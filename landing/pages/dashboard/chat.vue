<template>
	<v-container fluid style="height: 100vh">
		<appbar class="hidden-sm-and-down" title="Chat" />
		<v-card
			v-if="initLoading"
			flat
			style="height: calc(100vh - 135px)"
			class="mt-4 mt-md-0 d-flex justify-center align-center"
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
					class="mt-4 mt-md-0"
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
					<!-- barra lateral role psychologist -->
					<template v-if="$auth.$state.user && $auth.$state.user.role === 'psychologist'">
						<!-- sin consultantes -->
						<v-card-text class="py-0">
							<v-subheader class="primary--text body-1 px-0">
								Mis consultantes
							</v-subheader>
							<v-divider style="border-color: #5eb3e4" class="pa-0"></v-divider>
						</v-card-text>
						<v-sheet
							v-if="!clients.length"
							class="primary white--text pa-4 mx-4"
							style="border-radius: 20px"
						>
							Aún no tienes consultantes
						</v-sheet>
						<!-- consultantes -->
						<v-list v-else two-line style="overflow-y: auto; min-height: 100px">
							<v-list-item
								v-for="(user, e) in listClients"
								:key="e"
								dense
								@click="setSelectedUser(user)"
							>
								<v-list-item-avatar
									style="border-radius: 50%"
									:style="user.hasMessageUser ? 'border: 3px solid #2070E5' : ''"
									size="40"
								>
									<avatar :url="user.avatar" :name="user.name" size="40" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title v-html="user.name"></v-list-item-title>
									<v-list-item-subtitle>
										Usuario · Activo(a)
									</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action>
									<v-badge
										color="primary"
										:content="user.countMessagesUnRead"
										:value="user.countMessagesUnRead"
									>
									</v-badge>
								</v-list-item-action>
							</v-list-item>
						</v-list>
						<!-- general lista usuarios -->
						<template v-if="listUsers.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
							</v-card-text>
							<!-- usuarios -->
							<v-list dense two-line style="overflow-y: auto">
								<v-list-item
									v-for="(user, w) in listUsers"
									:key="w"
									@click="setSelectedUser(user)"
								>
									<v-list-item-avatar
										style="border-radius: 50%"
										:style="
											user.hasMessageUser ? 'border: 3px solid #2070E5' : ''
										"
										size="40"
									>
										<avatar :url="user.avatar" :name="user.name" size="40" />
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title>
											{{ user.name }}
										</v-list-item-title>
										<v-list-item-subtitle>
											Usuario · Activo(a)
										</v-list-item-subtitle>
									</v-list-item-content>
									<v-list-item-action>
										<v-badge
											color="primary"
											:content="user.countMessagesUnRead"
											:value="user.countMessagesUnRead"
										>
										</v-badge>
									</v-list-item-action>
								</v-list-item>
							</v-list>
						</template>
					</template>
					<!-- barra lateral role user -->
					<template v-if="$auth.$state.user && $auth.$state.user.role === 'user'">
						<v-card-text v-if="plan" class="py-0">
							<v-subheader class="primary--text body-1 px-0">
								Mi Psicólogo
							</v-subheader>
							<v-divider style="border-color: #5eb3e4"></v-divider>
						</v-card-text>
						<!-- usuario mi psicologo -->
						<v-list v-if="plan" dense two-line class="py-0">
							<v-list-item @click="setSelectedPsy(getMyPsy)">
								<v-list-item-avatar
									style="border-radius: 50%"
									:style="getMyPsy.hasMessage ? 'border: 3px solid #2070E5' : ''"
									size="40"
								>
									<avatar
										:url="getMyPsy.avatar"
										:name="getMyPsy.name"
										size="40"
									/>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title v-html="getMyPsy.name"></v-list-item-title>
									<v-list-item-subtitle>
										Psicólogo · Activo(a)
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
						</v-list>
						<!-- usuario sin psicologo -->
						<v-list
							v-else-if="!$auth.$state.user && !plan && listPsychologist.length"
							link
							two-line
							class="py-0 primary"
							dark
							style="border-radius: 10px"
						>
							<v-list-item class="px-0" :to="{ name: 'evaluacion' }">
								<v-list-item-avatar style="border-radius: 40px" size="50">
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
						<!-- lista de psicologos "chat iniciado" -->
						<template v-if="listPsychologist.length || plan">
							<v-card-text v-if="listPsychologist.length" class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list
								v-if="listPsychologist.length"
								two-line
								dense
								style="overflow-y: auto"
							>
								<v-list-item
									v-for="(psy, e) in listPsychologist"
									:key="e"
									@click="setSelectedPsy(psy)"
								>
									<v-list-item-avatar
										style="border-radius: 50%"
										:style="psy.hasMessage ? 'border: 3px solid #2070E5' : ''"
										size="40"
									>
										<avatar :url="psy.avatar" :name="psy.name" size="40" />
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
						<!-- lista de psicologos "sin chats iniciados" -->
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
								v-if="!selected.assistant"
								style="min-width: 150px"
								class="text-right"
							>
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
								<v-btn v-show="false" id="addheader" icon>
									<v-img
										contain
										width="25"
										height="25"
										:src="`https://cdn.hablaqui.cl/static/agregar.png`"
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
						<v-card-text
							class="scroll"
							style="flex: 1; display: flex; flex-direction: column; overflow-y: auto"
						>
							<!-- burbujas asistente -->
							<template v-if="selected.assistant">
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
										$auth.$state.user.role === 'user' ? 'con el psicólogo' : ''
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
									<p style="max-height: 75px; overflow-y: auto" class="body-2">
										{{
											$auth.$state.user.role === 'user'
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
														class="body-2"
														style="max-height: 75px; overflow-y: auto"
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
						<v-card-text v-if="selected.assistant">
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
											class="ml-2 mr-2"
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
								</v-text-field>
							</v-form>
						</v-card-text>
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
				countMessagesUnRead: this.setCountMessagesUnread(
					this.chats.find(chat => chat.psychologist._id === item._id)
				),
			}));
		},
		subHeader() {
			if (this.selected.assistant) return 'Asistente virtual';
			if (
				!this.selected.assistant &&
				this.$auth.$state.user &&
				this.selected._id === this.$auth.$state.user.psychologist
			)
				return 'Mi psicólogo';
			if (
				!this.selected.assistant &&
				this.$auth.$state.user &&
				this.clients.some(client => client._id === this.selected._id)
			)
				return 'Consultante';
			return 'Usuario de hablaquí';
		},
		listClients() {
			return this.clients
				.map(item => ({
					...item,
					countMessagesUnRead: this.setCountMessagesUnread(
						this.chats.find(chat => chat.user && chat.user._id === item._id)
					),
					hasMessageUser: this.hasMessageUser(item),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		// lista de usuarios/clientes con los que podría chatear el psicólogo
		listUsers() {
			let filterArray = this.chats.filter(el =>
				el.user.name.toLowerCase().includes(this.search.toLowerCase())
			);

			if (!filterArray.length) filterArray = this.chats;

			if (this.$auth.$state.user && this.$auth.$state.user.role === 'psychologist')
				filterArray = filterArray.filter(item => {
					return this.clients.every(el => el._id !== item.user._id);
				});

			return filterArray
				.map(item => ({
					...item.user,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessageUser: this.hasMessageUser(item.user),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		// lista de psicólogos con los que podría chatear el usuario
		listPsychologist() {
			let filterArray = this.chats.filter(el =>
				el.psychologist.name.toLowerCase().includes(this.search.toLowerCase())
			);
			if (!filterArray.length) filterArray = this.chats;

			if (this.$auth.$state.user && this.$auth.$state.user.role === 'user' && this.getMyPsy)
				filterArray = filterArray.filter(item => {
					return this.getMyPsy._id !== item.psychologist._id;
				});

			return filterArray
				.map(item => ({
					...item.psychologist,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessage: this.hasMessage(item.psychologist),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
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
		// retorna verdadero si el usurio tiene plan activo
		isActivePlan() {
			if (!this.plan) return false;
			return (
				this.plan.remainingSessions > 0 ||
				(this.plan.payment === 'success' && moment().isBefore(moment(this.plan.expiration)))
			);
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
		await this.getPsychologists();
		await this.getMessages();
		if (this.$auth.$state.user && this.$auth.$state.user.role === 'psychologist') {
			await this.getClients(this.$auth.$state.user.psychologist);
			if ('client' in this.$route.query) {
				this.setSelectedUser(
					this.clients.find(client => client._id === this.$route.query.client)
				);
				if ('client' in this.$route.query) this.$router.replace({ query: null });
			} else {
				// SELECT DEFAULT
				this.selected = {
					name: 'Habi',
					assistant: true,
					avatar: 'https://cdn.discordapp.com/attachments/829825912044388413/857366096428138566/hablaqui-asistente-virtual-habi.jpg',
					url: '',
				};
			}
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
			this.selected = {
				name: user.name,
				lastName: this.lastName,
				avatar: user.avatar,
				_id: user._id,
				roomsUrl: user.roomsUrl,
			};
			await this.getChat({ psy: this.$auth.$state.user.psychologist, user: user._id });
			this.loadingChat = false;
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
			if (user.countMessagesUnRead) {
				await this.updateMessage(user.hasMessageUser);
				await this.getMessages();
			}
		},
		async setSelectedPsy(psy) {
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
		hasMessageUser(user) {
			const temp = {
				...this.chats.find(item => item.user && item.user._id === user._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				const hasMessage = temp.messages.some(
					message =>
						message && !message.read && message.sentBy !== this.$auth.$state.user._id
				);
				if (hasMessage) return temp._id;
			}
		},
		getPsy(id) {
			return this.psychologists.find(item => item._id === id);
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
		...mapActions({
			getClients: 'Psychologist/getClients',
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
