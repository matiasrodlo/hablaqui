<template>
	<div>
		<v-badge
			v-if="$vuetify.breakpoint.smAndDown"
			color="red"
			bordered
			offset-x="15"
			offset-y="15"
			dot
			:value="
				(getMyPsy && getMyPsy.countMessagesUnRead > 0) ||
				(psyFromChats && psyFromChats.some(item => item.countMessagesUnRead > 0))
			"
			class="open-button pointer"
		>
			<v-img
				accesskey="b"
				width="65"
				height="65"
				:src="`https://cdn.hablaqui.cl/static/icono_chat.png`"
				contain
				@click="dialog = true"
			>
			</v-img>
			<v-dialog v-model="dialog" fullscreen>
				<v-sheet>
					<chat
						ref="cardChat"
						style="height: 100vh"
						:set-search="e => (search = e)"
						:selected="selected"
						:chat="chat"
						:plan="plan"
						:get-my-psy="getMyPsy"
						:psy-from-chats="psyFromChats"
						:set-selected="e => (selected = e)"
						:selected-psy="e => selectedPsy(e)"
						:loading-chat="loadingChat"
						:search="search"
						:close="() => (dialog = false)"
						:socket="socket"
					/>
				</v-sheet>
			</v-dialog>
		</v-badge>
		<v-menu
			v-else
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
						(getMyPsy && getMyPsy.countMessagesUnRead > 0) ||
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
			<chat
				ref="cardChat"
				:set-search="e => (search = e)"
				:selected="selected"
				:chat="chat"
				:plan="plan"
				:get-my-psy="getMyPsy"
				:psy-from-chats="psyFromChats"
				:set-selected="e => (selected = e)"
				:selected-psy="e => selectedPsy(e)"
				:loading-chat="loadingChat"
				:search="search"
				:socket="socket"
			/>
		</v-menu>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment-timezone';
import { uniqBy } from 'lodash';
moment.tz.setDefault('America/Santiago');

/**
 * burbuja de chat
 */
export default {
	components: {
		Chat: () => import('~/components/chat/CardChat'),
	},
	data() {
		return {
			search: '',
			selected: null,
			loadingChat: false,
			channel: null,
		};
	},
	computed: {
		/**
		 * retorna un nuevo array de psicologos con las propiedades necesarias
		 */
		psychologists() {
			return this.allPsychologists.map(item => ({
				...item,
				hasMessage: this.hasMessage(item),
				countMessagesUnRead: this.setCountMessagesUnread(
					this.chats.find(chat => chat.psychologist._id === item._id)
				),
			}));
		},
		/**
		 * retorna los chats de un spsicologo
		 */
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

			filterArray = uniqBy(filterArray, function (e) {
				return e.psychologist._id;
			});

			return filterArray
				.map(item => ({
					...item.psychologist,
					countMessagesUnRead: this.setCountMessagesUnread(item),
					hasMessage: this.hasMessage(item.psychologist),
				}))
				.sort((a, b) => b.countMessagesUnRead - a.countMessagesUnRead);
		},
		/**
		 * propiedad que retorna si el chat se abre o no
		 */
		menu: {
			get() {
				return this.floatingChat;
			},
			set(value) {
				this.setFloatingChat(value);
			},
		},
		/**
		 * propiedad que retorna si el chat se abre o no
		 */
		dialog: {
			get() {
				return this.floatingChat;
			},
			set(value) {
				this.setFloatingChat(value);
			},
		},
		/**
		 * obtiene el psicologo del usuario
		 */
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
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			plan: 'User/plan',
			floatingChat: 'Chat/floatingChat',
			allPsychologists: 'Psychologist/psychologists',
			resumeView: 'Psychologist/resumeView',
		}),
	},
	watch: {
		/**
		 * listener si cambia la propiedad
		 */
		async floatingChat(newValue) {
			if (newValue && this.$route.query.chat) {
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
		// moment a esp
		moment.locale('es');
		// activa el socket io
		this.socket = this.$nuxtSocket({
			channel: '/liveData',
		});

		/* Listen for events: */
		this.socket.on('getMessage', data => {
			if (
				data.content.sentBy !== this.$auth.$state.user._id &&
				(this.$auth.$state.user._id === data.userId ||
					this.$auth.$state.user.psychologist === data.psychologistId)
			) {
				this.socketioCallback(data);
			}
		});
	},
	async mounted() {
		// si esta la vista resumen activa
		if (this.resumeView) {
			// si tenemos el id en los parametros buscamos el psi  y establecemos
			if (this.$route.params.id) {
				const psychologist = this.psychologists.find(
					item => item._id === this.$route.params.id
				);
				await this.selectedPsy(psychologist);
			}
		}
		// obtiene los mensajes
		await this.getMessages();
	},
	methods: {
		/**
		 * funcion que se activa con el socket io
		 */
		async socketioCallback(data) {
			if (
				(this.selected && this.selected._id === data.psychologistId) ||
				(this.selected && this.selected._id === data.userId)
			) {
				await this.getChat({ psy: data.psychologistId, user: data.userId });
				this.$refs.cardChat.scrollToElement();
				await this.updateMessage(data._id);
			}
			await this.getMessages();
		},
		/**
		 * reestablece el chat luego de 200ms
		 */
		resetChat() {
			setTimeout(() => {
				if (this.selected) this.selected = null;
			}, 200);
		},
		/**
		 * selecciona e psicolog
		 */
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
				this.$refs.cardChat.scrollToElement();
			}, 10);
			// si no el usuario no tiene una conversation enviamos una intention de chat para notificar el pys
			if (!this.chat) await this.startConversation(psy._id);
			// Si ya tiene un chat con el psy, marcamos mensaje como Leído y actualizamos el psy
			if (psy.countMessagesUnRead) {
				await this.updateMessage(psy.hasMessage);
				await this.getMessages();
			}
		},
		/**
		 * verdadero si tienes mensajes sin leer
		 */
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
		/**
		 * conteo de los mensajes no leidos
		 */
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
		/**
		 * busca y retorna un psicologo segun el id
		 */
		getPsy(id) {
			return this.psychologists.find(item => item._id === id);
		},
		...mapActions({
			getChat: 'Chat/getChat',
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

.open-button:hover {
	opacity: 1;
}
</style>
