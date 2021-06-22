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
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					v-bind="attrs"
					v-on="on"
					fab
					color="primary"
					absolute
					class="open-button"
					width="80"
					height="80"
					@click="open"
				>
					<v-img width="80" height="80" src="/img/chat.png" contain></v-img>
				</v-btn>
			</template>
			<v-card width="400">
				<template v-if="selected">
					<v-card-text>
						<!-- cabecera -->
						<v-list-item class="px-0">
							<v-icon @click="selected = null" left>mdi-chevron-left</v-icon>
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
					<v-card-text
						v-if="loadingChat"
						style="height: 400px; overflow-y: auto;"
						class="d-flex justify-center align-center"
					>
						<v-progress-circular indeterminate color="primary" />
					</v-card-text>
					<v-card-text v-else ref="scrollToMe" style="height: 400px; overflow-y: auto;">
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
				</template>
				<template v-else>
					<v-card-title class="primary--text">
						Chat
					</v-card-title>
					<v-card-text>
						<v-text-field
							style="border-radius: 25px;"
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
						<v-list two-line style="height: 400px; overflow: auto">
							<v-list-item
								v-for="(psy, e) in psychologists"
								:key="e"
								@click="selectedPsy(psy)"
							>
								<v-list-item-avatar style="border-radius: 40px;" size="60">
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
				</template>
			</v-card>
		</v-menu>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

export default {
	components: {
		avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			menu: false,
			showChat: false,
			selected: null,
			loadingMessage: false,
			message: '',
			loadingChat: false,
		};
	},
	computed: {
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			user: 'User/user',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	async mounted() {
		moment.locale('es');
		await this.getMessages();
	},
	methods: {
		open() {
			this.showChat = true;
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
			return sentBy == this.user._id;
		},
		async selectedPsy(psy) {
			this.selected = psy;
			this.loadingChat = true;
			await this.getChat(psy._id);
			this.loadingChat = false;
			if (!this.chat) this.startConversation(psy._id);
			if (this.chat.messages.length) {
				const message = this.chat.messages[this.chat.messages.length - 1];
				if (message && !message.read) this.updateMessage(message._id);
			}
			setTimeout(() => {
				this.scrollToElement();
			}, 10);
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
					this.user.role == 'psychologist' ? this.user.psychologist : this.selected._id,
				userId: this.user.role == 'psychologist' ? this.selected._id : this.user._id,
			};
			await this.sendMessage(payload);
			this.message = '';
			this.loadingMessage = false;
			this.scrollToElement();
		},
		...mapActions({
			getChat: 'Chat/getChat',
			sendMessage: 'Chat/sendMessage',
			getMessages: 'Chat/getMessages',
			updateMessage: 'Chat/updateMessage',
			startConversation: 'Chat/startConversation',
			getPsychologists: 'Psychologist/getMessages',
		}),
		...mapMutations({ setChat: 'Chat/setChat' }),
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
