<script lang="ts">
	import type { EnginesNames } from '$lib/interfaces/types';

	export let EngineValue: EnginesNames;
</script>

<select
	bind:value={EngineValue}
	class="mt-2 rounded-md bg-primary-description p-1 capitalize text-primary-lightest outline-none
				 focus:ring-1 focus:ring-primary-800"
	required
>
	<option value="default">Choose your AI 🛠</option>
	<option value="text-ada-001">text-ada-001: Fastest🦅</option>
	<option value="text-babbage-001">text-babbage-001</option>
	<option value="text-curie-001">text-curie-001</option>
	<option value="text-davinci-002">text-davinci-002: Cleverest🧠</option>
</select>
