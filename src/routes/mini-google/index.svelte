<script lang="ts">
	import Metatags from '$lib/components/Metatags.svelte';
	import { onMount } from 'svelte';

	let InputQuestValue = '';
	let InputQuest: HTMLInputElement;

	onMount(() => InputQuest?.focus());

	const HandleSubmit = () => {};
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
		</form>
	</section>

	<section class="flex w-[50vw] flex-col items-center justify-center">
		<h2>His Response:</h2>
		<textarea class="w-full" />
	</section>
</article>

<style>
	input::placeholder {
		color: #ddd;
	}
</style>
