<script lang="ts">
	import { SessionPassword } from "$lib/SessionStore";
	// Components
	import Navbar from "$lib/components/Navbar.svelte";
	import Login from "$lib/components/login.svelte";
	// UI
	import "../styles/Index.css";
	import { ToastContainer, FlatToast } from "svelte-toasts";
	import { onMount } from "svelte";

	let Identified = false;
	let PSWVerified = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	// Login
	SessionPassword.subscribe((psw) => {
		if (!psw || psw.trim().length <= 0) return (Identified = false);
		Identified = true;
		PSWVerified = true;
	});

	$: if (!Identified && mounted) {
		if (window.location.pathname === "/") Identified = true;
		else {
			document.body.style.overflow = "hidden";
			scrollTo(0, 0);
		}
	}
	$: if (Identified && mounted) {
		if (window.location.pathname !== "/" && !PSWVerified) Identified = false;
		else document.body.style.overflow = null;
	}
</script>

<main class="flex h-screen flex-col">
	<Navbar />
	<slot />
	{#if !Identified}
		<Login />
	{/if}
	<ToastContainer placement="top-right" let:data>
		<FlatToast {data} />
	</ToastContainer>
</main>

<!-- Global styling, :global(tag){} -->
<style></style>
