<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      mini-variant-width="60"
      v-model:mini-variant="isMini"
      color="primary"
      :expand-on-hover="$vuetify.breakpoint.mdAndUp"
      app
      mobile-breakpoint="960"
    >
      <v-sheet color="primary" class="pa-1">
        <v-img
          height="100"
          contain
          style="cursor: pointer"
          :src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
          :lazy-src="`https://cdn.hablaqui.cl/static/logo_tiny_white.png`"
          alt="logo hablaquí"
          class="mt-10"
          @click="() => $router.push({ name: 'especialistas' })"
        />
      </v-sheet>
      <v-list
        id="listdrawer"
        style="flex: 2"
        dark
        color="primary"
        class="pt-0"
        left
        shaped
        top
      >
        <template v-for="(item, i) in links">
          <v-list-item
            v-if="item.visible"
            :id="item.name"
            :key="i"
            :inactive="item.disable"
            class="my-4"
            link
            :to="item.link"
          >
            <v-list-item-avatar size="35">
              <v-img
                height="35"
                width="35"
                :src="item.img"
                :lazy-src="item.img"
                :alt="item.name"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                :id="item.name"
                class="font-weight-bold body-2"
              >
                <v-tooltip
                  v-if="item.disable"
                  right
                  max-width="300"
                  color="white"
                >
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <icon :icon="mdiAlertOutline" color="red" />
                    </v-btn>
                  </template>
                  <span class="black--text">
                    Esta opción se activará contratando un plan premium
                  </span>
                </v-tooltip>

                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item
          v-if="$auth.$state.user.role === 'specialist'"
          class="my-4 hidden-md-and-up"
          link
          href="https://cal.hablaqui.cl/team/hablaqui/capacitacion"
        >
          <v-list-item-avatar size="30">
            <v-img
              height="30"
              width="30"
              src="https://cdn.hablaqui.cl/static/demo-w.png"
              alt="demo"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold body-2">
              Agendar demo
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$auth.user.role === 'specialist'"
          class="my-4 hidden-md-and-up"
          link
          href="https://hablaqui.cl/para-especialistas/preguntas-frecuentes/"
        >
          <v-list-item-avatar size="30">
            <v-img
              height="30"
              width="30"
              src="https://cdn.hablaqui.cl/static/ayuda.png"
              alt="soporte"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold body-2">
              FAQ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-else
          class="my-4 hidden-md-and-up"
          link
          href="https://hablaqui.cl/preguntas-frecuentes/"
        >
          <v-list-item-avatar size="30">
            <v-img
              height="30"
              width="30"
              src="https://cdn.hablaqui.cl/static/ayuda.png"
              alt="soporte"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold body-2">
              FAQ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="my-4 hidden-md-and-up" link @click="logout">
          <v-list-item-avatar size="30">
            <v-img
              height="45"
              width="45"
              :src="`https://cdn.hablaqui.cl/static/cerrar_sesion.png`"
              alt="cerrar sesión"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold body-2">
              Salir
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="$auth.$state.user.role === 'specialist'"
      :value="onBoarding"
      width="350"
      class="elevation-6"
      disable-resize-watcher
      app
      right
    >
      <v-list-item style="height: 120px" class="primary" dark>
        <v-list-item-avatar size="35" @click="() => setOnBoarding()">
          <v-btn icon>
            <icon color="white" size="35" :icon="mdiChevronRight" />
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title text-left">
            Para especialistas
          </v-list-item-title>
          <v-list-item-subtitle class="mt-3 text-left font-weight-bold">
            Asistente de configuración
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-expansion-panels flat>
        <v-expansion-panel v-for="(step, i) in stepOnboarding" :key="i">
          <v-expansion-panel-header v-if="step.visible">
            <div class="text-left">
              <icon
                v-if="step.title === 'Secciones'"
                size="35"
                :icon="mdiMapMarkerStar"
              />
              <icon
                v-else-if="step.title === 'Configuración'"
                size="35"
                :icon="mdiCog"
              />
              <icon
                v-else-if="step.title === 'Añade a tus consultantes'"
                size="35"
                :icon="mdiAccountSupervisor"
              />
              <icon
                v-else-if="step.title === 'Añade eventos o bloquea horas'"
                size="35"
                :icon="mdiCalendar"
              />
              <icon v-else size="35" color="#bfbfbf" :icon="mdiCircle" />
              <span class="ml-2">
                {{ step.title }}
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list dense>
              <v-list-item-group
                v-model="onSelectedStep"
                color="primary"
                @change="
                  () => {
                    if (onSelectedStep) setOnBoarding(false)
                  }
                "
              >
                <v-list-item
                  v-for="(item, key) in step.items"
                  :key="key"
                  :value="item"
                  @click="$router.push({ name: item.route })"
                >
                  <v-list-item-icon>
                    <icon v-if="item.done" size="20" :icon="mdiCheckCircle" />
                    <icon v-else size="20" color="#bfbfbf" :icon="mdiCircle" />
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title class="body-2 font-weight-regular">
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <template v-if="!$auth.user.onboarding" #append>
        <div
          class="pointer my-6 primary--text text-center"
          @click="changeStateOnboarding"
        >
          Completar tareas (saltar)
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      absolute
      height="70"
      flat
      color="white"
      dark
      class="hidden-md-and-up"
    >
      <v-btn v-if="goBack" icon @click="() => $router.go(-1)">
        <icon size="30" color="primary" :icon="mdiChevronLeft" />
      </v-btn>
      <h1 class="primary--text text-h5 font-weight-bold">{{ routeName }}</h1>
      <v-spacer></v-spacer>
      <v-btn
        id="menudrawer-appbar"
        accesskey="m"
        icon
        @click="drawer = !drawer"
      >
        <icon size="30" color="primary" :icon="mdiMenu" />
      </v-btn>
    </v-app-bar>
    <v-main
      :class="$vuetify.breakpoint.mdAndUp ? 'primary' : 'white'"
      :style="{ 'padding-top': $vuetify.breakpoint.mdAndUp ? '' : '50px' }"
    >
      <!-- overlay onboarding -->
      <v-overlay
        v-if="selectedStep"
        :value="!!selectedStep"
        color="white"
        :opacity="0.7"
        z-index="2"
        class="d-flex align-start justify-end"
      >
        <div class="primary--text pa-2">Presione esc para salir</div>
      </v-overlay>
      <v-dialog v-model="overlay" persistent max-width="300">
        <v-card light>
          <div class="text-right">
            <v-btn text @click="welcomeDialog">
              <span class="secondary--text"> x </span>
            </v-btn>
          </div>
          <v-card-text class="text-center body-2 px-6">
            Nos encantaría mostrarle nuestras funcionalidades y atender sus
            dudas
          </v-card-text>
          <v-card-actions class="text-center body-2 px-6">
            <v-spacer></v-spacer>
            <v-btn
              rounded
              color="primary"
              href="https://cal.hablaqui.cl/team/hablaqui/capacitacion"
              target="_blank"
              :loading="loadingOnboarding"
              @click="changeStateOnboarding"
            >
              Agendar capacitación
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div
        :class="
          $vuetify.breakpoint.mdAndUp ? 'border-desktop' : 'border-mobile'
        "
        class="white"
      >
        <snackbar />
        <nuxt />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import {
  mdiMenu,
  mdiAccount,
  mdiAccountOff,
  mdiAlert,
  mdiChevronLeft,
  mdiCheckCircle,
  mdiChevronRight,
  mdiChevronDown,
  mdiCircle,
  mdiMapMarkerStar,
  mdiCog,
  mdiAccountSupervisor,
  mdiCalendar,
  mdiAlertOutline,
} from '@mdi/js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Snackbar from '@/components/Snackbar'

