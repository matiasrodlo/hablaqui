<template>
	<v-card width="400">
		<div
			v-if="selected"
			class="d-flex"
			style="flex-direction: column"
			:style="$vuetify.breakpoint.smAndDown ? 'height: 100vh' : 'height: 580px'"
		>
			<v-card-text style="flex: 0" class="px-1 py-1">
				<!-- cabecera -->
				<v-list-item class="pl-0">
					<v-btn icon @click="setSelected(null)">
						<icon :icon="mdiChevronLeft" />
					</v-btn>
					<v-list-item-avatar size="50">
						<nuxt-link
							:to="{ name: 'dashboard-perfil' }"
							style="text-decoration: none; height: 40px; height: 40px"
						>
							<avatar :url="selected.avatar" size="40" :name="selected.name" />
						</nuxt-link>
					</v-list-item-avatar>
					<v-list-item-title class="subtitle-1 font-weight-bold d-flex ml-2">
						<nuxt-link :to="`/${selected.username}`" style="text-decoration: none">
							<span class="secondary--text">
								{{ selected.shortName || selected.name }}
							</span>
							<span v-if="selected.lastName" class="secondary--text">
								{{ selected.lastName }}
							</span>
						</nuxt-link>
					</v-list-item-title>
					<v-list-item-action>
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
					</v-list-item-action>
				</v-list-item>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text
				v-if="loadingChat"
				style="flex: 1; overflow-y: auto"
				class="d-flex justify-center align-center"
			>
				<v-progress-circular indeterminate color="primary" />
			</v-card-text>
			<v-card-text
				v-else
				ref="scrollToMe"
				style="flex: 1; overflow-y: auto; overflow-x: none"
			>
				<!-- Burbujas de chat -->
				<template v-if="chat && chat.messages && chat.messages.length">
					<div v-for="item in chat.messages" :key="item._id">
						<div
							class="d-flex mt-3"
							:class="sentBy(item.sentBy) ? 'justify-end' : 'justify-start'"
						>
							<div style="width: 50%">
								<div style="display: flex; justify-content: space-between">
									<span v-if="sentBy(item.sentBy)" class="text--disabled body-2">
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
										sentBy(item.sentBy) ? 'talkbubble__one' : 'talkbubble__two'
									"
								>
									<div style="max-height: 75px; overflow-y: auto" class="body-2">
										{{ item.message }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</v-card-text>
			<v-card-text style="flex: 0">
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
						<template #append>
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
		</div>
		<div
			v-else
			class="d-flex"
			style="flex-direction: column"
			:style="$vuetify.breakpoint.smAndDown ? 'height: 100vh' : 'height: 580px'"
		>
			<v-card-title style="flex: 0" class="primary--text d-flex justify-space-between">
				Chat
				<v-btn icon @click="close">
					<icon v-if="$vuetify.breakpoint.smAndDown" :icon="mdiCloseCircle" />
				</v-btn>
			</v-card-title>
			<v-card-text style="flex: 0">
				<v-text-field
					:value="search"
					style="border-radius: 25px"
					hide-details
					filled
					full-width
					dense
					outlined
					single-line
					:append-icon="mdiMagnify"
					label="Buscar"
					@input="e => setSearch(e)"
				/>
			</v-card-text>
			<!-- todos los psicologos -->
			<template v-if="psyFromChats.length">
				<v-card-text style="flex: 0" class="py-0">
					<v-subheader class="primary--text body-1 px-0">Psicólogos</v-subheader>
					<v-divider style="border-color: #5eb3e4" class="mb-2"></v-divider>
				</v-card-text>
				<v-list style="flex: 1; overflow: auto" two-line>
					<!-- mi psicologo -->
					<template v-if="$auth.$state.user.role === 'user' && plan && !search">
						<v-list-item @click="selectedPsy(getMyPsy)">
							<v-list-item-avatar
								style="border-radius: 50%"
								:style="getMyPsy.hasMessage ? 'border: 3px solid #2070E5' : ''"
								size="50"
							>
								<avatar :url="getMyPsy.avatar" :name="getMyPsy.name" size="50" />
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title v-html="getMyPsy.name"></v-list-item-title>
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
							<v-list-item-subtitle> Psicólogo · Activo(a) </v-list-item-subtitle>
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
				<div class="d-flex justify-center align-center" style="flex: 1">
					<div class="text-center pa-4" style="max-width: 300px">
						<span class="body-1 primary--text font-weight-bold">
							Comienza a hablar con nuestros psicólogos
						</span>
						<div class="mt-5 body-2">
							Orientación psicológica en cualquier momento y lugar. Comienza a mejorar
							tu vida hoy.
						</div>
						<v-btn class="mt-5 px-8" color="primary" rounded to="/psicologos">
							Buscar ahora
						</v-btn>
					</div>
				</div>
			</template>
		</div>
	</v-card>
</template>

<script>
import { mdiChevronLeft, mdiMagnify, mdiCloseCircle } from '@mdi/js';
import moment from 'moment';
import { mapActions } from 'vuex';

export default {
	components: {
		avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	props: {
		search: {
			type: String,
			default: '',
		},
		setSearch: {
			type: Function,
			required: true,
		},
		setSelected: {
			type: Function,
			required: true,
		},
		selectedPsy: {
			type: Function,
			required: true,
		},
		loadingChat: {
			type: Boolean,
			default: false,
		},
		selected: {
			type: Object,
			default: null,
		},
		chat: {
			type: Object,
			default: null,
		},
		plan: {
			type: Object,
			default: null,
		},
		getMyPsy: {
			type: Object,
			default: null,
		},
		psyFromChats: {
			type: Array,
			default: () => [],
		},
		close: {
			type: Function,
			default: () => null,
		},
	},
	data() {
		return {
			mdiChevronLeft,
			mdiMagnify,
			mdiCloseCircle,
			message: '',
			loadingMessage: false,
		};
	},
	created() {
		moment.locale('es');
	},
	methods: {
		setDate(time) {
			if (time) return moment(time).calendar();
			return moment().format('llll');
		},
		sentBy(sentBy) {
			return sentBy === this.$auth.$state.user._id;
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
		...mapActions({
			sendMessage: 'Chat/sendMessage',
		}),
	},
};
</script>

<style lang="scss" scoped>
$color__one: #bdbdbd;
$color__two: #2070e5;
$font__color_one: #424242;
$font__color_two: #ffffff;

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
.v-text-field--filled:not {
	margin-top: 0 !important;
}
</style>
