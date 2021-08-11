<template>
	<div>
		<template v-if="$auth.$state.user.plan.length">
			<v-slide-group
				v-if="$vuetify.breakpoint.mdAndUp"
				v-model="plans"
				class="pa-4"
				center-active
				show-arrows
			>
				<v-slide-item
					v-for="(item, n) in $auth.$state.user.plan"
					:key="n"
					v-slot="{ toggle }"
				>
					<v-card class="ma-4" height="220" width="400" @click="toggle">
						<v-card-title
							class="d-flex justify-space-between body-1 font-weight-medium"
						>
							<div>
								<div>
									{{ item.fullInfo.title }}
								</div>
								<div class="caption">
									<template v-if="item.status === 'success'">
										<span class="success--text">Tu plan actual</span>
									</template>
									<template v-if="item.status === 'pending'">
										<span class="warning--text">Pendiente</span>
									</template>
									<template v-if="item.status === 'expired'">
										<span class="error--text">Expirado</span>
									</template>
								</div>
							</div>
							<div
								style="width: 20px; height: 20px"
								:class="status(item.status)"
							></div>
						</v-card-title>
						<v-card-text>
							<div>
								<span class="headline font-weight-bold">{{ item.price }}</span>
								<span>/ {{ item.period }}</span>
							</div>
							{{ item.fullInfo.description }}
						</v-card-text>
						<v-card-text>
							{{ item.fullInfo.subtitle }}
						</v-card-text>
					</v-card>
				</v-slide-item>
			</v-slide-group>
			<template v-else>
				<v-card
					v-for="(item, n) in $auth.$state.user.plan"
					:key="n"
					class="my-4"
					height="220"
					width="100%"
					@click="toggle"
				>
					<v-card-title class="d-flex justify-space-between body-1 font-weight-medium">
						<div>
							<div>
								{{ item.fullInfo.title }}
							</div>
							<div class="caption">
								<template v-if="item.status === 'success'">
									<span class="success--text">Tu plan actual</span>
								</template>
								<template v-if="item.status === 'pending'">
									<span class="warning--text">Pendiente</span>
								</template>
								<template v-if="item.status === 'expired'">
									<span class="error--text">Expirado</span>
								</template>
							</div>
						</div>
						<div style="width: 20px; height: 20px" :class="status(item.status)"></div>
					</v-card-title>
					<v-card-text>
						<div>
							<span class="headline font-weight-bold">{{ item.price }}</span>
							<span>/ {{ item.period }}</span>
						</div>
						{{ item.fullInfo.description }}
					</v-card-text>
					<v-card-text>
						{{ item.fullInfo.subtitle }}
					</v-card-text>
				</v-card>
			</template>
		</template>
		<template v-else>
			<v-card>
				<v-card-text class="text-center">
					<div
						class="headline font-weight-bold primary--text my-5 mx-auto"
						style="max-width: 295px"
					>
						Adquiere nuestros planes y agenda con un espacialista
					</div>
					<div class="body-1 my-5 mx-auto" style="max-width: 280px">
						Orientación psicológica en cualquier momento y lugar. Comienza a mejorar tu
						vida hoy.
					</div>
					<v-btn rounded color="primary" to="/psicologos"> Buscar ahora </v-btn>
				</v-card-text>
			</v-card>
		</template>
	</div>
</template>

<script>
export default {
	data() {
		return {
			plans: null,
		};
	},
	methods: {
		status(status) {
			if (status === 'success') return 'success rounded-xl';
			if (status === 'pending') return 'warning rounded-xl';
			if (status === 'expired') return 'error rounded-xl';
		},
	},
};
</script>
