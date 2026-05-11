<template>
	<NuxtPage />
</template>

<style>
	:root {
		--background: #fff;
		--text: #111;
		--light: #677;
		--note: color-mix(var(--text) 70%, var(--background));
		--color-primary: #39620c;
		--color-primary-bright: #78a75a;
		--font-title: "Limelight", serif;
		--font-main: "Funnel Display", sans-serif;
		--light-border: color-mix(currentColor, transparent 80%);

		--highlight-base: .9 .1;
		--definition: oklch(var(--highlight-base) 260);
		--hint-1: oklch(var(--highlight-base) 90);
		--hint-2: oklch(var(--highlight-base) 310);
		--hint-3: oklch(var(--highlight-base) 135);
		--hint-4: oklch(var(--highlight-base) 45);
		--hint-5: oklch(var(--highlight-base) 210);
		--hint-6: oklch(var(--highlight-base) 0);
		@media (prefers-color-scheme: dark) {
			/* --background: #0d0f12; */
			--background: #17191d;
			--text: #eee;
			--light: #bdc3c7;
			--color-primary: #78a75a;

			--highlight-base: .4 .1;
		}
	}
	*, *::before, *::after { box-sizing: border-box; }
	* { margin: 0; scrollbar-color: var(--text) var(--background); }
	img, picture, video, canvas, svg {
		display: block;
		max-width: 100%;
	}
	input, button, textarea, select {
		font: inherit;
	}
	button {
		border: none;
		color: currentColor;
		background: none;
		text-transform: inherit;
		text-align: inherit;
		padding: 0;
		cursor: pointer;
	}
	p, h1, h2, h3, h4, h5, h6 {
		overflow-wrap: break-word;
	}
	p { text-wrap: pretty; margin-bottom: 1lh; }
	h1, h2, h3, h4, h5, h6 {
		font-family: var(--font-title);
		font-weight: 400;
		text-wrap: balance;
		margin-bottom: 1em;
	}
	ol, ul {
		margin-bottom: 1lh;
	}
	a {
		color: currentColor;
		text-decoration: none;
	}
	svg {
		fill: currentColor;
		&[width="0"][height="0"] {
			position: fixed; top: 0; left: 0;
		}
		&:where([fill="none"]) {
			fill: none;
			stroke: currentColor;
		}
	}
	html {
		background: var(--background);
		color: var(--text);
		font-family: var(--font-main);
		font-optical-sizing: auto;
		font-weight: 300;
	}
	strong { font-weight: 600; }
</style>