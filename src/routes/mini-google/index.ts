import { ReturnError, ReturnSuccess, HowManyToken, ParseRequest } from '$lib/Utils/utilsServer';

/** @type {import('./mini-google').RequestHandler} */
export async function post({ request }) {
	try {
		const {
			success,
			data: { Prompt, Engine }
		} = await ParseRequest(request);
		if (!success) return ReturnError('Bad Args', 400);

		const Tokens = HowManyToken(Prompt);

		return ReturnSuccess();
	} catch (err) {
		return ReturnError(err);
	}
}
