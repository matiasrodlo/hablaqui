<template>
	<v-container fluid style="height: 100vh">
		<appbar />
		<v-row>
			<v-col cols="12" md="4" lg="3">
				<div
					style="height: calc(100vh - 135px);"
					v-if="loading"
					class="d-flex justify-center align-center"
				>
					<v-progress-circular indeterminate color="primary"></v-progress-circular>
				</div>
				<v-card
					v-else
					style="height: calc(100vh - 135px); display: flex; flex-direction: column; border-radius: 15px"
					flat
				>
					<v-card-text class="py-0">
						<v-text-field
							style="border-radius: 25px;"
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
					<template v-if="user && user.role == 'psychologist'">
						<template>
							<v-card-text>
								<v-subheader class="primary--text body-1 px-0">
									Mis consultantes
								</v-subheader>
								<v-divider style="border-color: #5EB3E4"></v-divider>
							</v-card-text>
							<v-list two-line class="py-0">
								<v-list-item>
									<v-list-item-avatar
										style="border: 3px solid #2070E5; border-radius: 40px; "
										size="60"
									>
										<avatar :url="user.avatar" :name="user.name" size="60" />
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title v-html="user.name"></v-list-item-title>
										<v-list-item-subtitle>
											Psicólogo · Activo(a)
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</template>
						<template v-if="usersFromChats.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5EB3E4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list two-line style="overflow-y: auto">
								<v-list-item
									v-for="(user, w) in usersFromChats"
									:key="w"
									@click="setSelectedUser(user)"
								>
									<v-list-item-avatar
										style="border-radius: 40px;"
										:style="user.hasMessage ? 'border: 3px solid #2070E5' : ''"
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
						<div v-else style="flex: 1" class="d-flex justify-center align-center">
							<div class="text-center">
								<span class=" body-1 primary--text font-weight-bold">
									Los usuarios te comenzarán a contactar
								</span>
								<div class="mt-10 body-2">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
									diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								</div>
							</div>
						</div>
					</template>
					<!-- barra lateral user -->
					<template v-else>
						<template v-if="user && user.psychologist">
							<v-card-text>
								<v-subheader class="primary--text body-1 px-0">
									Mi Psicólogo
								</v-subheader>
								<v-divider style="border-color: #5EB3E4"></v-divider>
							</v-card-text>
							<v-list two-line class="py-0">
								<v-list-item>
									<v-list-item-avatar
										style="border: 3px solid #2070E5; border-radius: 40px; "
										size="60"
									>
										<avatar :url="user.avatar" :name="user.name" size="60" />
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title v-html="user.name"></v-list-item-title>
										<v-list-item-subtitle>
											Psicólogo · Activo(a)
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</template>
						<template v-else>
							<v-card-text>
								<v-subheader class="primary--text body-1 px-0">
									Mi Psicólogo
								</v-subheader>
								<v-divider style="border-color: #5EB3E4"></v-divider>
							</v-card-text>
							<v-list
								link
								one-line
								class="py-0 primary"
								dark
								style="border-radius: 10px"
							>
								<v-list-item class="px-0" :to="{ name: 'evaluacion' }">
									<v-list-item-avatar style="border-radius: 40px; " size="60">
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
						</template>
						<template v-if="psychologists.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5EB3E4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list two-line style="overflow-y: auto">
								<v-list-item
									v-for="(psy, e) in psychologists"
									:key="e"
									@click="setSelectedPsy(psy)"
								>
									<v-list-item-avatar
										style="border-radius: 40px;"
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
									<span class=" body-1 primary--text font-weight-bold">
										Comienza a hablar con nuestros psicólogos
									</span>
									<div class="mt-10 body-2">
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
										sed diam nonummy nibh euismod tincidunt ut laoreet dolore
										magna
									</div>
									<v-btn
										class="mt-10 px-8 py-6"
										color="primary"
										rounded
										@click="getAllPsy"
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
			<v-col cols="12" md="8" lg="9">
				<v-card
					style="height: calc(100vh - 135px); display: flex; flex-direction: column; border-radius: 15px"
				>
					<v-card-text style="flex: 0">
						<!-- cabecera -->
						<v-list-item>
							<v-list-item-avatar size="50">
								<router-link
									:to="{ name: 'perfil' }"
									style="text-decoration: none; height: 50px; height: 50px"
								>
									<avatar
										:url="selected.avatar"
										size="50"
										:name="selected.name"
									/>
								</router-link>
							</v-list-item-avatar>
							<v-list-item-title class="title d-flex">
								<router-link :to="{ name: 'perfil' }" style="text-decoration: none">
									<span class="secondary--text">
										{{ selected.shortName || selected.name }}
									</span>
									<span class="secondary--text" v-if="selected.lastName">
										{{ selected.lastName }}
									</span>
									<div class="secondary--text caption text--disabled">
										{{ subHeader }}
									</div>
								</router-link>
							</v-list-item-title>
							<v-list-item-action>
								<v-btn icon>
									<v-img contain height="25" src="/img/llamada.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-4">
									<v-img contain height="25" src="/img/camara.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-1">
									<v-img contain height="25" src="/img/agregar.png"></v-img>
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
					<v-card-text
						v-else
						class="scroll"
						style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;"
					>
						<!-- burbujas asistente -->
						<template v-if="selected.assitant">
							<div class="text-center">
								hablaquí
							</div>
							<div
								class="mx-auto text-center headline font-weight-bold primary--text my-4"
								style="max-width: 320px"
							>
								Bienvenido al chat confidencial con el psicólogo
							</div>
							<v-divider
								class="mx-auto"
								style="width: 100px; border-color: #2070E5"
							></v-divider>
							<div class="my-10 mx-auto text-center body-2" style="max-width: 400px">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
								nonummy nibh euismod tincidunt ut laoreet dolore magna
							</div>
							<v-divider class="mx-auto" style="width: 300px;"></v-divider>
							<div
								class="my-5 mx-auto text-center body-2 text--disabled"
								style="max-width: 400px"
							>
								{{ setDate() }}
							</div>
							<div style="width: 50%; display: flex; justify-content: space-between">
								<span class="text--disabled">
									{{ selected.name }}
								</span>
								<span class="text--disabled">{{ setDate() }}</span>
							</div>
							<div class="talkbubble talkbubble__two" style="margin-top: 2px">
								<p style="body-2 max-height: 75px; overflow-y: auto">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
									diam nonummy nibh euismod tincidunt ut laoreet dolore magna
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
											sentBy(item.sentBy) ? 'justify-end' : 'justify-start'
										"
									>
										<div style="width: 50%">
											<div
												style="display: flex; justify-content: space-between"
											>
												<span
													v-if="sentBy(item.sentBy)"
													class="text--disabled body-2"
												>
													{{ user.name }}
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
													style="max-height: 75px; overflow-y: auto body-2"
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
							Lorem ipsum dolor sit amet, consectetuer adiVer terminos y condiciones
							de Chat
						</div>
						<div class="primary--text body-2 text-center">
							<a :href="`${landingUrl}/condiciones`" style="text-decoration: none">
								Ver terminos y condiciones de Chat
							</a>
						</div>
					</v-card-text>
					<v-card-text v-else style="flex: 0">
						<v-form @submit.prevent="onSubmit">
							<v-text-field
								ref="textField"
								outlined
								dense
								:label="`Mensaje a ${selected.name}`"
								hide-details
								v-model="message"
								:disabled="loadingMessage"
								:loader-height="3"
								:loading="loadingMessage"
							>
								<template #prepend-inner>
									<v-img src="/img/adjuntar.png" height="25" width="25"></v-img>
								</template>
								<template #append>
									<v-btn depressed icon>
										<v-img src="/img/voz.png" height="30" width="30"></v-img>
									</v-btn>
									<v-btn class="ml-2 mr-2" depressed icon type="submit">
										<v-img
											src="/img/message.png"
											height="30"
											width="30"
										></v-img>
									</v-btn>
								</template>
							</v-text-field>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import { landing } from '@/config';
