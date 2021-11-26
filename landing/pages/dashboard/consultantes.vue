<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Consultantes" />
		<v-row align="start" style="overflow-y: auto">
			<v-expand-transition>
				<v-col v-if="selected" cols="12" class="mt-16 text-left">
					<v-btn small color="primary" outlined rounded @click="selected = null">
						<icon size="30" left :icon="mdiChevronLeft" color="primary"></icon>
						Regresar
					</v-btn>
				</v-col>
			</v-expand-transition>
			<v-expand-transition>
				<v-col v-if="selected" cols="12" class="d-flex algin-center">
					<v-expansion-panels accordion class="rounded-xl">
						<v-expansion-panel>
							<v-expansion-panel-header>
								<span style="flex: 2; align-self: center">
									<avatar
										size="40"
										:name="selected.name"
										:url="selected.avatarThumbnail"
									/>
									<span class="ml-4 secondary--text text-h6">
										{{ selected.name }}
										{{ selected.lastName ? selected.lastName : '' }}
									</span>
								</span>
								<span style="flex: 1" class="text-right">
									<v-tooltip bottom>
										<template #activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												icon
												:to="`chat?client=${selected._id}`"
												v-on="on"
											>
												<icon
													size="30"
													:icon="mdiChatProcessingOutline"
													color="primary"
												></icon>
											</v-btn>
										</template>
										<span>Chatear con {{ selected.name }}</span>
									</v-tooltip>
									<v-tooltip bottom>
										<template #activator="{ on, attrs }">
											<v-btn
												icon
												v-bind="attrs"
												:to="`agenda?dialog=${true}&client=${selected._id}`"
												v-on="on"
											>
												<icon
													size="30"
													:icon="mdiCalendarClockOutline"
													color="primary"
												></icon>
											</v-btn>
										</template>
										<span>Agregar sesión con {{ selected.name }}</span>
									</v-tooltip>
								</span>
								<template #actions>
									<v-btn icon>
										<icon
											size="30"
											:icon="mdiChevronDown"
											color="primary"
										></icon>
									</v-btn>
								</template>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-row>
									<v-col cols="12" sm="6">
										<v-text-field
											v-model="selected.name"
											disabled
											label="Nombre"
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											v-model="selected.lastName"
											label="Apellido"
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											v-model="selected.rut"
											label="Rut"
											dense
											filled
											outlined
										></v-text-field>
										<v-menu
											ref="menu"
											v-model="bmenu"
											:close-on-content-click="false"
											transition="scale-transition"
											offset-y
											min-width="auto"
										>
											<template #activator="{ on, attrs }">
												<v-text-field
													v-model="selected.birthDate"
													label="Fecha de nacimiento"
													readonly
													filled
													outlined
													dense
													v-bind="attrs"
													v-on="on"
												></v-text-field>
											</template>
											<v-date-picker
												v-model="selected.birthDate"
												locale="es"
												:active-picker.sync="activePicker"
												:max="
													new Date(
														Date.now() -
															new Date().getTimezoneOffset() * 60000
													)
														.toISOString()
														.substr(0, 10)
												"
												min="1950-01-01"
												@change="save"
											></v-date-picker>
										</v-menu>
										<v-text-field
											:value="
												selected.birthDate ? getAge(selected.birthDate) : ''
											"
											label="Edad"
											disabled
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											:value="
												selected.plan ? selected.plan.title : 'Sin plan'
											"
											label="Plan contratado"
											disabled
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											:value="
												selected.plan
													? `$${selected.plan.sessionPrice}`
													: 'Sin plan'
											"
											label="Valor por sesión"
											disabled
											dense
											filled
											outlined
										></v-text-field>
									</v-col>
									<v-divider class="hidden-sm-and-down" vertical></v-divider>
									<v-col cols="12" sm="6">
										<v-text-field
											v-model="selected.email"
											disabled
											label="Correo electrónico"
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											v-model="selected.direction"
											label="Direccion"
											dense
											filled
											outlined
										></v-text-field>
										<v-text-field
											v-model="selected.phone"
											label="Teléfono"
											dense
											filled
											outlined
										></v-text-field>
										<v-textarea
											v-model="selected.observation"
											label="Observaciones"
											dense
											filled
											outlined
											no-resize
										></v-textarea>
									</v-col>
									<v-col cols="12" class="text-right">
										<v-btn small color="primary" rounded @click="onSubmit">
											Guardar
										</v-btn>
									</v-col>
								</v-row>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
			</v-expand-transition>
			<v-expand-transition>
				<v-col v-if="selected" cols="12">
					<table-pagos
						:items="payments.filter(item => item.user === selected._id)"
					></table-pagos>
				</v-col>
			</v-expand-transition>
			<template v-if="!selected">
				<v-col cols="12" sm="6" md="4" class="mt-10">
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
					class="d-flex align-center justify-center justify-sm-start mt-sm-12"
					cols="12"
					sm="6"
					md="4"
				>
					<span class="pointer" @click="dialog = true">
						<v-btn fab depressed color="primary" style="width: 20px; height: 20px">
							<icon :icon="mdiPlus" color="white" small />
						</v-btn>
						<span class="primary--text ml-2"> Consultante nuevo </span>
					</span>
				</v-col>
			</template>
			<v-col cols="12" md="6">
				<v-alert prominent text color="info">
					<div
						style="color: #0079ff"
						class="text-center text-sm-left font-weight-medium pointer"
						@click="() => (dialogComission = true)"
					>
						Paga 0% de comisión con los consultantes nuevos que invites.
						<b>¡Sepa más!</b>
					</div>
				</v-alert>
			</v-col>
			<v-expand-transition>
				<v-col v-if="!selected" cols="12">
					<v-data-table
						:search="search"
						:loading="loading"
						:headers="headers"
						:items="items"
						item-key="_id"
						class="elevation-2"
						loading-text="Cargando..."
						:items-per-page="5"
						:footer-props="{
							'items-per-page-text': 'Consultantes por página',
						}"
						no-data-text="No hay consultantes"
						@click:row="setSelected"
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
				</v-col>
			</v-expand-transition>
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
						0% de comisión por clientes referidos por ti
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
						Nuestro objetivo es ampliar y potenciar su consulta mediante un entorno de
						trabajo automatizado y dinámico.
					</p>
					<p>
						Por ello, le animamos a liberarse de las cuatro paredes de su consulta
						atendiendo a todos sus clientes en Hablaquí. Ingresar a sus clientes es cosa
						de unos clics y lo mejor: cobramos 0% de comisión.
					</p>
					<p>
						Al llevar a sus clientes a la plataforma asegura organización y practicidad
						en sus actividades, además de optimizar sus tiempos y dinero. Concéntrese en
						atender a sus clientes y déjenos la burocracia a nosotros.
					</p>
					<h4 class="primary--text">Cómo hacerlo:</h4>
					<br />
					<ul style="list-style: none; padding: 0">
						<li>1. Vaya a la sección “Consultantes”</li>
						<li>2. Haga clic en “Consultante nuevo”</li>
						<li>3. Rellene los datos solicitados</li>
						<li>4. Haga clic en el botón “Agregar”</li>
						<li>
							5. Hecho, tu consultante ya está asociado a ti y no pagará más comisión
							a Hablaquí.
						</li>
					</ul>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
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
} from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import moment from 'moment';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		TablePagos: () => import('~/components/dashboard/TablePagos'),
		Avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	mixins: [validationMixin],
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
		selected: null,
		mdiChevronDown,
		mdiChevronLeft,
		dialogComission: false,
		loadingCreatedUser: false,
		dialog: false,
		activePicker: null,
		mdiClose,
		mdiMagnify,
		mdiPlus,
		mdiChatProcessingOutline,
		mdiCalendarClockOutline,
		bmenu: false,
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
		items() {
			return this.clients
				.map(item => ({
					...item,
				}))
				.sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
		},
		emailErrors() {
			const errors = [];
			if (!this.$v.form.email.$dirty) return errors;
			!this.$v.form.email.required && errors.push('Se requiere correo electrónico');
			!this.$v.form.email.email && errors.push('Escriba un correo electrónico valido');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('Se requiere rut');
			return errors;
		},
		...mapGetters({ clients: 'Psychologist/clients', payments: 'Psychologist/payments' }),
	},
	watch: {
		bmenu(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		},
	},
	created() {
		this.resetForm();
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async onSubmit() {
			this.loading = true;
			await this.updateOne({
				_id: this.selected._id,
				lastName: this.selected.lastName,
				rut: this.selected.rut,
				direction: this.selected.direction,
				birthDate: this.selected.birthDate,
				phone: this.selected.phone,
			});
			await this.updateSessions({
				_id: this.selected.sessionsId,
				observation: this.selected.observation,
			});
			this.loading = false;
		},
		async initFetch() {
			this.loading = true;
			await this.getClients(this.$auth.$state.user.psychologist);
			await this.getPayments();
			this.loading = false;
		},
		async submitUser() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.loadingCreatedUser = true;
				await this.registerUser(this.form);
				this.loadingCreatedUser = false;
				this.closeDialog();
				await this.initFetch();
			}
		},
		resetForm() {
			this.form = {
				name: '',
				rut: '',
				phone: '',
				email: '',
			};
		},
		setSelected(item) {
			this.selected = item;
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		closeDialog() {
			this.dialog = false;
			this.resetForm();
			this.$v.$reset();
		},
		getAge(date) {
			return moment().diff(date, 'years');
		},
		...mapActions({
			getClients: 'Psychologist/getClients',
			updateSessions: 'Psychologist/updateSessions',
			registerUser: 'User/registerUser',
			updateOne: 'User/updateOne',
			getPayments: 'Psychologist/getPayments',
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
		},
	},
};
</script>
