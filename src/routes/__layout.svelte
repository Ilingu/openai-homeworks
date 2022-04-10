<script lang="ts">
	// Components
	import Navbar from '$lib/components/Navbar.svelte';
	// UI
	import '../styles/Index.css';
</script>

<main class="flex h-screen flex-col">
	<Navbar />
	<slot />
</main>

<!-- Global styling, :global(tag){} -->
<style></style>
