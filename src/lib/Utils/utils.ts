import type { GetWorkerRes } from '$lib/interfaces/interfaces';
import type { EnginesNames } from '$lib/interfaces/types';

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

export const HandleWorkers = (
	filePath: string,
	datasToSend: unknown | unknown[]
): Promise<GetWorkerRes> => {
	return new Promise((resolve, rej) => {
		console.log(window.Worker);
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
