<script lang="ts">
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	// Types
	import { CallApi, GetEngineStore, isValidEngine, PushToast } from "$lib/Utils/utils";
	import { onMount } from "svelte";
	import Form from "$lib/components/Form.svelte";

	let InputNumQuest = 5;
	let InputContext = "";
	let InputQuestElem: HTMLInputElement;

	let OpenAIResText = "";

	let UserLoggedIn = false;
	IsLoggedIn.subscribe((logged) => {
		UserLoggedIn = logged;
		if (!logged) InputContext = "⛔ You are not logged in ⛔";
		else InputContext = "";
	});
	onMount(() => InputQuestElem?.focus());

	$: SentencePlaceholder = ["with a science fiction author:", "at Walmart:"][
		Math.round(Math.random() * 1)
	];

	const HandleSubmit = async () => {
		try {
			if (isNaN(InputNumQuest) || InputNumQuest < 1 || InputNumQuest > 20)
				return PushToast(
					"Bad Arguments",
					"warning",
					3600,
					"Number of questions should be > 1 and < 20"
				);

			const EngineValue = await GetEngineStore();
			const NumberQuest = InputNumQuest.toFixed().trim();
			InputContext = InputContext.trim();
			if (NumberQuest.length <= 0 || InputContext.length <= 0 || !isValidEngine(EngineValue))
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedQuestion = InputContext.endsWith(":") ? InputContext : `${InputContext}:`;
			const FormattedPrompt = `Create a list of ${NumberQuest} questions for my interview ${FormattedQuestion}`;

			const OpenAIResponse = await CallApi({
				METHOD: "POST",
				URI: "/api/openai",
				body: {
					Prompt: FormattedPrompt,
					Engine: EngineValue,
					Temperature: 0.5
				}
			});
			if (!OpenAIResponse.succeed || !OpenAIResponse?.data?.text)
				return PushToast("Completion Failed!", "error", 5000, OpenAIResponse?.message);

			OpenAIResText = OpenAIResponse.data.text;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<Metatags />
<article class="middle w-full">
	<h1 class="text-4xl font-semibold text-primary-800">
		<i class="fa-solid fa-briefcase" /> Interview Questions
	</h1>

	<Form {HandleSubmit} {UserLoggedIn}>
		<div class="my-2 w-full text-xl font-semibold leading-9 text-primary-headline">
			{">"} Create a list of
			<input
				type="number"
				bind:value={InputNumQuest}
				bind:this={InputQuestElem}
				disabled={!UserLoggedIn}
				placeholder="5"
				min="1"
				max="20"
				required
				class="h-8 w-8 rounded bg-primary-800 bg-opacity-30 text-center font-bold outline-none transition-all focus:ring-1 focus:ring-primary-800"
			/>
			questions for my interview
			<input
				type="text"
				bind:value={InputContext}
				disabled={!UserLoggedIn}
				placeholder={SentencePlaceholder}
				required
				class="h-8 w-96 rounded bg-primary-800 bg-opacity-30 text-center font-bold outline-none transition-all focus:ring-1 focus:ring-primary-800"
			/>
		</div>
	</Form>

	<DisplayAiRes {OpenAIResText} />
</article>

<style>
	input::placeholder {
		color: #fff;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
