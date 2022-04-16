<script lang="ts">
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	// Types
	import { CallApi, GetEngineStore, isValidEngine, PushToast } from "$lib/Utils/utils";
	import { onMount } from "svelte";
	import Form from "$lib/components/Form.svelte";

	let InputQuestValue = "";
	let InputQuestElem: HTMLInputElement;

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

			const FormattedQuestion = InputQuestValue.endsWith("?")
				? InputQuestValue
				: `${InputQuestValue}?`;
			const FormattedPrompt = `I am a highly intelligent question answering bot.${
				EngineValue === "text-davinci-002"
					? ""
					: " If you ask me a question I will give you the answer."
			}\nQ: ${FormattedQuestion}\nA:`;

			const OpenAIResponse = await CallApi({
				METHOD: "POST",
				URI: "/api/openai",
				body: {
					Prompt: FormattedPrompt,
					Engine: EngineValue,
					Temperature: 0
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
		<i class="fa-brands fa-google" /> Mini Google
	</h1>

	<Form {HandleSubmit} {UserLoggedIn}>
		<input
			type="text"
			disabled={!UserLoggedIn}
			bind:value={InputQuestValue}
			bind:this={InputQuestElem}
			placeholder="How many planets in solar system?"
			class="w-full rounded bg-primary-800 bg-opacity-60 p-3 text-xl font-semibold text-primary-lightest shadow-md 
      shadow-primary-description outline-none transition-all focus:ring-2 focus:ring-primary-800"
			required
		/>
	</Form>

	<DisplayAiRes {OpenAIResText} />
</article>

<style>
	input::placeholder {
		color: #ddd;
	}
</style>
