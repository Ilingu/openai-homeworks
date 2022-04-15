onmessage = (evt) => {
	if (!evt?.data) return postMessage({ success: false });

	try {
		const StringToSlice = evt.data;

		const ResDatasTextFormatted = StringToSlice.split(
			`<script type="application/json" sveltekit:data-type="props">`
		)[1].split("</script>")[0];
		const ResDatas = JSON.parse(ResDatasTextFormatted);

		postMessage({ success: true, data: ResDatas });
	} catch (err) {
		postMessage({ success: false });
	}
};
