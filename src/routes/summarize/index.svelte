<script lang="ts">
	import { IsLoggedIn } from "$lib/stores/SessionStore";
	// Components
	import DisplayAiRes from "$lib/components/DisplayAIRes.svelte";
	import Metatags from "$lib/components/Metatags.svelte";
	// Types
	import type { EnginesNames } from "$lib/interfaces/types";
	import { isValidEngine, PushToast, RequestOpenAI } from "$lib/Utils/utils";
	import { getContext, onMount } from "svelte";
	import Form from "$lib/components/Form.svelte";

	type MethodsSummaryNames = "grader" | "notes";

	let InputQuestValue = "";
	let InputQuestElem: HTMLTextAreaElement;
	let MethodSummary: MethodsSummaryNames;

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
			const { EngineValue } = getContext("FormEngineValue") as { EngineValue: EnginesNames };
			InputQuestValue = InputQuestValue.trim();
			if (InputQuestValue.length <= 0 || !isValidEngine(EngineValue) || !isValidMethodName())
				return PushToast("Bad Arguments", "warning", 3600);

			const FormattedSummary = `${
				MethodSummary === "notes"
					? "Convert my short hand into a first-hand account of the meeting:\n\n"
					: "Summarize this for a second-grade student:\n\n"
			}${InputQuestValue}`;

			const OpenAIResponse = await RequestOpenAI(
				FormattedSummary,
				EngineValue,
				MethodSummary === "notes" ? 0 : 0.7
			);
			if (!OpenAIResponse.success)
				return PushToast("Completion Failed!", "error", 5000, OpenAIResponse?.reason);
			OpenAIResText = OpenAIResponse.data.text;
		} catch (err) {
			console.error(err);
		}
	};

	const isValidMethodName = (): boolean => {
		if (MethodSummary === "grader") return true;
		if (MethodSummary === "notes") return true;
		return false;
	};
</script>

<!-- Summarize for a 2nd grader && Notes to summary -->

<Metatags />
<article class="middle w-full">
	<h1 class="text-4xl font-semibold text-primary-800">
		<i class="fa-solid fa-book" /> Summarize
	</h1>

	<Form {HandleSubmit} {UserLoggedIn}>
		<textarea
			disabled={!UserLoggedIn}
			bind:value={InputQuestValue}
			bind:this={InputQuestElem}
			required
			class="h-32 w-full rounded-md bg-primary-lightest p-5 text-lg font-semibold shadow-md shadow-primary-headline outline-none focus:ring-1 focus:ring-primary-800"
		/>
		<select
			bind:value={MethodSummary}
			class="mt-2 rounded-md bg-primary-description p-1 capitalize text-primary-lightest outline-none
				 focus:ring-1 focus:ring-primary-800"
			required
		>
			<option value="default">Choose Methods to summarize</option>
			<option value="grader">Summarize for a 2nd grader</option>
			<option value="notes">Notes to summary</option>
		</select>
	</Form>

	<DisplayAiRes {OpenAIResText} />
</article>
