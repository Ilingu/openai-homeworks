<script lang="ts">
	import { IsLoggedIn, SessionPassword } from "$lib/stores/SessionStore";
	// Components
	import Navbar from "$lib/components/Navbar.svelte";
	// UI
	import "../styles/Index.css";
	import { ToastContainer, FlatToast } from "svelte-toasts";
	import { onDestroy, onMount } from "svelte";
	import { CheckPasswordReq, PushToast } from "$lib/Utils/utils";
	// Types
	import type { Unsubscriber } from "svelte/store";

	let LoggedIn = false;

	let unsub: Unsubscriber;
	onMount(async () => {
		const CachedPsw = window.localStorage.getItem("SessionPassword");
		if (!CachedPsw) return;

		try {
			const Password: string = JSON.parse(CachedPsw);
			if (!Password || Password.trim().length <= 0)
				return window.localStorage.removeItem("SessionPassword");

			const { GoodPsw } = await CheckPasswordReq(Password);
			if (!GoodPsw) {
				window.localStorage.removeItem("SessionPassword");
				SessionPassword.set(undefined);
				IsLoggedIn.set(false);
				return PushToast("Password Cached is invalid", "error", 5000, "You have been disconnected");
			}

			PushToast("Connected", "success", 1500);
			SessionPassword.set(Password);
			IsLoggedIn.set(true);
		} catch (err) {
			PushToast("Internal Error", "error", 1500, "Couldn't Login");
		}
	});
	onDestroy(() => unsub());

	unsub = SessionPassword.subscribe((psw) => {
		if (!psw || psw.trim().length <= 0) return (LoggedIn = false);
		LoggedIn = true;
	});
</script>

<main class="flex h-screen flex-col">
	<Navbar {LoggedIn} />
	<slot />
	<ToastContainer placement="top-right" let:data>
		<FlatToast {data} />
	</ToastContainer>
</main>

<!-- Global styling, :global(tag){} -->
<style></style>
