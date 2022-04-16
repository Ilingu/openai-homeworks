<script lang="ts">
	export let OpenAIResText: string;
</script>

<section class="flex w-[100vw] flex-col items-center justify-center">
	<h2>His Response:</h2>
	<div
		class="max-h-[400px] min-h-[100px] w-[95%] overflow-y-auto rounded-md bg-primary-lightest p-4 text-lg font-bold shadow-md shadow-primary-headline md:w-3/4 xl:w-1/2"
	>
		{@html OpenAIResText.replaceAll("\n", "<br />")}
	</div>
</section>
