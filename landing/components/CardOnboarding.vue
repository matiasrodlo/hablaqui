<template>
  <v-card v-if="step" elevation="24" rounded="xl" :class="arrow">
    <v-card-title class="pt-0 pb-1 caption font-weight-bold primary--text">
      {{ step.card.title }}
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="caption pb-0 pt-1 d-flex" style="width: 250px">
      <div style="flex: 5">
        {{ step.card.description }}
        <a v-if="step.card.link" :href="step.card.link">Enlace</a>
      </div>
      <div style="flex: 1" class="text-right">
        <v-btn icon @click.stop="setStep(next())">
          <icon size="30" color="primary" :icon="mdiChevronRightCircle" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiChevronRightCircle } from '@mdi/js'
import { mapGetters, mapMutations } from 'vuex'

/**
 * tarjeta para el onboarding
 */
export default {
  props: {
    itemId: {
      type: String,
      default: '',
    },
    arrow: {
      type: String,
      required: true,
    },
    next: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    fav: true,
    menu: true,
    message: false,
    hints: true,
    mdiChevronRightCircle,
  }),
  computed: {
    ...mapGetters({ step: 'User/step' }),
  },
  watch: {
    /**
     * Listener step y abrir o no el menu
     */
    step: {
      handler(newValue) {
        if (newValue) {
          this.menu = true
        } else this.menu = false
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * mutaciones utilizadas
     */
    ...mapMutations({
      // establece el paso en el que ira
      setStep: 'User/setStep',
    }),
  },
}
</script>

<style lang="scss" scoped>
.arrow-left {
  padding: 15px !important;
}
.arrow-left:after {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  right: 100% !important;
  top: 50% !important;
  margin-top: -10px !important;
  width: 0 !important;
  height: 0 !important;
  border-top: 10px solid transparent !important;
  border-right: 10px solid white !important;
  border-bottom: 10px solid transparent !important;
  border-left: 10px solid transparent !important;
}

.arrow-right {
  padding: 15px;
}
.arrow-right:after {
  content: '';
  display: block;
  position: absolute;
  left: 100%;
  top: 50%;
  margin-top: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid white;
}

.arrow-top {
  padding: 15px;
}
.arrow-top:after {
  content: '';
  display: block;
  position: absolute;
  left: 20px;
  bottom: 100%;
  width: 0;
  height: 0;
  border-bottom: 10px solid white;
  border-top: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
.arrow-bottom {
  padding: 15px;
}
.arrow-bottom:after {
  content: '';
  display: block;
  position: absolute;
  left: 20px;
  top: 100%;
  width: 0;
  height: 0;
  border-bottom: 10px solid transparent;
  border-top: 10px solid white;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
</style>
