<script lang="ts">
	// Components
	import Navbar from '$lib/components/Navbar.svelte';
	// UI
	import '../styles/Index.css';
</script>

<main class="h-screen">
	<Navbar />
	<slot />
</main>

<!-- Global styling, :global(tag){} -->
<style></style>
