import type { VercelRequest, VercelResponse } from "@vercel/node";

import type { ApiRes, ParseReqOpenAIShape } from "../interface/_interfaces";
import type { TemperatureVal } from "../interface/_types";

import { OpenAICall } from "../utils/_OpenAI";
import { GetPrice } from "../utils/_prices";
import { HandleError, HandleSuccess, ParseRequest, Authentificator } from "../utils/_utilsServer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Utils Func
	const Respond = (ResData: ApiRes) => {
		res.status(ResData.code).json(ResData);
	};
	try {
		// Request Verifier
		const { method, headers, body } = req;

		const AuthToken = headers?.authorization?.toString() || undefined;
		if (!headers || !AuthToken)
			return Respond(HandleError("Missing User Authentification Token", 400)); // ❌
		if (method !== "POST") return Respond(HandleError("Only accept POST req", 400)); // ❌

		/* Parsing Datas + Auth */
		const { success, data } = (await ParseRequest(body, AuthToken)) as ParseReqOpenAIShape;
		if (!success || !data) return Respond(HandleError("Bad Args", 400)); // ⛔
		const { Prompt, Engine, Temperature } = data;

		const { success: Authentificated } = Authentificator(AuthToken); // Authentification
		if (!Authentificated) return Respond(HandleError("Not logged in!", 403)); // ⛔

		const MaxCompletionToken = GetPrice(Engine, Prompt);
		const MAX_AI_TOKEN = MaxCompletionToken?.data?.MAX_AI_TOKEN;
		if (!MaxCompletionToken.success || !MAX_AI_TOKEN)
			return Respond(HandleError("Forbidden Amount Of Token", 401)); // ⛔

		/* OpenAI */
		const OaiResponse = await OpenAICall({
			engine: Engine,
			prompt: Prompt,
			max_tokens: MAX_AI_TOKEN,
			temperature: parseFloat(Temperature) as TemperatureVal
		});

		if (!OaiResponse.success || !OaiResponse?.data?.res)
			return Respond(HandleError("OpenAI couldn't answer")); // ⛔
		const OaiResData = OaiResponse.data.res;

		return Respond(HandleSuccess(200, OaiResData));
	} catch (err) {
		return Respond(HandleError(err));
	}
}
