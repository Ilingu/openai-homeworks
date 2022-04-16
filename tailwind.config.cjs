const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				// Main Colors
				primary: {
					lightest: "#feffe7", // 50
					lighter: "#fcffc1", // 100
					light: "#feff86", // 200
					300: "#fff941",
					main: {
						whither: "#ffec0d", // 400
						DEFAULT: "#ffdd00" // 500
					},
					description: {
						whither: "#d1a300", // 600
						DEFAULT: "#a67502" // 700
					},
					800: "#895b0a",
					headline: "#744a0f" // 900
				}
			}
		},
		// Responsive
		screens: {
			xs: "450px",
			...defaultTheme.screens
		}
	},
	plugins: []
};
