import type { EnginesNames, JSONFormatter } from './types';

export interface IconDatasShape {
	icon: string;
	desc: string;
	href: string;
}

export interface ApiRes {
	status: number;
	redirect?: string;
	error?: Error;
	body?: string;
}

export interface ParseReqShape {
	success: boolean;
	data?: JSONFormatter;
}

export interface ParseReqOpenAIShape extends ParseReqShape {
	data?: {
		Prompt: string;
		Engine: EnginesNames;
	};
}
