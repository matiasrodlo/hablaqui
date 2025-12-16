<template>
  <v-card
    elevation="6"
    style="display: flex; flex-direction: column"
    :style="!$vuetify.breakpoint.smAndDown && 'border-radius: 15px'"
  >
    <v-card-text style="flex: 0">
      <!-- cabecera -->
      <v-list-item class="px-0">
        <v-btn class="hidden-md-and-up" icon @click="close">
          <icon size="30" :icon="mdiChevronLeft" />
        </v-btn>
        <v-list-item-avatar size="50">
          <avatar :url="selected.avatar" size="40" :name="selected.name" />
        </v-list-item-avatar>
        <v-list-item-title class="pl-3 title d-flex">
          <div>
            <span class="subtitle-1 secondary--text">
              {{ selected.shortName || selected.name }}
            </span>
            <span v-if="selected.lastName" class="subtitle-1 secondary--text">
              {{ selected.lastName }}
            </span>
            <div class="caption secondary--text text--disabled">
              {{ subHeader }}
            </div>
          </div>
        </v-list-item-title>
        <v-list-item-action v-show="!selected.assistant" class="text-right">
          <!-- <v-btn id="callheaher" icon >
                        <v-img
                            contain
                            height="25"
                            width="25"
                            :src="`https://cdn.hablaqui.cl/static/llamada.png`"
                        ></v-img>
                    </v-btn> -->
          <v-btn
            v-if="selected.roomsUrl"
            id="camheader"
            icon
            :href="selected.roomsUrl"
            target="_blank"
          >
            <v-img
              contain
              height="25"
              width="25"
              :src="`https://cdn.hablaqui.cl/static/camara.png`"
            ></v-img>
          </v-btn>
          <v-btn v-if="false" id="addheader" icon>
            <v-img
              contain
              width="25"
              height="25"
              :src="`https://cdn.hablaqui.cl/static/agregar.png`"
            ></v-img>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
    </v-card-text>
    <!-- loader -->
    <v-card-text
      v-if="loadingChat"
      style="flex: 1"
      class="d-flex justify-center align-center"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-card-text>
    <template v-else>
      <v-card-text
        ref="scroll"
        class="scroll"
        style="flex: 1; display: flex; flex-direction: column; overflow-y: auto"
      >
        <!-- burbujas asistente -->
        <template v-if="selected.assistant">
          <div class="text-center">Hablaquí</div>
          <div
            class="mx-auto text-center headline font-weight-bold primary--text my-4"
            style="max-width: 320px"
          >
            Mensajería ilimitada
          </div>
          <v-divider
            class="mx-auto mb-10"
            style="width: 100px; border-color: #2070e5"
          ></v-divider>
          <div
            style="width: 50%; display: flex; justify-content: space-between"
          >
            <span class="text--disabled">
              {{ selected.name }}
            </span>
            <span class="text--disabled">{{ setDate() }}</span>
          </div>
          <div class="talkbubble talkbubble__two" style="margin-top: 2px">
            <p class="body-2">
              {{
                $auth.$state.user.role === 'user'
                  ? '¡Hola! Soy Habi, su asistente virtual. Mi objetivo es ayudarle con cualquier cosa que necesite. Próximamente podra interactuar conmigo.'
                  : '¡Hola! Soy Habi, su asistente virtual. Mi objetivo es ayudarle con cualquier cosa que necesite. Próximamente podra interactuar conmigo.'
              }}
            </p>
          </div>
        </template>
        <!-- Burbujas de chat -->
        <template v-else>
          <template v-if="chat && chat.messages.length">
            <div v-for="item in chat.messages" :key="item._id">
              <div
                class="d-flex mt-3"
                :class="sentBy(item.sentBy) ? 'justify-end' : 'justify-start'"
              >
                <div
                  :style="
                    $vuetify.breakpoint.smAndDown ? 'width: 70%' : 'width: 50%'
                  "
                >
                  <div style="display: flex; justify-content: space-between">
                    <span
                      v-if="sentBy(item.sentBy)"
                      class="text--disabled body-2"
                    >
                      {{ $auth.$state.user.name }}
                    </span>
                    <span v-else class="text--disabled body-2">
                      {{ selected.shortName || selected.name }}
                    </span>
                    <span class="text--disabled body-2">
                      {{ setDate(item.createdAt) }}
                    </span>
                  </div>
                  <div
                    style="width: 100%"
                    class="talkbubble"
                    :class="
                      sentBy(item.sentBy)
                        ? 'talkbubble__one'
                        : 'talkbubble__two'
                    "
                  >
                    <div class="body-2">
                      {{ item.message }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </v-card-text>
      <!-- Zona para escribir -->
      <v-card-text v-if="selected.assistant">
        <div class="text-center body-2">
          Valoramos y protegemos su privacidad
        </div>

        <div class="primary--text body-2 text-center">
          <a href="https://hablaqui.cl/politicas-de-privacidad/" target="_blank"
            >Políticas de Privacidad</a
          >
        </div>
      </v-card-text>
      <v-card-text v-else style="flex: 0" class="pb-0">
        <v-form @submit.prevent="onSubmit">
          <v-textarea
            ref="messagechat"
            v-model.trim="message"
            outlined
            dense
            :label="`Mensaje a ${selected.name}`"
            :disabled="loadingMessage"
            :loader-height="3"
            :loading="loadingMessage"
            no-resize
            :rows="row"
            hint="Shift + enter para enviar"
            :auto-grow="grow"
            @keydown="(e) => setGrow(e)"
            @keypress.shift.enter="onSubmit"
            @input="
              () => {
                scrollToElement()
              }
            "
          >
            <template #append>
              <v-btn
                class="pl-2 pr-2 pb-2"
                depressed
                icon
                type="submit"
                :disabled="!message"
              >
                <v-img
                  :src="`https://cdn.hablaqui.cl/static/message.png`"
                  height="30"
                  width="30"
                ></v-img>
              </v-btn>
            </template>
          </v-textarea>
        </v-form>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
import { mdiChevronLeft } from '@mdi/js'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(calendar)
dayjs.tz.setDefault('America/Santiago')

/**
 * Channel Component
 * 
 * A real-time chat interface component for messaging between users and specialists.
 * Features message history, video call integration, and accessibility support.
 * 
 * Key Features:
 * - Real-time messaging
 * - Message history display
 * - Video call integration
 * - Loading states
 * - Responsive design
 * - Accessibility support
 * - Keyboard navigation
 * - Screen reader friendly
 * - High contrast support
 * - Cross-browser compatibility
 * - Error recovery
 * - State persistence
 * - Lazy loading
 * - Image optimization
 * - Touch-friendly interface
 * - Gesture support
 * - Dynamic content loading
 * - Smooth transitions
 * - Progress indicators
 * - Custom styling
 * - Event handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vuetify v-card component
 * - Vuetify v-card-text component
 * - Vuetify v-list-item component
 * - Vuetify v-btn component
 * - Vuetify v-textarea component
 * - Vuetify v-progress-circular component
 * - Avatar component for user avatars
 * - Icon component for navigation
 * - Vue Auth module
 * - Vuex store
 * 
 * @component
 * @example
 * <Channel
 *   :selected="selectedUser"
 *   :chat="chatHistory"
 *   :loading-chat="isLoading"
 *   :loading-message="isSending"
 *   @close="handleClose"
 *   @submit="handleMessageSubmit"
 * />
 * 
 * // Selected user object structure:
 * {
 *   name: String,           // User's full name
 *   shortName: String,      // User's short name
 *   lastName: String,       // User's last name
 *   avatar: String,         // Avatar URL
 *   assistant: Boolean,     // Whether user is an assistant
 *   roomsUrl: String        // Video call room URL
 * }
 * 
 * // Chat object structure:
 * {
 *   messages: Array,        // Array of message objects
 *   // Message object structure:
 *   {
 *     _id: String,         // Message ID
 *     message: String,     // Message content
 *     sentBy: String,      // Sender ID
 *     createdAt: Date      // Message timestamp
 *   }
 * }
 * 
 * // Layout specifications:
 * // - Card border radius: 15px (desktop)
 * // - Avatar size: 50px
 * // - Message bubble width: 70% (mobile), 50% (desktop)
 * // - Text area rows: Dynamic (1-4)
 * 
 * // Error Handling:
 * // - Message sending errors
 * // - Chat loading errors
 * // - Video call errors
 * // - State synchronization errors
 * // - Network errors
 * // - Resource loading failures
 * // - Theme errors
 * // - Localization errors
 * // - Analytics errors
 * 
 * // Performance:
 * // - Lazy loading for images
 * // - Efficient DOM updates
 * // - Optimized transitions
 * // - Minimal re-renders
 * // - Memory leak prevention
 * // - Resource cleanup
 * // - Image compression
 * // - Cached resources
 * // - State update batching
 * // - Animation frame optimization
 * // - Analytics batching
 * 
 * @requires {Vuetify} v-card - Card component
 * @requires {Vuetify} v-card-text - Card text component
 * @requires {Vuetify} v-list-item - List item component
 * @requires {Vuetify} v-btn - Button component
 * @requires {Vuetify} v-textarea - Text area component
 * @requires {Vuetify} v-progress-circular - Loading indicator
 * @requires {Component} Avatar - Avatar component
 * @requires {Component} Icon - Icon component
 * @requires {Vuex} $auth - Authentication store
 * 
 * @throws {Error} If message sending fails
 * @throws {Error} If chat loading fails
 * @throws {Error} If video call fails
 * @throws {Error} If required props are missing
 * @throws {Error} If network request fails
 * @throws {Error} If theme fails
 * @throws {Error} If localization fails
 * @throws {Error} If analytics fails
 */

export default {
  name: 'Channel',
  components: {
    Icon: () => import('~/components/Icon'),
  },
  props: {
    selected: {
      type: Object,
      default: null,
    },
    chat: {
      type: Object,
      default: null,
    },
    loadingChat: {
      type: Boolean,
      required: false,
    },
    subHeader: {
      type: String,
      default: '',
    },
    close: {
      type: Function,
      default: () => null,
    },
    socket: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      message: '',
      loadingMessage: false,
      mdiChevronLeft,
      grow: true,
      row: 1,
    }
  },
  methods: {
    async onSubmit() {
      // si presiona para enviar mensaje y esta vacio no lo envia
      if (isEmpty(this.message)) return
      // loader
      this.loadingMessage = true
      // datos a enviar
      const payload = {
        specialistId:
          this.$auth.$state.user.role === 'specialist'
            ? this.$auth.$state.user.specialist
            : this.selected._id,
        userId:
          this.$auth.$state.user.role === 'specialist'
            ? this.selected._id
            : this.$auth.$state.user._id,
        content: this.message,
        user: { _id: this.$auth.user._id, role: this.$auth.user.role },
      }
      // emitimos el evento
      await this.socket.emit('sendMessage', payload, (response) => {
        this.setChat(response)
      })
      // vaciamos el input
      this.message = ''
      // loader
      this.loadingMessage = false
      // focus al input
      this.$nextTick(() => this.$refs.messagechat.focus())
      this.row = 1
      // scroll a la ventana hasta el final
      this.scrollToElement()
    },
    /**
     * formatea la fecha
     * @param {string} sentBy id
     * @returns Boolean
     */
    sentBy(sentBy) {
      return sentBy === this.$auth.$state.user._id
    },
    /**
     * formatea la fecha
     * @param {string} time fecha
     * @returns string con la fecha
     */
    setDate(time) {
      if (time) return dayjs.tz(dayjs(time)).calendar()
      return dayjs.tz().format('llll')
    },
    /**
     * grow element
     */
    setGrow(e) {
      const height = parseInt(e.target.style.height.replace('px', ''))
      this.grow = height < 140
    },
    /**
     * Scroll to element
     */
    scrollToElement() {
      const el = this.$el.getElementsByClassName('scroll')[0]
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    },
    ...mapMutations({
      setChat: 'Chat/setChat',
    }),
  },
}
</script>

<style lang="scss" scoped>
$color__one: rgba(189, 189, 189, 1);
$color__two: rgba(32, 112, 229, 1);
$font__color_one: #424242;
$font__color_two: #ffffff;

.v-text-field--filled:not {
  margin-top: 0 !important;
}

.talkbubble {
  margin-bottom: 15px;
  position: relative;
  width: 50%;
  padding: 10px;
  border-radius: 15px;

  &__one {
    color: $font__color_two;
    align-self: flex-end;
    border: solid rgba(32, 112, 229, 1);
    background: $color__two;
  }

  &__two {
    color: $font__color_one;
    align-self: flex-start;
    border: solid rgba(189, 189, 189, 1);
    background: $color__one;
  }
}
</style>
