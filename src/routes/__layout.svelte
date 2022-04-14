<script lang="ts">
	// Components
	import Navbar from '$lib/components/Navbar.svelte';
	// UI
	import '../styles/Index.css';
	import { ToastContainer, FlatToast } from 'svelte-toasts';
</script>

<main class="flex h-screen flex-col">
	<Navbar />
	<slot />
	<ToastContainer placement="top-right" let:data>
		<FlatToast {data} />
	</ToastContainer>
</main>

<!-- Global styling, :global(tag){} -->
<style></style>
