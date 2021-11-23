<template>
	<v-container fluid style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Consultantes" />
		<v-row align="start" style="overflow-y: auto">
			<v-col cols="8" md="4">
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
			<v-col class="d-flex align-center mt-2" cols="4">
				<span class="pointer" @click="dialog = true">
					<v-btn fab depressed color="primary" style="width: 20px; height: 20px">
						<icon :icon="mdiPlus" color="white" small />
					</v-btn>
					<span class="primary--text ml-2"> Consultante nuevo </span>
				</span>
			</v-col>
			<v-col cols="12" md="6">
				<v-alert prominent text color="info">
					<div
						style="color: #0079ff"
						class="font-weight-medium pointer"
						@click="() => (dialogComission = true)"
					>
						Paga 0% de comisión con los consultantes nuevos que invites.
						<b>¡Sepa más!</b>
					</div>
				</v-alert>
			</v-col>
			<v-expand-transition>
				<v-col v-if="selected" cols="12" class="d-flex algin-center">
					<span style="flex: 2; align-self: center">
						<avatar size="70" :name="selected.name" :url="selected.avatarThumbnail" />
						<span class="ml-4 secondary--text text-h6">{{ selected.fullname }}</span>
					</span>
					<span style="flex: 1" class="text-right">
						<v-btn icon>
							<icon size="30" :icon="mdiCalendar" color="primary"></icon>
						</v-btn>
						<v-btn icon>
							<icon size="30" :icon="mdiChat" color="primary"></icon>
						</v-btn>
					</span>
				</v-col>
			</v-expand-transition>
			<v-expand-transition>
				<v-col v-if="selected" cols="12" class="d-flex algin-center">
					<v-expansion-panels accordion class="rounded-xl">
						<v-expansion-panel>
							<v-expansion-panel-header>
								<span class="text-h6 secondary--text">Datos del consultante</span>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-divider class="mx-auto"></v-divider>
								<v-row>
									<v-col cols="4" class="pt-14 body-2 secondary--text">
										<div class="font-weight-bold">Información personal</div>
										<div class="pt-4 d-flex">
											<span style="flex: 1">Nombres:</span>
											<span style="flex: 1" class="text-right">
												{{ selected.name }}
											</span>
										</div>
										<div class="pt-1 d-flex">
											<span style="flex: 1">Apellidos:</span>
											<span style="flex: 1" class="text-right">
												{{ selected.lastName }}
											</span>
										</div>
										<div class="pt-1 d-flex">
											<span style="flex: 1">Rut:</span>
											<span style="flex: 1" class="text-right">
												{{ selected.rut }}
											</span>
										</div>
										<div class="pt-1 d-flex">
											<span style="flex: 1">Plan contratado:</span>
											<span style="flex: 1" class="text-right">
												{{
													selected.plan ? selected.plan.title : 'Sin plan'
												}}
											</span>
										</div>
										<div class="pt-1 d-flex">
											<span style="flex: 1">Valor por sesión:</span>
											<span style="flex: 1" class="text-right">
												{{
													selected.plan
														? `$${selected.plan.sessionPrice}`
														: 'Sin plan'
												}}
											</span>
										</div>
									</v-col>
									<v-col><v-divider vertical class="pa-0"></v-divider></v-col>
									<v-col cols="7" class="pt-14 body-2 secondary--text">
										<div class="secondary--text body-2 font-weight-bold">
											Contácto
										</div>
										<div class="pt-4 d-flex">
											<span style="flex: 1">Email:</span>
											<span style="flex: 1" class="text-right">
												{{ selected.email }}
											</span>
										</div>
										<div class="pt-1 d-flex">
											<span style="flex: 1">Teléfono:</span>
											<span style="flex: 1" class="text-right">
												{{ selected.phone }}
											</span>
										</div>
									</v-col>
								</v-row>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
			</v-expand-transition>
			<v-col cols="12">
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
							<span class="ml-2 body-2">{{ item.fullname }}</span>
						</div>
					</template>
					<template #[`item.actions`]="{ item }">
						<div>
							<v-btn icon :to="`agenda?dialog=${true}&client=${item._id}`">
								<icon :icon="mdiCalendar" small color="primary"></icon>
							</v-btn>
							<v-btn icon :to="`chat?client=${item._id}`">
								<icon :icon="mdiChat" small color="primary"></icon>
							</v-btn>
						</div>
					</template>
				</v-data-table>
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
						<v-col cols="6">
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
						<v-col cols="6">
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
						<v-col cols="6">
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
						<v-col cols="6">
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
						<v-col cols="6">
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
import { mdiMagnify, mdiPlus, mdiChat, mdiClose, mdiCalendar } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import moment from 'moment';

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
		selected: null,
		dialogComission: false,
		loadingCreatedUser: false,
		dialog: false,
		mdiClose,
		mdiMagnify,
		mdiPlus,
		mdiChat,
		mdiCalendar,
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
					avatar: item.avatar,
					name: `${item.name} ${item.lastName ? item.lastName : ''}`,
					lastSession: item.lastSession,
					status: item.status,
					_id: item._id,
					createdAt: item.createdAt,
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
		...mapGetters({ clients: 'Psychologist/clients' }),
	},
	created() {
		this.resetForm();
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			this.loading = true;
			await this.getClients(this.$auth.$state.user.psychologist);
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
		closeDialog() {
			this.dialog = false;
			this.resetForm();
			this.$v.$reset();
		},
		...mapActions({
			getClients: 'Psychologist/getClients',
			registerUser: 'User/registerUser',
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

<style scoped></style>
