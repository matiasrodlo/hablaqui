<template>
  <v-avatar x-small :color="randomColors" :size="size">
    <v-img
      v-if="Boolean(url)"
      class="pa-1"
      :src="url"
      :lazy-src="url"
      alt="avatar"
      contain
    />
    <span
      v-else
      style="font-size: 8px"
      class="white--text text-uppercase"
      :class="headline ? 'headline' : 'subtitle-2'"
    >
      {{ initials }}
    </span>
    <v-progress-circular
      v-if="loading"
      style="position: absolute"
      indeterminate
      :color="loadingColor"
    ></v-progress-circular>
  </v-avatar>
</template>

<script>
/**
 * Visualiza el avatar o coloca iniciales del nombre si no tiene
 */
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
    loadingColor: {
      type: String,
      default: 'primary',
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
    }
  },
  computed: {
    /**
     * Iniciales a establecer
     * @returns string con las iniciales
     */
    initials() {
      if (this.name)
        return `${this.name.substr(0, 1)}${
          this.lastName && this.lastName.substr(0, 1)
        }`
      return ''
    },
    /**
     * Colores random
     * @returns string con un color aleatorio
     */
    randomColors() {
      if (this.url) return '#6e548624'
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
  },
}
</script>
