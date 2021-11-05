<template>
	<div>
		<template v-if="$auth.$state.user.sessions">
			<v-slide-group
				v-if="$vuetify.breakpoint.mdAndUp"
				v-model="plans"
				class="pa-4"
				center-active
				show-arrows
			>
				<v-slide-item
					v-for="(item, n) in $auth.$state.user.sessions.plan"
					:key="n"
					v-slot="{ toggle }"
				>
					<v-card class="ma-4" height="220" width="400" @click="toggle">
						<v-card-title
							class="d-flex justify-space-between body-1 font-weight-medium"
						>
							<div>
								<div>
									{{ item.title }}
								</div>
								<div v-if="itemExpired(item)" class="caption">
									<template v-if="item.payment === 'success'">
										<span class="error--text">Finalizó</span>
									</template>
								</div>
								<div v-else class="caption">
									<template v-if="item.payment === 'success'">
										<span class="success--text">Tu plan actual</span>
									</template>
									<template v-if="item.payment === 'pending'">
										<span class="warning--text">Pendiente</span>
									</template>
									<template v-if="item.payment === 'expired'">
										<span class="error--text">Expirado</span>
									</template>
								</div>
							</div>
							<div style="width: 20px; height: 20px" :class="status(item)"></div>
						</v-card-title>
						<v-card-text>
							<div>
								<span class="headline font-weight-bold">{{ item.totalPrice }}</span>
								<span>/ {{ item.period }}</span>
							</div>
							{{ setDescrition(item.title) }}
						</v-card-text>
						<v-card-text>
							{{ setSubtitle(item.title) }}
						</v-card-text>
					</v-card>
				</v-slide-item>
			</v-slide-group>
			<template v-else>
				<v-card
					v-for="(item, n) in $auth.$state.user.sessions.plan"
					:key="n"
					class="my-4"
					height="220"
					width="100%"
				>
					<v-card-title class="d-flex justify-space-between body-1 font-weight-medium">
						<div>
							<div>
								{{ item.title }}
							</div>
							<div v-if="itemExpired(item)" class="caption">
								<template v-if="item.payment === 'success'">
									<span class="success--text">Expiro</span>
								</template>
							</div>
							<div v-else class="caption">
								<template v-if="item.payment === 'success'">
									<span class="success--text">Tu plan actual</span>
								</template>
								<template v-if="item.payment === 'pending'">
									<span class="warning--text">Pendiente</span>
								</template>
								<template v-if="item.payment === 'expired'">
									<span class="error--text">Expirado</span>
								</template>
							</div>
						</div>
						<div style="width: 20px; height: 20px" :class="status(item)"></div>
					</v-card-title>
					<v-card-text>
						<div>
							<span class="headline font-weight-bold">{{ item.totalPrice }}</span>
							<span>/ {{ item.period }}</span>
						</div>
						{{ setDescrition(item.title) }}
					</v-card-text>
					<v-card-text>
						{{ setSubtitle(item.title) }}
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
import moment from 'moment';
export default {
	data() {
		return {
			plans: null,
		};
	},
	methods: {
		status(item) {
			if (this.itemExpired(item)) return 'grey rounded-xl';
			if (item.payment === 'success') return 'success rounded-xl';
			if (item.payment === 'pending') return 'warning rounded-xl';
			if (item.payment === 'failed') return 'error rounded-xl';
		},
		setDescrition(title) {
			if (title === 'Sesiones por videollamada')
				return 'Habla con un psicólogo por videollamada en cualquier momento, en cualquier lugar.';
			if (title === 'Mensajería y videollamada')
				return 'Chatea y habla por videollamada con un psicólogo. Respuestas vía texto garantizadas 5 días a la semana.';
			if (title === 'Acompañamiento vía mensajería')
				return 'Chatea con un psicólogo. Respuestas vía texto garantizadas 5 días a la semana.';
		},
		setSubtitle(title) {
			if (title === 'Sesiones por videollamada') return 'Sesiones por videollamada (50 min)';
			if (title === 'Mensajería y videollamada') return 'Mensajería + Videollamada (30min)';
			if (title === 'Acompañamiento vía mensajería') return 'Terapia vía mensajes de texto';
		},
		setDate(date) {
			return moment(date).format('l');
		},
		itemExpired(item) {
			return !(item.payment === 'success' && moment().isBefore(moment(item.expiration)));
		},
	},
};
</script>
