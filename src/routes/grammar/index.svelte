<script lang="ts">
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	// Types
	import { GetEngineStore, isValidEngine, PushToast, RequestOpenAI } from "$lib/Utils/utils";
	import { onMount } from "svelte";
	import Form from "$lib/components/Form.svelte";

	let InputQuestValue = "";
	let InputQuestElem: HTMLTextAreaElement;

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
			const EngineValue = await GetEngineStore();
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue))
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedQuestion = InputQuestValue.endsWith(".")
				? InputQuestValue
				: `${InputQuestValue}.`;
			const FormattedPrompt = `Correct this to standard English:\n\n${FormattedQuestion}`;

			const OpenAIResponse = await RequestOpenAI(FormattedPrompt, EngineValue, 0);
			if (!OpenAIResponse.success)
				return PushToast("Completion Failed!", "error", 5000, OpenAIResponse?.reason);
			OpenAIResText = OpenAIResponse.data.text;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<Metatags />
<article class="middle w-full">
	<h1 class="text-3xl font-semibold text-primary-800 xs:text-4xl">
		<i class="fa-solid fa-spell-check" /> Grammar Check
	</h1>

	<Form {HandleSubmit} {UserLoggedIn}
		><textarea
			bind:value={InputQuestValue}
			bind:this={InputQuestElem}
			disabled={!UserLoggedIn}
			placeholder="He have 2 apple."
			required
			class="h-32 w-full rounded-md bg-primary-lightest p-5 text-lg font-semibold shadow-md shadow-primary-headline 
				outline-none focus:ring-1 focus:ring-primary-800"
		/></Form
	>

	<DisplayAiRes {OpenAIResText} />
</article>
