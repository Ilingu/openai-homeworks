<script lang="ts">
	import Metatags from '$lib/components/Metatags.svelte';
	import type { OpenAIChoice } from '$lib/interfaces/interfaces';
	import type { EnginesNames } from '$lib/interfaces/types';
	import { onMount } from 'svelte';

	let InputQuestValue = '';
	let OpenAIResText = '';
	let EngineValue: EnginesNames;
	let InputQuest: HTMLInputElement;

	onMount(() => InputQuest?.focus());

	export let data: OpenAIChoice;
	const HandleSubmit = async () => {
		try {
			const OpenAIRes = await fetch(window.location.href, {
				method: 'POST',
				body: JSON.stringify({ Engine: EngineValue, Prompt: InputQuestValue })
			});
			const OpenAIResDatasText = await OpenAIRes.text();
			const OpenAIResDatasTextFormatted = OpenAIResDatasText.slice(-5000)
				.split(`<script type="application/json" sveltekit:data-type="props">`)[1]
				.split('</script')[0];
			const OpenAIResDatas: OpenAIChoice = JSON.parse(OpenAIResDatasTextFormatted);
			OpenAIResText = OpenAIResDatas.text;
		} catch (err) {
			console.error(err);
		}
	};

	console.log(data, 'Front');
</script>

<!-- Q&A: mini google -->
<!-- 
I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer.

Q: <Question>(endwith "?" ? nothing : "?")
A:
 -->

<Metatags />
<article class="middle w-full">
	<h1 class="text-4xl font-semibold text-primary-800">
		<i class="fa-brands fa-google" /> Mini Google
	</h1>

	<section class="my-8 flex w-[50vw] flex-col items-center justify-center">
		<h2>Your request:</h2>
		<form on:submit|preventDefault={HandleSubmit} class="w-full">
			<input
				type="text"
				bind:value={InputQuestValue}
				bind:this={InputQuest}
				placeholder="Write a thanks you email:"
				class="w-full rounded bg-primary-description-whither p-3 text-xl font-semibold text-primary-lightest outline-none transition-all focus:ring-[2.5px] focus:ring-primary-800"
			/>
			<select bind:value={EngineValue}>
				<option value="text-ada-001">text-ada-001</option>
				<option value="text-babbage-001">text-babbage-001</option>
				<option value="text-curie-001">text-curie-001</option>
				<option value="text-davinci-002">text-davinci-002</option>
			</select>
			<button>Submit</button>
		</form>
	</section>

	<section class="flex w-[50vw] flex-col items-center justify-center">
		<h2>His Response:</h2>
		<textarea class="w-full" bind:value={OpenAIResText} />
	</section>

	{JSON.stringify(data)}
</article>

<style>
	input::placeholder {
		color: #ddd;
	}
</style>
