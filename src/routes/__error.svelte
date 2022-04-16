<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		console.error(error.stack);
		return {
			props: {
				msg: `${status}: ${error.message}`,
				status
			}
		};
	}
</script>

<script lang="ts">
	import Metatags from '$lib/components/Metatags.svelte';

	import { onMount } from 'svelte';

	export let msg: string;
	export let status: number;

	let PagePath = '';
	onMount(() => {
		PagePath = window?.location?.pathname;
	});
</script>

<Metatags title="ERROR ⛔" />
<section class="middle">
	<!-- <Metatags title="404 Page Not Found!" description="404 Page" /> -->
	<h1 class="mb-2 font-mono text-6xl font-bold text-red-500">
		{#if status === 404}
			404: Not Found!
		{:else}
			Oops Error happened!
		{/if}
	</h1>

	{#if status === 404}
		<h2 class="mb-4 text-3xl font-semibold">That page does not seem to exist...</h2>
		<iframe
			src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
			width="480"
			height="362"
			frameBorder="0"
			title="Gif of error"
			class="rounded-md"
		/>
	{:else}
		<div class="text-justify text-lg">
			<div>Code: <span class="text-red-500 font-bold">{status}</span></div>
			<div>Occur on: <span class="text-primary-description font-semibold">"{PagePath}"</span></div>
			<code>Message: <span class="text-primary-description font-semibold">"{msg}"</span></code>
		</div>
	{/if}

	<a href="/" sveltekit:prefetch>
		<button
			class="text-headline focus:bg-secondary mt-2 w-32 rounded-md py-2 px-2 font-bold
        outline-none transition hover:bg-primary-800 hover:text-primary-lightest focus:ring-2 focus:ring-offset-2"
		>
			Go home
		</button>
	</a>
</section>
