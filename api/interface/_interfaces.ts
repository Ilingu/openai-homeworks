import { EnginesNames, JSONFormatter } from "./_types";

/* Back */
// Internal ApiRes
export interface ApiRes {
	succeed: boolean;
	code: number;
	data?: object;
	message?: string;
}

//#region FuncRes
export interface FunctionResponseShape {
	success: boolean;
	data?: object;
}

export interface ParseReqShape extends FunctionResponseShape {
	data?: JSONFormatter;
}
export interface ParseReqOpenAIShape extends ParseReqShape {
	data?: {
		Prompt: string;
		Engine: EnginesNames;
		Temperature: string;
	};
}

export interface GetPriceRes extends FunctionResponseShape {
	data?: {
		MAX_AI_TOKEN: number;
	};
}
//#endregion

//#region OpenAICall
export interface OpenAICallResShape extends FunctionResponseShape {
	data?: { res: OpenAIChoice };
}
export interface OpenAIResShape {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: OpenAIChoice[];
}
export interface OpenAIChoice {
	text: string;
	index: number;
	logprobs: LogprobsShape | null;
	finish_reason: string;
}
interface LogprobsShape {
	tokens?: string[];
	token_logprobs?: number[];
	top_logprobs?: object[];
	text_offset?: number[];
}
//#endregion
