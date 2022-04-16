/* Back */

import type { EnginesNames, TemperatureVal } from "./types";

// Internal ApiRes
export interface ApiRes {
	succeed: boolean;
	code: number;
	data?: OpenAIChoice;
	message?: string;
}

export interface CallApiArgs {
	URI: string;
	METHOD: "POST" | "GET";
	AuthToken?: string;
	body?: BodyApiCall;
}

export interface BodyApiCall {
	Prompt: string;
	Engine: EnginesNames;
	Temperature: TemperatureVal;
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

export interface FunctionResponseShape {
	success: boolean;
	data?: object;
}

export interface GetWorkerRes extends FunctionResponseShape {
	data?: { WorkerResult: unknown };
}

export interface LoginResShape extends FunctionResponseShape {
	data: { success: true | undefined };
}

export interface IconDatasShape {
	icon: string;
	desc: string;
	href: string;
}
