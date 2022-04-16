import type { OpenAICallResShape, OpenAIResShape } from "../interface/_interfaces";
import type { EnginesNames, TemperatureVal } from "../interface/_types";
import { Configuration, OpenAIApi } from "openai";

import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: "org-YtdbB30SU3tT1beMr85IuAR1"
});
const openai = new OpenAIApi(configuration);

interface OpenAIReqArgsShape {
	max_tokens: number;
	prompt: string;
	engine: EnginesNames;
	temperature?: TemperatureVal;
}

/**
 * Call OpenAI Completion Service
 * @param {OpenAIReqArgsShape} CallArgsOption (Prompt)
 * @returns {OpenAICallResShape} OpenAI Response
 */
export const OpenAICall = async ({
	engine,
	max_tokens,
	prompt,
	temperature
}: OpenAIReqArgsShape): Promise<OpenAICallResShape> => {
	try {
		const OpenAIResponse = await openai.createCompletion(engine, {
			prompt,
			max_tokens,
			temperature: temperature || 0
		});

		if (OpenAIResponse.status !== 200 || !OpenAIResponse?.data) return { success: false };
		const OaiResDatas = OpenAIResponse.data as unknown as OpenAIResShape;

		if (!OaiResDatas?.choices || OaiResDatas.choices.length <= 0) return { success: false };
		const OaiFirstChoice = OaiResDatas.choices[0];

		return { success: true, data: { res: OaiFirstChoice } };
	} catch (err) {
		return { success: false };
	}
};
