<template>
	<div>
		<v-overlay :value="initLoading">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<v-container fluid style="height: 100vh">
			<appbar class="hidden-sm-and-down" title="Chat" />
			<v-row v-show="!initLoading">
				<v-col cols="12" md="4" lg="3" class="px-0 px-md-4">
					<v-card
						:elevation="!$vuetify.breakpoint.smAndDown ? '6' : '0'"
						style="display: flex; flex-direction: column; border-radius: 15px"
						:style="$vuetify.breakpoint.smAndDown ? '' : 'height: calc(100vh - 135px)'"
						class="py-4 mt-md-0"
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
						<template
							v-if="$auth.$state.user && $auth.$state.user.role === 'psychologist'"
						>
							<!-- sin consultantes -->
							<v-card-text v-if="listClients.length" class="py-0">
								<v-subheader class="primary--text body-1 px-0">
									Mis consultantes
								</v-subheader>
								<v-divider style="border-color: #5eb3e4" class="pa-0"></v-divider>
							</v-card-text>
							<v-sheet
								v-if="!clients.length"
								class="primary white--text pa-4 mt-2 mx-4"
								style="border-radius: 20px"
							>
								Aún no tienes consultantes
							</v-sheet>
							<!-- consultantes -->
							<v-list
								v-if="listClients.length"
								two-line
								style="overflow-y: auto; min-height: 100px"
							>
								<v-list-item
									v-for="(user, e) in listClients"
									:key="e"
									dense
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
									<v-subheader class="primary--text body-1 px-0"
										>General</v-subheader
									>
									<v-divider
										style="border-color: #5eb3e4"
										class="mb-2"
									></v-divider>
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
												user.hasMessageUser
													? 'border: 3px solid #2070E5'
													: ''
											"
											size="40"
										>
											<avatar
												:url="user.avatar"
												:name="user.name"
												size="40"
											/>
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
										:style="
											getMyPsy.hasMessage ? 'border: 3px solid #2070E5' : ''
										"
										size="40"
									>
										<avatar
											:url="getMyPsy.avatar"
											:name="getMyPsy.name"
											size="40"
										/>
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title
											v-html="getMyPsy.name"
										></v-list-item-title>
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
									<v-subheader class="primary--text body-1 px-0"
										>General</v-subheader
									>
									<v-divider
										style="border-color: #5eb3e4"
										class="mb-2"
									></v-divider>
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
											:style="
												psy.hasMessage ? 'border: 3px solid #2070E5' : ''
											"
											size="40"
										>
											<avatar :url="psy.avatar" :name="psy.name" size="40" />
										</v-list-item-avatar>

										<v-list-item-content>
											<v-list-item-title
												v-html="psy.name"
											></v-list-item-title>
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
								<div
									style="flex: 1"
									class="my-2 d-flex justify-center align-center"
								>
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
				<!-- CHAT/CHANNEL -->
				<template v-if="selected">
					<v-dialog v-if="$vuetify.breakpoint.smAndDown" v-model="dialog" fullscreen>
						<v-sheet>
							<channel
								style="height: 100vh"
								:selected="selected"
								:sub-header="subHeader"
								:loading-chat="loadingChat"
								:chat="chat"
								:scroll-to-element="scrollToElement"
								:close="() => (dialog = false)"
							/>
						</v-sheet>
					</v-dialog>
					<v-col v-else cols="12" md="8" lg="9">
						<channel
							style="height: calc(100vh - 135px)"
							:selected="selected"
							:sub-header="subHeader"
							:loading-chat="loadingChat"
							:chat="chat"
							:scroll-to-element="scrollToElement"
						/>
					</v-col>
				</template>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import Pusher from 'pusher-js';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Channel: () => import('~/components/chat/Channel'),
		avatar: () => import('~/components/Avatar'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			search: '',
			loadingChat: false,
			dialog: false,
			selected: null,
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
				.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()))
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
	watch: {
		selected(newValue) {
			if (newValue._id) this.dialog = true;
			else this.dialog = false;
		},
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
		async pusherCallback(data) {
			if (this.selected._id === data.psychologistId || this.selected._id === data.userId) {
				await this.getChat({ psy: data.psychologistId, user: data.userId });
				this.scrollToElement();
				await this.updateMessage(data.content._id);
			}
			await this.getMessages();
		},
		scrollToElement() {
			const el = this.$el.getElementsByClassName('scroll')[0];
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
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
