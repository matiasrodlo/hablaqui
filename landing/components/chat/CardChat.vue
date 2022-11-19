<template>
	<v-card :style="$vuetify.breakpoint.smAndDown ? 'width: 100%' : 'width: 400px'">
		<div
			v-if="selected"
			class="d-flex"
			style="flex-direction: column"
			:style="$vuetify.breakpoint.smAndDown ? 'height: 100vh' : 'height: 580px'"
		>
			<v-card-text style="flex: 0" class="px-1 py-1">
				<!-- cabecera -->
				<v-list-item class="pl-0">
					<v-btn icon @click="setSelected(null)">
						<icon :icon="mdiChevronLeft" />
					</v-btn>
					<v-list-item-avatar size="50">
						<nuxt-link
							:to="{ name: 'dashboard-perfil' }"
							style="text-decoration: none; height: 40px; height: 40px"
						>
							<avatar :url="selected.avatar" size="40" :name="selected.name" />
						</nuxt-link>
					</v-list-item-avatar>
					<v-list-item-title class="subtitle-1 font-weight-bold d-flex ml-2">
						<nuxt-link :to="`/${selected.username}`" style="text-decoration: none">
							<span class="secondary--text">
								{{ selected.name }} {{ selected.lastName }}
							</span>
						</nuxt-link>
					</v-list-item-title>
					<v-list-item-action>
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
					</v-list-item-action>
				</v-list-item>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text
				v-if="loadingChat"
				style="flex: 1; overflow-y: auto"
				class="d-flex justify-center align-center"
			>
				<v-progress-circular indeterminate color="primary" />
			</v-card-text>
			<v-card-text
				v-else
				ref="scrollToMe"
				style="flex: 1; overflow-y: auto; overflow-x: none"
			>
				<!-- Burbujas de chat -->
				<template v-if="chat && chat.messages && chat.messages.length">
					<div v-for="item in chat.messages" :key="item._id">
						<div
							class="d-flex mt-3"
							:class="sentBy(item.sentBy) ? 'justify-end' : 'justify-start'"
						>
							<div style="width: 70%">
								<div style="display: flex; justify-content: space-between">
									<span v-if="sentBy(item.sentBy)" class="text--disabled body-2">
										{{ $auth.$state.user.name }}
									</span>
									<span v-else class="text--disabled body-2">
										{{ selected.name }}
										{{ selected.lastName }}
									</span>
									<span class="text--disabled body-2">
										{{ setDate(item.createdAt) }}
									</span>
								</div>
								<div
									style="width: 100%"
									class="talkbubble"
									:class="
										sentBy(item.sentBy) ? 'talkbubble__one' : 'talkbubble__two'
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
			</v-card-text>
			<v-card-text style="flex: 0" class="pb-0">
				<v-form @submit.prevent="onSubmit">
					<v-textarea
						ref="msj"
						v-model.trim="message"
						outlined
						dense
						:label="`Mensaje a ${selected.name}`"
						:disabled="loadingMessage"
						:loader-height="3"
						:loading="loadingMessage"
						hint="Shift + enter para enviar"
						no-resize
						:auto-grow="grow"
						:rows="row"
						single-line
						@keydown="e => setGrow(e)"
						@keypress.shift.enter="onSubmit"
						@input="
							() => {
								scrollToElement();
							}
						"
					>
						<template #append>
							<v-btn
								:disabled="!message"
								class="pb-2 pl-2 pr-2"
								depressed
								icon
								type="submit"
							>
								<v-img
									height="25"
									contain
									:src="`https://cdn.hablaqui.cl/static/message.png`"
								></v-img>
							</v-btn>
						</template>
					</v-textarea>
				</v-form>
			</v-card-text>
		</div>
		<div
			v-else
			class="d-flex"
			style="flex-direction: column"
			:style="$vuetify.breakpoint.smAndDown ? 'height: 100vh' : 'height: 580px'"
		>
			<v-card-title style="flex: 0" class="primary--text d-flex justify-space-between">
				Chat
				<v-btn icon @click="close">
					<icon v-if="$vuetify.breakpoint.smAndDown" :icon="mdiCloseCircle" />
				</v-btn>
			</v-card-title>
			<v-card-text style="flex: 0">
				<v-text-field
					:value="search"
					style="border-radius: 25px"
					hide-details
					filled
					full-width
					dense
					outlined
					single-line
					:append-icon="mdiMagnify"
					label="Buscar"
					@input="e => setSearch(e)"
				/>
			</v-card-text>
			<!-- todos los especialistas -->
			<template
				v-if="
					specFromChats.length || ($auth.$state.user.role === 'user' && plan && !search)
				"
			>
				<v-card-text style="flex: 0" class="py-0">
					<v-subheader class="primary--text body-1 px-0">Especialistas</v-subheader>
					<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
				</v-card-text>
				<v-list style="flex: 1; overflow: auto" two-line>
					<!-- mi especialista -->
					<template v-if="$auth.$state.user.role === 'user' && plan && !search">
						<v-list-item @click="selectedSpec(getMySpec)">
							<v-list-item-avatar
								style="border-radius: 50%"
								:style="getMySpec.hasMessage ? 'border: 3px solid #2070E5' : ''"
								size="50"
							>
								<avatar :url="getMySpec.avatar" :name="getMySpec.name" size="50" />
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title>
									{{ getMySpec.name }} {{ getMySpec.lastName }}
								</v-list-item-title>
								<v-list-item-subtitle class="primary--text">
									Mi especialista
								</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-badge
									color="primary"
									:content="getMySpec.countMessagesUnRead"
									:value="getMySpec.countMessagesUnRead"
								>
								</v-badge>
							</v-list-item-action>
						</v-list-item>
					</template>
					<!-- resto de especialista -->
					<v-list-item
						v-for="(spec, e) in specFromChats"
						:key="e"
						@click="selectedSpec(spec)"
					>
						<v-list-item-avatar
							style="border-radius: 50%"
							:style="spec.hasMessage ? 'border: 3px solid #2070E5' : ''"
							size="50"
						>
							<avatar :url="spec.avatar" :name="spec.name" size="50" />
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title>
								{{ spec.name }} {{ spec.lastName }}
							</v-list-item-title>
							<v-list-item-subtitle v-show="false">
								Especialista · Activo(a)
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-badge
								color="primary"
								:content="spec.countMessagesUnRead"
								:value="spec.countMessagesUnRead"
							>
							</v-badge>
						</v-list-item-action>
					</v-list-item>
				</v-list>
			</template>
			<template v-else>
				<div class="d-flex justify-center align-center" style="flex: 1">
					<div class="text-center pa-4" style="max-width: 300px">
						<div class="mt-5 body-2">Bienestar en cualquier momento</div>
						<v-btn class="mt-5 px-8" color="primary" rounded to="/evaluacion/">
							Comenzar
						</v-btn>
					</div>
				</div>
			</template>
		</div>
	</v-card>
