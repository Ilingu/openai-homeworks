import { writable } from "svelte/store";

export const SessionPassword = writable<string>();
export const IsLoggedIn = writable(false);
