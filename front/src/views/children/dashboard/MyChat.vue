<template>
	<v-container fluid style="height: 100vh">
		<appbar />
		<v-row>
			<v-col cols="12" md="4" lg="3">
				<div v-if="loading" class="text-center">
					<v-progress-circular indeterminate color="primary"></v-progress-circular>
				</div>
				<v-card
					v-else
					style="height: calc(100vh - 135px); display: flex; flex-direction: column; border-radius: 15px"
					flat
				>
					<v-card-text class="py-0">
						<v-text-field
							style="border-radius: 25px;"
							hide-details
							filled
							dense
							outlined
							single-line
							append-icon="mdi-magnify"
							label="Buscar"
						/>
						<v-subheader class="primary--text body-1 px-0">
							Mi Psicólogo
						</v-subheader>
						<v-divider style="border-color: #5EB3E4"></v-divider>
					</v-card-text>
					<v-list two-line class="py-0">
						<v-list-item>
							<v-list-item-avatar
								style="border: 3px solid #2070E5; border-radius: 40px; "
								size="60"
							>
								<avatar :url="user.avatar" :name="user.name" size="60" />
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-html="user.name"></v-list-item-title>
								<v-list-item-subtitle>
									Psicólogo · Activo(a)
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
					<v-card-text class="py-0">
						<v-subheader class="primary--text body-1 px-0">General</v-subheader>
						<v-divider style="border-color: #5EB3E4" class="mb-2"></v-divider>
					</v-card-text>
					<v-list two-line style="overflow-y: auto">
						<v-list-item v-for="n in 5" :key="n">
							<v-list-item-avatar
								style="border: 3px solid #2070E5; border-radius: 40px; "
								size="60"
							>
								<avatar :url="user.avatar" :name="user.name" size="60" />
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-html="user.name"></v-list-item-title>
								<v-list-item-subtitle>
									Psicólogo · Activo(a)
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-col>
			<v-col cols="12" md="8" lg="9">
				<v-card
					style="height: calc(100vh - 135px); display: flex; flex-direction: column; border-radius: 15px"
				>
					<v-card-text style="flex: 0">
						<v-list-item>
							<v-list-item-avatar size="50">
								<v-img height="50" width="50" :src="user.avatar"></v-img>
							</v-list-item-avatar>
							<v-list-item-title class="title d-flex">
								<span>
									{{ user.name }}
								</span>
								<span v-if="user.lastName">
									{{ user.lastName }}
								</span>
							</v-list-item-title>
							<v-list-item-action>
								<v-btn icon>
									<v-img height="35" width="40" src="/img/llamada.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-8">
									<v-img height="35" width="50" src="/img/camara.png"></v-img>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon class="ml-6">
									<v-img height="35" width="40" src="/img/agregar.png"></v-img>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider></v-divider>
					</v-card-text>
					<v-card-text
						style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;"
					>
						<div
							v-for="(item, i) in messages"
							:key="i"
							class="talkbubble"
							:class="item.sender == 'yo' ? 'talkbubble__one' : 'talkbubble__two'"
						>
							<p style="max-height: 75px; overflow-y: auto">
								{{ item.msj }}
							</p>
						</div>
					</v-card-text>
					<v-card-text style="flex: 0">
						<v-form>
							<v-textarea
								outlined
								rows="1"
								dense
								no-resize
								label="Mensaje a Juan"
								hide-details
							>
								<template #prepend-inner>
									<v-img src="/img/adjuntar.png" height="25" width="25"></v-img>
								</template>
								<template #append>
									<v-btn depressed icon>
										<v-img src="/img/voz.png" height="30" width="30"></v-img>
									</v-btn>
									<v-btn class="ml-2 mr-2" depressed icon>
										<v-img
											src="/img/message.png"
											height="30"
											width="30"
										></v-img>
									</v-btn>
								</template>
							</v-textarea>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	components: {
		appbar: () => import('@/components/ui/AppbarProfile'),
		avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			loading: false,
			items: [
				{
					color: 'primary',
					icon: 'mdi-calendar-month',
					title: 'Lorem ipsum dolor sit amet',
					subtitle: 'consectetuer adipiscing elit, sed diam nonummy nibh euismod',
				},
				{
					icon: 'mdi-calendar-month',
					title: 'Lorem ipsum dolor sit amet',
					subtitle: 'consectetuer adipiscing elit, sed diam nonummy nibh euismod',
				},
				{
					icon: 'mdi-calendar-month',
					title: 'Lorem ipsum dolor sit amet',
					subtitle: 'consectetuer adipiscing elit, sed diam nonummy nibh euismod',
				},
			],
			messages: [
				{
					sender: 'yo',
					msj:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla  tristique diam vel tristique diam vel tristique diam vel',
				},
				{
					sender: 'el',
					msj:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla  tristique diam vel tristique diam vel tristique diam vel',
				},
				{
					sender: 'yo',
					msj: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				},
				{
					sender: 'yo',
					msj: 'Nulla  tristique diam vel tristique diam vel tristique diam vel',
				},
			],
		};
	},
	computed: {
		...mapGetters({ user: 'User/user', psychologists: 'Psychologist/psychologists' }),
	},
	async mounted() {
		this.loading = true;
		await this.getPsychologists();
		this.loading = false;
	},
	methods: {
		...mapActions({
			getPsychologists: 'Psychologist/getPsychologists',
		}),
	},
};
</script>

<style lang="scss" scoped>
$color__one: #bdbdbd;
$color__two: #2070e5;
$font__color_one: #424242;
$font__color_two: #ffffff;

.v-text-field--filled:not {
	margin-top: 0 !important;
}
.talkbubble {
	margin-top: 15px;
	margin-bottom: 15px;
	position: relative;
	width: 50%;
	padding: 10px;
	border-radius: 15px;

	&__one {
		color: $font__color_one;
		align-self: flex-end;
		border: solid $color__one;
		background: $color__one;
	}

	&__one:before {
		content: '';
		position: absolute;
		right: 10%;
		top: 100%;
		width: 0;
		height: 0;

		border-left: 13px solid transparent;
		border-right: 13px solid transparent;
		border-top: 26px solid $color__one;
	}

	&__two {
		color: $font__color_two;
		align-self: flex-start;
		border: solid $color__two;
		background: $color__two;
	}

	&__two:before {
		content: '';
		position: absolute;
		right: 90%;
		top: 100%;
		width: 0;
		height: 0;

		border-left: 13px solid transparent;
		border-right: 13px solid transparent;
		border-top: 26px solid $color__two;
	}
}
</style>
