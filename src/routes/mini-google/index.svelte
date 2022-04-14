<script lang="ts">
	import Metatags from '$lib/components/Metatags.svelte';
	import type { EnginesNames } from '$lib/interfaces/types';
	import { isValidEngine, RequestOpenAI } from '$lib/Utils/utils';
	import { onMount } from 'svelte';

	let InputQuestValue = '';
	let EngineValue: EnginesNames;

	let OpenAIResText = '';

	let InputQuestElem: HTMLInputElement;
	onMount(() => InputQuestElem?.focus());

	const HandleSubmit = async () => {
		try {
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue)) return;

			const FormattedQuestion = InputQuestValue.endsWith('?')
				? InputQuestValue
				: `${InputQuestValue}?`;
			const FormattedPrompt =
				EngineValue === 'text-davinci-002' || EngineValue === 'text-curie-001'
					? FormattedQuestion
					: `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer.\nQ: ${FormattedQuestion}\nA:`;

			const OpenAIResponse = await RequestOpenAI(FormattedPrompt, EngineValue);
			if (!OpenAIResponse.success) return;
			console.log(OpenAIResponse.data);
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
			<select
				bind:value={EngineValue}
				class="mt-2 rounded-md bg-primary-description p-1 capitalize text-primary-lightest outline-none
				 focus:ring-1 focus:ring-primary-800"
				required
			>
				<option value="default">Choose your AI 🛠</option>
				<option value="text-ada-001">text-ada-001: Fastest🦅</option>
				<option value="text-babbage-001">text-babbage-001</option>
				<option value="text-curie-001">text-curie-001</option>
				<option value="text-davinci-002">text-davinci-002: Cleverest🧠</option>
			</select>
			<button
				type="submit"
				class="rounded-sm bg-primary-lighter p-1 transition-all hover:scale-105 hover:bg-primary-300"
				><i class="fa-solid fa-robot" /> Submit</button
			>
		</form>
	</section>

	<section class="flex w-[50vw] flex-col items-center justify-center">
		<h2>His Response:</h2>
		<div
			class="h-[500px] w-full rounded-md bg-primary-lightest text-lg font-bold shadow-md shadow-primary-headline"
		>
			{@html OpenAIResText.replaceAll('\n', '<br />')}
		</div>
	</section>
</article>

<style>
	input::placeholder {
		color: #ddd;
	}
</style>
