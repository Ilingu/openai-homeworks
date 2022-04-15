<script lang="ts">
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	import SelectAi from "$lib/components/SelectAI.svelte";
	// Types
	import type { EnginesNames } from "$lib/interfaces/types";
	import { isValidEngine, PushToast, RequestOpenAI } from "$lib/Utils/utils";
	import { onMount } from "svelte";

	let InputQuestValue = "";
	let InputQuestElem: HTMLTextAreaElement;
	let EngineValue: EnginesNames;

	let OpenAIResText = "";

	let UserLoggedIn = false;
	IsLoggedIn.subscribe((logged) => {
		UserLoggedIn = logged;
		if (!logged) InputQuestValue = "⛔ You are not logged in ⛔";
		else InputQuestValue = "";
	});
	onMount(() => InputQuestElem?.focus());

	const HandleSubmit = async () => {
		try {
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue))
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedQuestion = InputQuestValue.endsWith(":")
				? InputQuestValue
				: `${InputQuestValue}:`;

			const OpenAIResponse = await RequestOpenAI(FormattedQuestion, EngineValue, 0.7);
			if (!OpenAIResponse.success)
				return PushToast("Completion Failed!", "error", 5000, OpenAIResponse?.reason);
			OpenAIResText = OpenAIResponse.data.text;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<!-- Generating text -->

<Metatags />
<article class="middle w-full">
	<h1 class="text-4xl font-semibold text-primary-800">
		<i class="fa-solid fa-message" /> Text Completion
	</h1>

	<section class="my-8 flex w-[50vw] flex-col items-center justify-center">
		<h2>Your request:</h2>
		<form on:submit|preventDefault={HandleSubmit} class="w-full text-center">
			<textarea
				bind:value={InputQuestValue}
				bind:this={InputQuestElem}
				disabled={!UserLoggedIn}
				required
				class="h-32 w-full rounded-md bg-primary-lightest p-5 text-lg font-semibold shadow-md shadow-primary-headline outline-none focus:ring-1 focus:ring-primary-800"
			/>
			<SelectAi bind:EngineValue />
			<button
				type="submit"
				disabled={!UserLoggedIn}
				class="rounded-sm bg-primary-lighter p-1 transition-all hover:scale-105 hover:bg-primary-300"
				><i class="fa-solid fa-robot" /> Submit</button
			>
		</form>
	</section>

	<DisplayAiRes {OpenAIResText} />
</article>
