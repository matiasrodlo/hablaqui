<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" class="text-left font-weight-bold text-h3 text--secondary">
				Elige a tu psicólogo online
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="4" md="3">
				<v-card style="border-radius:15px" outlined>
					<v-card-title class="text--secondary">
						Filtrar por
					</v-card-title>
					<v-card-text>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text style="height:70px" class="d-flex align-center">
						<v-icon>mdi-menu</v-icon>
						<v-divider vertical class="mx-2"></v-divider>
						<v-icon>mdi-view-grid-outline</v-icon>
					</v-card-text>
					<v-card-text>
						<div class="title mt-2">Género</div>
						<v-checkbox label="Hombre" hide-details></v-checkbox>
						<v-checkbox label="Mujer" hide-details></v-checkbox>
						<div class="title mt-2">Tipo de cita</div>
						<v-checkbox label="Personal" hide-details></v-checkbox>
						<v-checkbox label="Pareja" hide-details></v-checkbox>
						<div class="title mt-2">Idioma</div>
						<v-checkbox label="Español" hide-details></v-checkbox>
						<v-checkbox label="Ingles" hide-details></v-checkbox>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="8" md="9">
				<v-row>
					<v-col>
						<v-select
							class="white"
							hide-details
							outlined
							label="Motivo de consulta"
							no-data-text="Vacio"
						></v-select>
					</v-col>
					<v-col>
						<v-select
							class="white"
							hide-details
							outlined
							label="Busca tu psicólogo"
							no-data-text="Vacio"
						></v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="6" md="4" lg="3" v-for="item in items" :key="item._id">
						<v-card style="border-radius:15px" class="text-center">
							<div class="pa-2">
								<v-btn
									color="#9D9D9C"
									class="elevation-0"
									fab
									width="100"
									height="100"
								></v-btn>
							</div>
							<v-card-text>
								<div class="title text--secondary">{{ item.name }}</div>
								<div class="body-1 primary--text">Cédula {{ item.rut }}</div>
								<v-divider></v-divider>
								<div class="body-2 mt-2">
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!
								</div>
							</v-card-text>
							<v-card-actions class="text-center">
								<v-spacer></v-spacer>
								<v-btn color="primary">Agenda cita oline</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
							<v-card-actions class="text-center">
								<v-spacer></v-spacer>
								<v-btn text color="#9D9D9C">Más información</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" class="primary white--text">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum dolorem! A
				qui quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi
				omnis nihil animi similique natus. Lorem ipsum dolor sit amet, consectetur
				adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde beatae adipisci ex
				culpa. Quod, adipisci esse voluptas nisi omnis nihil animi similique natus. Lorem
				ipsum dolor sit amet, consectetur adipisicing elit. Placeat, harum dolorem! A qui
				quaerat eius unde beatae adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis
				nihil animi similique natus. ipsum dolor sit amet, consectetur adipisicing elit.
				Placeat, harum dolorem! A qui quaerat eius unde beatae adipisci ex culpa. Quod,
				adipisci esse voluptas nisi omnis nihil animi similique natus. ipsum dolor sit amet,
				consectetur adipisicing elit. Placeat, harum dolorem! A qui quaerat eius unde beatae
				adipisci ex culpa. Quod, adipisci esse voluptas nisi omnis nihil animi similique
				natus.
			</v-col>
			<v-col cols="3">
				<div class="text-center headline text--secondary font-weight-bold">Acuerdos</div>
				<div class="text-center headline text--secondary">
					Políticas de Privacidad
				</div>
				<div class="text-center headline text--secondary">
					Terminos y Condiciones
				</div>
			</v-col>
			<v-col cols="3">
				<div class="text-center headline text--secondary font-weight-bold">
					Soporte Técnico
				</div>
				<div class="text-center headline text--secondary">
					+52 1 5568 2686 6322
				</div>
				<div class="text-center headline text--secondary">
					soporte@hablaqui.com
				</div>
			</v-col>
			<v-col cols="3">
				<div class="text-center headline text--secondary font-weight-bold">
					Atención a clientes
				</div>
				<div class="text-center headline text--secondary">
					clientes@hablaqui.com
				</div>
				<div class="text-center headline text--secondary">
					John Harvard
				</div>
			</v-col>
			<v-col cols="3">
				<div class="text-center headline text--secondary font-weight-bold">
					Pago seguro
				</div>
				<div class="text-center headline text--secondary">
					LOGO PAYPAL
				</div>
			</v-col>
		</v-row>
		<v-row></v-row>
	</v-container>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			items: [
				{ _id: 1, name: 'user 1 trter', rut: 1222231 },
				{ _id: 2, name: 'user 2 ewrew', rut: 1222231 },
				{ _id: 3, name: 'user 3 wreewr', rut: 1222231 },
				{ _id: 4, name: 'user 4 rerwe', rut: 1222231 },
				{ _id: 5, name: 'user 5', rut: 1222231 },
				{ _id: 6, name: 'user 6', rut: 1222231 },
				{ _id: 7, name: 'user 7', rut: 1222231 },
				{ _id: 8, name: 'user 8', rut: 1222231 },
				{ _id: 9, name: 'user 9', rut: 1222231 },
			],
		};
	},
};
</script>
