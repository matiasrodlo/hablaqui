<template>
	<div>
		<card-onboarding
			v-if="stepOnboarding && stepOnboarding.title === 'Chat'"
			style="position: absolute; top: 130px; left: 10px; z-index: 3"
			arrow="arrow-left"
			:next="
				() => {
					setStepLinks(0);
					$router.push({ name: 'dashboard-agenda' });
					return {
						title: 'Sesiones',
						card: {
							title: 'Sesiones',
							description:
								'Las sesiones se añadirán automáticamente a su calendario ',
							link: '',
						},
						route: 'dashboard-agenda',
					};
				}
			"
		/>
		<v-overlay z-index="1" :value="initLoading">
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
								:append-icon="mdiMagnify"
								label="Buscar"
							/>
						</v-card-text>
						<!-- barra lateral role specialist -->
						<template
							v-if="$auth.$state.user && $auth.$state.user.role === 'specialist'"
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
								Aún no tiene consultantes
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
										<v-list-item-title>
											{{ user.name }} {{ user.lastName }}
										</v-list-item-title>
										<v-list-item-subtitle v-show="false">
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
									<v-subheader class="primary--text body-1 px-0">
										General
									</v-subheader>
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
												{{ user.name }} {{ user.lastName }}
											</v-list-item-title>
											<v-list-item-subtitle v-show="false">
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
									Mi especialista
								</v-subheader>
								<v-divider style="border-color: #5eb3e4"></v-divider>
							</v-card-text>
							<!-- usuario mi especialista -->
							<v-list v-if="plan && getMySpec" dense two-line class="py-0">
								<v-list-item @click="setSelectedSpec(getMySpec)">
									<v-list-item-avatar
										style="border-radius: 50%"
										:style="
											getMySpec.hasMessage ? 'border: 3px solid #2070E5' : ''
										"
										size="40"
									>
										<avatar
											:url="getMySpec.avatar"
											:name="getMySpec.name"
											size="40"
										/>
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title>
											{{ getMySpec.name }} {{ getMySpec.lastName }}
										</v-list-item-title>
										<v-list-item-subtitle v-show="false">
											Especialista · Activo(a)
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
							</v-list>
							<!-- usuario sin especialista -->
							<v-list
								v-else-if="!$auth.$state.user && !plan && listSpecialist.length"
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
											Aun no tienes especialista
										</v-list-item-title>
										<v-list-item-title class="caption">
											Encuentra uno aquí
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
							<!-- lista de especialistas "chat iniciado" -->
							<template v-if="listSpecialist.length || plan">
								<v-card-text v-if="listSpecialist.length" class="py-0">
									<v-subheader class="primary--text body-1 px-0"
										>General</v-subheader
									>
									<v-divider
										style="border-color: #5eb3e4"
										class="mb-2"
									></v-divider>
								</v-card-text>
								<v-list
									v-if="listSpecialist.length"
									two-line
									dense
									style="overflow-y: auto"
								>
									<v-list-item
										v-for="(spec, e) in listSpecialist"
										:key="e"
										@click="setSelectedSpec(spec)"
									>
										<v-list-item-avatar
											style="border-radius: 50%"
											:style="
												spec.hasMessage ? 'border: 3px solid #2070E5' : ''
											"
											size="40"
										>
											<avatar
												:url="spec.avatar"
												:name="spec.name"
												size="40"
											/>
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
							<!-- lista de especialistas "sin chats iniciados" -->
							<template v-else>
								<div
									style="flex: 1"
									class="my-2 d-flex justify-center align-center"
								>
									<div class="text-center">
										<div class="mt-5 body-2 mx-auto" style="max-width: 220px">
											Bienestar en cualquier momento
										</div>
										<v-btn
											class="mt-5 px-8"
											color="primary"
											rounded
											:to="{ name: 'evaluacion' }"
										>
											Comenzar
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
								ref="channel1"
								style="height: 100vh"
								:selected="selected"
								:sub-header="subHeader"
								:loading-chat="loadingChat"
								:chat="chat"
								:socket="socket"
								:close="() => (selected = null)"
							/>
						</v-sheet>
					</v-dialog>
					<v-col v-else cols="12" md="8" lg="9">
						<channel
							ref="channel2"
							style="height: calc(100vh - 135px)"
							:selected="selected"
							:sub-header="subHeader"
							:loading-chat="loadingChat"
							:chat="chat"
							:socket="socket"
						/>
					</v-col>
				</template>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { mdiMagnify } from '@mdi/js';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	components: {
		avatar: () => import('~/components/Avatar'),
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Channel: () => import('~/components/chat/Channel'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			mdiMagnify,
			search: '',
			loadingChat: false,
			dialog: false,
			selected: null,
			channel: null,
			initLoading: true,
			plan: null,
		};
	},
	computed: {
		specialists() {
			return this.allSpecialists.map(item => ({
				...item,
				hasMessage: this.hasMessage(item),
				countMessagesUnRead: this.setCountMessagesUnread(
					this.chats.find(chat => chat.specialist._id === item._id)
				),
			}));
		},
		subHeader() {
			if (this.selected.assistant) return 'Asistente virtual';
			if (
				!this.selected.assistant &&
				this.$auth.$state.user &&
				this.selected._id === this.$auth.$state.user.specialist
			) {
				const professions = {
					specialist: 'Especialista',
					nutritionist: 'Nutricionista',
					specchopedagogue: 'Psicopedagogo',
				};
				return this.selected.profession
					? especialidadEspecialista[this.selected.profession]
					: 'Especialista';
			}
			if (
				!this.selected.assistant &&
				this.$auth.$state.user.role === 'specialist' &&
				this.clients.some(client => client._id === this.selected._id)
			)
				return 'Consultante';
			return this.$auth.$state.user.role === 'user'
				? 'Especialista de hablaquí'
				: 'No es un consultane';
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
		// lista de usuarios/clientes con los que podría chatear el especialista
		listUsers() {
			let filterArray = this.chats.filter(item => item.specialist && item.user);

			if (this.search) {
				filterArray = this.chats.filter(el =>
					el.user.name.toLowerCase().includes(this.search.toLowerCase())
				);
			}

			if (this.$auth.$state.user.role === 'specialist') {
				filterArray = filterArray.filter(item => {
					return this.clients.every(el => el._id !== item.user._id);
				});
			}

			return filterArray
				.map(item => ({
					...item.user,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessageUser: this.hasMessageUser(item.user),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		// lista de especialistas con los que podría chatear el usuario
		listSpecialist() {
			let filterArray = this.chats.filter(item => item.specialist && item.user);

			if (this.search) {
				filterArray = this.chats.filter(el =>
					el.specialist.name.toLowerCase().includes(this.search.toLowerCase())
				);
			}

			if (this.$auth.$state.user.role === 'user' && this.getMySpec) {
				filterArray = filterArray.filter(item => {
					return this.getMySpec._id !== item.specialist._id;
				});
			}

			filterArray = uniqBy(filterArray, function (e) {
				return e.specialist._id;
			});

			return filterArray
				.map(item => ({
					...item.specialist,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessage: this.hasMessage(item.specialist),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		getMySpec() {
			if (this.$auth.$state.user && this.$auth.$state.user.role === 'user' && this.plan) {
				const spec = this.plan.specialist;
				if (spec)
					return {
						...this.getSpec(spec),
						roomsUrl: this.plan && this.plan.roomsUrl ? this.plan.roomsUrl : '',
					};
				else return null;
			}
			return null;
		},
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			allSpecialists: 'Specialist/specialists',
			clients: 'Specialist/clients',
			plans: 'User/plan',
			stepOnboarding: 'User/step',
		}),
	},
	watch: {
		selected(newValue) {
			if (newValue && newValue._id) {
				this.dialog = true;
			} else this.dialog = false;
		},
	},
	created() {
		this.selected = {
			name: 'Habi',
			assistant: true,
			avatar: 'https://cdn.discordapp.com/attachments/829825912044388413/857366096428138566/hablaqui-asistente-virtual-habi.jpg',
			url: '',
		};
		this.socket = this.$nuxtSocket({
			channel: '/liveData',
		});

		/* Listen for events: */
		this.socket.on('getMessage', data => {
			if (
				data.content.sentBy !== this.$auth.$state.user._id &&
				(this.$auth.$state.user._id === data.userId ||
					this.$auth.$state.user.specialist === data.specialistId)
			) {
				this.socketioCallback(data);
			}
		});
	},
	async mounted() {
		await this.initFetch();
	},
	methods: {
		async initFetch() {
			this.plan =
				this.plans && this.plans.sortedPlans.length > 0 ? this.plans.sortedPlans[0] : null;
			dayjs.locale('es');
			await this.getSpecialists();
			if (this.$auth.$state.user.role === 'user') {
				await this.getMessages();
				this.initLoading = false;
				return (this.selected = {
					name: 'Habi',
					assistant: true,
					avatar: 'https://cdn.discordapp.com/attachments/829825912044388413/857366096428138566/hablaqui-asistente-virtual-habi.jpg',
					url: '',
				});
			}
			if (this.$auth.$state.user.role === 'specialist') {
				if (this.$auth.$state.user.specialist) {
					await this.getMessages();
				}
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
		async socketioCallback(data) {
			if (this.selected._id === data.specialistId || this.selected._id === data.userId) {
				await this.getChat({ spec: data.specialistId, user: data.userId });
				// scroll to end
				setTimeout(() => {
					if (this.$vuetify.breakpoint.smAndDown) {
						this.$refs.channel1.scrollToElement();
					} else this.$refs.channel2.scrollToElement();
				}, 100);
				await this.updateMessage(data._id);
			}
			await this.getMessages();
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
			await this.getChat({ spec: this.$auth.$state.user.specialist, user: user._id });
			this.loadingChat = false;
			// scroll to end
			setTimeout(() => {
				if (this.$vuetify.breakpoint.smAndDown) {
					this.$refs.channel1.scrollToElement();
				} else this.$refs.channel2.scrollToElement();
			}, 100);
			if (user.countMessagesUnRead) {
				await this.updateMessage(user.hasMessageUser);
				await this.getMessages();
			}
		},
		async setSelectedSpec(spec) {
			if (this.selected && this.selected._id === spec._id) return;
			// iniciamos carga del seleccionado
			this.loadingChat = true;
			this.selected = spec;
			// obtener chat del selecciona
			await this.getChat({ spec: spec._id, user: this.$auth.$state.user._id });
			// finalizamos carga del seleccionado
			this.loadingChat = false;
			// si no el usuario no tiene una conversation enviamos una intention de chat para notificar el pys
			if (!this.chat) await this.startConversation(spec._id);
			// scroll to end
			setTimeout(() => {
				if (this.$vuetify.breakpoint.smAndDown) {
					this.$refs.channel1.scrollToElement();
				} else this.$refs.channel2.scrollToElement();
			}, 100);
			// Si ya tiene un chat con el spec, marcamos mensaje como Leído y actualizamos el spec
			if (spec.countMessagesUnRead) {
				await this.updateMessage(spec.hasMessage);
				await this.getMessages();
			}
		},
		hasMessage(spec) {
			const temp = {
				...this.chats.find(item => item.specialist && item.specialist._id === spec._id),
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
		getSpec(id) {
			return this.specialists.find(item => item._id === id);
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
			getSpecialists: 'Specialist/getSpecialists',
			getChat: 'Chat/getChat',
			getMessages: 'Chat/getMessages',
			updateMessage: 'Chat/updateMessage',
			startConversation: 'Chat/startConversation',
		}),
		...mapMutations({
			setChat: 'Chat/setChat',
			setSpecialists: 'Specialist/setSpecialists',
			setStepLinks: 'User/setStepLinks',
		}),
	},
};
</script>
