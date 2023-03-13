<template>
  <v-card :loading="loading">
    <v-card-text v-if="loading">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="3" class="text-center">
          <v-avatar size="200" color="grey lighten-1"></v-avatar>
        </v-col>
        <v-col cols="12" sm="9">
          <div class="body-2 mt-2 mr-4 text-center text-sm-left">
            <v-skeleton-loader
              max-width="300"
              type="heading"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mt-4"
              type="paragraph"
            ></v-skeleton-loader>
            <v-skeleton-loader class="mt-2" type="heading"></v-skeleton-loader>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="specialist && !loading">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="3" class="text-center">
          <avatar
            :url="avatar(specialist, true)"
            :name="specialist.name"
            :last-name="specialist.lastName ? specialist.lastName : ''"
            size="130"
            loading-color="white"
          ></avatar>
          <div class="text-center body-2 text--secondary mt-3 mb-2">
            Código {{ specialist.code }}
          </div>
          <nuxt-link
            class="primary--text body-2 font-weight-bold"
            style="text-decoration: none"
            :to="{ path: `/${specialist.username}` }"
          >
            Más información
          </nuxt-link>
        </v-col>
        <v-col cols="12" sm="9">
          <v-row justify-md="space-between" align="center">
            <v-col cols="12" sm="7" md="9" class="text-center text-sm-left">
              <nuxt-link
                style="text-decoration: none"
                :to="{
                  path: `/${specialist.username}`,
                }"
              >
                <span
                  class="body-1 text-lg-h5 font-weight-bold text--secondary"
                >
                  {{ specialist.name }}
                  {{ specialist.lastName && specialist.lastName }}
                </span>
              </nuxt-link>
            </v-col>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="text-center text-sm-right mb-4 mb-sm-0"
            >
              <!-- ocultado por peticion de daniel -->
              <v-btn
                depressed
                block
                small
                color="primary"
                rounded
                class="ma-2"
                @click="goToReview"
              >
                Añadir evaluación
              </v-btn>
              <v-btn
                depressed
                block
                small
                text
                rounded
                class="ma-2"
                @click="changeSpecialist"
              >
                Cambiar especialista
              </v-btn>
            </v-col>
          </v-row>
          <v-chip-group v-model="specialties" show-arrows>
            <template v-for="(tag, i) in specialist.specialties">
              <v-chip
                :key="i"
                :value="tag"
                class="ma-2"
                small
                :color="specialties == tag ? 'primary--text' : ''"
              >
                <span>
                  {{ tag }}
                </span>
              </v-chip>
            </template>
          </v-chip-group>
          <div class="body-2 mt-2 mr-4 text-center text-sm-left">
            {{
              specialist.professionalDescription.length > 345
                ? specialist.professionalDescription.slice(0, 345).concat('...')
                : specialist.professionalDescription
            }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="!specialist && !loading" class="text-center">
      <div class="body-1 my-5 mx-auto" style="max-width: 280px">
        Bienestar en cualquier momento
      </div>
      <v-btn rounded color="primary" :to="{ name: 'evaluacion' }">
        Comenzar
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
/**
 * componente de especialista
 */
export default {
  props: {
    specialist: {
      type: Object,
      default: null,
    },
    setSpecialist: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      specialties: '',
    }
  },
  computed: {
    ...mapGetters({
      plans: 'User/plan',
    }),
  },
  mounted() {
    this.plan =
      this.plans && this.plans.sortedPlans.length > 0
        ? this.plans.sortedPlans[0]
        : null
  },
  methods: {
    /**
     * retorna string url, miniatura si la tiene o full size
     */
    avatar(specialist, thumbnail) {
      if (!specialist.approveAvatar) return ''
      if (specialist.avatarThumbnail && thumbnail)
        return specialist.avatarThumbnail
      if (specialist.avatar) return specialist.avatar
      return ''
    },
    /**
     * Se ejecuta para cambiar de especialista, le muestra un mesaje de alerta
     */
    changeSpecialist() {
      return alert('Por favor, escribanos a nuestro WhatsApp: +569 7132 6467')
    },
    /**
     * redirige al review
     */
    goToReview() {
      return this.$router.push(`/review?specialist=${this.specialist._id}`)
    },
  },
}
</script>
