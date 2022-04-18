import type { GetPriceRes } from "../interface/_interfaces";
import type { EnginesNames } from "../../src/lib/interfaces/types";
import { HowManyTokens } from "./_utilsServer";

type PriceShape = {
	[EN in EnginesNames]: {
		MAX_PROMPT: number;
		MAX_COMPLETION: number;
	};
};

const MAX_VALUE: PriceShape = {
	"text-davinci-002": {
		MAX_PROMPT: 35,
		MAX_COMPLETION: 65
	},
	"text-curie-001": {
		MAX_PROMPT: 60,
		MAX_COMPLETION: 70
	},
	"text-babbage-001": {
		MAX_PROMPT: 337,
		MAX_COMPLETION: 338
	},
	"text-ada-001": {
		MAX_PROMPT: 500,
		MAX_COMPLETION: 500
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
	 MAX_PROMPT: 35 token
	 MAX_COMPLETION: 65 token
	 MAX_COST: 100T = 0.006$/req

Currie
	 MAX_PROMPT: 60 token
	 MAX_COMPLETION: 70 token
	 MAX_COST: 130T = 0.00078$/req

Babbage
	 MAX_PROMPT: 337 token
	 MAX_COMPLETION: 338 token
	 MAX_COST: 675T = 0.00081$/req

Ada
	 MAX_PROMPT: 500 token
	 MAX_COMPLETION: 500 token
	 MAX_COST: 1000T = 0.0008$/req
*/

// MAX_COST = price * nT / 1000
// nT = 1000 * MAX_COST / price
