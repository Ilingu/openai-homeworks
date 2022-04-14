<script lang="ts">
	export let OpenAIResText: string;
</script>

<section class="flex w-[50vw] flex-col items-center justify-center">
	<h2>His Response:</h2>
	<div
		class="max-h-[400px] min-h-[100px] w-full overflow-y-auto rounded-md bg-primary-lightest p-4 text-lg font-bold shadow-md shadow-primary-headline"
	>
		{@html OpenAIResText.replaceAll('\n', '<br />')}
	</div>
</section>
