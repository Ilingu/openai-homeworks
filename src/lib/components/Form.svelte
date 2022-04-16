<script lang="ts">
	import type { EnginesNames } from "$lib/interfaces/types";
	import { EngineStore } from "$lib/stores/PropsStores";
	import type { ToastProps } from "svelte-toasts/types/common";
	import SelectAi from "./SelectAI.svelte";

	export let HandleSubmit: () => Promise<ToastProps>;
	export let UserLoggedIn: boolean;

	let EngineValue: EnginesNames;
	const SetEngine = () => EngineStore.set(EngineValue);
</script>

<section class="my-8 flex w-[100vw] flex-col items-center justify-center">
	<h2>Your request:</h2>
	<form
		on:submit|preventDefault={() => {
			SetEngine();
			HandleSubmit();
		}}
		class="w-[95%] text-center md:w-3/4 xl:w-1/2"
	>
		<slot />
		<SelectAi bind:EngineValue />
		<button
			type="submit"
			disabled={!UserLoggedIn}
			class="rounded-sm bg-primary-lighter p-1 transition-all hover:scale-105 hover:bg-primary-300"
			><i class="fa-solid fa-robot" /> Submit</button
		>
	</form>
</section>
