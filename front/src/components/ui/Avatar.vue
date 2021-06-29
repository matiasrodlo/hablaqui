<template>
	<v-avatar X-small :color="randomColors" :size="size">
		<v-img class="pa-1" v-if="Boolean(url)" :src="url" alt="avatar" contain />
		<span
			v-else
			style="font-size: 8px;"
			class="white--text text-uppercase"
			:class="headline ? 'headline' : 'subtitle-2'"
		>
			{{ initials }}
		</span>
		<v-progress-circular
			v-if="loading"
			style="position: absolute;"
			indeterminate
			color="primary"
		></v-progress-circular>
	</v-avatar>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: '',
		},
		lastName: {
			type: String,
			default: '',
		},
		url: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: '28',
		},
		headline: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			colors: [
				'red',
				'blue',
				'green',
				'indigo',
				'purple',
				'teal',
				'orange',
				'brown',
				'deep-orange',
				'blue-grey',
				'cyan',
			],
			currentColor: '',
		};
	},
	computed: {
		initials() {
			if (this.name)
				return `${this.name.substr(0, 1)}${this.lastName && this.lastName.substr(0, 1)}`;
			return '';
		},
		randomColors() {
			if (this.url) return '#6e548624';
			return this.colors[Math.floor(Math.random() * this.colors.length)];
		},
	},
};
</script>
