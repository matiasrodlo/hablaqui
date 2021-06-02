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
					<!-- chats psychologist -->
					<template v-if="user && user.role == 'psychologist'">
						<div style="flex: 1" class="d-flex justify-center align-center">
							<div class="text-center">
								<span class=" body-1 primary--text font-weight-bold">
									Comienza a hablar con nuestros psicólogos
								</span>
								<div class="mt-10 body-2">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
									diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								</div>
								<v-btn
									class="mt-10 px-8 py-6"
									color="primary"
									rounded
									@click="getPsy"
								>
									Buscar ahora
								</v-btn>
							</div>
						</div>
					</template>
					<!-- chats user -->
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
						<template v-if="psychologists.length">
							<v-card-text class="py-0">
								<v-subheader class="primary--text body-1 px-0">General</v-subheader>
								<v-divider style="border-color: #5EB3E4" class="mb-2"></v-divider>
							</v-card-text>
							<v-list two-line style="overflow-y: auto">
								<v-list-item
									v-for="psy in psychologists"
									:key="psy._id"
									@click="setSelected(psy)"
								>
									<v-list-item-avatar
										style="border: 3px solid #2070E5; border-radius: 40px; "
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
										@click="getPsy"
									>
										Buscar ahora
									</v-btn>
								</div>
							</div>
						</template>
					</template>
				</v-card>
			</v-col>
			<v-col cols="12" md="8" lg="9">
				<v-card
					style="height: calc(100vh - 135px); display: flex; flex-direction: column; border-radius: 15px"
				>
					<v-card-text style="flex: 0">
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
										{{ selected.name }}
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
									<v-img height="35" width="40" src="/img/llamada.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-8">
									<v-img height="35" width="50" src="/img/camara.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-6">
									<v-img height="35" width="40" src="/img/agregar.png"></v-img>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text
						v-if="loadingChat"
						style="flex: 1"
						class="d-flex justify-center align-center"
					>
						<v-progress-circular indeterminate color="primary" />
					</v-card-text>
					<v-card-text
						v-else
						style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;"
					>
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
								<span class="text--disabled">{{ selected.name }}</span>
								<span class="text--disabled">{{ setDate() }}</span>
							</div>
							<div class="talkbubble talkbubble__two" style="margin-top: 2px">
								<p style="body-2 max-height: 75px; overflow-y: auto">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
									diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								</p>
							</div>
						</template>
						<template v-else>
							<template v-for="(item, i) in chat.messages">
								<div
									:key="i"
									class="d-flex mt-3"
									:class="item.sentByUser ? 'justify-end' : 'justify-start'"
								>
									<div
										style="width: 50%; display: flex; justify-content: space-between"
									>
										<span class="text--disabled body-2">
											{{ item.sentByUser ? user.name : selected.name }}
										</span>
										<span class="text--disabled body-2">
											{{ setDate(item.createdAt) }}
										</span>
									</div>
								</div>
								<div
									:key="i"
									class="talkbubble"
									:class="item.sentByUser ? 'talkbubble__one' : 'talkbubble__two'"
								>
									<div style="max-height: 75px; overflow-y: auto body-2">
										{{ item.message }}
									</div>
								</div>
							</template>
						</template>
					</v-card-text>
					<v-card-text v-if="!selected.assitant" style="flex: 0">
						<v-form @submit.prevent="onSubmit">
							<v-textarea
								outlined
								rows="1"
								dense
								no-resize
								label="Mensaje a Juan"
								hide-details
								v-model="message"
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
							</v-textarea>
						</v-form>
					</v-card-text>
					<v-card-text v-else>
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
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import { landing } from '@/config';

export default {
	components: {
		appbar: () => import('@/components/ui/AppbarProfile'),
		avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			loading: false,
			loadingChat: false,
			selected: null,
			message: '',
		};
	},
	computed: {
		subHeader() {
			if (this.selected.assitant) return 'Asistente virtual';
			if (!this.selected.assitant && this.selected._id == this.user.psychologist)
				return 'Mi psicólogo';
			if (!this.selected.assitant && this.selected._id != this.user.psychologist)
				return 'Terapeuta de Hablaquí con licencia';
			return '';
		},
		landingUrl() {
			return landing;
		},
		...mapGetters({
			chat: 'Chat/chat',
			user: 'User/user',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	created() {
		this.selected = {
			name: 'Habi',
			assitant: true,
			avatar: '',
		};
	},
	mounted() {
		moment.locale('es');
		if (this.user.role == 'psychologist') {
			this.getMessages();
		}
	},
	methods: {
		async onSubmit() {
			await this.sendMessage({
				payload: this.message,
				psychologistId: this.selected._id,
				userId: this.user._id,
			});
			await this.getChat(this.selected._id);
			this.message = '';
		},
		setDate(time) {
			if (time) return moment(time).format('llll');
			return moment().format('llll');
		},
		async setSelected(psy) {
			this.selected = psy;
			this.loadingChat = true;
			await this.getChat(psy._id);
			this.loadingChat = false;
			if (!this.chat) this.startConversation(psy._id);
		},
		async getPsy() {
			this.loading = true;
			await this.getPsychologists();
			this.loading = false;
		},
		...mapActions({
			getChat: 'Chat/getChat',
			sendMessage: 'Chat/sendMessage',
			getMessages: 'Chat/getMessages',
			startConversation: 'Chat/startConversation',
			getPsychologists: 'Psychologist/getMessages',
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
