import type { ParseReqOpenAIShape } from '$lib/interfaces/interfaces';
import type { EnginesNames } from '$lib/interfaces/types';
import { ReturnError, ReturnSuccess, HowManyToken, ParseRequest } from '$lib/Utils/utilsServer';

type PriceShape = {
	[EN in EnginesNames]: {
		MAX_PROMPT: number;
		MAX_COMPLETION: number;
	};
};

/*
Davinci
	 MAX_PROMPT: 20 token
	 MAX_COMPLETION: 30 token
	 MAX_COST: 50T = 0.003$/req

Currie
	 MAX_PROMPT: 27 token
	 MAX_COMPLETION: 53 token
	 MAX_COST: 80T = 0.00048$/req

Babbage
	 MAX_PROMPT: 80 token
	 MAX_COMPLETION: 170 token
	 MAX_COST: 250T = 0.0003$/req

Ada
	 MAX_PROMPT: 100 token
	 MAX_COMPLETION: 200 token
	 MAX_COST: 300T = 0.00024$/req
*/

// MAX_COST = price * nT / 1000

const MAX_VALUE: PriceShape = {
	'text-davinci-002': {
		MAX_PROMPT: 20,
		MAX_COMPLETION: 30
	},
	'text-curie-001': {
		MAX_PROMPT: 27,
		MAX_COMPLETION: 53
	},
	'text-babbage-001': {
		MAX_PROMPT: 80,
		MAX_COMPLETION: 170
	},
	'text-ada-001': {
		MAX_PROMPT: 100,
		MAX_COMPLETION: 200
	}
};

/** @type {import('./mini-google').RequestHandler} */
export async function post({ request }) {
	try {
		const {
			success,
			data: { Prompt, Engine }
		} = (await ParseRequest(request)) as ParseReqOpenAIShape;
		if (!success) return ReturnError('Bad Args', 400); // ⛔

		const PromptTokens = HowManyToken(Prompt);

		let MAX_AI_TOKEN = 20;
		if (Engine === 'text-davinci-002') {
			if (PromptTokens > MAX_VALUE[Engine].MAX_PROMPT)
				return ReturnError('Forbidden Amount Of Token', 401); // ⛔
			MAX_AI_TOKEN = MAX_VALUE[Engine].MAX_COMPLETION;
		}
		if (Engine === 'text-curie-001') {
			if (PromptTokens > MAX_VALUE[Engine].MAX_PROMPT)
				return ReturnError('Forbidden Amount Of Token', 401); // ⛔
			MAX_AI_TOKEN = MAX_VALUE[Engine].MAX_COMPLETION;
		}
		if (Engine === 'text-babbage-001') {
			if (PromptTokens > MAX_VALUE[Engine].MAX_PROMPT)
				return ReturnError('Forbidden Amount Of Token', 401); // ⛔
			MAX_AI_TOKEN = MAX_VALUE[Engine].MAX_COMPLETION;
		}
		if (Engine === 'text-ada-001') {
			if (PromptTokens > MAX_VALUE[Engine].MAX_PROMPT)
				return ReturnError('Forbidden Amount Of Token', 401); // ⛔
			MAX_AI_TOKEN = MAX_VALUE[Engine].MAX_COMPLETION;
		}

		return ReturnSuccess();
	} catch (err) {
		return ReturnError(err);
	}
}
