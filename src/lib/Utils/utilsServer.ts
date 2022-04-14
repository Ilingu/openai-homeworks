import type { ApiRes, ParseReqShape } from '$lib/interfaces/interfaces';
import type { JSONFormatter, RequestShape } from '$lib/interfaces/types';
import { encode } from 'gpt-3-encoder';
import { isValidEngine, IsValidURL } from './utils';

/**
 * Return An Internal API Error Object
 * @param {string} reason
 * @param {number | 500} http_error_code (Default: 500)
 * @returns Error Object To Send
 */
export const ReturnError = (reason?: string, http_error_code?: number): ApiRes => {
	console.error('API_ERROR: ', http_error_code || 500, reason);
	return {
		error: Error(reason || 'Something Went Wrong 😨'),
		status: http_error_code || 500
	};
};

/**
 * Return An Internal API Success Object
 * @param {object} data
 * @param {number | 200} code (Default: 200)
 * @returns Success Object To Send
 */
export const ReturnSuccess = (data?: object, code?: number): ApiRes => ({
	status: code || 200,
	body: data || undefined
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
 * Parse The Request Obj From API
 * @param {RequestShape} request
 * @returns {ParseReqShape} An object with the validity of the req and if valid the request data
 */
export const ParseRequest = async (request: RequestShape): Promise<ParseReqShape> => {
	const data = await request.json();
	if (!data) return { success: false };

	const Prompt = data['Prompt'];
	const Engine = data['Engine'];

	if (!Prompt || !Engine || Prompt.trim().length <= 0 || Engine.trim().length <= 0)
		return { success: false };
	if (!isValidEngine(Engine)) return { success: false };

	return { success: true, data };
};

/**
 * Convert A String his coresponding number of OpenAI tokens
 * @param {string} str
 * @returns {number} number of token in str
 */
export const HowManyTokens = (str: string): number => {
	const encoded: number[] = encode(str);
	return encoded?.length || 0;
};