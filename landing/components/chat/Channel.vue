<template>
	<v-card
		elevation="6"
		style="display: flex; flex-direction: column"
		:style="!$vuetify.breakpoint.smAndDown && 'border-radius: 15px'"
	>
		<v-card-text style="flex: 0">
			<!-- cabecera -->
			<v-list-item class="px-0">
				<v-btn class="hidden-md-and-up" icon @click="close">
					<icon size="30" :icon="mdiChevronLeft" />
				</v-btn>
				<v-list-item-avatar size="50">
					<avatar :url="selected.avatar" size="50" :name="selected.name" />
				</v-list-item-avatar>
				<v-list-item-title class="pl-3 title d-flex">
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
				<div v-show="!selected.assistant" style="min-width: 150px" class="text-right">
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
					<v-btn v-if="false" id="addheader" icon>
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
		<v-card-text v-if="loadingChat" style="flex: 1" class="d-flex justify-center align-center">
			<v-progress-circular indeterminate color="primary" />
		</v-card-text>
		<template v-else>
			<v-card-text
				ref="scroll"
				class="scroll"
				style="flex: 1; display: flex; flex-direction: column; overflow-y: auto"
			>
				<!-- burbujas asistente -->
				<template v-if="selected.assistant">
					<div class="text-center">hablaquí</div>
					<div
						class="mx-auto text-center headline font-weight-bold primary--text my-4"
						style="max-width: 320px"
					>
						Bienvenido al chat confidencial
						{{ $auth.$state.user.role === 'user' ? 'con el psicólogo' : '' }}
					</div>
					<v-divider
						class="mx-auto mb-10"
						style="width: 100px; border-color: #2070e5"
					></v-divider>
					<div style="width: 50%; display: flex; justify-content: space-between">
						<span class="text--disabled">
							{{ selected.name }}
						</span>
						<span class="text--disabled">{{ setDate() }}</span>
					</div>
					<div class="talkbubble talkbubble__two" style="margin-top: 2px">
						<p class="body-2">
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
										<div class="body-2">
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
					Hablaquí valora la privacidad. No compartiremos tus mensajes, ni tampoco ningún
					dato personal.
				</div>
				<div class="primary--text body-2 text-center">
					<nuxt-link target="_blank" to="/condiciones" style="text-decoration: none">
						Ver terminos y condiciones de Chat
					</nuxt-link>
				</div>
			</v-card-text>
			<v-card-text v-else style="flex: 0" class="pb-0">
				<v-form @submit.prevent="onSubmit">
					<v-textarea
						ref="messagechat"
						v-model.trim="message"
						outlined
						dense
						:label="`Mensaje a ${selected.name}`"
						:disabled="loadingMessage"
						:loader-height="3"
						:loading="loadingMessage"
						no-resize
						:rows="row"
						hint="Shift + enter para enviar"
						:auto-grow="grow"
						@keydown="e => setGrow(e)"
						@keypress.shift.enter="onSubmit"
						@input="
							() => {
								scrollToElement();
							}
						"
					>
						<template #append>
							<v-btn
								class="pl-2 pr-2 pb-2"
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
					</v-textarea>
				</v-form>
			</v-card-text>
		</template>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { mdiChevronLeft } from '@mdi/js';
import moment from 'moment';
import { isEmpty } from 'lodash';

export default {
	components: {
		Icon: () => import('~/components/Icon'),
	},
	props: {
		selected: {
			type: Object,
			default: null,
		},
		chat: {
			type: Object,
			default: null,
		},
		scrollToElement: {
			type: Function,
			required: true,
		},
		loadingChat: {
			type: Boolean,
			required: false,
		},
		subHeader: {
			type: String,
			default: '',
		},
		close: {
			type: Function,
			default: () => null,
		},
	},
	data() {
		return {
			message: '',
			loadingMessage: false,
			mdiChevronLeft,
			grow: true,
			row: 1,
		};
	},
	methods: {
		async onSubmit() {
			if (isEmpty(this.message)) return;
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
			this.loadingMessage = false;
			this.$nextTick(() => this.$refs.messagechat.focus());
			this.row = 1;
			this.scrollToElement();
		},
		sentBy(sentBy) {
			return sentBy === this.$auth.$state.user._id;
		},
		setDate(time) {
			if (time) return moment(time).calendar();
			return moment().format('llll');
		},
		setGrow(e) {
			const height = parseInt(e.target.style.height.replace('px', ''));
			this.grow = height < 140;
		},
		...mapActions({
			sendMessage: 'Chat/sendMessage',
		}),
	},
};
</script>

<style lang="scss" scoped>
$color__one: rgba(189, 189, 189, 1);
$color__two: rgba(32, 112, 229, 1);
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
		border: solid rgba(32, 112, 229, 1);
		background: $color__two;
	}

	&__two {
		color: $font__color_one;
		align-self: flex-start;
		border: solid rgba(189, 189, 189, 1);
		background: $color__one;
	}
}
</style>
