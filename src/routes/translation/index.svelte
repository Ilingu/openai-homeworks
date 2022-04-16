<script lang="ts">
	import { onMount } from "svelte";
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	import Form from "$lib/components/Form.svelte";
	// Types
	import { GetEngineStore, isValidEngine, PushToast, RequestOpenAI } from "$lib/Utils/utils";
	type LanguageNames = "french" | "english";

	let InputQuestValue = "";
	let InputQuestElem: HTMLInputElement;
	let [InputLang, OutputLang]: LanguageNames[] = ["french", "english"];

	let OpenAIResText = "";

	let UserLoggedIn = false;
	IsLoggedIn.subscribe((logged) => {
		UserLoggedIn = logged;
		if (!logged) InputQuestValue = "⛔ You are not logged in ⛔";
		else InputQuestValue = "";
	});
	onMount(() => InputQuestElem?.focus());

	const HandleLanguagesChange = (InvokeEmplacement: "input" | "output") => {
		if (InvokeEmplacement === "input") {
			if (InputLang === "french") OutputLang = "english";
			if (InputLang === "english") OutputLang = "french";
		}

		if (InvokeEmplacement === "output") {
			if (OutputLang === "english") InputLang = "french";
			if (OutputLang === "french") InputLang = "english";
		}
	};

	const HandleSubmit = async () => {
		try {
			const EngineValue = await GetEngineStore();
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue))
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedQuestion = InputQuestValue.endsWith(".")
				? InputQuestValue
				: `${InputQuestValue}.`;
			const FormattedPrompt = `Translate this ${InputLang} text into ${OutputLang}:\n\n${FormattedQuestion}`;

			const OpenAIResponse = await RequestOpenAI(FormattedPrompt, EngineValue, 0.3);
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
		<i class="fa-solid fa-language" /> Translation
	</h1>

	<Form {HandleSubmit} {UserLoggedIn}>
		<div class="my-1 text-lg">
			Input:
			<select
				bind:value={InputLang}
				on:change={() => HandleLanguagesChange("input")}
				class="rounded bg-primary-800 bg-opacity-60 p-1 text-primary-lightest outline-none focus:ring-1 focus:ring-primary-800"
			>
				<option value="english">🇬🇧 English</option>
				<option value="french">🇫🇷 French</option>
			</select>
			Output:
			<select
				bind:value={OutputLang}
				on:change={() => HandleLanguagesChange("output")}
				class="rounded bg-primary-800 bg-opacity-60 p-1 text-primary-lightest outline-none focus:ring-1 focus:ring-primary-800"
			>
				<option value="french">🇫🇷 French</option>
				<option value="english">🇬🇧 English</option>
			</select>
		</div>
		<input
			type="text"
			disabled={!UserLoggedIn}
			bind:value={InputQuestValue}
			bind:this={InputQuestElem}
			placeholder="Quelles sont les chambres disponibles?"
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
