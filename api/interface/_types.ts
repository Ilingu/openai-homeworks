export type JSONFormatter = { [k: string]: string };
export type RequestShape = { json: () => Promise<JSONFormatter> };
export type EnginesNames =
	| "text-davinci-002"
	| "text-curie-001"
	| "text-babbage-001"
	| "text-ada-001";
export type TemperatureVal = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
