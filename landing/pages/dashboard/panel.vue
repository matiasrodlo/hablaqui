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
						@click="setSelected(item, false)"
					>
						{{ item.name }} {{ item.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
			<v-col class="text--secondary" cols="6">
				<v-list>
					<v-subheader>Psicologos</v-subheader>
					<v-list-item
						v-for="item in psychologists"
						:key="item._id"
						@click="setSelected(item, true)"
					>
						{{ item.name }} {{ item.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
		<v-dialog v-model="dialog" width="400" class="rounded-xl">
			<v-card v-if="selected" class="rounded-xl" min-height="400">
				<v-toolbar flat color="primary" class="white--text">
					{{ selected.name }} {{ selected.lastName }}
					<v-spacer></v-spacer>
					<v-btn text color="white">Actualizar</v-btn>
					<v-btn text color="white">Aprobar</v-btn>
				</v-toolbar>
				<v-card-text class="mt-3">
					<div>
						Correo:
						<v-text-field
							:value="selected.email"
							type="text"
							dense
							hide-details
							outlined
							:disabled="selected.isPsy"
							@input="e => (selected.email = e.target.value)"
						/>
						<br />
						Nombre:
						<v-text-field
							:value="selected.name"
							type="text"
							dense
							hide-details
							outlined
							:disabled="selected.isPsy"
							@input="e => (selected.name = e.target.value)"
						/>
						<br />
						Apellido:
						<v-text-field
							:value="selected.lastName"
							dense
							hide-details
							outlined
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.lastName = e.target.value)"
						/>
						<br />
						RUT:
						<v-text-field
							:value="selected.rut"
							dense
							hide-details
							outlined
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.rut = e.target.value)"
						/>
						<br />
						Genero:
						<v-select
							:items="['Hombre', 'Mujer', 'Transgénero']"
							:value="selected.gender"
							type="text"
							dense
							hide-details
							outlined
							:disabled="selected.isPsy"
							@input="e => (selected.gender = e.target.value)"
						/>
						<br />
						Comuna:
						<v-select
							class="d-inline-block"
							dense
							hide-details
							outlined
							:value="selected.comuna"
							:items="comunas"
							:disabled="selected.isPsy"
							@input="e => (selected.comuna = e.target.value)"
						/>
						<br />
						Region:
						<v-select
							class="d-inline-block"
							dense
							hide-details
							outlined
							:value="selected.region"
							:disabled="selected.isPsy"
							:items="regiones"
							@input="e => (selected.region = e.target.value)"
						/>
						<br />
						Cumpleaños:
						<input
							:value="selected.birthDate"
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.birthDate = e.target.value)"
						/><br />
						Linkedin:
						<input
							:value="selected.linkedin"
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.linkedin = e.target.value)"
						/><br />
						instagram:
						<input
							:value="selected.linkedin"
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.instagram = e.target.value)"
						/><br />
						username:
						<input
							:value="selected.username"
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected.username = e.target.value)"
						/><br />
						Especialidades: <br />
						<input
							v-for="(el, i) in selected.specialties"
							:key="i"
							:value="el"
							type="text"
							:disabled="selected.isPsy"
							@input="e => (selected[i].specialties = e.target.value)"
						/>
					</div>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Panel',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			dialog: false,
			items: [],
			psychologists: [],
			selected: null,
			comunasRegiones: [],
			regiones: [],
			comunas: [],
		};
	},
	watch: {
		'selected.region'(newVal) {
			this.comunas = this.comunasRegiones.find(item => item.region === newVal).comunas;
		},
	},
	async mounted() {
		const { recruitment } = await this.$axios.$get(`/recruitment`);
		this.items = recruitment;
		const { psychologists } = await this.$axios.$get('/psychologists/all');
		this.psychologists = psychologists;
		const response = await axios.get(`${this.$config.LANDING_URL}/comunas-regiones.json`);
		this.comunasRegiones = response.data;
		this.regiones = response.data.map(i => i.region);
	},
	methods: {
		setSelected(item, isPsy) {
			this.selected = { ...item, isPsy };
			this.dialog = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
