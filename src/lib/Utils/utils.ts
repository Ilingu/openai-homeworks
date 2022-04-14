import type { GetWorkerRes, OpenAIResTextObject } from '$lib/interfaces/interfaces';
import type { EnginesNames, TemperatureVal, ToastType } from '$lib/interfaces/types';
import { toasts } from 'svelte-toasts';

/**
 * Check if the url is a valid one
 * @param {string} url
 * @returns {boolean} Return `true` if the url is valid
 */
export const IsValidURL = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};

/**
 * Check if the engine is a valid one
 * @param {EnginesNames | string} engine
 * @returns {boolean} Return `true` if the engine is valid
 */
export const isValidEngine = (engine: EnginesNames | string): boolean => {
	if (engine === 'text-ada-001') return true;
	if (engine === 'text-babbage-001') return true;
	if (engine === 'text-curie-001') return true;
	if (engine === 'text-davinci-002') return true;

	return false;
};

/**
 * Call and Manage OpenAI internal API Request and Response
 * @param {string} Prompt
 * @param {EnginesNames} Engine
 * @returns {OpenAIResTextObject} Return OpenAI Response
 */
export const RequestOpenAI = async (
	Prompt: string,
	Engine: EnginesNames,
	Temperature?: TemperatureVal
): Promise<OpenAIResTextObject> => {
	try {
		// Request
		const OpenAIRes = await fetch(`${window.location.origin}/api`, {
			method: 'POST',
			body: JSON.stringify({ Engine, Prompt, Temperature: Temperature || 0 })
		});

		// Response
		const OpenAIRawResponse = await OpenAIRes.text();
		const ResWorker = await HandleWorkers('/slice_oai_res_workers.js', OpenAIRawResponse); // Parsing Res
		if (!ResWorker.success || !ResWorker?.data || !ResWorker.data?.WorkerResult)
			return { success: false, reason: 'No Data Res' };

		const OpenAIResponse = ResWorker.data.WorkerResult as OpenAIResTextObject;
		if (!OpenAIResponse.success || !OpenAIResponse?.data)
			return { success: false, reason: 'No OpenAI Res' };

		return OpenAIResponse;
	} catch (err) {
		console.error(err);
		return { success: false };
	}
};

/**
 * Delegate Complex Operation in another javascript thread
 * @param {string} filePath
 * @param {unknown | unknown[]} datasToSend
 * @returns {GetWorkerRes} Return Worker's Response
 */
export const HandleWorkers = (
	filePath: string,
	datasToSend: unknown | unknown[]
): Promise<GetWorkerRes> => {
	return new Promise((resolve, rej) => {
		if (window.Worker) {
			try {
				const myWorker = new Worker(encodeURI(filePath));
				myWorker.postMessage(datasToSend);
				myWorker.onmessage = (evt) => {
					if (!evt?.data || !evt.data?.success) return rej('No Data Sent back');

					const WorkerResult = evt.data;
					resolve({ success: true, data: { WorkerResult } });
				};
			} catch (err) {
				rej(err);
			}
		} else return rej('WebWorkers not supported');
	});
};

export const PushToast = (message: string, type: ToastType, duration: number) =>
	toasts.add({ title: message, duration, type });
