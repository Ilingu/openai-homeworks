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