import Pusher from 'pusher-js';

export default {
	components: {
		appbar: () => import('@/components/ui/AppbarProfile'),
		avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			loading: false,
			loadingMessage: false,
			loadingChat: false,
			selected: null,
			message: '',
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
		subHeader() {
			if (this.selected.assitant) return 'Asistente virtual';
			if (!this.selected.assitant && this.selected._id == this.user.psychologist)
				return 'Mi psicólogo';
			if (!this.selected.assitant && this.selected._id != this.user.psychologist)
				return 'Terapeuta de Hablaquí con licencia';
			return '';
		},
		usersFromChats() {
			return this.chats.map(item => ({
				...item.user,
				hasMessage: this.hasMessageUser(item.user),
			}));
		},
		landingUrl() {
			return landing;
		},
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			user: 'User/user',
			allPsychologists: 'Psychologist/psychologists',
		}),
	},
	created() {
		// PUSHER
		this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
			cluster: process.env.VUE_APP_PUSHER_CLUSTER,
		});
		this.pusher.connection.bind('update', function(err) {
			console.error(err);
		});
		this.channel = this.pusher.subscribe('chat');
		this.channel.bind('update', data => this.$emit('updateChat', data));
		this.$on('updateChat', async data => {
			if (
				data.content.sentBy !== this.user._id &&
				(this.user._id == data.userId || this.user.psychologist == data.psychologistId)
			) {
				this.pusherCallback(data);
			}
		});

		// SELECT DEFAULT
		this.selected = {
			name: 'Habi',
			assitant: true,
			avatar: '',
		};
	},
	async mounted() {
		moment.locale('es');

		await this.getMessages();
	},
	methods: {
		async pusherCallback(data) {
			if (this.selected._id == data.psychologistId) {
				await this.getChat(data.psychologistId);
				this.scrollToElement();
				await this.updateMessage(data.content._id);
				await this.getMessages();
			}
			await this.getMessages();
		},
		async onSubmit() {
			this.loadingMessage = true;
			if (!this.message) return;
			const payload = {
				payload: this.message,
				psychologistId:
					this.user.role == 'psychologist' ? this.user.psychologist : this.selected._id,
				userId: this.user.role == 'psychologist' ? this.selected._id : this.user._id,
			};
			await this.sendMessage(payload);
			this.message = '';
			this.loadingMessage = false;
			this.scrollToElement();
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
			return sentBy == this.user._id;
		},
		setSelectedUser(user) {
			this.selected = {
				name: user.name,
				lastName: user.lastName,
				avatar: user.avatar,
				_id: user._id,
			};
			this.setChat(this.chats.find(item => item.user._id == user._id));
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
		},
		async setSelectedPsy(psy) {
			// inicamos carga del seleccionado
			this.loadingChat = true;
			this.selected = psy;
			// obeteners chat del seleccciona
			await this.getChat(psy._id);
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
		async getAllPsy() {
			this.loading = true;
			await this.getPsychologists();
			this.loading = false;
		},
		hasMessage(psy) {
			let temp = {
				...this.chats.find(item => item.psychologist && item.psychologist._id == psy._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				temp = temp.messages[temp.messages.length - 1];
				if (temp && !temp.read && temp.sentBy !== this.user._id) return temp._id;
			}
		},
		hasMessageUser(user) {
			let temp = {
				...this.chats.find(item => item.user && item.user._id == user._id),
			};
			if (temp && temp.messages && temp.messages.length) {
				temp = temp.messages[temp.messages.length - 1];
				if (temp && !temp.read && temp.sentBy !== this.user._id) return temp._id;
			}
		},
		getPsy(id) {
			return this.psychologists.find(item => item._id == id);
		},
		...mapActions({
			getChat: 'Chat/getChat',
			sendMessage: 'Chat/sendMessage',
			getMessages: 'Chat/getMessages',
			updateMessage: 'Chat/updateMessage',
			startConversation: 'Chat/startConversation',
			getPsychologists: 'Psychologist/getPsychologists',
		}),
		...mapMutations({ setChat: 'Chat/setChat' }),
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
