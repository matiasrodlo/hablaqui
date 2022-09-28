<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Camnbio de psicólogo" />
		<v-row style="height: calc(100vh - 110px); overflow-y: auto">
			<v-col class="text--secondary" cols="6">
				<v-list>
					<v-subheader>Psicologos</v-subheader>
					<v-list-item
						v-for="item in psychologists"
						:key="item._id"
						:disabled="false"
						@click="
							() => {
								getClients(item._id);
							}
						"
					>
						{{ item.name }} {{ item.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
			<v-col class="text--secondary" cols="6">
				<v-list>
					<v-subheader>Consultantes</v-subheader>
					<v-list-item
						v-for="client in clients"
						:key="client._id"
						:disabled="!clients"
						@click="
							() => {
								getSession(client);
							}
						"
					>
						{{ client.name }} {{ client.lastName }}
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
		<v-dialog v-model="dialog" fullscreen>
			<v-card max-width="1200px">
				<v-toolbar flat color="primary" class="white--text">
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="dialog = false">Cerrar</v-btn>
				</v-toolbar>
				<v-card-text class="mt-3">
					<v-row>
						<v-col cols="6">
							<v-data-table :headers="headers" :items="sessions" />
						</v-col>
					</v-row>
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
			psychologists: [],
			clients: [],
			loading: true,
			dialog: false,
			sessions: [],
			headers: [
				{
					text: 'Fecha de sesión',
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{ text: 'Fecha de pago', value: 'paymentDate' },
				{ text: 'Estatus', value: 'status' },
			],
		};
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			await this.getPsychologist();
			this.loading = false;
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
			this.psychologists = this.psychologists.map(psychologist => {
				const psy = psychologist;
				if (!psychologist.experience.length)
					psy.experience.push({ title: '', place: '', start: '', end: '' });
				if (!psychologist.formation.length)
					psy.formation.push({
						formationType: '',
						description: '',
						start: '',
						end: '',
					});
				if (isEmpty(psychologist.paymentMethod))
					psychologist.paymentMethod = {
						bank: '',
						accountType: '',
						accountNumber: '',
						rut: '',
						name: '',
						email: '',
					};
				return psy;
			});
		},
		async getClients(id) {
			const { users } = await this.$axios.$get(`/psychologist/clients/${id}`);
			this.clients = users;
			console.log(this.clients);
		},
		getSession(client) {
			this.dialog = true;
			const plan = client.plan;
			this.sessions = plan ? plan.session : [];
		},
	},
};
</script>

<style></style>
