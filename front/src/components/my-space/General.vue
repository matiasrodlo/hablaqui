<template>
	<div>
		<v-form>
			<v-row>
				<v-col cols="12" class="title">Información General</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formUser.name"
						filled
						outlined
						dense
						label="Nombre"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formUser.lastName"
						filled
						outlined
						dense
						label="Apellido"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-combobox
						filled
						label="Zona horaria"
						v-model="formUser.timeZone"
						:items="timezone"
						outlined
						:search-input.sync="motive"
						hide-details
					>
						<template v-slot:no-data>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										No se encontraron resultados que coincidan con "<strong>
											{{ motive }}
										</strong>
										" .
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</template>
					</v-combobox>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formUser.email"
						filled
						outlined
						dense
						label="Correo electronico"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formUser.phone"
						filled
						outlined
						dense
						label="Numero de telefono"
					></v-text-field>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn color="primary" depressed class="px-16" style="border-radius: 10px">
						Editar
					</v-btn>
				</v-col>
			</v-row>
		</v-form>
		<v-form>
			<v-row>
				<v-col cols="12" class="title">
					Contraseña
				</v-col>
				<v-col cols="12" class="title">
					<v-text-field filled outlined dense label="Contraseña actual"></v-text-field>
				</v-col>
				<v-col cols="12" class="title">
					<v-text-field filled outlined dense label="Nueva Contraseña"></v-text-field>
				</v-col>
				<v-col cols="12" class="title">
					<v-text-field
						filled
						outlined
						dense
						label="Repite la nueva contraseña"
					></v-text-field>
				</v-col>
				<v-col cols="12" class="text-center">
					<v-btn color="primary" depressed class="px-16" style="border-radius: 10px">
						Actualizar nueva contraseña
					</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { api_absolute } from '@/config/index';

export default {
	data() {
		return {
			formUser: null,
			formPassword: null,
			formAvatar: null,
			timezone: [],
		};
	},
	async mounted() {
		this.formUser = { ...this.user };
		const { data } = await axios.get(`${api_absolute}/timezone.json`);
		this.timezone = data;
	},
	computed: {
		...mapGetters({ user: 'User/user' }),
	},
};
</script>

<style lang="scss" scoped></style>
