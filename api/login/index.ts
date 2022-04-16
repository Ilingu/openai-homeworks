import type { VercelResponse, VercelRequest } from "@vercel/node";

import type { ApiRes } from "../interface/_interfaces";
import { Authentificator, HandleError, HandleSuccess } from "../utils/_utilsServer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Utils Func
	const Respond = (ResData: ApiRes) => {
		res.status(ResData.code).json(ResData);
	};

	try {
		// Request Verifier
		const { method, headers } = req;

		const AuthToken = headers?.authorization?.toString() || undefined;
		if (!headers || !AuthToken)
			return Respond(HandleError("Missing User Authentification Token", 400)); // ❌
		if (method !== "GET") return Respond(HandleError("Only accept GET req", 400)); // ❌

		if (!AuthToken || AuthToken.trim().length <= 0) return Respond(HandleError("Bad Args", 400));

		const { success: Authentificated } = Authentificator(AuthToken); // Authentification
		if (!Authentificated) return Respond(HandleError("Not logged in!", 403)); // ⛔

		return Respond(HandleSuccess());
	} catch (err) {
		return Respond(HandleError(err));
	}
}
