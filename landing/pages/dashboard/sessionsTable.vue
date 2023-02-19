<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Sesiones" />
		<v-row>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col>
				<v-menu
					ref="menu"
					v-model="menu"
					:close-on-content-click="false"
					:return-value.sync="date"
					transition="scale-transition"
					offset-y
					min-width="auto"
				>
					<template v-slot:activator="{ on, attrs }">
					<v-text-field
						v-model="date"
						label="Filtro por Fecha"
						readonly
						v-bind="attrs"
						v-on="on"
					></v-text-field>
					</template>
					<v-date-picker
					v-model="date"
					range
					>
					<v-spacer></v-spacer>
					<v-btn
						text
						color="primary"
						@click="menu = false"
					>
						Cancel
					</v-btn>
					<v-btn
						text
						color="primary"
						@click="$refs.menu.save(date)"
					>
						OK
					</v-btn>
					</v-date-picker>
				</v-menu>
            </v-col>
            <v-col>
              <v-select
                v-model="statFilterText"
                :item-value="status.value"
                :item-text="status.text"
                :items="status"
                label="Estado de Realización">
              </v-select>
            </v-col>
			<v-col>
              <v-text-field v-model="psyFilterText"
                            label="Filtro por Especialista"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="userFilterText"
                            label="Filtro por Usuario"></v-text-field>
            </v-col>
            <v-col>
              <v-select v-model="payFilterText" :item-value="payStatus.value" :item-text="payStatus.text"
                        :items="payStatus" label="Estado de Pago">
              </v-select>
            </v-col>
		  </v-row>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="filteredSessions"
            :items-per-page="5"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
		</v-row>
		<v-dialog v-model="dialog" @click:outside="
			() => {
				dialog = false;
			}
		">
		</v-dialog>
		<v-dialog v-model="showBank" max-width="500" @click:outside="
	() => {
		showBank = false;
	}
		">
		</v-dialog>

	</v-container>

</template>
<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	name: 'Payment',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data() {
		return {
			page: 1,
			pageCount: 0,
			psychologist: [],
			transactions: [],
			start: [],
			end: [],
			menu: '',
			date: '',
			label: 'Sesiones a pagar',
			dialog: false,
			showBank: false,
			paymentMethods: {},
			dateFilterText: null,
			statFilterText: '',
			psyFilterText: '',
			userFilterText: '',
			payFilterText: '',
      headers: [
        { text: 'Consultante', value: 'user' },
        { text: 'Especialista', value: 'specialist' },
        { text: 'Fecha', value: 'date' },
        { text: 'Teléfono usuario', value: 'userPhone' },
        { text: 'Email Consultante', value: 'emailUser' },
        { text: 'Email Especialista', value: 'emailSpecialist' },
        { text: 'Estado de Realización', value: 'statusSession' },
        { text: 'Estado de Pago', value: 'paymentPlan' },
      ],
			sessions: [],
			status: [
				{ text: 'Pendiente', value: 'pending' },
				{ text: 'Realizada', value: 'success' }
			],
			payStatus: [
				{ text: 'Pendiente', value: 'pending' },
				{ text: 'Pagada', value: 'success' }
			],
		};
	},
	computed: {
		filteredTransactions() {
			let transactions = [];
			if (this.start === '' || this.end === '') transactions = this.transactions;
			else {
				transactions = this.transactions.filter(t =>
					dayjs(t.createdAt, 'DD/MM/YYYY HH:mm').isBetween(
						dayjs(this.start, 'yyyy-MM-DDTHH:mm'),
						dayjs(this.end, 'yyyy-MM-DDTHH:mm')
					)
				);
			}
			return transactions;
		},
		filteredSessions() {
			if (this.date && this.date[0] && this.date[1]){
				this.start = this.date[0].split('-')
				this.end = this.date[1].split('-')
			}
			// Método que filtra las sesiones según 5 condiciones, nombre de usuario, estatus de la sesión, nombre del psicólogo, fecha de la sesión y estado de pago
			return this.sessions.filter(
				session =>
					session.user.toLowerCase().includes(this.userFilterText.toLowerCase()) &&
					session.statusSession.includes(this.statFilterText) &&
					session.specialist.toLowerCase().includes(this.psyFilterText.toLowerCase()) &&
					session.paymentPlan.includes(this.payFilterText) &&
					(this.date && this.date[0] && this.date[1]
						? dayjs(session.date, 'DD/MM/YYYY HH:mm').isBetween(
						dayjs(`${this.start[2]}/${this.start[1]}/${this.start[0]}`, 'MM/DD/YYYY'),
						dayjs(`${this.end[2]}/${this.end[1]}/${this.end[0]}`, 'MM/DD/YYYY')
					)
						: true
					)
			);
		},
	},
	mounted() {
		this.initFetch();
	},
	methods: {
		async initFetch() {
      await this.getFormattedSessions();
			const { amounts } = await this.$axios.$get('/dashboard/pay-mount');
			this.psychologist = amounts;
			const { transactions } = await this.$axios.$get('/transaction/get/all');
			this.transactions = transactions;
		},
		async setTransaction(item) {
			try {
				const { data } = await this.$axios('/transaction/generate', {
					method: 'POST',
					data: {
						total: item.total,
						session: item.session,
						idPsy: item._id,
					},
				});

				const index = this.psychologist.indexOf(item);
				this.psychologist[index].total = 0;
				this.psychologist[index].session = [];
				this.snackBar({ content: data.message, color: 'success' });
			} catch (error) {
				this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
			}
		},
		showSessionsToPay(item, label) {
			this.label = label;
			this.dialog = true;
			this.sessions = item.session;
		},
		showBankInfo(item) {
			this.paymentMethods = item.paymentMethod;
			this.showBank = true;
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
    async getFormattedSessions() {
      try {
        const { data } = await this.$axios('/sessions/get-all-sessions-formatted', {
          method: 'GET'
        });
        const { formattedSessions } = data;
        this.sessions = formattedSessions;
        console.log(this.sessions[0]);
        return formattedSessions;
      } catch (e) {
        this.snackBar({
          content: e,
          color: 'error',
        });
      }
    },
	},
};
</script>

<style>

</style>
