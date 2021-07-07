<template>
	<v-container>
		<div class="mb-6">
			<h1
				class="d-inline-block text-capitalize text-left font-weight-bold text-h6 text-md-h4 text--secondary"
			>
				<v-icon size="40" class="grey--text lighten-1">mdi-magnify</v-icon>
				Psicólogos desde {{ $route.name.split('-').slice(0)[1] }}
			</h1>
		</div>
		<v-card outlined class="rounded-r-xl">
			<v-row no-gutters>
				<v-col>
					<v-card-text class="secondary--text">
						<div>
							<span class="text-capitalize primary--text font-weight-bold">
								¿Estás buscando un buen Psicólogo en
								{{ $route.name.split('-').slice(0)[1] }}</span
							>? No te preocupes, hoy puedes tener tu consulta de manera online en tu
							casa
							<span class="primary--text font-weight-bold">
								desde
								<span class="text-capitalize">
									{{ $route.name.split('-').slice(0)[1] }}
								</span>
							</span>
							o cualquier parte del mundo.
						</div>
						<div class="mt-2">
							Los mejores psicólogos para atender de forma online en
							<span class="text-capitalize primary--text font-weight-bold">
								{{ $route.name.split('-').slice(0)[1] }} </span
							>, especializados en psicoterapia y trastornos psicológicos. Pide una
							cita online o habla con los psicólogos de manera gratuita en nuestro
							chat
							<span class="primary--text font-weight-bold">
								desde
								<span class="text-capitalize"
									>{{ $route.name.split('-').slice(0)[1] }}.</span
								>
							</span>
						</div>
					</v-card-text>
				</v-col>
				<v-col cols="5" class="rounded-r-xl primary"></v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
