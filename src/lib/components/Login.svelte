<script lang="ts">
	import { SessionPassword } from "$lib/SessionStore";
	import { PushToast } from "$lib/Utils/utils";
	import { onMount } from "svelte";

	let IAuthToken = "";
	let InputElem: HTMLInputElement;

	onMount(() => InputElem?.focus());

	const SaveAuthToken = () => {
		if (!IAuthToken || IAuthToken.trim().length <= 0)
			return PushToast("No Password", "warning", 2500, "Please Fill The Input");
		SessionPassword.set(IAuthToken);
	};
</script>

<div
	class="absolute grid h-screen w-screen place-content-center bg-primary-headline bg-opacity-40 text-center"
>
	<h1
		class="rounded-t-lg bg-primary-800 bg-opacity-80 px-5 pt-5 pb-2 text-4xl font-semibold text-primary-lightest"
	>
		<i class="fa-solid fa-arrow-right-to-bracket" /> Please Login
	</h1>
	<form
		on:submit|preventDefault={SaveAuthToken}
		class="rounded-b-lg bg-primary-800 bg-opacity-80 px-5 pb-5"
	>
		<input
			type="text"
			bind:value={IAuthToken}
			bind:this={InputElem}
			class="rounded-md bg-primary-lighter p-2 text-center text-lg font-semibold text-primary-headline outline-none ring-primary-lightest transition-all focus:ring-1"
		/>
	</form>
</div>
