import type { ParseReqOpenAIShape } from "$lib/interfaces/interfaces";
import type { TemperatureVal } from "$lib/interfaces/types";
import { OpenAICall } from "$lib/Utils/OpenAI";
import { GetPrice } from "$lib/Utils/prices";
import { ReturnError, ReturnSuccess, ParseRequest, Authentificator } from "$lib/Utils/utilsServer";

/** @type {import('./api').RequestHandler} */
export async function post({ request }) {
	try {
		/* Parsing Datas + Auth */
		const { success, data } = (await ParseRequest(request)) as ParseReqOpenAIShape;
		if (!success || !data) return ReturnError("Bad Args", 400); // ⛔
		const { Prompt, Engine, AuthToken, Temperature } = data;

		const { success: Authentificated } = Authentificator(AuthToken); // Authentification
		if (!Authentificated) return ReturnError("Not logged in!", 403); // ⛔

		const MaxCompletionToken = GetPrice(Engine, Prompt);
		const MAX_AI_TOKEN = MaxCompletionToken?.data?.MAX_AI_TOKEN;
		if (!MaxCompletionToken.success || !MAX_AI_TOKEN)
			return ReturnError("Forbidden Amount Of Token", 401); // ⛔

		/* OpenAI */
		const OaiResponse = await OpenAICall({
			engine: Engine,
			prompt: Prompt,
			max_tokens: MAX_AI_TOKEN,
			temperature: parseFloat(Temperature) as TemperatureVal
		});

		if (!OaiResponse.success || !OaiResponse?.data?.res)
			return ReturnError("OpenAI couldn't answer"); // ⛔
		const OaiResData = OaiResponse.data.res;

		return ReturnSuccess(OaiResData);
	} catch (err) {
		return ReturnError(err);
	}
}
