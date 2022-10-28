<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Cambio de psicologo" />
		<v-row>
			<v-col cols="6">
				<v-card>
					<v-card-title> Psicologo actual </v-card-title>
					<v-data-table
						:headers="headers"
						:items="psychologists"
						@click:row="getClients"
					/>
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
					<v-card-title> Psicologo Nuevo </v-card-title>
					<v-data-table
						:headers="headers"
						:items="psychologists"
						@click:row="selectNewPsy"
					/>
				</v-card>
			</v-col>
			<v-col cols="6">
				<v-card>
					<v-card-title> Cambio de psicologo </v-card-title>
					<div class="pa-5">
						Psicologo actual:
						<span v-if="selectedPsy">{{
							selectedPsy.name + ' ' + selectedPsy.lastName
						}}</span>
					</div>

					<div class="pa-5">
						Consultante:
						<span v-if="selectedClient">{{
							selectedClient.name + ' ' + selectedClient.lastName
						}}</span>
					</div>
					<div class="pa-5">
						Psicologo nuevo:
						<span v-if="selectedNewPsy">{{
							selectedNewPsy.name + ' ' + selectedNewPsy.lastName
						}}</span>
					</div>
					<v-card-actions>
						<v-spacer />
						<div>
							<v-btn
								class="primary"
								:disabled="!selectedClient || !selectedPsy || !selectedNewPsy"
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
export default {
	name: 'Cambio',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			userId: '',
			currentPsyId: '',
			newPsyId: '',
			psychologists: [],
			clients: [],
			selectedClient: null,
			selectedPsy: null,
			selectedNewPsy: null,
			loadingChange: false,
			headers: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Apellido', value: 'lastName' },
				{ text: 'Correo', value: 'email' },
			],
		};
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			await this.getPsychologist();
			console.log(this.psychologists);
		},
		async getPsychologist() {
			const { psychologists } = await this.$axios.$get('/psychologists/all');
			this.psychologists = psychologists.sort((a, b) => {
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
		async getClients(row) {
			this.selectedPsy = row;
			const { users } = await this.$axios.$get(`/psychologist/clients/${row._id}`);
			this.clients = users;
		},
		selectClient(row) {
			this.selectedClient = row;
		},
		selectNewPsy(row) {
			this.selectedNewPsy = row;
		},
		async change() {
			try {
				this.loadingChange = true;
				const { data } = await this.$axios(`/dashboard/update/psychologist`, {
					method: 'PUT',
					data: {
						newPsychologist: this.selectedNewPsy._id,
						oldPsychologist: this.selectedPsy._id,
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
