<script lang="ts">
	export let LoggedIn: boolean;
</script>

<nav
	class="flex h-20 w-full items-center justify-between bg-gradient-to-r from-primary-description-whither to-primary-800 px-5"
>
	<!-- Home -->
	<a href="/" sveltekit:prefetch class="flex items-center gap-x-2"
		><img src="/IMG/favicon.png" alt="Home" class="w-16 rounded" />
		<span class="text-lg font-bold text-primary-lightest"
			>AI Homeworks<span class="hidden sm:inline">📚</span></span
		>
	</a>

	<a href="/login" sveltekit:prefetch>
		{#if LoggedIn}
			<p class="text-lg font-bold text-green-500">
				<span class="hidden sm:inline">✅</span> Connected
			</p>
		{:else}
			<p class="text-lg text-red-500 font-bold">
				<span class="sm:inline hidden">❌</span> Disconnected
			</p>
		{/if}
	</a>
</nav>
