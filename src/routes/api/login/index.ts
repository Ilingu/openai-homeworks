import type { RequestShape } from "$lib/interfaces/types";
import { Authentificator, ReturnError, ReturnSuccess } from "$lib/Utils/utilsServer";

/** @type {import('./login').RequestHandler} */
export async function post({ request }: { request: RequestShape }) {
	try {
		const data = await request.json();
		if (!data) return ReturnError("Bad Args", 400);

		const AuthToken = data["AuthToken"];
		if (!AuthToken || AuthToken.trim().length <= 0) return ReturnError("Bad Args", 400);

		const { success: Authentificated } = Authentificator(AuthToken); // Authentification
		if (!Authentificated) return ReturnError("Not logged in!", 403); // ⛔
		return ReturnSuccess({ success: true });
	} catch (err) {
		return ReturnError();
	}
}
