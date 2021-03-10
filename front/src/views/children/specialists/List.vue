<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" class="text-left font-weight-bold text-h6 text-md-h3 text--secondary">
				Elige a tu psicólogo online
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="3" lg="2">
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
						<v-row>
							<v-col cols="4" md="12">
								<div class="title mt-2">Género</div>
								<v-checkbox label="Hombre" hide-details></v-checkbox>
								<v-checkbox label="Mujer" hide-details></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Tipo de cita</div>
								<v-checkbox label="Personal" hide-details></v-checkbox>
								<v-checkbox label="Pareja" hide-details></v-checkbox>
							</v-col>
							<v-col cols="4" md="12">
								<div class="title mt-2">Idioma</div>
								<v-checkbox label="Español" hide-details></v-checkbox>
								<v-checkbox label="Ingles" hide-details></v-checkbox>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="9" lg="10">
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
					<v-col cols="12" sm="6" md="4" lg="3" v-for="(item, i) in items" :key="i">
						<v-card
							min-height="450"
							:dark="firstItem(i)"
							style="border-radius:15px"
							class="text-center"
							:color="firstItem(i) ? 'primary' : ''"
						>
							<div class="pa-2">
								<v-btn
									:style="firstItem(i) && 'border: 8px solid #5EB3E4'"
									color="#9D9D9C"
									class="elevation-0"
									fab
									width="100"
									height="100"
								></v-btn>
							</div>
							<v-card-text>
								<div
									v-if="!firstItem(i)"
									class="title"
									:class="firstItem(i) ? 'white--text' : 'text--secondary'"
								>
									{{ item.name }}
								</div>
								<div v-if="!firstItem(i)" class="body-1 primary--text">
									Cédula {{ item.rut }}
								</div>
								<v-divider></v-divider>
								<div class="body-2 mt-2">{{ item.description }}</div>
							</v-card-text>
							<template v-if="firstItem(i)">
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn class="px-10" light color="#F0F8FF">Comenzar</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</template>
							<template v-else>
								<v-card-actions class="text-center">
									<v-spacer></v-spacer>
									<v-btn color="primary">Agenda cita oline</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
								<v-card-actions class="text-center">
									<v-spacer></v-spacer>
									<v-btn
										text
										color="#9D9D9C"
										:to="{ name: 'especialista', params: { id: item._id } }"
									>
										Más información
									</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</template>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			items: [
				{
					_id: 1,
					name: 'Encuentra a tu psicólogo ideal',
					rut: null,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 2,
					name: 'user 2 ewrew',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 3,
					name: 'user 3 wreewr',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 4,
					name: 'user 4 rerwe',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 5,
					name: 'user 5',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 6,
					name: 'user 6',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 7,
					name: 'user 7',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 8,
					name: 'user 8',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
				{
					_id: 9,
					name: 'user 9',
					rut: 1222231,
					description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
									neque tempora obcaecati, molestiae deleniti quos quibusdam
									voluptatem, nesciunt aut, officiis minus laudantium iste minima.
									Commodi nulla dolorum quae. Possimus, ipsam!`,
				},
			],
		};
	},
	methods: {
		firstItem(index) {
			return index == 0;
		},
	},
};
</script>
