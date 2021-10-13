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
					<div style="color: #0079ff" class="font-weight-medium">
						Paga 0% de comisión con los consultantes nuevos que invites.
						<b>¡Sepa más!</b>
					</div>
				</v-alert>
			</v-col>
			<v-col cols="12">
				<v-data-table
                    :search="search"
                    :loading="loading"
                    :headers="headers"
                    :items="items"
                    item-key="_id"
                    :items-per-page="5"
                    :footer-props="{
						'items-per-page-text': 'Consultantes por página',
					}"
                    no-data-text="No hay consultantes"
                >
                    <template #[`item.name`]="{ item }">
                        <div>
                            <avatar size="30" :name="item.name" :url="item.avatar" />
                            <span class="ml-2 body-2">{{ item.name }}</span>
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
                            <v-btn icon>
                                <icon :icon="mdiClose" small color="error"></icon>
                            </v-btn>
                        </div>
                    </template>
                </v-data-table>
			</v-col>
		</v-row>
		<v-dialog v-if="dialog" v-model="dialog" max-width="550" transition="dialog-top-transition">
			<v-card min-height="300" width="550" rounded="lg">
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
					<v-btn icon @click="dialog = false">
						<icon :icon="mdiClose" color="white" />
					</v-btn>
				</v-card-text>
				<v-card-text class="pt-3">
					<v-row>
						<v-col cols="6">
							<v-text-field type="text" dense hide-details outlined label="Nombre">
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field type="text" dense hide-details outlined label="Rut">
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field type="email" dense hide-details outlined label="email">
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field
								type="text"
								dense
								hide-details
								outlined
								prefix="+56"
								label="Teléfono"
							>
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field type="text" dense hide-details outlined label="Dirección">
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field type="text" dense hide-details outlined label="Comuna">
							</v-text-field>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="6">
							<v-btn text @click="dialog = false"> Cancelar </v-btn>
							<v-btn rounded color="primary"> Agregar </v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { mdiMagnify, mdiPlus, mdiChat, mdiClose, mdiCalendar } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';

export default {
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		Avatar: () => import('~/components/Avatar'),
		Icon: () => import('~/components/Icon'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	data: () => ({
        dialog: false,
        mdiClose,
        mdiMagnify,
        mdiPlus,
        mdiChat,
        mdiCalendar,
        search: "",
        headers: [
            {
                text: "Nombre",
                sortable: false,
                value: "name"
            },
            { text: "Última sesión", value: "lastSession", sortable: false },
            { text: "Estado", value: "status", sortable: false },
            { text: "Acciones", value: "actions", sortable: false }
        ],
        loading: false
    }),
	computed: {
		items() {
            return this.clientes.map(item => ({
                avatar: item.avatar,
                name: `${item.name} ${item.lastName ? item.lastName : ""}`,
                lastSession: item.lastSession,
                status: item.status,
                _id: item._id
            }));
        },
		...mapGetters({ clientes: 'Psychologist/clients' }),
	},
	async mounted() {
		this.loading = true;
		await this.getClients(this.$auth.$state.user.psychologist);
		this.loading = false;
	},
	methods: {
		...mapActions({
			getClients: 'Psychologist/getClients',
		}),
	},
};
</script>

<style scoped></style>
