<template>
	<div>
		<card-onboarding
			v-if="step && step.title === 'Consultantes'"
			style="position: absolute; top: 320px; left: 10px; z-index: 3"
			arrow="arrow-left"
			:next="
				() => {
					setStepLinks(3);
					changeStateOnboarding();
					$router.push({ name: 'dashboard-perfil' });
					setStep(null);
				}
			"
		/>
		<v-container fluid style="height: 100vh; max-width: 1200px">
			<appbar class="hidden-sm-and-down" title="Consultantes" />
			<v-row align="start">
				<v-col cols="12" sm="6" md="4" class="hidden-sm-and-down mt-10">
					<v-text-field
						v-model="search"
						hide-details
						filled
						dense
						outlined
						single-line
						:append-icon="mdiMagnify"
						label="Nombre del consultante"
					/>
				</v-col>
				<v-col
					class="hidden-sm-and-down mt-sm-12"
					cols="12"
					sm="6"
					md="4"
					style="position: relative"
					:style="step && step.title === 'Consultante nuevo' ? 'z-index: 3' : ''"
				>
					<span
						v-if="
							$auth.$state.user.role === 'psychologist' &&
							$auth.$state.user.psychologist
						"
						class="pointer"
						@click="dialog = true"
					>
						<v-btn fab depressed color="primary" style="width: 20px; height: 20px">
							<icon :icon="mdiPlus" color="white" small />
						</v-btn>
						<span class="primary--text ml-2">Agendamiento manual</span>
					</span>
					<card-onboarding
						v-if="step && step.title === 'Consultante nuevo'"
						style="position: absolute; top: -40px; right: -25%; z-index: 3"
						arrow="arrow-left"
						:next="
							() => {
								setStep(null);
							}
						"
					/>
				</v-col>
				<v-col cols="12" md="6">
					<v-alert prominent text color="info">
						<div
							style="color: #0079ff"
							class="text-center text-sm-left font-weight-medium pointer"
							@click="() => (dialogComission = true)"
						>
							0% de comisión para consultantes invitados
							<b>¡Ver más!</b>
						</div>
					</v-alert>
				</v-col>
				<v-col cols="12">
					<v-data-table
						:loading="loading"
						:headers="headers"
						:items="items"
						item-key="_id"
						class="elevation-2 hidden-sm-and-down"
						loading-text="Cargando..."
						:items-per-page="5"
						:footer-props="{
							'items-per-page-text': 'Consultantes por página',
						}"
						no-data-text="No hay consultantes"
						@click:row="
							e => $router.push(`consultantes/consultante-seleccionado?id=${e._id}`)
						"
					>
						<template #[`item.name`]="{ item }">
							<div>
								<avatar size="30" :name="item.name" :url="item.avatarThumbnail" />
								<span class="ml-2 body-2">
									{{ item.name }}
									{{ item.lastName ? item.lastName : '' }}
								</span>
							</div>
						</template>
						<template #[`item.actions`]="{ item }">
							<div>
								<v-tooltip bottom>
									<template #activator="{ on, attrs }">
										<v-btn
											icon
											:to="`agenda?dialog=${true}&client=${item._id}`"
											v-bind="attrs"
											v-on="on"
										>
											<icon
												:icon="mdiCalendarClockOutline"
												small
												color="primary"
											></icon>
										</v-btn>
									</template>
									<span>Agendar sesión con {{ item.name }}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template #activator="{ on, attrs }">
										<v-btn
											icon
											:to="`chat?client=${item._id}`"
											v-bind="attrs"
											v-on="on"
										>
											<icon
												:icon="mdiChatProcessingOutline"
												small
												color="primary"
											></icon>
										</v-btn>
									</template>
									<span>Chatear con {{ item.name }}</span>
								</v-tooltip>
							</div>
						</template>
					</v-data-table>
					<v-row v-if="items.length">
						<v-col cols="9" class="hidden-md-and-up">
							<v-text-field
								v-model="search"
								hide-details
								filled
								dense
								outlined
								single-line
								:append-icon="mdiMagnify"
								label="Nombre del consultante"
							/>
						</v-col>
						<v-col cols="3" class="hidden-md-and-up">
							<v-btn small fab depressed color="primary" @click="dialog = true">
								<icon :icon="mdiPlus" color="white" small />
								<icon :icon="mdiAccount" color="white" small />
							</v-btn>
						</v-col>
					</v-row>
					<div v-if="!items.length" class="hidden-md-and-up">
						<v-skeleton-loader
							class="my-4 mx-auto"
							type="card-heading"
						></v-skeleton-loader>
						<v-skeleton-loader
							v-for="el in [1, 2, 3]"
							:key="el"
							class="my-4 mx-auto"
							height="60"
							type="image"
						></v-skeleton-loader>
					</div>
					<v-card
						v-for="item in items"
						:key="item._id"
						class="hidden-md-and-up my-4 elevation-4"
						@click="
							() =>
								$router.push(`consultantes/consultante-seleccionado?id=${item._id}`)
						"
					>
						<v-card-text>
							<div class="d-flex align-center justify-space-between">
								<div class="d-flex align-center">
									<avatar
										size="30"
										:name="item.name"
										:url="item.avatarThumbnail"
									/>
									<span class="d-inline-block ml-2 body-2">
										<span>
											{{ item.name }} {{ item.lastName ? item.lastName : '' }}
										</span>
										<div
											v-if="item.lastSession"
											class="secondary--text caption"
										>
											Última sesión {{ item.lastSession }}
										</div>
									</span>
								</div>
								<div>
									<v-tooltip bottom>
										<template #activator="{ on, attrs }">
											<v-btn
												icon
												:to="`agenda?dialog=${true}&client=${item._id}`"
												v-bind="attrs"
												v-on="on"
											>
												<icon
													:icon="mdiCalendarClockOutline"
													small
													color="primary"
												></icon>
											</v-btn>
										</template>
										<span>Agendar sesión con {{ item.name }}</span>
									</v-tooltip>
									<v-tooltip bottom>
										<template #activator="{ on, attrs }">
											<v-btn
												icon
												:to="`chat?client=${item._id}`"
												v-bind="attrs"
												v-on="on"
											>
												<icon
													:icon="mdiChatProcessingOutline"
													small
													color="primary"
												></icon>
											</v-btn>
										</template>
										<span>Chatear con {{ item.name }}</span>
									</v-tooltip>
								</div>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-dialog
				v-if="dialog"
				v-model="dialog"
				max-width="550"
				transition="dialog-top-transition"
				@click:outside="closeDialog"
			>
				<v-card width="550" rounded="lg">
					<v-card-text
						class="
							d-flex
							justify-space-between justify-center
							primary
							white--text
							text-h5
							py-3
						"
					>
						<div class="body-1 font-weight-bold pt-2">Consultante nuevo</div>
						<v-btn icon @click="closeDialog">
							<icon :icon="mdiClose" color="white" />
						</v-btn>
					</v-card-text>
					<v-card-text class="mt-4">
						<v-row>
							<v-col cols="12" sm="6">
								<v-text-field
									v-model="form.name"
									type="text"
									dense
									hide-details="auto"
									outlined
									label="Nombre"
									:error-messages="nameErrors"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field
									v-model="form.lastName"
									type="text"
									dense
									hide-details="auto"
									outlined
									label="Nombre"
									:error-messages="nameErrors"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field
									v-model="form.rut"
									type="text"
									dense
									hide-details="auto"
									outlined
									label="Rut"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field
									v-model="form.email"
									type="email"
									dense
									hide-details
									outlined
									label="email"
									:error-messages="emailErrors"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field
									v-model="form.phone"
									type="text"
									dense
									hide-details
									outlined
									prefix="+56"
									label="Teléfono"
								>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row justify="center">
							<v-col cols="12" class="text-center">
								<v-btn text @click="closeDialog"> Cancelar </v-btn>
								<v-btn
									:loading="loadingCreatedUser"
									rounded
									color="primary"
									@click="submitUser"
								>
									Agregar
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-dialog>
			<v-dialog
				v-if="dialogComission"
				v-model="dialogComission"
				max-width="650"
				transition="dialog-top-transition"
			>
				<v-card min-height="300" width="650" rounded="lg">
					<v-card-text class="d-flex align-center white--text text-center py-3">
						<div
							style="flex: 1"
							class="text-center text-h6 font-weight-bold pt-2 primary--text"
						>
							0% de comisión para consultantes invitados
						</div>
						<v-btn
							style="flex: 0"
							class="pr-4"
							icon
							@click="() => (dialogComission = false)"
						>
							<icon :icon="mdiClose" color="grey" />
						</v-btn>
					</v-card-text>
					<v-card-text class="pt-3">
						<p>
							Concéntrese en atender a sus consultantes y déjenos la burocracia a
							nosotros.
						</p>
						<p>
							El tiempo que gasta en agendar, confirmar su asistencia y cobrar, ahora
							lo podrá usar para enfocarse en tu carrera o simplemente ver Netflix.
						</p>
						<p>
							Ingresar a sus consultantes es muy simple y lo mejor: cobramos 0% de
							comisión. De esta forma estara asegurando organización y practicidad en
							sus actividades diarias, además de optimizar sus tiempos y dinero.
						</p>
						<h4 class="primary--text">¿Cómo hacerlo?</h4>
						<br />
						<ul style="list-style: none; padding: 0">
							<li>1. Vaya a la sección “Mi cuenta”</li>
							<li>2. Haga clic en “Copiar link”</li>
							<li>3. Comparta su link de pago</li>
						</ul>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-container>
	</div>
