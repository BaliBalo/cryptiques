<script setup lang="ts">
	import { getAnswerLength } from '#shared/utils/answerLength';

	const { content = '', answer = '', authorName = '' } = defineProps<{
		content?: string,
		answer?: string,
		authorName?: string,
	}>();

	const len = getAnswerLength(answer);
	const words = answer.split(/([ ])/g).map((word, i, all) => ({ letters: [...word], offset: all.slice(0, i).reduce((s, w) => s + w.length, 0) })) || [];
	const isLetter = (c: string | undefined) => c && !isSeparator(c);
	const hasLetterBeforeStyle = { borderLeftWidth: '2px', marginLeft: '-2px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };
	const hasLetterAfterStyle = { borderRightWidth: '2px', borderTopRightRadius: 0, borderBottomRightRadius: 0 };
</script>

<template>
	<div class="container">
		<div class="clue">
			<div v-if="authorName" class="by">Une énigme de : {{ authorName }}</div>
			{{ content }} {{ len }}
		</div>
		<div class="answer">
			<span v-for="word in words" :key="word.offset" class="word">
				<template v-for="(letter, index) in word.letters">
					<span v-if="isSeparator(letter)" :key="`sep-${index}`" class="answer-sep">{{ letter }}</span>
					<span
						v-else
						:key="`letter-${index}`"
						class="answer-letter"
						:style="{
							// Dynamic classnames do not seem to work
							// Also inline styles have lower priority than class styles for some reason, so define relevant properties here
							border: '4px solid',
							borderRadius: '8px',
							...(isLetter(word.letters[index - 1]) && hasLetterBeforeStyle),
							...(isLetter(word.letters[index + 1]) && hasLetterAfterStyle),
						}"
					/>
				</template>
			</span>
		</div>
	</div>
</template>

<style>
	.container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: safe center;
		gap: 32px;
		background: #17191d;
		color: #eee;
		font-size: 48px;
		padding: 16px 60px;
	}
	.clue {
		display: flex;
		flex-flow: column nowrap;
		padding: 32px;
		border: 16px double #bdc3c7;
		border-radius: 32px;
		corner-shape: bevel;
	}
	.by {
		font-size: 32px;
		opacity: 0.75;
		margin-bottom: 24px;
	}
	.answer {
		display: flex;
		flex-flow: row wrap;
		gap: 16px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.word {
		display: inline-flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 16px 0;
	}
	.answer-letter, .answer-sep {
		line-height: normal;
		vertical-align: middle;
	}
	.answer-letter {
		position: relative;
		display: inline-block;
		width: 72px;
		height: 72px;
		text-align: center;
		place-content: center;
		text-transform: lowercase;
		z-index: 1;
	}

</style>