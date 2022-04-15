import type { EnginesNames, JSONFormatter, TemperatureVal } from "./types";

/* Back */
// Internal ApiRes
export interface ApiRes {
	status: number;
	redirect?: string;
	error?: Error;
	body?: object;
}

export interface OpenAIResTextObject {
	success: boolean;
	data?: string;
	reason?: string;
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
		AuthToken: string;
		Temperature: string;
	};
}

export interface GetPriceRes extends FunctionResponseShape {
	data?: {
		MAX_AI_TOKEN: number;
	};
}

export interface GetWorkerRes extends FunctionResponseShape {
	data?: { WorkerResult: unknown };
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

/* Front */
export interface IconDatasShape {
	icon: string;
	desc: string;
	href: string;
}
