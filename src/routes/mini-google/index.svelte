<script lang="ts">
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	import SelectAi from "$lib/components/SelectAI.svelte";
	// Types
	import type { EnginesNames } from "$lib/interfaces/types";
	import { isValidEngine, PushToast, RequestOpenAI } from "$lib/Utils/utils";
	import { onMount } from "svelte";

	let InputQuestValue = "";
	let EngineValue: EnginesNames;

	let OpenAIResText = "";

	let InputQuestElem: HTMLInputElement;
	onMount(() => InputQuestElem?.focus());

	const HandleSubmit = async () => {
		try {
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue))
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedQuestion = InputQuestValue.endsWith("?")
				? InputQuestValue
				: `${InputQuestValue}?`;
			const FormattedPrompt = `I am a highly intelligent question answering bot.${
				EngineValue === "text-davinci-002"
					? ""
					: " If you ask me a question I will give you the answer."
			}\nQ: ${FormattedQuestion}\nA:`;

			const OpenAIResponse = await RequestOpenAI(FormattedPrompt, EngineValue);
			if (!OpenAIResponse.success)
				return PushToast("Completion Failed!", "error", 5000, OpenAIResponse?.reason);
			OpenAIResText = OpenAIResponse.data;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<Metatags />
<article class="middle w-full">
	<h1 class="text-4xl font-semibold text-primary-800">
		<i class="fa-brands fa-google" /> Mini Google
	</h1>

	<section class="my-8 flex w-[50vw] flex-col items-center justify-center">
		<h2>Your request:</h2>
		<form on:submit|preventDefault={HandleSubmit} class="w-full text-center">
			<input
				type="text"
				bind:value={InputQuestValue}
				bind:this={InputQuestElem}
				placeholder="How many planets in solar system?"
				class="w-full rounded bg-primary-800 p-3 text-xl font-semibold text-primary-lightest outline-none transition-all 
				focus:ring-2 focus:ring-primary-800"
				required
			/>
			<SelectAi bind:EngineValue />
			<button
				type="submit"
				class="rounded-sm bg-primary-lighter p-1 transition-all hover:scale-105 hover:bg-primary-300"
				><i class="fa-solid fa-robot" /> Submit</button
			>
		</form>
	</section>

	<DisplayAiRes {OpenAIResText} />
</article>

<style>
	input::placeholder {
		color: #ddd;
	}
</style>
