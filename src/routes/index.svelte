<script lang="ts">
	import type { IconDatasShape } from '$lib/interfaces/interfaces';

	import { onDestroy, onMount } from 'svelte';

	// DOM
	let h1Elem: HTMLElement;
	let AnimationInterval: NodeJS.Timer;
	// Var
	const HeadingText = [
		['Homeworks', 'Text', 'Completion 📚'],
		['Mini', 'Google 🌐'],
		['It Prepare', 'you for', 'exams 👨‍🎓'],
		['It Shorten', 'your', 'notes 🗒']
	];

	let TextIndex = 0;
	let WordIndex = 0;
	let move: 'forward' | 'backward' = 'forward';
	let skip = 0;

	let currentSentence: string[] = [];

	const RenderH1 = () => (h1Elem.textContent = currentSentence.join(''));
	onMount(() => {
		AnimationInterval = setInterval(() => {
			if (skip > 0) return skip--;

			const CurrentSentenceIndex = HeadingText[TextIndex];
			const CurrentWordIndex = CurrentSentenceIndex[WordIndex];

			if (WordIndex < CurrentSentenceIndex.length && move === 'forward') {
				currentSentence = [...currentSentence, ` ${CurrentWordIndex}`];
				RenderH1();
				WordIndex++;
			}
			if (WordIndex >= CurrentSentenceIndex.length && move === 'forward') {
				skip = 3;
				return (move = 'backward');
			}

			if (WordIndex !== 0 && move === 'backward') {
				currentSentence.pop();
				RenderH1();
				WordIndex--;
			}

			if (WordIndex <= 0 && move === 'backward') {
				move = 'forward';
				if (TextIndex >= HeadingText.length - 1) return (TextIndex = 0);

				TextIndex++;
			}
		}, 300);
	});
	onDestroy(() => {
		clearInterval(AnimationInterval);
	});

	const RandomRGBValue = () => {
		const [R, G, B] = Array(3)
			.fill(0)
			.map(() => Math.round(Math.random() * 255)) as [number, number, number];
		let WoB = '#ffffff';

		if (R * 0.299 + G * 0.587 + B * 0.114 > 186) WoB = '#000000';
		return `background-color: rgb(${R}, ${G}, ${B}); color: ${WoB};`;
	};
	$: RGBColor = () => RandomRGBValue();

	const IconsDatas: IconDatasShape[] = [
		{ icon: 'fa-solid fa-message', desc: 'Text Completion', href: '/text-completion' },
		{ icon: 'fa-brands fa-google', desc: 'Mini Google', href: '/mini-google' },
		{ icon: 'fa-solid fa-book', desc: 'Summarize Notes', href: '/summarize' },
		{ icon: 'fa-solid fa-spell-check', desc: 'Grammar Check', href: '/grammar' },
		{ icon: 'fa-solid fa-briefcase', desc: 'Job Interview', href: '/job-interview' }
	];
</script>

<article class="middle w-full">
	<h1
		class="active min-h-[96px] overflow-y-hidden text-center text-3xl text-primary-headline sm:h-24 sm:text-4xl md:text-5xl"
	>
		OpenAI: <br /> <span bind:this={h1Elem} class="font-bold text-primary-description-whither" />
	</h1>

	<div class="mt-8 w-[50vw]">
		<header class="text-lg font-semibold">Functionnalities:</header>
		<div class="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
			{#each IconsDatas as { icon, desc, href }}
				<a {href} sveltekit:prefetch>
					<div class="flex items-center gap-x-2">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-md p-3"
							style={RGBColor()}
						>
							<i class={icon} />
						</div>
						<p>{desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</article>
