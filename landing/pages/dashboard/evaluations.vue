<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Evaluaciones" />
		<v-row>
			<v-col cols="12">
				<div>
					<v-data-table
						:headers="headers"
						:items="evaluations"
						sort-by="send"
						class="elevation-1"
					>
						<template #top>
							<v-toolbar flat>
								<v-toolbar-title>Todas las evaluaciones</v-toolbar-title>
							</v-toolbar>
						</template>
						<template #body.prepend>
							<tr>
								<td>
									<v-select
										v-model="usernames"
										:items="checkUsernames"
										label="usernames"
										multiple
									>
										<template #selection="{ item, index }">
											<v-chip v-if="index === 0">
												<span>{{ item }}</span>
											</v-chip>
											<span
												v-if="index === 1"
												class="grey--text text-caption"
											>
												(+{{ usernames.length - 1 }})
											</span>
										</template>
									</v-select>
								</td>
								<td colspan="5" />
								<td>
									<v-select
										v-model="states"
										:items="checkStates"
										label="Estado"
										multiple
									>
										<template #selection="{ item, index }">
											<v-chip v-if="index === 0">
												<span>{{ item }}</span>
											</v-chip>
											<span
												v-if="index === 1"
												class="grey--text text-caption"
											>
												(+{{ states.length - 1 }})
											</span>
										</template>
									</v-select>
								</td>
								<td />
							</tr>
						</template>

						<template #item.comments="{ item }">
							<v-btn x-small @click="showComments(item)"> Ver </v-btn>
						</template>
						<template #item.actions="{ item }">
							<v-btn
								:disabled="item.approved === 'approved'"
								x-small
								@click="refuseApproveEvaluation('approved', item)"
							>
								<icon :icon="mdiCheckBold" color="green" />
							</v-btn>
							<v-btn
								:disabled="item.approved === 'refuse'"
								x-small
								@click="refuseApproveEvaluation('refuse', item)"
							>
								<icon :icon="mdiCloseThick" color="red" />
							</v-btn>
						</template>
					</v-data-table>
				</div>
			</v-col>
		</v-row>
		<v-dialog
			v-model="dialog"
			max-width="500"
			@click:outside="
				() => {
					dialog = false;
				}
			"
		>
			<v-card max-width="500">
				<v-card-title>
					<span class="text-h5">Comentarios</span>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="4">
							<div>
								Internet:
								<span class="font-weight-black">
									{{ internet }}
								</span>
							</div>
						</v-col>
						<v-col cols="4">
							<div>
								Puntualidad: <span class="font-weight-black">{{ puntuality }}</span>
							</div>
						</v-col>
						<v-col cols="4">
							<div>
								Atención: <span class="font-weight-black">{{ attention }}</span>
							</div>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="6"
							>Qué gustó: <span class="font-weight-black">{{ like }}</span></v-col
						>
						<v-col cols="6"
							>Qué mejorar:
							<span class="font-weight-black">{{ improve }}</span></v-col
						>
					</v-row>
					<v-row>
						<v-col cols="12">{{ comment }}</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import { mdiCheckBold, mdiCloseThick } from '@mdi/js';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Icon: () => import('~/components/Icon'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			usernames: [],
			states: [],
			mdiCheckBold,
			mdiCloseThick,
			headers: [
				// { text: 'Especialista', value: 'specialist' },
				{
					text: 'Nombre de usuario',
					value: 'username',
					filter: value => {
						if (this.usernames.length === 0) return true;
						return this.usernames.includes(value);
					},
				},
				{ text: 'Consultante', value: 'user' },
				{ text: 'Global', value: 'global' },
				{ text: 'Enviado', value: 'send' },
				{ text: 'Actualizado', value: 'updated' },
				{ text: 'Comentario', value: 'comments', sortable: false },
				{
					text: 'Estatus',
					value: 'approved',
					filter: value => {
						if (this.states.length === 0) return true;
						return this.states.includes(value);
					},
				},
				{ text: 'Acciones', value: 'actions', sortable: false },
			],
			evaluations: [],
			dialog: false,
			comment: '',
			like: '',
			improve: '',
			internet: 0,
			puntuality: 0,
			attention: 0,
		};
	},
	computed: {
		checkUsernames() {
			const data = this.evaluations.map(e => e.username);
			const dataArr = new Set(data);
			const result = [...dataArr];
			return result;
		},
		checkStates() {
			const data = this.evaluations.map(e => e.approved);
			const dataArr = new Set(data);
			const result = [...dataArr];
			return result;
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
			const { evaluations } = await this.$axios.$get(`/evaluation/get-all-evaluations`);
			this.evaluations = evaluations;
		},
		async refuseApproveEvaluation(type, item) {
			if (type === 'refuse') await this.refuse(item);

			if (type === 'approved') await this.approve(item);
		},
		async refuse(item) {
			try {
				const { data } = await this.$axios(
					`/specialist/refuse-evaluation/${item.evsId}/${item.evId}`,
					{ method: 'POST' }
				);
				const index = this.evaluations.indexOf(item);
				this.evaluations[index].approved = 'refuse';
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		async approve(item) {
			try {
				const { data } = await this.$axios(
					`/specialist/approve-evaluation/${item.evsId}/${item.evId}`,
					{ method: 'POST' }
				);
				const index = this.evaluations.indexOf(item);
				this.evaluations[index].approved = 'approved';
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		showComments(item) {
			this.comment = item.comment;
			this.like = item.like;
			this.improve = item.improve;
			this.internet = item.internet;
			this.puntuality = item.puntuality;
			this.attention = item.attention;
			this.dialog = true;
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
};
</script>

<style>
.v-label .select {
	font-size: 10px;
}
</style>
