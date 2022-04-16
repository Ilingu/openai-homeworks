import type { ApiRes, FunctionResponseShape, ParseReqShape } from "../interface/_interfaces";
import type { JSONFormatter, TemperatureVal } from "../interface/_types";
import { encode } from "gpt-3-encoder";
import createKeccakHash from "keccak";
import { isValidEngine } from "./_utils";

import dotenv from "dotenv";
dotenv.config();

/**
 * Return An Internal API Error Object
 * @param {string} reason
 * @param {number | 500} http_error_code (Default: 500)
 * @returns Error Object To Send
 */
export const HandleError = (reason?: string, http_error_code?: number): ApiRes => {
	console.error("API_ERROR: ", http_error_code || 500, reason);
	return {
		succeed: false,
		code: http_error_code || 500,
		message: reason || "Something Went Wrong 😨"
	};
};

/**
 * Return An Internal API Success Object
 * @param {object} data
 * @param {number | 200} code (Default: 200)
 * @returns Success Object To Send
 */
export const HandleSuccess = (code?: number, data?: object): ApiRes => ({
	succeed: true,
	code: code || 200,
	data: data || undefined
});

/**
 * Parse The Request Obj From API
 * @param {Body} request
 * @returns {ParseReqShape} An object with the validity of the req and if valid the request data
 */
export const ParseRequest = async (body: string, AuthToken: string): Promise<ParseReqShape> => {
	let data: JSONFormatter;
	if (typeof body === "object") data = body;
	if (typeof body === "string") data = JSON.parse(body);
	if (!body || !data) return { success: false };

	const Prompt = data["Prompt"];
	const Engine = data["Engine"];
	const Temperature = parseFloat(data["Temperature"]) as TemperatureVal;

	if (!Prompt || !Engine || Prompt.trim().length <= 0 || Engine.trim().length <= 0)
		return { success: false };
	if (!AuthToken || AuthToken.trim().length <= 0) return { success: false };
	if (isNaN(Temperature)) return { success: false };
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

export const Authentificator = (AuthToken: string): FunctionResponseShape => {
	const HashedPassword = createKeccakHash("keccak256").update(AuthToken).digest("hex");
	const RightPassword = process.env.PSW_ENCRYPTED;

	if (!HashedPassword || !RightPassword) return { success: false };
	if (HashedPassword.trim().length <= 0 || RightPassword.trim().length <= 0)
		return { success: false };
	if (HashedPassword !== RightPassword) return { success: false };

	return { success: true };
};
