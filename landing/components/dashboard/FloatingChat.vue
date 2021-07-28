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
				<v-img
					class="open-button pointer"
					accesskey="b"
					v-bind="attrs"
					width="65"
					height="65"
					:src="`${$config.LANDING_URL}/icono_chat.png`"
					contain
					v-on="on"
				></v-img>
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
									style="text-decoration: none; height: 50px; height: 50px"
								>
									<avatar
										:url="selected.avatar"
										size="50"
										:name="selected.name"
									/>
								</nuxt-link>
							</v-list-item-avatar>
							<v-list-item-title class="title d-flex ml-2">
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
										:src="`${$config.LANDING_URL}/llamada.png`"
									></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-4">
									<v-img
										contain
										height="25"
										:src="`${$config.LANDING_URL}/camara.png`"
									></v-img>
								</v-btn>
							</v-list-item-action> -->
							<v-list-item-action>
								<v-btn icon class="ml-1">
									<v-img
										contain
										height="25"
										:src="`${$config.LANDING_URL}/agregar.png`"
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
											<div style="max-height: 75px; overflow-y: auto body-2">
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
										:src="`${$config.LANDING_URL}/adjuntar.png`"
										height="25"
										width="25"
									></v-img>
								</template> -->
								<template #append>
									<!-- <v-btn depressed icon>
										<v-img
											:src="`${$config.LANDING_URL}/voz.png`"
											height="30"
											width="30"
										></v-img>
									</v-btn> -->
									<v-btn class="ml-2 mr-2" depressed icon type="submit">
										<v-img
											height="25"
											contain
											:src="`${$config.LANDING_URL}/message.png`"
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
							append-icon="mdi-magnify"
							label="Buscar"
						/>
					</v-card-text>
					<template v-if="$auth.$state.user && $auth.$state.user.psychologist">
						<v-card-text>
							<v-subheader class="primary--text body-1 px-0">
								Mi Psicólogo
							</v-subheader>
							<v-divider style="border-color: #5eb3e4"></v-divider>
						</v-card-text>
						<v-list two-line class="py-0">
							<v-list-item>
								<v-list-item-avatar
									style="border: 3px solid #2070e5; border-radius: 40px"
									size="60"
								>
									<avatar
										:url="$auth.$state.user.avatar"
										:name="$auth.$state.user.name"
										size="60"
									/>
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title
										v-html="$auth.$state.user.name"
									></v-list-item-title>
									<v-list-item-subtitle>
										Psicólogo · Activo(a)
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
					<template v-if="psyFromChats.length">
						<v-card-text class="py-0">
							<v-subheader class="primary--text body-1 px-0">General</v-subheader>
							<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
						</v-card-text>
						<v-list two-line style="height: 400px; overflow: auto">
							<v-list-item
								v-for="(psy, e) in psyFromChats"
								:key="e"
								@click="selectedPsy(psy)"
							>
								<v-list-item-avatar
									style="border-radius: 40px"
									:style="psy.hasMessage ? 'border: 3px solid #2070E5' : ''"
									size="60"
								>
									<avatar :url="psy.avatar" :name="psy.name" size="60" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title v-html="psy.name"></v-list-item-title>
									<v-list-item-subtitle>
										Psicólogo · Activo(a)
									</v-list-item-subtitle>
								</v-list-item-content>
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
import { mdiChevronLeft } from '@mdi/js';

export default {
	components: {
		avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	data() {
		return {
			mdiChevronLeft,
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
			}));
		},
		psyFromChats() {
			let filterArray = this.chats.filter(el =>
				el.psychologist.name.toLowerCase().includes(this.search.toLowerCase())
			);
			if (!filterArray.length) filterArray = this.chats;
			return filterArray.map(item => ({
				...item.psychologist,
				hasMessage: this.hasMessage(item.psychologist),
			}));
		},
		menu: {
			get() {
				return this.floatingChat;
			},
			set(value) {
				this.setFloatingChat(value);
			},
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
			if (newValue) {
				this.setResumeView(false);
				if (this.$route.params.slug) {
					const psychologist = this.psychologists.find(
						item => item.username === this.$route.params.slug
					);
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
				(this.$auth.$state.user._id === data.userId ||
					this.$auth.$state.user.psychologist === data.psychologistId)
			) {
				this.pusherCallback(data);
			}
		});
	},
	async mounted() {
		if (this.resumeView) {
			this.setResumeView(false);
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
				await this.updateMessage(data.content._id);
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
			// inicamos carga del seleccionado
			this.loadingChat = true;
			this.selected = psy;
			// obeteners chat del seleccciona
			await this.getChat({ psy: psy._id, user: this.$auth.$state.user._id });
			// finalizamos carga del seleccionado
			this.loadingChat = false;
			// scroll hasta el final para ver los ultimos mensajes
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
			// si no el usuario no tiene una conversacion enviamos una intencion de chat para notificar el pys
			if (!this.chat) await this.startConversation(psy._id);
			// Si ya tiene un chat con el psy, marcamos mensaje como leido y actualizamos el psy
			if (psy.hasMessage) {
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
			if (!this.message) return;
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
			this.loadingMessage = false;
			this.$nextTick(() => this.$refs.msj.focus());
			this.scrollToElement();
		},
		hasMessage(psy) {
			let temp = {
				...this.chats.find(item => item.psychologist && item.psychologist._id === psy._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				temp = temp.messages[temp.messages.length - 1];
				if (temp && !temp.read && temp.sentBy !== this.$auth.$state.user._id)
					return temp._id;
			}
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
