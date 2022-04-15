import type { GetPriceRes } from "$lib/interfaces/interfaces";
import type { EnginesNames } from "../interfaces/types";
import { HowManyTokens } from "./utilsServer";

type PriceShape = {
	[EN in EnginesNames]: {
		MAX_PROMPT: number;
		MAX_COMPLETION: number;
	};
};

const MAX_VALUE: PriceShape = {
	"text-davinci-002": {
		MAX_PROMPT: 30,
		MAX_COMPLETION: 30
	},
	"text-curie-001": {
		MAX_PROMPT: 45,
		MAX_COMPLETION: 55
	},
	"text-babbage-001": {
		MAX_PROMPT: 80,
		MAX_COMPLETION: 170
	},
	"text-ada-001": {
		MAX_PROMPT: 100,
		MAX_COMPLETION: 200
	}
};

/**
 * Check If Prompt Token are bellow the max and return the max_ai_token_res
 * @param {EnginesNames} Engine
 * @param {number} Prompt
 * @returns {GetPriceRes} Return the max_ai_token_res (max number of token that the AI will response)
 */
export const GetPrice = (Engine: EnginesNames, Prompt: string): GetPriceRes => {
	const PromptTokens = HowManyTokens(Prompt);
	if (PromptTokens > MAX_VALUE[Engine].MAX_PROMPT) return { success: false };

	const MAX_AI_TOKEN = MAX_VALUE[Engine].MAX_COMPLETION;
	return { success: true, data: { MAX_AI_TOKEN } };
};

/*
Davinci
	 MAX_PROMPT: 30 token
	 MAX_COMPLETION: 30 token
	 MAX_COST: 60T = 0.0036$/req

Currie
	 MAX_PROMPT: 45 token
	 MAX_COMPLETION: 55 token
	 MAX_COST: 100T = 0.0006$/req

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
