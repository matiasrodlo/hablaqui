<template>
	<v-container fluid style="height: 100vh">
		<appbar title="Chat" />
		<v-card
			v-if="initLoading"
			flat
			style="height: calc(100vh - 135px)"
			class="d-flex justify-center align-center"
		>
			<v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
		</v-card>
		<v-row v-else>
			<v-col cols="12" md="4" lg="3">
				<v-card
					style="
						height: calc(100vh - 135px);
						display: flex;
						flex-direction: column;
						border-radius: 15px;
					"
					flat
				>
					<v-card-text class="py-0">
						<v-text-field
							v-model="search"
							style="border-radius: 25px"
							hide-details
							filled
							dense
							outlined
							single-line
							append-icon="mdi-magnify"
							label="Buscar"
						/>
					</v-card-text>
					<!-- barra lateral psychologist -->
					<template v-if="$auth.$state.user && $auth.$state.user.role == 'psychologist'">
						<v-card-text>
							<v-subheader class="primary--text body-1 px-0">
								Mis consultantes
							</v-subheader>
							<v-divider style="border-color: #5eb3e4"></v-divider>
						</v-card-text>
						<v-sheet
							v-if="!clients.length"
							class="primary white--text pa-4 mx-4"
							style="border-radius: 20px"
						>
							Aún no tienes consultantes
						</v-sheet>
						<v-list v-else two-line style="overflow-y: auto">
							<v-list-item
								v-for="(user, e) in userFromClients"
								:key="e"
								@click="setSelectedUser(user)"
							>
								<v-list-item-avatar
									style="border-radius: 40px"
									:style="user.hasMessageUser ? 'border: 3px solid #2070E5' : ''"
									size="60"
								>
									<avatar :url="user.avatar" :name="user.name" size="60" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title v-html="user.name"></v-list-item-title>
									<v-list-item-subtitle>
										Usuario · Activo(a)
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>
						<template v-if="usersFromChats.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list two-line style="overflow-y: auto">
								<v-list-item
									v-for="(user, w) in usersFromChats"
									:key="w"
									@click="setSelectedUser(user)"
								>
									<v-list-item-avatar
										style="border-radius: 40px"
										:style="
											user.hasMessageUser ? 'border: 3px solid #2070E5' : ''
										"
										size="60"
									>
										<avatar :url="user.avatar" :name="user.name" size="60" />
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title v-html="user.name"></v-list-item-title>
										<v-list-item-subtitle>
											Usuario · Activo(a)
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</template>
					</template>
					<!-- barra lateral user -->
					<template v-else>
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
						<!-- <template v-else>
							<v-card-text>
								<v-subheader class="primary--text body-1 px-0">
									Mi Psicólogo
								</v-subheader>
								<v-divider style="border-color: #5EB3E4"></v-divider>
							</v-card-text>
							<v-list
								link
								two-line
								class="py-0 primary"
								dark
								style="border-radius: 10px"
							>
								<v-list-item class="px-0" :to="{ name: 'evaluacion' }">
									<v-list-item-avatar style="border-radius: 40px; " size="50">
										<v-img
											height="50"
											width="50"
											class="mx-auto"
											src="/img/Lupa.png"
										></v-img>
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title class="caption">
											Aun no tienes psicólogo
										</v-list-item-title>
										<v-list-item-title class="caption">
											Encuentra uno aquí
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</template> -->
						<template v-if="psyFromChats.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list two-line style="overflow-y: auto">
								<v-list-item
									v-for="(psy, e) in psyFromChats"
									:key="e"
									@click="setSelectedPsy(psy)"
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
							<div style="flex: 1" class="d-flex justify-center align-center">
								<div class="text-center">
									<span
										class="body-1 primary--text font-weight-bold"
										style="max-width: 220px"
									>
										Comienza a hablar con nuestros psicólogos
									</span>
									<div class="mt-5 body-2 mx-auto" style="max-width: 220px">
										Orientación psicológica en cualquier momento y lugar.
										Comienza a mejorar tu vida hoy.
									</div>
									<v-btn
										class="mt-5 px-8"
										color="primary"
										rounded
										:to="{ name: 'psicologos' }"
									>
										Buscar ahora
									</v-btn>
								</div>
							</div>
						</template>
					</template>
				</v-card>
			</v-col>
			<!-- CHAT USER/PSY -->
			<v-col v-if="selected" cols="12" md="8" lg="9">
				<v-card
					style="
						height: calc(100vh - 135px);
						display: flex;
						flex-direction: column;
						border-radius: 15px;
					"
				>
					<v-card-text style="flex: 0">
						<!-- cabecera -->
						<v-list-item>
							<v-list-item-avatar size="50">
								<avatar :url="selected.avatar" size="50" :name="selected.name" />
							</v-list-item-avatar>
							<v-list-item-title class="title d-flex">
								<div>
									<span class="secondary--text">
										{{ selected.shortName || selected.name }}
									</span>
									<span v-if="selected.lastName" class="secondary--text">
										{{ selected.lastName }}
									</span>
									<div class="secondary--text caption text--disabled">
										{{ subHeader }}
									</div>
								</div>
							</v-list-item-title>
							<div
								v-if="!selected.assitant"
								style="min-width: 150px"
								class="text-right"
							>
								<!-- <v-btn id="callheaher" icon >
									<v-img
										contain
										height="25"
										width="25"
										:src="`${$config.LANDING_URL}/llamada.png`"
									></v-img>
								</v-btn> -->
								<v-btn id="camheader" icon @click="setVideo">
									<v-img
										contain
										height="25"
										width="25"
										:src="`${$config.LANDING_URL}/camara.png`"
									></v-img>
								</v-btn>
								<v-btn id="addheader" icon>
									<v-img
										contain
										width="25"
										height="25"
										:src="`${$config.LANDING_URL}/agregar.png`"
									></v-img>
								</v-btn>
							</div>
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
						<div
							v-if="video"
							style="position: relative; border-radius: 30px; height: 100%"
							class="px-8 pb-2"
						>
							<div
								class="mx-auto text-center flex align-items-center"
								style="
									background-color: #272727;
									position: absolute;
									bottom: 20px;
									left: 0;
									right: 0;
									z-index: 1;
									width: 60px;
									height: 60px;
								"
							/>
							<iframe
								style="width: 100%; height: 100%; border-radius: 30px"
								:src="`https://brie.fi/ng/${video}?audio=1&video=1&fs=1&invite=0&prefs=0&share=0&chat=0`"
								allow="camera; microphone; speaker; display-capture"
							>
							</iframe>
						</div>
						<template v-else>
							<v-card-text
								class="scroll"
								style="
									flex: 1;
									display: flex;
									flex-direction: column;
									overflow-y: auto;
								"
							>
								<!-- burbujas asistente -->
								<template v-if="selected.assitant">
									<div class="text-center">hablaquí</div>
									<div
										class="
											mx-auto
											text-center
											headline
											font-weight-bold
											primary--text
											my-4
										"
										style="max-width: 320px"
									>
										Bienvenido al chat confidencial
										{{
											$auth.$state.user.role == 'user'
												? 'con el psicólogo'
												: ''
										}}
									</div>
									<v-divider
										class="mx-auto mb-10"
										style="width: 100px; border-color: #2070e5"
									></v-divider>
									<div
										style="
											width: 50%;
											display: flex;
											justify-content: space-between;
										"
									>
										<span class="text--disabled">
											{{ selected.name }}
										</span>
										<span class="text--disabled">{{ setDate() }}</span>
									</div>
									<div class="talkbubble talkbubble__two" style="margin-top: 2px">
										<p style="body-2 max-height: 75px; overflow-y: auto">
											{{
												$auth.$state.user.role == 'user'
													? '¡Hola! Bienvenid@ a tu espacio personal en Hablaquí. Soy Habi, tu asesora virtual. Mi objetivo es ayudarte a encontrar el profesional más adecuado para ti, para que pueda trabajar contigo en aquello que desees mejorar. Si bien actualmente estoy en desarrollo, próximamente podrás interactuar conmigo.'
													: '¡Hola! Bienvenid@ a tu espacio personal en Hablaquí. Soy Habi, tu asesora virtual. Mi objetivo es atender tus consultas sobre el funcionamiento de la plataforma. Si bien actualmente estoy en desarrollo, próximamente podrás interactuar conmigo.'
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
												:class="
													sentBy(item.sentBy)
														? 'justify-end'
														: 'justify-start'
												"
											>
												<div style="width: 50%">
													<div
														style="
															display: flex;
															justify-content: space-between;
														"
													>
														<span
															v-if="sentBy(item.sentBy)"
															class="text--disabled body-2"
														>
															{{ $auth.$state.user.name }}
														</span>
														<span v-else class="text--disabled body-2">
															{{
																selected.shortName || selected.name
															}}
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
															class="body-2"
															style="
																max-height: 75px;
																overflow-y: auto;
															"
														>
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
							<v-card-text v-if="selected.assitant">
								<div class="text-center body-2">
									Hablaquí valora la privacidad. No compartiremos tus mensajes, ni
									tampoco ningún dato personal.
								</div>
								<div class="primary--text body-2 text-center">
									<nuxt-link
										target="_blank"
										to="/condiciones"
										style="text-decoration: none"
									>
										Ver terminos y condiciones de Chat
									</nuxt-link>
								</div>
							</v-card-text>
							<v-card-text v-else style="flex: 0">
								<v-form @submit.prevent="onSubmit">
									<v-text-field
										ref="messagechat"
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
											<v-btn
												class="ml-2 mr-2"
												depressed
												icon
												type="submit"
												:disabled="!message"
											>
												<v-img
													:src="`${$config.LANDING_URL}/message.png`"
													height="30"
													width="30"
												></v-img>
											</v-btn>
										</template>
									</v-text-field>
								</v-form>
							</v-card-text>
						</template>
					</template>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import Pusher from 'pusher-js';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		avatar: () => import('~/components/Avatar'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			video: null,
			search: '',
			loadingMessage: false,
			loadingChat: false,
			selected: null,
			message: '',
			pusher: null,
			channel: null,
			initLoading: true,
		};
	},
	computed: {
		psychologists() {
			return this.allPsychologists.map(item => ({
				...item,
				hasMessage: this.hasMessage(item),
			}));
		},
		subHeader() {
			if (this.selected.assitant) return 'Asistente virtual';
			if (
				!this.selected.assitant &&
				this.selected._id === this.$auth.$state.user.psychologist
			)
				return 'Mi psicólogo';
			if (
				!this.selected.assitant &&
				this.selected._id !== this.$auth.$state.user.psychologist
			)
				return 'Terapeuta de Hablaquí con licencia';
			return '';
		},
		userFromClients() {
			return this.clients.map(item => ({
				...item,
				hasMessageUser: this.hasMessageUser(item),
			}));
		},
		usersFromChats() {
			let filterArray = this.chats.filter(el =>
				el.user.name.toLowerCase().includes(this.search.toLowerCase())
			);
			if (!filterArray.length) filterArray = this.chats;
			filterArray = filterArray.filter(
				item => !this.clients.some(el => el._id === item.user._id)
			);
			return filterArray.map(item => ({
				...item.user,
				hasMessageUser: this.hasMessageUser(item.user),
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
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			allPsychologists: 'Psychologist/psychologists',
			clients: 'Psychologist/clients',
		}),
	},
	created() {
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
		moment.locale('es');
		if (process.browser) {
			const psicologos = JSON.parse(localStorage.getItem('psychologists'));
			if (psicologos && psicologos.length) this.setPsychologists(psicologos);
		}
		await this.getPsychologists();
		await this.getMessages();
		if (this.$route.params.psy) {
			const psychologist = this.getPsy(this.$route.params.psy);
			this.setSelectedPsy(psychologist);
		} else {
			// SELECT DEFAULT
			this.selected = {
				name: 'Habi',
				assitant: true,
				avatar: 'https://cdn.discordapp.com/attachments/829825912044388413/857366096428138566/hablaqui-asistente-virtual-habi.jpg',
			};
		}
		if (this.$auth.$state.user && this.$auth.$state.user.role === 'psychologist') {
			await this.geClients(this.$auth.$state.user.psychologist);
		}
		this.initLoading = false;
	},
	methods: {
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
			this.$nextTick(() => this.$refs.messagechat.focus());
			this.scrollToElement();
		},
		async pusherCallback(data) {
			if (this.selected._id === data.psychologistId || this.selected._id === data.userId) {
				await this.getChat({ psy: data.psychologistId, user: data.userId });
				this.scrollToElement();
				await this.updateMessage(data.content._id);
			}
			await this.getMessages();
		},
		setDate(time) {
			if (time) return moment(time).calendar();
			return moment().format('llll');
		},
		scrollToElement() {
			const el = this.$el.getElementsByClassName('scroll')[0];
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		},
		sentBy(sentBy) {
			return sentBy === this.$auth.$state.user._id;
		},
		async setSelectedUser(user) {
			this.loadingChat = true;
			this.video = null;
			this.selected = {
				name: user.name,
				lastName: this.lastName,
				avatar: user.avatar,
				_id: user._id,
			};
			await this.getChat({ psy: this.$auth.$state.user.psychologist, user: user._id });
			this.loadingChat = false;
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
			if (user.hasMessageUser) {
				await this.updateMessage(user.hasMessageUser);
				await this.getMessages();
			}
		},
		async setSelectedPsy(psy) {
			this.video = null;
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
		hasMessageUser(user) {
			let temp = {
				...this.chats.find(item => item.user && item.user._id === user._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				temp = temp.messages[temp.messages.length - 1];
				if (temp && !temp.read && temp.sentBy !== this.$auth.$state.user._id)
					return temp._id;
			}
		},
		getPsy(id) {
			return this.psychologists.find(item => item._id === id);
		},
		setVideo() {
			if (this.video) this.video = null;
			else {
				const psychologistId =
					this.$auth.$state.user.role === 'psychologist'
						? this.$auth.$state.user.psychologist
						: this.selected._id;
				const userId =
					this.$auth.$state.user.role === 'psychologist'
						? this.selected._id
						: this.$auth.$state.user._id;
				this.video = psychologistId + userId;
			}
		},
		...mapActions({
			geClients: 'Psychologist/geClients',
			getPsychologists: 'Psychologist/getPsychologists',
			getChat: 'Chat/getChat',
			sendMessage: 'Chat/sendMessage',
			getMessages: 'Chat/getMessages',
			updateMessage: 'Chat/updateMessage',
			startConversation: 'Chat/startConversation',
		}),
		...mapMutations({
			setChat: 'Chat/setChat',
			setPsychologists: 'Psychologist/setPsychologists',
		}),
	},
};
</script>

<style lang="scss" scoped>
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
