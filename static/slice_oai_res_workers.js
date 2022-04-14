onmessage = (evt) => {
	if (!evt?.data) return postMessage({ success: false });

	try {
		const StringToSlice = evt.data;

		const OpenAIResDatasTextFormatted = StringToSlice.split(
			`<script type="application/json" sveltekit:data-type="props">`
		)[1].split('</script>')[0];
		const OpenAIResDatas = JSON.parse(OpenAIResDatasTextFormatted);

		postMessage({ success: true, data: OpenAIResDatas.text });
	} catch (err) {
		postMessage({ success: false });
	}
};
