<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Panel de control" />
		<v-row style="height: calc(100vh - 110px); overflow-y: auto">
			<v-col class="text--secondary" cols="6">
				<v-list>
					<v-subheader>Postulados</v-subheader>
					<v-list-item
						v-for="item in items"
						:key="item._id"
						:disabled="loading"
						@click="setSelected(item, false)"
					>
						{{ item.name }} {{ item.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
			<v-col class="text--secondary" cols="6">
				<v-list>
					<v-subheader>Especialistas</v-subheader>
					<v-list-item
						v-for="item in specialists"
						:key="item._id"
						:disabled="loading"
						@click="setSelected(item, true)"
					>
						{{ item.name }} {{ item.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
		<v-dialog v-model="dialog" fullscreen>
			<v-card v-if="selected" max-width="1200px">
				<v-toolbar flat color="primary" class="white--text">
					<nuxt-link
						v-if="selected.isSpec"
						style="text-decoration: none; display: block"
						:to="{ path: `/${selected.username}` }"
					>
						<span class="body-2 font-weight-bold white--text">
							{{ selected.name }} {{ selected.lastName }}
						</span>
					</nuxt-link>
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="dialog = false">Cerrar</v-btn>
				</v-toolbar>
				<v-card-text class="mt-3">
					<v-row>
						<template v-if="selected.isSpec">
							<v-col cols="12">
								<a :href="selected.avatar" target="_blank">
									<avatar
										:url="selected.avatar"
										:name="selected.name"
										:last-name="selected.lastName ? selected.lastName : ''"
										size="100"
										loading-color="white"
										:loading="loadingAvatar"
									></avatar>
								</a>
								<div
									:class="
										selected.approveAvatar ? 'success--text' : 'warning--text'
									"
									class="font-weight-bold body-1"
								>
									{{
										selected.approveAvatar
											? 'Avatar aprobado'
											: 'Avatar a la esperade aprobación'
									}}
								</div>
								<label for="upload">
									<div
										class="elevation-1 pointer rounded cyan body-1 white--text text-center d-inline-block"
										style="width: 200px"
									>
										{{ loadingAvatar ? 'Subiendo...' : 'Subir nuevo avatar' }}
									</div>
								</label>
								<div
									class="d-inline-block elevation-1 pointer success rounded body-1 white--text text-center ml-2"
									style="width: 200px"
									@click="approveAvatar(selected._id)"
								>
									{{
										loadingApproveAvatar
											? 'Actualizando'
											: 'Aprobar Avatar actual'
									}}
								</div>
								<v-file-input
									id="upload"
									ref="avatar"
									class="d-none"
									dense
									filled
									hide-details
									accept="image/jpeg, image/png, image/gif, image/jpg"
									placeholder="Agrega un avatar"
									drop-placeholder="Arrastrar aqui..."
									@change="uploadAvatar"
								></v-file-input>
							</v-col>
						</template>
						<!--Switch para mostrar psicógolo en matchmaking, aparece solo si es un psicólogo verificado y su contenido se guarda en "switch1"-->
						<v-switch
							v-if="selected.isPsy"
							v-model="switch1"
							label="Mostrar Psicólogo en Matchmaking"
						>
						</v-switch>
						<!-- username -->
						<v-col cols="12">Username</v-col>
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							username
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								class="px-2"
								:value="selected.username"
								type="text"
								:disabled="selected.isSpec"
								@input="
									e => {
										selected.username = e.target.value;
										available = false;
									}
								"
							/>
						</v-col>
						<v-col v-if="!selected.isSpec" cols="4" class="py-2">
							<v-btn
								:color="available ? 'success' : 'warning'"
								small
								@click="checkusername"
							>
								Verificar
							</v-btn>
						</v-col>
						<!-- Monto -->
						<v-col cols="12">Monto a pagar</v-col>
						<v-col cols="2" class="bl br bb bt py-2 primary white--text"> Monto</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input class="px-2" :value="totalMount" type="text" :disabled="true" />
						</v-col>
						<v-col cols="4" class="py-2">
							<v-btn
								small
								:disabled="!selected.isSpec || sessionsToPay.length === 0"
								@click="setTransaction"
							>
								Pagar
							</v-btn>
						</v-col>
						<!-- Codigo -->
						<v-col cols="12">Codigo</v-col>
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">Codigo</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.code"
								type="text"
								@input="e => (selected.code = e.target.value)"
							/>
						</v-col>
						<v-col cols="12">Datos basicos</v-col>
						<!-- email -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text"> Email</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								class="px-2"
								:value="selected.email"
								type="text"
								:disabled="selected.isSpec"
								@input="e => (selected.email = e.target.value)"
							/>
						</v-col>
						<!-- rut -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text"> RUT</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								class="px-2"
								:value="selected.rut"
								type="text"
								:disabled="selected.isSpec"
								@input="e => (selected.rut = e.target.value)"
							/>
						</v-col>
						<!-- name -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text"> Nombre</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								class="px-2"
								:value="selected.name"
								type="text"
								@input="e => (selected.name = e.target.value)"
							/>
						</v-col>
						<!-- lastname -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Apellido
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								class="px-2"
								:value="selected.lastName"
								type="text"
								@input="e => (selected.lastName = e.target.value)"
							/>
						</v-col>
						<!-- gender -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Genero
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.gender"
								type="text"
								@change="e => (selected.gender = e.target.value)"
							>
								<option value="male">Hombre</option>
								<option value="female">Mujer</option>
								<option value="transgender">Transgénero</option>
							</select>
						</v-col>
						<!-- birthdate -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Cumpleaños
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.birthDate"
								type="text"
								@input="e => (selected.birthDate = e.target.value)"
							/>
						</v-col>
						<!-- instagram -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Instagram
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.instagram"
								type="text"
								@input="e => (selected.instagram = e.target.value)"
							/>
						</v-col>
						<!-- linkedin -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Linkedin
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.linkedin"
								type="text"
								@input="e => (selected.linkedin = e.target.value)"
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">Informacion</v-col>
						<!-- Informacion personal -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">Inf.personal</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<textarea v-model="selected.personalDescription" rows="3"></textarea>
						</v-col>
						<!-- linkedin -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">
								Inf.Profesional
							</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<textarea
								v-model="selected.professionalDescription"
								rows="3"
							></textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">Zona / Idiomas / Ubicación</v-col>
						<!-- Zona horaria -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">Zona horaria</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.timeZone"
								type="text"
								@change="e => (selected.timeZone = e.target.value)"
							>
								<option v-for="(item, i) in timezone" :key="i" :value="item">
									{{ item }}
								</option>
							</select>
						</v-col>
						<!-- Idiomas -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">Idiomas</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-0">
							<v-checkbox
								v-model="selected.languages"
								class="ma-0 d-inline-block"
								filled
								label="Español"
								value="spanish"
								outlined
								hide-details
							></v-checkbox>
							<v-checkbox
								v-model="selected.languages"
								class="ma-0 d-inline-block"
								filled
								value="english"
								label="Ingles"
								outlined
								hide-details
								dense
							></v-checkbox>
						</v-col>
						<!-- Región -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Región
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.region"
								type="text"
								@change="e => (selected.region = e.target.value)"
							>
								<template v-if="regiones.length">
									<option v-for="(item, i) in regiones" :key="i" :value="item">
										{{ item }}
									</option>
								</template>
							</select>
						</v-col>
						<!-- Comuna -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Comuna
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.comuna"
								type="text"
								@change="e => (selected.comuna = e.target.value)"
							>
								<template v-if="comunas.length">
									<option v-for="(item, i) in comunas" :key="i" :value="item">
										{{ item }}
									</option>
								</template>
							</select>
						</v-col>
					</v-row>
					<v-row v-if="selected.isSpec">
						<v-col cols="12">Datos Bancarios</v-col>
						<!-- bank data -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">Banco</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.paymentMethod.bank"
								type="text"
								@change="e => (selected.paymentMethod.bank = e.target.value)"
							>
								<option v-for="(item, i) in banks" :key="i" :value="item.nombre">
									{{ item.nombre }}
								</option>
							</select>
						</v-col>
						<!-- RUT del titular -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">RUT titular</div>
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.paymentMethod.rut"
								type="text"
								@input="e => (selected.paymentMethod.rut = e.target.value)"
							/>
						</v-col>
						<!-- Tipo de cuenta -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Tipo de cuenta
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<select
								:value="selected.paymentMethod.accountType"
								type="text"
								@change="e => (selected.paymentMethod.accountType = e.target.value)"
							>
								<option
									v-for="(item, i) in [
										'Cuenta vista',
										'Cuenta ahorro',
										'Cuenta corriente',
									]"
									:key="i"
									:value="item"
								>
									{{ item }}
								</option>
							</select>
						</v-col>
						<!-- Nombre completo del titular -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Nombre titular
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.paymentMethod.name"
								type="text"
								@input="e => (selected.paymentMethod.name = e.target.value)"
							/>
						</v-col>
						<!-- Número de cuenta -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Número de cuenta
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.paymentMethod.accountNumber"
								type="text"
								@input="
									e => (selected.paymentMethod.accountNumber = e.target.value)
								"
							/>
						</v-col>
						<!-- Email -->
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							Correo
						</v-col>
						<v-col cols="4" class="br bb bt py-2">
							<input
								:value="selected.paymentMethod.email"
								type="text"
								@input="e => (selected.paymentMethod.email = e.target.value)"
							/>
						</v-col>
					</v-row>
					<v-row>
						<!-- Especialidades -->
						<v-col cols="12">Especialidades</v-col>
						<v-col cols="2" class="bl br bb bt py-2 primary white--text">
							<div class="d-flex align-center" style="height: 100%">
								Especialidades
							</div>
						</v-col>
						<v-col cols="10" class="br bb bt py-0">
							<v-select
								v-model="selected.specialties"
								:loading="!specialties.length"
								solo
								flat
								dense
								chips
								small-chips
								multiple
								hide-details
								type="text"
								:items="specialties"
							></v-select>
						</v-col>
						<v-col cols="12">Experiencia</v-col>
						<!-- Experiencia -->
						<v-col cols="12" class="bl br bb bt py-2 primary">
							<v-row no-gutters align="center">
								<v-col cols="3">
									<div class="white--text font-weight-regular">Experiencia</div>
								</v-col>
								<v-col cols="3">
									<div class="white--text font-weight-regular">
										Lugar / Descripción
									</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Inicio</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Termino</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Acción</div>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12" class="br bb bt pa-0">
							<v-row
								v-for="(item, i) in selected.experience"
								:key="i"
								align="center"
								no-gutters
							>
								<v-col cols="3" class="bl br bb bt">
									<input
										class="px-2"
										:value="item.title"
										type="text"
										@input="
											e => (selected.experience[i].title = e.target.value)
										"
									/>
								</v-col>
								<v-col cols="3" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.place"
										@input="
											e => (selected.experience[i].place = e.target.value)
										"
									/>
								</v-col>
								<v-col cols="2" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.start"
										@input="
											e => (selected.experience[i].start = e.target.value)
										"
									/>
								</v-col>
								<v-col cols="2" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.end"
										@input="e => (selected.experience[i].end = e.target.value)"
									/>
								</v-col>
								<v-col cols="2" class="text-right text-sm-left">
									<v-btn
										v-if="i === selected.experience.length - 1"
										x-small
										color="primary"
										text
										depressed
										@click="newExperience"
									>
										<h1>+</h1>
									</v-btn>
									<v-btn
										v-if="
											i === selected.experience.length - 1 &&
											selected.experience.length - 1
										"
										x-small
										color="error"
										text
										depressed
										@click="
											() =>
												(selected.experience = selected.experience.filter(
													(el, index) => index !== i
												))
										"
									>
										<h1>-</h1>
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12">Formación</v-col>
						<!-- Experiencia -->
						<v-col cols="12" class="bl br bb bt py-2 primary">
							<v-row no-gutters align="center">
								<v-col cols="3">
									<div class="white--text font-weight-regular">Tipo</div>
								</v-col>
								<v-col cols="3">
									<div class="white--text font-weight-regular">
										Lugar / Descripción
									</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Inicio</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Termino</div>
								</v-col>
								<v-col cols="2">
									<div class="white--text font-weight-regular">Acción</div>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12" class="br bb bt pa-0">
							<v-row
								v-for="(item, i) in selected.formation"
								:key="i"
								align="center"
								no-gutters
							>
								<v-col cols="3" class="bl br bb bt">
									<select
										type="text"
										:value="item.formationType"
										@change="
											e =>
												(selected.formation[i].formationType =
													e.target.value)
										"
									>
										<option
											v-for="(el, k) in [
												'Licenciatura',
												'Diplomado',
												'Master',
												'Magister',
												'Doctorado',
												'Curso/especialización',
												'Otro',
											]"
											:key="k"
											class="px-2"
											:value="el"
										>
											{{ el }}
										</option>
									</select>
								</v-col>
								<v-col cols="3" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.description"
										@input="
											e =>
												(selected.formation[i].description = e.target.value)
										"
									/>
								</v-col>
								<v-col cols="2" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.start"
										@input="e => (selected.formation[i].start = e.target.value)"
									/>
								</v-col>
								<v-col cols="2" class="br bb bt">
									<input
										class="px-2"
										type="text"
										:value="item.end"
										@input="e => (selected.formation[i].end = e.target.value)"
									/>
								</v-col>
								<v-col cols="2" class="text-right text-sm-left">
									<v-btn
										v-if="i === selected.formation.length - 1"
										x-small
										color="primary"
										text
										depressed
										@click="newFormation"
									>
										<h1>+</h1>
									</v-btn>
									<v-btn
										v-if="
											i === selected.formation.length - 1 &&
											selected.formation.length - 1
										"
										x-small
										color="error"
										text
										depressed
										@click="
											() =>
												(selected.formation = selected.formation.filter(
													(el, index) => index !== i
												))
										"
									>
										<h1>-</h1>
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12">Horario</v-col>
						<v-col cols="12">
							<v-card>
								<v-card-text>
									<horario
										:specialist="specialist"
										:set-specialist="setSpecialist"
									/>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col cols="12">Tabla de Sesiones</v-col>
						<v-col cols="12">
							<v-card>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="sessions"
										:items-per-page="5"
										class="elevation-1"
									></v-data-table>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col v-if="!selected.isSpec" cols="12">
							¿Cuántos años llevas trabajando como especialista clínico?
							{{ selected.yearsExpSpecialist }}
							<br />
							¿Cuántos años ha visto pacientes en línea a través de consultas por
							video? {{ selected.yearsExpVideocalls }}
							<br />
							¿Cuál es el número promedio de paciente que ve semanalmente?
							{{ selected.avgPatients }}
							<br />¿Es la atención clínica su actividad exclusiva?
							{{ selected.isExclusiveActivity ? 'Si' : 'No' }}
							<br />
							¿Está actualmente bajo la supervisión clínica de otro profesional de la
							psicología? {{ selected.isUnderSupervision ? 'Si' : 'No' }} <br />
							¿Supervisa actualmente a otros especialistas?
							{{ selected.isSupervisor ? 'Si' : 'No' }}
						</v-col>
					</v-row>
				</v-card-text>
				<div
					v-if="!selected.isSpec"
					class="text-center warning--text font-weight-bold pb-2"
				>
					Recuerda antes de aprobar dar al boton actualizar y tambien recuerda verificar
					el username que este disponible
				</div>
				<v-card-actions class="pb-16">
					<v-spacer></v-spacer>
					<v-btn :loading="loadingSubmit" text color="primary" @click="submit">
						Actualizar
					</v-btn>
					<v-btn
						v-if="!selected.isSpec"
						:loading="loadingApprove"
						text
						color="primary"
						@click="approve"
					>
						Aprobar
					</v-btn>
					<v-btn
						v-if="selected.isSpec"
						:loading="loadingDelete"
						text
						color="error"
						@click="deleteSpec"
					>
						Eliminar
					</v-btn>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';

export default {
	name: 'Panel',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Avatar: () => import('~/components/Avatar'),
		Horario: () => import('~/components/dashboard/Horario'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			loadingApproveAvatar: false,
			loadingAvatar: false,
			dialog: false,
			items: [],
			specialists: [],
			selected: null,
			comunasRegiones: [],
			regiones: [],
			comunas: [],
			timezone: [],
			loadingSubmit: false,
			loadingApprove: false,
			loadingDelete: false,
			loading: true,
			available: false,
			banks: [],
			totalMount: 0,
			sessionsToPay: [],
			switch1: true,
			headers: [
				{ text: 'Consultante', value: '' },
				{ text: 'Psicólogo', value: '' },
				{ text: 'Fecha', value: '' },
				{ text: 'Teléfono usuario', value: '' },
				{ text: 'Email Consultante', value: '' },
				{ text: 'Email Psicólogo', value: '' },
				{ text: 'Estatus', value: '' },
			],
			sessions: [],
		};
	},
	computed: {
		specialist: {
			get() {
				return this.selected;
			},
			set(value) {
				this.setSpecialist(value);
			},
		},
		...mapGetters({ specialties: 'Appointments/specialties' }),
	},
	watch: {
		'selected.region'(newVal) {
			if (newVal)
				this.comunas = this.comunasRegiones.find(item => item.region === newVal).comunas;
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		setSpecialist(value) {
			this.specialist = value;
		},
		async initFetch() {
			await this.getRecruitments();
			await this.getSpecialist();
			let banks = await fetch(`${this.$config.LANDING_URL}/bancos.json`);
			banks = await banks.json();
			this.banks = banks;
			const response = await axios.get(`${this.$config.LANDING_URL}/comunas-regiones.json`);
			this.comunasRegiones = response.data;
			this.regiones = response.data.map(i => i.region);
			const { data } = await axios.get(`${this.$config.API_ABSOLUTE}/timezone.json`);
			this.timezone = data;
			await this.getAppointments();
			this.loading = false;
		},
		async getRecruitments() {
			const { recruitment } = await this.$axios.$get(`/recruitment`);
			this.items = recruitment.sort((a, b) => {
				const fa = a.name.toLowerCase();
				const fb = b.name.toLowerCase();

				if (fa < fb) {
					return -1;
				}
				if (fa > fb) {
					return 1;
				}
				return 0;
			});
		},
		async getSpecialist() {
			const { specialists } = await this.$axios.$get('/specialists/all');
			this.specialists = specialists.sort((a, b) => {
				const fa = a.name.toLowerCase();
				const fb = b.name.toLowerCase();

				if (fa < fb) {
					return -1;
				}
				if (fa > fb) {
					return 1;
				}
				return 0;
			});
			this.specialists = this.specialists.map(specialist => {
				const spec = specialist;
				if (!specialist.experience.length)
					spec.experience.push({ title: '', place: '', start: '', end: '' });
				if (!specialist.formation.length)
					spec.formation.push({
						formationType: '',
						description: '',
						start: '',
						end: '',
					});
				if (isEmpty(specialist.paymentMethod))
					specialist.paymentMethod = {
						bank: '',
						accountType: '',
						accountNumber: '',
						rut: '',
						name: '',
						email: '',
					};
				return spec;
			});
		},
		async approve() {
			await this.checkusername();
			if (!this.available) {
				this.loadingApprove = false;
				return alert('Username no disponible');
			}
			if (!confirm('Estas seguro de aprobar este postulado?'))
				return (this.loadingApprove = false);
			this.loadingApprove = true;
			if (this.selected.isSpec) return;
			await this.$axios(`/recruitment/approve/${this.selected.email}`, {
				method: 'post',
			});
			const { recruitment } = await this.$axios.$get(`/recruitment`);
			this.items = recruitment;
			const { specialists } = await this.$axios.$get('/specialists/all');
			this.specialists = specialists;
			this.loadingApprove = false;
			this.dialog = false;
		},
		async submit() {
			this.loadingSubmit = true;
			if (this.selected.isSpec) {
				await this.updateSpecialist(this.selected);
				const { specialists } = await this.$axios.$get('/specialists/all');
				this.specialists = specialists;
				// Endpoint encargado de actualizar visibilidad del psicólogo en el matchmaking
				await this.$axios.$put(
					`/dashboard/specialist-visibility/${this.selected._id}/${this.switch1}`
				);
			} else {
				await this.checkusername();
				if (!this.available) {
					this.loadingSubmit = false;
					return alert('Username no disponible');
				}
				await this.$axios('/recruitment/update', {
					method: 'put',
					data: this.selected,
				});
				const { recruitment } = await this.$axios.$get(`/recruitment`);
				this.items = recruitment;
			}
			this.loadingSubmit = false;
		},
		async deleteSpec() {
			if (confirm('Estas seguro de eliminar?')) {
				this.loadingDelete = true;
				this.specialists = await this.deleteSpecialist(this.selected._id);
				this.loadingDelete = false;
				this.dialog = false;
			}
		},
		async checkusername() {
			this.available = await this.checkUsername(this.selected.username);
		},
		async setSelected(item, isSpec) {
			this.selected = { ...item, isSpec };
			this.switch1 = this.selected.preferences.marketplaceVisibility;
			this.dialog = true;
		},
		newExperience() {
			this.selected.experience.push({ title: '', place: '', start: '', end: '' });
		},
		newFormation() {
			this.selected.formation.push({
				formationType: '',
				description: '',
				start: '',
				end: '',
			});
		},
		async uploadAvatar(file) {
			this.loadingAvatar = true;
			const { specialist } = await this.upateAvatar(this.setAvatarObject(file));
			const index = this.specialists.findIndex(element => element._id === specialist._id);
			this.specialists[index] = specialist;
			this.setSelected(
				{
					...this.selected,
					avatar: specialist.avatar,
					avatarThumbnail: specialist.avatarThumbnail,
					approveAvatar: specialist.approveAvatar,
				},
				true
			);
			this.loadingAvatar = false;
		},
		async approveAvatar(id) {
			this.loadingApproveAvatar = true;
			const specialist = await this.putApproveAvatar(id);
			const index = this.specialists.findIndex(element => element._id === specialist._id);
			this.specialists[index] = specialist;
			this.setSelected(
				{
					...this.selected,
					approveAvatar: specialist.approveAvatar,
				},
				true
			);
			this.loadingApproveAvatar = false;
		},
		setAvatarObject(file) {
			const avatar = new FormData();
			avatar.append('avatar', file);
			avatar.append('name', this.selected.name);
			avatar.append('lastName', this.selected.lastName);
			avatar.append('idSpecialist', this.selected._id.toString());
			avatar.append('oldAvatar', this.selected.avatar);
			avatar.append(
				'oldAvatarThumbnail',
				this.selected.avatarThumbnail ? this.selected.avatarThumbnail : ''
			);
			return avatar;
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
			setSpecialist: 'Specialist/setSpecialist',
		}),
		...mapActions({
			putApproveAvatar: 'Specialist/approveAvatar',
			checkUsername: 'Specialist/checkUsername',
			deleteSpecialist: 'Specialist/deleteSpecialist',
			getAppointments: 'Appointments/getAppointments',
			updateSpecialist: 'Specialist/updateSpecialist',
			upateAvatar: 'User/upateAvatar',
		}),
	},
};
</script>

<style lang="scss" scoped>
.bt {
	border-top: 1px solid rgb(197, 197, 197) !important;
}
.br {
	border-right: 1px solid rgb(197, 197, 197) !important;
}
.bb {
	border-bottom: 1px solid rgb(197, 197, 197) !important;
}
.bl {
	border-left: 1px solid rgb(197, 197, 197) !important;
}
textarea,
select,
input {
	outline: none;
	width: 100%;
}
</style>
