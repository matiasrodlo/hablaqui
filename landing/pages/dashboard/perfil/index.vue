<template>
  <v-container style="height: 100vh; max-width: 1200px">
    <appbar class="hidden-sm-and-down" title="Cuenta" />
    <v-list
      two-line
      color="transparent"
      style="height: 150px"
      class="mt-16 pt-10 pt-md-0 mt-md-0"
    >
      <v-list-item
        id="itemAvatar"
        class="hidden-sm-and-down"
        style="position: relative"
        :style="step && step.title === 'Foto de perfil' ? 'z-index: 3' : ''"
      >
        <v-file-input
          id="upload"
          ref="avatar"
          class="d-none"
          dense
          filled
          hide-details
          accept="image/jpeg, image/png, image/gif, image/jpg"
          placeholder="Agrega un avatar"
          drop-placeholder="Arrastrar aqui..."
          @change="uploadAvatar"
        ></v-file-input>
        <v-list-item-avatar size="150">
          <label for="upload" style="cursor: pointer; position: relative">
            <avatar
              :url="$auth.$state.user.avatarThumbnail"
              :name="$auth.$state.user.name"
              :last-name="
                $auth.$state.user.lastName ? $auth.$state.user.lastName : ''
              "
              size="100"
              :loading="loadingAvatar"
              loading-color="white"
            ></avatar>
            <div
              v-if="!loadingAvatar"
              class="white rounded-circle elevation-1"
              style="position: absolute; right: 0px; bottom: 0px; padding: 4px"
            >
              <icon size="30" color="primary" :icon="mdiCamera" />
            </div>
          </label>
        </v-list-item-avatar>
        <v-list-item-content v-if="$auth.$state.user">
          <card-onboarding
            v-if="step && step.title === 'Foto de perfil'"
            style="position: absolute; top: 20%"
            arrow="arrow-left"
            :next="
              () => ({
                title: 'Datos bancarios',
                tab: 0,
                card: {
                  title: 'Datos bancarios',
                  description:
                    'Ingrese sus datos. Nosotros cobramos y transferimos directamente a su cuenta.',
                },
                route: 'dashboard-perfil',
              })
            "
          />
          <v-list-item-title class="text-capitalize font-weight-bold title">
            {{ $auth.$state.user.name }} {{ $auth.$state.user.lastName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="body-1">Bienvenido a Hablaquí</div>
            <!-- <small v-if="!$auth.$state.user.isVerified" class="error--text">
							Verifique su correo electronico
						</small> -->
          </v-list-item-subtitle>
        </v-list-item-content>
        <client-only>
          <v-list-item-action
            v-if="canCopy && specialist && $auth.user.role === 'specialist'"
          >
            <div class="d-flex align-center">
              <v-text-field
                readonly
                style="font-size: 14px"
                outlined
                dense
                hide-details
                filled
                :value="`hablaqui.cl/${specialist.username}`"
              />
              <v-btn class="ml-1" small color="primary" @click="copyLink">
                Copiar link
              </v-btn>
            </div>
          </v-list-item-action>
        </client-only>
      </v-list-item>
      <v-list-item class="hidden-md-and-up">
        <div
          style="position: absolute; top: -70px; left: 0; width: 100%"
          class="text-center mx-auto"
        >
          <label for="upload" style="cursor: pointer; position: relative">
            <avatar
              :url="$auth.$state.user.avatarThumbnail"
              :name="$auth.$state.user.name"
              size="100"
              :loading="loadingAvatar"
              loading-color="white"
            ></avatar>
            <div
              v-if="!loadingAvatar"
              class="white rounded-circle elevation-1"
              style="position: absolute; right: 0; bottom: -40px; padding: 4px"
            >
              <icon size="30" color="primary" :icon="mdiCamera" />
            </div>
          </label>
        </div>
        <v-list-item-content v-if="$auth.$state.user" class="mt-10">
          <v-list-item-title
            class="text-capitalize font-weight-bold title text-center"
          >
            {{ $auth.$state.user.name }} {{ $auth.$state.user.lastName }}
          </v-list-item-title>
          <v-list-item-subtitle class="body-1 text-center">
            Bienvenido a Hablaquí
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-tabs
      v-model="tabs"
      class="hidden-sm-and-down"
      grow
      style="height: 100px"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab class="primary--text text-capitalize"> Información General </v-tab>

      <v-tab v-if="$auth.$state.user" class="primary--text text-capitalize">
        {{ $auth.$state.user.role == 'user' ? 'Suscripciones' : 'Horario' }}
      </v-tab>

      <v-tab class="primary--text text-capitalize">
        {{ $auth.$state.user.role == 'user' ? 'Especialista' : 'Servicios' }}
      </v-tab>
    </v-tabs>
    <v-row no-gutters>
      <v-col cols="12">
        <v-tabs-items v-model="tabs" class="hidden-sm-and-down">
          <v-tab-item :transition="false">
            <general-information
              v-if="tabs === 0"
              :specialist="specialist"
              :set-specialist="setSpecialist"
            />
          </v-tab-item>
          <v-tab-item :transition="false">
            <my-plans v-if="tabs === 1 && $auth.$state.user.role === 'user'" />
            <horario
              v-if="tabs === 1 && $auth.$state.user.role === 'specialist'"
              :specialist="specialist"
              :set-specialist="setSpecialist"
            />
          </v-tab-item>
          <v-tab-item :transition="false">
            <especialista
              v-if="tabs === 2 && $auth.$state.user.role === 'user'"
              :specialist="specialist"
              :set-specialist="setSpecialist"
            />
            <services
              v-if="tabs === 2 && $auth.$state.user.role === 'specialist'"
              :specialist="specialist"
              :set-specialist="setSpecialist"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-expansion-panels
          v-model="panels"
          flat
          multiple
          class="mb-4 hidden-md-and-up"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <div class="text-h6" style="color: #3c3c3b">Configuración</div>
                <div
                  v-if="$auth.$state.user.role === 'specialist'"
                  class="text--secondary"
                >
                  Datos bancarios, información profesional, etc
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <general-information
                :specialist="specialist"
                :set-specialist="setSpecialist"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="$auth.$state.user.role == 'user'">
            <v-expansion-panel-header>
              <div>
                <div class="text-h6" style="color: #3c3c3b">Suscripciones</div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <my-plans />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="$auth.$state.user.role == 'user'">
            <v-expansion-panel-header>
              <div>
                <div class="text-h6" style="color: #3c3c3b">Especialista</div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <especialista
                :specialist="specialist"
                :set-specialist="setSpecialist"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="$auth.$state.user.role === 'specialist'">
            <v-expansion-panel-header>
              <div>
                <div class="text-h6" style="color: #3c3c3b">Horarios</div>
                <div class="text--secondary">
                  En estos horarios podrán agendar con usted
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <horario
                :specialist="specialist"
                :set-specialist="setSpecialist"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="$auth.$state.user.role === 'specialist'">
            <v-expansion-panel-header>
              <div>
                <div class="text-h6" style="color: #3c3c3b">Servicios</div>
                <div class="text--secondary">
                  Valor por sesión, agendamiento y reagendamiento
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card elevation="6" to="perfil/services">
                <v-card-title>
                  <div class="my-6" style="width: 100%">
                    <div class="text-h6" style="color: #3c3c3b">
                      Configuración de servicios
                    </div>
                    <div class="text--secondary body-2">
                      Configura los servicios ofrecidos por medio de Hablaquí
                    </div>
                  </div>
                </v-card-title>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { mdiCamera } from '@mdi/js'

/**
 * perfil index
 */
export default {
  components: {
    Appbar: () => import('~/components/dashboard/AppbarProfile'),
    Avatar: () => import('~/components/Avatar'),
    GeneralInformation: () => import('~/components/dashboard/General'),
    Horario: () => import('~/components/dashboard/Horario'),
    Icon: () => import('~/components/Icon'),
    MyPlans: () => import('~/components/dashboard/MyPlans'),
    Especialista: () => import('~/components/dashboard/Especialista'),
    Services: () => import('~/components/dashboard/Services'),
  },
  layout: 'dashboard',
  middleware: ['auth'],
  data() {
    return {
      mdiCamera,
      tabs: 0,
      panels: [],
      loadingAvatar: false,
      sidebar: 0,
      canCopy: false,
    }
  },
  computed: {
    specialist: {
      get() {
        return this.item
      },
      set(value) {
        this.setSpecialist(value)
      },
    },
    ...mapGetters({ item: 'Specialist/specialist', step: 'User/step' }),
  },
  watch: {
    step(newValue) {
      if (newValue) this.tabs = newValue.tab
    },
  },
  mounted() {
    // verifica el clipboard
    this.canCopy = !!navigator.clipboard
  },
  methods: {
    /**
     * estable el valor en especialista
     */
    setSpecialist(value) {
      this.specialist = value
    },
    /**
     * Actualiza el avatar
     */
    async uploadAvatar(file) {
      if (!file) return false
      this.loadingAvatar = true
      const { user } = await this.upateAvatar(this.setAvatarObject(file))
      this.$auth.setUser(user)
      this.loadingAvatar = false
      if (this.$auth.user.role === 'specialist' && this.$auth.user.specialist)
        alert(
          'Tu avatar estara disponible publicamente despues de que lo aprobemos'
        )
    },
    /**
     * Crea el formdata de avatar
     */
    setAvatarObject(file) {
      const avatar = new FormData()
      avatar.append('avatar', file)
      avatar.append('_id', this.$auth.$state.user._id)
      avatar.append('name', this.$auth.$state.user.name)
      avatar.append('lastName', this.$auth.$state.user.lastName)
      avatar.append('idSpecialist', this.$auth.$state.user.specialist)
      avatar.append('role', this.$auth.$state.user.role)
      avatar.append('oldAvatar', this.$auth.$state.user.avatar)
      avatar.append(
        'oldAvatarThumbnail',
        this.$auth.$state.user.avatarThumbnail
          ? this.$auth.$state.user.avatarThumbnail
          : ''
      )
      return avatar
    },
    /**
     * copiar enlace
     */
    copyLink() {
      navigator.clipboard.writeText(
        `${this.$config.VUE_URL}${this.specialist.username}`
      )
    },
    ...mapMutations({
      setSpecialist: 'Specialist/setSpecialist',
    }),
    ...mapActions({
      upateAvatar: 'User/upateAvatar',
    }),
  },
}
</script>