</template>

<script>
import { mdiChevronLeft, mdiMagnify, mdiCloseCircle } from '@mdi/js';
import dayjs from 'dayjs';
import { mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import calendar from 'dayjs/plugin/calendar';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	components: {
		avatar: () => import('~/components/Avatar.vue'),
		Icon: () => import('~/components/Icon.vue'),
	},
	props: {
		search: {
			type: String,
			default: '',
		},
		setSearch: {
			type: Function,
			required: true,
		},
		setSelected: {
			type: Function,
			required: true,
		},
		selectedSpec: {
			type: Function,
			required: true,
		},
		loadingChat: {
			type: Boolean,
			default: false,
		},
		selected: {
			type: Object,
			default: null,
		},
		chat: {
			type: Object,
			default: null,
		},
		plan: {
			type: Object,
			default: null,
		},
		getMySpec: {
			type: Object,
			default: null,
		},
		specFromChats: {
			type: Array,
			default: () => [],
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
			mdiChevronLeft,
			mdiMagnify,
			mdiCloseCircle,
			message: '',
			loadingMessage: false,
			grow: true,
			row: 1,
		};
	},
	created() {
		dayjs.tz().locale('es');
	},
	methods: {
		/**
		 * formatea la fecha
		 * @param {string} time fecha
		 * @returns string con la fecha
		 */
		setDate(time) {
			if (time) return dayjs.tz(dayjs(time)).calendar();
			return dayjs.tz().format('llll');
		},
		/**
		 * formatea la fecha
		 * @param {string} sentBy id
		 * @returns Boolean
		 */
		sentBy(sentBy) {
			return sentBy === this.$auth.$state.user._id;
		},
		/**
		 * Scroll to element
		 */
		scrollToElement() {
			const el = this.$refs.scrollToMe;
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		},
		/**
		 * Enviar mensaje del chat
		 */
		async onSubmit() {
			// si presiona para enviar mensaje y esta vacio no lo envia
			if (isEmpty(this.message)) return;
			// loader
			this.loadingMessage = true;
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
			};
			// emitimos el evento
			await this.socket.emit('sendMessage', payload, response => {
				this.setChat(response);
			});
			// vaciamos el input
			this.message = '';
			// focus al input
			this.$nextTick(() => {
				this.$refs.msj.focus();
				this.row = 1;
			});
			// scroll a la ventana hasta el final
			this.scrollToElement();
			// loader
			this.loadingMessage = false;
		},
		/**
		 * grow element
		 */
		setGrow(e) {
			const height = parseInt(e.target.style.height.replace('px', ''));
			this.grow = height < 140;
		},
		/**
		 * mutaciones utilizadas
		 */
		...mapMutations({
			setChat: 'Chat/setChat',
		}),
	},
};
</script>

<style lang="scss" scoped>
$color__one: rgba(189, 189, 189, 1);
$color__two: rgba(32, 112, 229, 1);
$font__color_one: #424242;
$font__color_two: #ffffff;

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
.v-text-field--filled:not {
	margin-top: 0 !important;
}
</style>
