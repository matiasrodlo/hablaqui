<template>
	<div>
		<v-menu
			v-model="menu"
			:close-on-content-click="false"
			transition="slide-x-transition"
			rounded="xl"
			offset-y
			offset-x
			offset-overflow
			@input="resetChat"
		>
			<template #activator="{ on, attrs }">
				<v-badge
					color="red"
					bordered
					offset-x="15"
					offset-y="15"
					dot
					:value="
						getMyPsy.countMessagesUnRead > 0 ||
						(psyFromChats && psyFromChats.some(item => item.countMessagesUnRead > 0))
					"
					class="open-button pointer"
				>
					<v-img
						v-bind="attrs"
						accesskey="b"
						width="65"
						height="65"
						:src="`https://cdn.hablaqui.cl/static/icono_chat.png`"
						contain
						v-on="on"
					>
					</v-img>
				</v-badge>
			</template>
			<v-card width="400">
				<template v-if="selected">
					<v-card-text>
						<!-- cabecera -->
						<v-list-item class="px-0">
							<v-btn icon @click="selected = null">
								<icon :icon="mdiChevronLeft" />
							</v-btn>
							<v-list-item-avatar size="50">
								<nuxt-link
									:to="{ name: 'dashboard-perfil' }"
									style="text-decoration: none; height: 40px; height: 40px"
								>
									<avatar
										:url="selected.avatar"
										size="40"
										:name="selected.name"
									/>
								</nuxt-link>
							</v-list-item-avatar>
							<v-list-item-title class="subtitle-1 font-weight-bold d-flex ml-2">
								<nuxt-link
									:to="`/${selected.username}`"
									style="text-decoration: none"
								>
									<span class="secondary--text">
										{{ selected.shortName || selected.name }}
									</span>
									<span v-if="selected.lastName" class="secondary--text">
										{{ selected.lastName }}
									</span>
								</nuxt-link>
							</v-list-item-title>
							<!-- <v-list-item-action>
								<v-btn icon>
									<v-img
										contain
										height="25"
										:src="`https://cdn.hablaqui.cl/static/llamada.png`"
									></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-4">
									<v-img
										contain
										height="25"
										:src="`https://cdn.hablaqui.cl/static/camara.png`"
									></v-img>
								</v-btn>
							</v-list-item-action> -->
							<v-list-item-action>
								<v-btn icon class="ml-1">
									<v-img
										contain
										height="25"
										:src="`https://cdn.hablaqui.cl/static/agregar.png`"
									></v-img>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text
						v-if="loadingChat"
						style="height: 400px; overflow-y: auto"
						class="d-flex justify-center align-center"
					>
						<v-progress-circular indeterminate color="primary" />
					</v-card-text>
					<v-card-text v-else ref="scrollToMe" style="height: 400px; overflow-y: auto">
						<!-- Burbujas de chat -->
						<template v-if="chat && chat.messages && chat.messages.length">
							<div v-for="item in chat.messages" :key="item._id">
								<div
									class="d-flex mt-3"
									:class="sentBy(item.sentBy) ? 'justify-end' : 'justify-start'"
								>
									<div style="width: 50%">
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
											<div
												style="max-height: 75px; overflow-y: auto"
												class="body-2"
											>
												{{ item.message }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</template>
					</v-card-text>
					<v-card-text>
						<v-form @submit.prevent="onSubmit">
							<v-text-field
								ref="msj"
								v-model="message"
								outlined
								dense
								:label="`Mensaje a ${selected.name}`"
								hide-details
								:disabled="loadingMessage"
								:loader-height="3"
								:loading="loadingMessage"
							>
								<!-- <template #prepend-inner>
									<v-img
										:src="`https://cdn.hablaqui.cl/static/adjuntar.png`"
										height="25"
										width="25"
									></v-img>
								</template> -->
								<template #append>
									<!-- <v-btn depressed icon>
										<v-img
											:src="`https://cdn.hablaqui.cl/static/voz.png`"
											height="30"
											width="30"
										></v-img>
									</v-btn> -->
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
							</v-text-field>
						</v-form>
					</v-card-text>
				</template>
				<template v-else>
					<v-card-title class="primary--text"> Chat </v-card-title>
					<v-card-text>
						<v-text-field
							v-model="search"
							style="border-radius: 25px"
							hide-details
							filled
							full-width
							dense
							outlined
							single-line
							:append-icon="mdiMagnify"
							label="Buscar"
						/>
					</v-card-text>
					<!-- todos los psicologos -->
					<template v-if="psyFromChats.length">
						<v-card-text class="py-0">
							<v-subheader class="primary--text body-1 px-0">Psicólogos</v-subheader>
							<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
						</v-card-text>
						<v-list two-line style="height: 400px; overflow: auto">
							<!-- mi psicologo -->
							<template v-if="$auth.$state.user.role === 'user' && plan">
								<v-list-item @click="selectedPsy(getMyPsy)">
									<v-list-item-avatar
										style="border-radius: 50%"
										:style="
											getMyPsy.hasMessage ? 'border: 3px solid #2070E5' : ''
										"
										size="50"
									>
										<avatar
											:url="getMyPsy.avatar"
											:name="getMyPsy.name"
											size="50"
										/>
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title
											v-html="getMyPsy.name"
										></v-list-item-title>
										<v-list-item-subtitle class="primary--text">
											Mi Psicólogo
										</v-list-item-subtitle>
									</v-list-item-content>
									<v-list-item-action>
										<v-badge
											color="primary"
											:content="getMyPsy.countMessagesUnRead"
											:value="getMyPsy.countMessagesUnRead"
										>
										</v-badge>
									</v-list-item-action>
								</v-list-item>
							</template>
							<!-- resto de psicologo -->
							<v-list-item
								v-for="(psy, e) in psyFromChats"
								:key="e"
								@click="selectedPsy(psy)"
							>
								<v-list-item-avatar
									style="border-radius: 50%"
									:style="psy.hasMessage ? 'border: 3px solid #2070E5' : ''"
									size="50"
								>
									<avatar :url="psy.avatar" :name="psy.name" size="50" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title v-html="psy.name"></v-list-item-title>
									<v-list-item-subtitle>
										Psicólogo · Activo(a)
									</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action>
									<v-badge
										color="primary"
										:content="psy.countMessagesUnRead"
										:value="psy.countMessagesUnRead"
									>
									</v-badge>
								</v-list-item-action>
							</v-list-item>
						</v-list>
					</template>
					<template v-else>
						<div class="d-flex justify-center align-center" style="height: 400px">
							<div class="text-center pa-4" style="max-width: 300px">
								<span class="body-1 primary--text font-weight-bold">
									Comienza a hablar con nuestros psicólogos
								</span>
								<div class="mt-5 body-2">
									Orientación psicológica en cualquier momento y lugar. Comienza a
									mejorar tu vida hoy.
								</div>
								<v-btn class="mt-5 px-8 py-6" color="primary" rounded>
									Buscar ahora
								</v-btn>
							</div>
						</div>
					</template>
				</template>
			</v-card>
		</v-menu>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import Pusher from 'pusher-js';
import { mdiChevronLeft, mdiMagnify } from '@mdi/js';

export default {
	components: {
		avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiChevronLeft,
			mdiMagnify,
			search: '',
			selected: null,
			loadingMessage: false,
			message: '',
			loadingChat: false,
			pusher: null,
			channel: null,
		};
	},
	computed: {
		psychologists() {
			return this.allPsychologists.map(item => ({
				...item,
				hasMessage: this.hasMessage(item),
				countMessagesUnRead: this.setCountMessagesUnread(
					this.chats.find(chat => chat.psychologist._id === item._id)
				),
			}));
		},
		psyFromChats() {
			let filterArray = this.chats;

			filterArray = this.chats.filter(el =>
				el.psychologist.name.toLowerCase().includes(this.search.toLowerCase())
			);

			if (this.getMyPsy) {
				filterArray = filterArray.filter(item => {
					return this.getMyPsy._id !== item.psychologist._id;
				});
			}
			return filterArray
				.map(item => ({
					...item.psychologist,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessage: this.hasMessage(item.psychologist),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		menu: {
			get() {
				return this.floatingChat;
			},
			set(value) {
				this.setFloatingChat(value);
			},
		},
		getMyPsy() {
			if (this.$auth.$state.user && this.$auth.$state.user.role === 'user' && this.plan) {
				const psy = this.plan.psychologist;
				if (psy)
					return {
						...this.getPsy(psy),
						roomsUrl: this.plan.roomsUrl,
					};
				else return null;
			}
			return null;
		},
		// retorna el plan act o el ultimo expirado
		plan() {
			if (!this.$auth.$state.user || this.$auth.$state.user.role !== 'user') return null;
			// Obtenemos un array con todo los planes solamente
			const plans = this.$auth.$state.user.sessions.flatMap(item =>
				item.plan.map(plan => ({
					...plan,
					idSessions: item._id,
					roomsUrl: item.roomsUrl,
					psychologist: item.psychologist,
					user: item.user,
					// dias de diferencia entre el dia que expiró y hoy
					diff: moment(plan.expiration).diff(moment(), 'days'),
				}))
			);
			const max = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));

			// retornamos el plan success y sin expirar
			let plan = plans.find(
				item => item.payment === 'success' && moment().isBefore(moment(item.expiration))
			);
			// retornamos el ultimo plan succes y que expiro
			if (!plan) plan = plans.find(item => item.diff === max);
			return plan;
		},
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			floatingChat: 'Chat/floatingChat',
			allPsychologists: 'Psychologist/psychologists',
			resumeView: 'Psychologist/resumeView',
		}),
	},
	watch: {
		async floatingChat(newValue) {
			if (newValue && this.$route.query.chat) {
				this.setResumeView(false);
				if (this.$route.params.slug) {
					const psychologist = this.psychologists.find(
						item => item.username === this.$route.params.slug
					);
					console.log('selecyed psy');
					await this.selectedPsy(psychologist);
					await this.getMessages();
				}
			}
		},
	},
	created() {
		moment.locale('es');
		// PUSHER
		this.pusher = new Pusher(this.$config.PUSHER_KEY, {
			cluster: this.$config.PUSHER_CLUSTER,
		});
		this.pusher.connection.bind('update', function (err) {
			console.error(err);
		});
		this.channel = this.pusher.subscribe('chat');
		this.channel.bind('update', data => this.$emit('updateChat', data));
		this.$on('updateChat', data => {
			if (
				data.content.sentBy !== this.$auth.$state.user._id &&
				this.$auth.$state.user._id === data.userId
			) {
				this.pusherCallback(data);
			}
		});
	},
	async mounted() {
		if (this.resumeView) {
			if (this.$route.params.id) {
				const psychologist = this.psychologists.find(
					item => item._id === this.$route.params.id
				);
				await this.selectedPsy(psychologist);
			}
		}
		await this.getMessages();
	},
	methods: {
		async pusherCallback(data) {
			if (
				(this.selected && this.selected._id === data.psychologistId) ||
				(this.selected && this.selected._id === data.userId)
			) {
				await this.getChat({ psy: data.psychologistId, user: data.userId });
				this.scrollToElement();
				await this.updateMessage(data._id);
			}
			await this.getMessages();
		},
		resetChat() {
			setTimeout(() => {
				if (this.selected) this.selected = null;
			}, 200);
		},
		setDate(time) {
			if (time) return moment(time).calendar();
			return moment().format('llll');
		},
		sentBy(sentBy) {
			return sentBy === this.$auth.$state.user._id;
		},
		async selectedPsy(psy) {
			if (this.selected && this.selected._id === psy._id) return;
			// iniciamos carga del seleccionado
			this.loadingChat = true;
			this.selected = psy;
			// obtener chat del selecciona
			await this.getChat({ psy: psy._id, user: this.$auth.$state.user._id });
			// finalizamos carga del seleccionado
			this.loadingChat = false;
			// scroll hasta el final para ver los ultimo mensajes
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
			// si no el usuario no tiene una conversation enviamos una intention de chat para notificar el pys
			if (!this.chat) await this.startConversation(psy._id);
			// Si ya tiene un chat con el psy, marcamos mensaje como Leído y actualizamos el psy
			if (psy.countMessagesUnRead) {
				await this.updateMessage(psy.hasMessage);
				await this.getMessages();
			}
		},
		scrollToElement() {
			const el = this.$refs.scrollToMe;
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		},
		async onSubmit() {
			this.loadingMessage = true;
			const payload = {
				payload: this.message,
				psychologistId:
					this.$auth.$state.user.role === 'psychologist'
						? this.$auth.$state.user.psychologist
						: this.selected._id,
				userId:
					this.$auth.$state.user.role === 'psychologist'
						? this.selected._id
						: this.$auth.$state.user._id,
			};
			await this.sendMessage(payload);
			this.message = '';
			this.$nextTick(() => this.$refs.msj.focus());
			this.scrollToElement();
			this.loadingMessage = false;
		},
		hasMessage(psy) {
			const temp = {
				...this.chats.find(item => item.psychologist && item.psychologist._id === psy._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				const hasMessage = temp.messages.some(
					message =>
						message && !message.read && message.sentBy !== this.$auth.$state.user._id
				);
				if (hasMessage) return temp._id;
			}
		},
		setCountMessagesUnread(item) {
			let count = 0;
			if (!item || !item.messages) return count;
			item.messages.forEach(el => {
				if (!el.read && el.sentBy !== this.$auth.$state.user._id) {
					count += 1;
				}
			});
			return count;
		},
		getPsy(id) {
			return this.psychologists.find(item => item._id === id);
		},
		...mapActions({
			getChat: 'Chat/getChat',
			sendMessage: 'Chat/sendMessage',
			getMessages: 'Chat/getMessages',
			updateMessage: 'Chat/updateMessage',
			startConversation: 'Chat/startConversation',
		}),
		...mapMutations({
			setResumeView: 'Psychologist/setResumeView',
			setChat: 'Chat/setChat',
			setFloatingChat: 'Chat/setFloatingChat',
		}),
	},
};
</script>

<style lang="scss" scoped>
.open-button {
	opacity: 0.8;
	position: fixed;
	bottom: 23px;
	right: 28px;
	z-index: 1;
}

/* The popup chat - hidden by default */
.chat-popup {
	position: fixed;
	bottom: 110px;
	right: 15px;
	border-radius: 0 0 0 25px;
	z-index: 2;
}
.open-button:hover {
	opacity: 1;
}

$color__one: #bdbdbd;
$color__two: #2070e5;
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
		border: solid $color__two;
		background: $color__two;
	}

	&__two {
		color: $font__color_one;
		align-self: flex-start;
		border: solid $color__one;
		background: $color__one;
	}
}
</style>
