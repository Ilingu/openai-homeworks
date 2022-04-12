import type { ApiRes, ParseReqShape } from '$lib/interfaces/interfaces';
import type { RequestShape } from '$lib/interfaces/types';
import { encode } from 'gpt-3-encoder';
import { IsValidURL } from './utils';

/**
 * Return An Internal API Error Object
 * @param {string} reason
 * @param {number | 500} http_error_code (Default: 500)
 * @returns Error Object To Send
 */
export const ReturnError = (reason?: string, http_error_code?: number): ApiRes => ({
	error: Error(reason || 'Something Went Wrong 😨'),
	status: http_error_code || 500
});

/**
 * Return An Internal API Success Object
 * @param {object} data
 * @param {number | 200} code (Default: 200)
 * @returns Success Object To Send
 */
export const ReturnSuccess = (data?: object, code?: number): ApiRes => ({
	status: code || 200,
	body: data ? JSON.stringify(data) : undefined
});

/**
 * Return An Internal API Redirect Object
 * @param {string} redirect_uri
 * @returns Redirect Object To Send
 */
export const ReturnRedirect = (redirect_uri: string): ApiRes => ({
	redirect: IsValidURL(redirect_uri) ? redirect_uri : '/',
	status: 307
});

/**
 * Return An Internal API Redirect Object
 * @param {string} redirect_uri
 * @returns Redirect Object To Send
 */
export const ParseRequest = async (request: RequestShape): Promise<ParseReqShape> => {
	const data = await request.json();
	if (!data) return { success: false };

	const { Prompt, Engine } = data;
	if (!Prompt || !Engine || Prompt.trim().length <= 0 || Engine.trim().length <= 0)
		return { success: false };

	return { success: true, data };
};

/**
 * Convert A String his coresponding number of OpenAI tokens
 * @param {string} str
 * @returns {number} number of token in str
 */
export const HowManyToken = (str: string): number => {
	const encoded: number[] = encode(str);
	return encoded?.length || 0;
};
