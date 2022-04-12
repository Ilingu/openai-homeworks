export type JSONFormatter = { [k: string]: string };
export type RequestShape = { json: () => Promise<JSONFormatter> };