</template>

<script>
import {
	mdiMagnify,
	mdiPlus,
	mdiChatProcessingOutline,
	mdiClose,
	mdiCalendarClockOutline,
	mdiChevronLeft,
	mdiChevronDown,
	mdiAccount,
} from '@mdi/js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import moment from 'moment-timezone';
moment.tz.setDefault('America/Santiago');
/**
 * pagina principal de consultantes
 */
export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	mixins: [validationMixin],
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
		mdiChevronDown,
		mdiChevronLeft,
		dialogComission: false,
		loadingCreatedUser: false,
		dialog: false,
		mdiAccount,
		mdiClose,
		mdiMagnify,
		mdiPlus,
		mdiChatProcessingOutline,
		mdiCalendarClockOutline,
		search: '',
		headers: [
			{ text: 'Nombre', sortable: false, value: 'name' },
			{ text: 'Última sesión', value: 'lastSession', sortable: false },
			{ text: 'Acciones', value: 'actions', sortable: false },
		],
		loading: false,
		form: null,
	}),
	computed: {
		/**
		 * retorna los clientes filtrados y ordenados por fecha
		 */
		items() {
			return this.clients
				.filter(item => {
					// eslint-disable-next-line unicorn/prefer-includes
					return item.fullname.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
				})
				.sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
		},
		/**
		 * validacion de error de email
		 */
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		/**
		 * validacion de error de nombre
		 */
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('Se requiere nombre');
			return errors;
		},
		/**
		 * validacion de error de apellido
		 */
		lastNameErrors() {
			const errors = [];
			if (!this.$v.form.lastName.$dirty) return errors;
			!this.$v.form.lastName.required && errors.push('Se requiere apellido');
			return errors;
		},
		...mapGetters({ clients: 'Psychologist/clients', step: 'User/step' }),
	},
	watch: {
		/**
		 * listener para establecer el datepicker
		 */
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
	},
	created() {
		// limpia el formulario
		this.resetForm();
	},
	methods: {
		/**
		 * crea un usuario y vuelve a obtener los clientes
		 */
		async submitUser() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingCreatedUser = true;
				await this.registerUser(this.form);
				this.loadingCreatedUser = false;
				this.closeDialog();
				this.loading = true;
				await this.getClients(this.$auth.$state.user.psychologist);
				this.loading = false;
			}
		},
		/**
		 * resetea el formulario
		 */
		resetForm() {
			this.form = {
				name: '',
				lastName: '',
				rut: '',
				phone: '',
				email: '',
			};
		},
		/**
		 * utilizado por el datepicker
		 */
		save(date) {
			this.$refs.menu.save(date);
		},
		/**
		 * cierra el modal
		 */
		closeDialog() {
			this.dialog = false;
			this.resetForm();
			this.$v.$reset();
		},
		/**
		 * establece los años trancurridos segun la fecha pasada
		 */
		getAge(date) {
			return moment().diff(date, 'years');
		},
		/**
		 * cambia el estado del onboarding a true es decir realizado
		 */
		async changeStateOnboarding() {
			await this.updateOne({
				_id: this.$auth.$state.user._id,
				onboarding: true,
			});
			this.$auth.fetchUser();
		},
		...mapMutations({
			setOnBoarding: 'User/setOnBoarding',
			setStepLinks: 'User/setStepLinks',
			setStep: 'User/setStep',
		}),
		...mapActions({
			getClients: 'Psychologist/getClients',
			registerUser: 'User/registerUser',
			updateOne: 'User/updateOne',
		}),
	},
	validations: {
		form: {
			email: {
				required,
				email,
			},
			name: {
				required,
			},
			lastName: {
				required,
			},
		},
	},
};
</script>
