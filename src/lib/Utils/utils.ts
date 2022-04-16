import type { ApiRes, CallApiArgs, GetWorkerRes } from "$lib/interfaces/interfaces";
import type { EnginesNames, TemperatureVal, ToastType } from "$lib/interfaces/types";
import { EngineStore } from "$lib/stores/PropsStores";
import { SessionPassword } from "$lib/stores/SessionStore";
import { toasts } from "svelte-toasts";
import type { ToastProps } from "svelte-toasts/types/common";

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
	if (engine === "text-ada-001") return true;
	if (engine === "text-babbage-001") return true;
	if (engine === "text-curie-001") return true;
	if (engine === "text-davinci-002") return true;

	return false;
};

/**
 * Get The current Session Password once
 * @returns {string} Return Session Password
 */
export const GetSessionPassword = (): Promise<string> =>
	new Promise((resolve, reject) => {
		const unsub = SessionPassword.subscribe((psw) => {
			if (!psw || psw.trim().length <= 0) return reject("No password");
			resolve(psw);
		});
		unsub();
	});

/**
 * Get The value of Engine Store
 * @returns {EnginesNames} Return EngineValue
 */
export const GetEngineStore = (): Promise<EnginesNames> =>
	new Promise((resolve) => {
		const unsub = EngineStore.subscribe((EngineValue) => resolve(EngineValue as EnginesNames));
		unsub();
	});

/**
 * Call and Manage OpenAI internal API Request and Response
 * @param {string} Prompt
 * @param {EnginesNames} Engine
 * @returns {OpenAIResTextObject} Return OpenAI Response
 */
// export const RequestOpenAI = async (
// 	Prompt: string,
// 	Engine: EnginesNames,
// 	Temperature?: TemperatureVal
// ): Promise<OpenAIResTextObject> => {
// 	try {
// 		const AuthToken = await GetSessionPassword();

// 		// Request
// 		const OpenAIRes = await fetch(`${window.location.origin}/api`, {
// 			method: "POST",
// 			body: JSON.stringify({ Engine, Prompt, Temperature: Temperature || 0 }),
// 			headers: { authorization: AuthToken }
// 		});

// 		// Response
// 		const OpenAIRawResponse = await OpenAIRes.json();
// 		console.log(OpenAIRawResponse);
// 		return;
// 	} catch (err) {
// 		console.error(err);
// 		return { success: false, reason: err };
// 	}
// };

/**
 * Call internal API endpoint and Manage the result
 * @param {CallApiArgs} FetchArgs
 * @returns {ApiRes} Return Internal API Raw Response
 */
export const CallApi = async ({ URI, METHOD, AuthToken, body }: CallApiArgs): Promise<ApiRes> => {
	try {
		const URL = encodeURI(`${window.location.origin}${URI}`);
		if (!AuthToken) AuthToken = await GetSessionPassword();
		if (!IsValidURL(URL)) throw new Error("Unvalid URL");

		// Request
		const APIRequest = await fetch(URL, {
			method: METHOD,
			body: JSON.stringify(body),
			headers: { authorization: AuthToken }
		});

		// Response
		const APIResponse: ApiRes = await APIRequest.json();
		return APIResponse;
	} catch (err) {
		return { succeed: false, code: 500, message: err };
	}
};

/**
 * Create A Notification in FrontEnd
 * @param {string} message
 * @param {ToastType} type
 * @param {number} duration
 * @param {string} description
 * @returns {ToastProps} Return the intanciate notification
 */
export const PushToast = (
	message: string,
	type: ToastType,
	duration: number,
	description?: string
): ToastProps => toasts.add({ title: message, duration, type, description: description || "" });
