<script lang="ts">
	import Metatags from "$lib/components/Metatags.svelte";

	import { IsLoggedIn, SessionPassword } from "$lib/stores/SessionStore";
	import { CheckPasswordReq, PushToast } from "$lib/Utils/utils";
	import { onMount } from "svelte";

	let IAuthToken = "";
	let InputElem: HTMLInputElement;
	let UserLoggedIn = false;

	onMount(() => InputElem?.focus());
	IsLoggedIn.subscribe((logged) => (UserLoggedIn = logged));

	const SaveAuthToken = async () => {
		if (!IAuthToken || IAuthToken.trim().length <= 0)
			return PushToast("No Password", "warning", 2500, "Please Fill The Input");

		try {
			const { GoodPsw } = await CheckPasswordReq(IAuthToken);
			if (!GoodPsw) return PushToast("Wrong Password", "error", 5000, "Try again");
			PushToast("Successfully Logged In!", "success", 5000, "Password Save in memory");

			// Save psw in store
			SessionPassword.set(IAuthToken);
			window.localStorage.setItem("SessionPassword", JSON.stringify(IAuthToken));
		} catch (err) {
			console.error(err);
			PushToast("Internal Error", "error", 5000, "Couldn't reach internal server");
		}
	};
</script>

<Metatags />
<article class="middle w-full">
	<h1 class="mb-5 text-2xl font-semibold text-primary-headline">
		<i class="fa-solid fa-arrow-right-to-bracket" /> Login
	</h1>
	<form on:submit|preventDefault={SaveAuthToken} class="flex translate-x-3">
		<input
			type="password"
			disabled={UserLoggedIn}
			placeholder={UserLoggedIn ? "Already logged in" : "The password"}
			bind:value={IAuthToken}
			bind:this={InputElem}
			class="rounded-md bg-primary-lighter p-2 text-center text-lg font-semibold text-primary-headline shadow-md shadow-primary-800 outline-none ring-primary-lightest transition-all focus:ring-1"
		/>
		<button type="submit" class="p-2 text-lg text-primary-headline"
			><i class="fa-solid fa-check" /></button
		>
	</form>
</article>
