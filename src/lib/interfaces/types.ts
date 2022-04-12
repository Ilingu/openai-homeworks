export type JSONFormatter = { [k: string]: string };
export type RequestShape = { json: () => Promise<JSONFormatter> };

export type EnginesNames =
	| 'text-davinci-002'
	| 'text-curie-001'
	| 'text-babbage-001'
	| 'text-ada-001';
