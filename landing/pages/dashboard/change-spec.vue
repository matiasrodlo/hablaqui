<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Cambio de especialista" />
		<v-row>
			<v-col cols="6">
				<v-card>
					<v-card-title> Especialista actual </v-card-title>
					<v-data-table :headers="headers" :items="specialists" @click:row="getClients" />
				</v-card>
			</v-col>
			<v-spacer />
			<v-col cols="6">
				<v-card>
					<v-card-title> Consultante </v-card-title>
					<v-data-table :headers="headers" :items="clients" @click:row="selectClient" />
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="6">
				<v-card>
					<v-card-title> Especialista Nuevo </v-card-title>
					<v-data-table
						:headers="headers"
						:items="specialists"
						@click:row="selectNewSpec"
					/>
				</v-card>
			</v-col>
			<v-col cols="6">
				<v-card>
					<v-card-title> Cambio de especialista </v-card-title>
					<div class="pa-5">
						Especialista actual:
						<span v-if="selectedSpec">{{
							selectedSpec.name + ' ' + selectedSpec.lastName
						}}</span>
					</div>
					<div class="pa-5">
						Consultante:
						<span v-if="selectedClient">{{
							selectedClient.name + ' ' + selectedClient.lastName
						}}</span>
					</div>
					<div class="pa-5">
						Especialista nuevo:
						<span v-if="selectedNewSpec">{{
							selectedNewSpec.name + ' ' + selectedNewSpec.lastName
						}}</span>
					</div>
					<v-card-actions>
						<v-spacer />
						<div>
							<v-btn
								class="primary"
								:disabled="!selectedClient || !selectedSpec || !selectedNewSpec"
								@click="change"
								>Realizar Cambio</v-btn
							>
						</div>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
/**
 * Cambio de psicologo
 */
export default {
	name: 'ChangePsy',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			userId: '',
			currentSpecId: '',
			newSpecId: '',
			specialists: [],
			clients: [],
			selectedClient: null,
			selectedSpec: null,
			selectedNewSpec: null,
			loadingChange: false,
			headers: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Apellido', value: 'lastName' },
				{ text: 'Correo', value: 'email' },
			],
		};
	},
	mounted() {
		/**
		 * inicial fetch datas
		 */
		this.initFetch();
	},
	methods: {
		/**
		 * Obtenemos los datos iniciales
		 */
		async initFetch() {
			await this.getSpecialist();
		},
		/**
		 * Obtenermos los psicologos todos
		 */
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
		},
		/**
		 * Obtenemos los clientes del psicologo seleccionado
		 */
		async getClients(row) {
			this.selectedSpec = row;
			const { users } = await this.$axios.$get(`/specialist/clients/${row._id}`);
			this.clients = users.filter(user => !!user.plan);
		},
		/**
		 * Cliente seleccionado
		 */
		selectClient(row) {
			this.selectedClient = row;
		},
		/**
		 * spec seleccionado
		 */
		selectNewSpec(row) {
			this.selectedNewSpec = row;
		},
		/**
		 * Actualizar psy in user
		 */
		async change() {
			try {
				this.loadingChange = true;
				const { data } = await this.$axios(`/dashboard/update/specialist`, {
					method: 'PUT',
					data: {
						newSpecialist: this.selectedNewSpec._id,
						oldSpecialist: this.selectedSpec._id,
						user: this.selectedClient._id,
					},
				});
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			} finally {
				this.loadingChange = false;
			}
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>