/**
 * Layout dashboard
 */
export default {
  components: {
    Snackbar,
    Icon: () => import('~/components/Icon'),
  },
  data() {
    return {
      overlay: false,
      loadingOnboarding: false,
      loadingStatus: false,
      mdiAccountSupervisor,
      mdiCalendar,
      mdiCog,
      mdiChevronRight,
      mdiMapMarkerStar,
      mdiChevronLeft,
      mdiChevronDown,
      mdiAlert,
      mdiAccount,
      mdiAccountOff,
      mdiMenu,
      mdiCheckCircle,
      mdiCircle,
      mdiAlertOutline,
      drawer: true,
      online: true,
      isMini: true,
      plan: null,
    }
  },
  computed: {
    /**
     * expand drawer
     */
    expand() {
      return true
    },
    /**
     * Establece y retorna el paso(onboarding)
     */
    onSelectedStep: {
      get() {
        return this.selectedStep
      },
      set(value) {
        return this.setStep(value)
      },
    },
    /**
     * regresar
     */
    goBack() {
      return (
        this.$route.name === 'dashboard-perfil-configuracion-personal' ||
        this.$route.name === 'dashboard-perfil-datos-bancarios' ||
        this.$route.name === 'dashboard-perfil-experiencia-formacion' ||
        this.$route.name === 'dashboard-perfil-informacion-general' ||
        this.$route.name === 'dashboard-perfil-horario' ||
        this.$route.name === 'dashboard-perfil-services' ||
        this.$route.name === 'dashboard-consultantes-consultante-seleccionado'
      )
    },
    /**
     * items de rutas a la que podemos ir
     */
    links() {
      const visible =
        (this.$auth.$state.loggedIn && this.$auth.user.role === 'specialist') ||
        (this.$auth.$state.loggedIn && this.$auth.user.role === 'user')
      const disable = false
      const lengthPlan = this.specialist
        ? this.specialist.specPlans.length - 1
        : -1
      return [
        {
          name: 'Chat',
          link: { name: 'dashboard-chat' },
          img: 'https://cdn.hablaqui.cl/static/chat.png',
          visible,
          disable,
        },
        {
          name: 'Sesiones',
          link: { name: 'dashboard-agenda' },
          img: 'https://cdn.hablaqui.cl/static/sesiones.png',
          visible,
          disable,
        },
        {
          name: 'Pagos',
          link: { name: 'dashboard-pagos' },
          img: 'https://cdn.hablaqui.cl/static/pay.png',
          visible:
            this.$auth.$state.loggedIn &&
            this.$auth.$state.user.role === 'specialist',
          disable:
            lengthPlan !== -1 &&
            this.specialist.specPlans[lengthPlan].tier === 'free',
        },
        {
          name: 'Consultantes',
          link: { name: 'dashboard-consultantes' },
          img: 'https://cdn.hablaqui.cl/static/icon-consultante.png',
          visible:
            this.$auth.$state.loggedIn &&
            this.$auth.$state.user.role === 'specialist',
          disable,
        },
        {
          name: 'Cuenta',
          link: { name: 'dashboard-perfil' },
          img: 'https://cdn.hablaqui.cl/static/home.png',
          visible,
          disable,
        },
        {
          name: 'Mi plan premium',
          link: { name: 'dashboard-planes' },
          img: 'https://cdn.hablaqui.cl/static/diamante.png',
          visible:
            this.$vuetify.breakpoint.smAndDown &&
            this.$auth.$state.user.role === 'specialist',
          disable,
        },
        {
          name: 'General',
          link: { name: 'dashboard-panel' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          name: 'Reagendamiento',
          link: { name: 'dashboard-reschedule-session' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          name: 'Reasignación',
          link: { name: 'dashboard-change-spec' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          name: 'Evaluaciones',
          link: { name: 'dashboard-evaluations' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          name: 'Sesiones',
          link: { name: 'dashboard-sessionsTable' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          name: 'Pagos',
          link: { name: 'dashboard-paymentTable' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
        {
          // Redirecciona a la tabla de usuarios del panel de administrador
          name: 'Usuarios',
          link: { name: 'dashboard-usersTable' },
          img: 'https://cdn.hablaqui.cl/static/apps.png',
          visible: this.$auth.$state.user?.role === 'superuser',
          disable,
        },
      ]
    },
    /**
     * dependiendo de donde nos encontremos retorna un titulo
     */
    routeName() {
      if (this.$route.name === 'dashboard-chat') return 'Chats'
      if (this.$route.name === 'dashboard-planes') return 'Planes'
      if (this.$route.name === 'dashboard-agenda') return 'Agenda'
      if (this.$route.name === 'dashboard-diario') return 'Diario'
      if (this.$route.name === 'dashboard-consultantes') return 'Consultantes'
      if (this.$route.name === 'dashboard-pagos') return 'Pagos'
      if (this.$route.name === 'dashboard-perfil') return 'Cuenta'
      if (this.$route.name === 'dashboard-perfil-configuracion-personal')
        return 'Configuración personal'
      if (this.$route.name === 'dashboard-perfil-datos-bancarios')
        return 'Datos bancarios'
      if (this.$route.name === 'dashboard-perfil-experiencia-formacion')
        return 'Experiencia y formación'
      if (this.$route.name === 'dashboard-perfil-informacion-general')
        return 'Informacion general'
      if (this.$route.name === 'dashboard-perfil-horario') return 'Horarios'
      if (this.$route.name === 'dashboard-perfil-services') return 'Servicios'
      if (
        this.$route.name === 'dashboard-consultantes-consultante-seleccionado'
      )
        return 'Consultante'
      return ''
    },
    /**
     * verdadero si tiene avatar
     */
    hasAvatar() {
      return this.specialist && this.specialist.avatar
    },
    /**
     * verdadero si tiene datos bancarios
     */
    hasBankdata() {
      return (
        this.specialist &&
        this.specialist.paymentMethod &&
        this.specialist.paymentMethod.bank &&
        this.specialist.paymentMethod.accountType &&
        this.specialist.paymentMethod.email &&
        this.specialist.paymentMethod.rut &&
        this.specialist.paymentMethod.name
      )
    },
    /**
     * verdadero si tiene horario
     */
    hasSchedule() {
      return (
        this.specialist &&
        this.specialist.schedule &&
        (this.specialist.schedule.monday !== 'busy' ||
          this.specialist.schedule.tuesday !== 'busy' ||
          this.specialist.schedule.wednesday !== 'busy' ||
          this.specialist.schedule.thursday !== 'busy' ||
          this.specialist.schedule.friday !== 'busy' ||
          this.specialist.schedule.saturday !== 'busy' ||
          this.specialist.schedule.sunday !== 'busy')
      )
    },
    /**
     * verdadero si tienes las preferencias de sesion
     */
    hasPreferences() {
      return (
        this.specialist &&
        this.specialist.preferences &&
        this.specialist.preferences.minimumNewSession > 0 &&
        this.specialist.preferences.minimumRescheduleSession > 0
      )
    },
    /**
     * verdadero si tienes los precios de las sesiones
     */
    hasSessionPrice() {
      return (
        this.specialist &&
        this.specialist.sessionPrices &&
        this.specialist.sessionPrices.video > 0
      )
    },
    /**
     * verdadero si tienes cosutantes
     */
    hasConsultantes() {
      return this.consultantes.length
    },
    /**
     * verdadero si tienes eventos es decir sesiones
     */
    hasEvents() {
      return this.$auth.user.sessions.length
    },
    /**
     * pasos del onboarding
     */
    stepOnboarding() {
      return [
        {
          title: 'Configuración',
          route: '/dashboard/perfil',
          items: [
            {
              title: 'Foto de perfil',
              tab: 0,
              card: {
                title: 'Foto de perfil',
                description:
                  'Adjunte su foto, nosotros la retocaremos. Ver manual',
                link: 'https://drive.google.com/file/d/1IPmrPotLIyaRUD2T3NwnzQvF8KHm3pZw/view',
              },
              route: 'dashboard-perfil',
              done: this.hasAvatar,
            },
            {
              title: 'Datos bancarios',
              tab: 0,
              card: {
                title: 'Datos bancarios',
                description:
                  'Ingrese sus datos. Transferimos directamente a su cuenta',
              },
              done: this.hasBankdata,
              route: 'dashboard-perfil',
            },
            {
              title: 'Horarios',
              tab: 1,
              card: {
                title: 'Disponibilidad',
                description: 'Establezca sus horarios de atención al público',
              },
              done: this.hasSchedule,
              route: 'dashboard-perfil',
            },
            {
              title: 'Disponibilidad',
              tab: 1,
              card: {
                title: 'Intervalos',
                description:
                  'Establezca intervalos de disponibilidad para cada día',
              },
              done: this.hasSchedule,
              route: 'dashboard-perfil',
            },
            {
              title: 'Agendamientos',
              tab: 2,
              card: {
                title: 'Agendamientos',
                description:
                  'Establezca la anticipación con que le pueden agendar',
              },
              done: this.hasPreferences,
              route: 'dashboard-perfil',
            },
            {
              title: 'Reprogramación',
              tab: 2,
              card: {
                title: 'Reprogramación',
                description:
                  'Establezca la anticipación con que le pueden reagendar',
              },
              done: this.hasPreferences,
              route: 'dashboard-perfil',
            },
            {
              title: 'Valor por sesión',
              tab: 2,
              card: {
                title: 'Valor por sesión',
                description: 'Configure el valor por sesiones de 50 minutos',
              },
              done: this.hasSessionPrice,
              route: 'dashboard-perfil',
            },
          ],
          visible: true,
          done:
            this.hasSessionPrice &&
            this.hasPreferences &&
            this.hasSchedule &&
            this.hasBankdata &&
            this.hasAvatar,
        },
        {
          title: 'Secciones',
          route: '/dashboard/chat',
          items: [
            {
              title: 'Chat',
              route: 'dashboard-chat',
              card: {
                title: 'Chat',
                description:
                  'Envíe mensajes ilimitados para coordinar y realizar seguimiento',
                link: '',
                route: 'dashboard-chat',
              },
              done: this.$auth.user.onboarding || this.stepLinks[0],
            },
            {
              title: 'Sesiones',
              card: {
                title: 'Sesiones',
                description:
                  'Las sesiones se añadirán automáticamente a su calendario',
                link: '',
                route: 'dashboard-chat',
              },
              route: 'dashboard-agenda',
              done: this.$auth.user.onboarding || this.stepLinks[1],
            },
            {
              title: 'Pagos',
              card: {
                title: 'Pagos',
                description:
                  'Lleve el historial de sus ingresos en piloto automático',
                link: '',
                route: 'dashboard-chat',
              },
              route: 'dashboard-pagos',
              done: this.$auth.user.onboarding || this.stepLinks[2],
            },
            {
              title: 'Consultantes',
              card: {
                title: 'Consultantes',
                description:
                  'Toda la información de sus consultantes en un solo lugar',
                link: '',
                route: 'dashboard-chat',
              },
              route: 'dashboard-consultantes',
              done: this.$auth.user.onboarding || this.stepLinks[3],
            },
          ],
          visible: true,
          done: true,
        },
      ]
    },
    ...mapGetters({
      listenerUserOnline: 'User/listenerUserOnline',
      onBoarding: 'User/onBoarding',
      stepLinks: 'User/stepLinks',
      selectedStep: 'User/step',
      specialist: 'Specialist/specialist',
      plans: 'User/plan',
      consultantes: 'Specialist/clients',
    }),
  },
  watch: {
    /**
     * listener de propiedad specialist
     */
    specialist(newValue) {
      if (
        newValue &&
        this.$auth.user.specialist &&
        this.$auth.user.role === 'specialist'
      ) {
        this.online = newValue.inmediateAttention.activated
      }
    },
  },
  async mounted() {
    // lanzar onboarding al cargar
    // if (!this.$auth.$state.user.onboarding && this.$auth.$state.user.role === 'specialist')
    // 	this.setOnBoarding(true);
    this.plan =
      this.plans && this.plans.sortedPlans.length > 0
        ? this.plans.sortedPlans[0]
        : null
    if (
      !this.$auth.$state.user.onboarding &&
      this.$auth.$state.user.role === 'specialist'
    )
      this.overlay = true

    // si el usuario es role user
    if (this.$auth.$state.user.role === 'user') {
      if (this.$auth.$state.user.sessions.length) {
        if (this.plan.specialist) {
          const { specialist } = await this.$axios.$get(
            `/specialists/one/${this.plan.specialist}`
          )
          this.setSpecialist(specialist)
        }
      } else {
        this.setSpecialist(null)
      }
    }
    if (this.$auth.$state.user.role === 'specialist') {
      let specialist
      if (this.$auth.$state.user.specialist) {
        await this.getClients(this.$auth.$state.user.specialist)
        const res = await this.$axios.$get(
          `/specialists/one/${this.$auth.$state.user.specialist}`
        )
        specialist = res.specialist
      } else {
        const res = await this.$axios.$get(
          `/recruitment/${this.$auth.user.email}`
        )
        specialist = res.recruited
      }
      if (!specialist.formation.length) {
        specialist.formation.push({
          formationType: '',
          description: '',
          start: '',
          end: '',
        })
      }
      if (!specialist.experience.length) {
        specialist.experience.push({ title: '', place: '', start: '', end: '' })
      }
      this.setSpecialist(specialist)
    }
    // listener de el envento keyup para evaluar la tecla escape y cerrar onboarding
    document.body.addEventListener('keyup', (evt) => {
      evt = evt || window.event
      let isEscape = false
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc'
      } else {
        isEscape = evt.keyCode === 27
      }
      if (isEscape && this.selectedStep) {
        this.setStep(null)
      }
    })
  },
  methods: {
    /**
     * cerrar sesion y redigire a auth
     */
    async logout() {
      await this.$auth.logout()
      this.$router.push('/auth')
    },
    /**
     * muestra mensaje de bienvenida
     */
    welcomeDialog() {
      this.overlay = false
      this.setOnBoarding(true)
      // this.changeStateOnboarding();
    },
    /**
     * establece nueva estado del onboarding
     */
    async changeStateOnboarding() {
      this.loadingOnboarding = true
      await this.updateOne({
        _id: this.$auth.$state.user._id,
        onboarding: true,
      })
      this.loadingOnboarding = false
      this.overlay = false
      this.$auth.fetchUser()
    },
    ...mapMutations({
      setListenerUserOnline: 'User/setListenerUserOnline',
      setOnBoarding: 'User/setOnBoarding',
      setStep: 'User/setStep',
      setSpecialist: 'Specialist/setSpecialist',
    }),
    ...mapActions({
      getClients: 'Specialist/getClients',
      updateOne: 'User/updateOne',
      toggleStatus: 'Specialist/toggleStatus',
    }),
  },
}
</script>

<style scoped>
.border-desktop {
  border-radius: 50px 0 0 0;
}
.border-mobile {
  border-radius: 50px 50px 0 0;
}
</style>
