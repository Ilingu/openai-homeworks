import type { ParseReqOpenAIShape } from '$lib/interfaces/interfaces';
import { OpenAICall } from '$lib/Utils/OpenAI';
import { GetPrice } from '$lib/Utils/prices';
import { ReturnError, ReturnSuccess, ParseRequest } from '$lib/Utils/utilsServer';

/** @type {import('./mini-google').RequestHandler} */
export async function post({ request }) {
	try {
		/* Parsing Datas + Auth */
		const { success, data } = (await ParseRequest(request)) as ParseReqOpenAIShape;
		if (!success || !data) return ReturnError('Bad Args', 400); // ⛔
		const { Prompt, Engine } = data;

		// TODO: Authentification

		const MaxCompletionToken = GetPrice(Engine, Prompt);
		const MAX_AI_TOKEN = MaxCompletionToken?.data?.MAX_AI_TOKEN;
		if (!MaxCompletionToken.success || !MAX_AI_TOKEN)
			return ReturnError('Forbidden Amount Of Token', 401); // ⛔

		/* OpenAI */
		const OaiResponse = await OpenAICall({
			engine: Engine,
			prompt: Prompt,
			max_tokens: MAX_AI_TOKEN,
			temperature: 0.7
		});

		if (!OaiResponse.success || !OaiResponse?.data?.res)
			return ReturnError("OpenAI couldn't answer"); // ⛔
		const OaiResData = OaiResponse.data.res;

		return ReturnSuccess(OaiResData);
	} catch (err) {
		return ReturnError(err);
	}
}

// I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer.

// Q: <Question>(endwith "?" ? nothing : "?")
// A:
