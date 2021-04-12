<template>
	<v-container fluid>
		<v-row style="height: calc(100vh - 110px); overflow-y: hidden">
			<v-col cols="12" sm="6" md="8" style="height: calc(100vh - 110px);">
				<v-card height="100%" flat style="display: flex; flex-direction: column;">
					<v-card-text>
						<div class="text-center text-h5 font-weight-bold py-2">
							Disfruta la comodidad de ser atendido desde la pantalla de un
							computador.
						</div>
						<v-divider></v-divider>
						<div class="text-center body-2 py-2">
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
							nonummy nibh euismod
						</div>
						<div class="text-center text--secondary body-2 py-2">
							Lorem ipsum dolor
						</div>
					</v-card-text>
					<v-card-text
						style="flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-end"
					>
						<div class="talkbubble" style="align-self: flex-start">
							<p style="max-height: 75px;overflow-y: auto">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
								tristique diam vel tristique diam vel tristique diam vel
							</p>
						</div>
						<div class="talkbubble" style="align-self: flex-end">
							<p style="max-height: 75px;overflow-y: auto">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
								tristique diam vel tristique diam vel tristique diam vel
							</p>
						</div>
					</v-card-text>
					<v-card-text>
						<v-textarea
							rows="1"
							prepend-inner-icon="mdi-plus-circle-outline"
							append-icon="mdi-microphone"
							label="Mensaje a Juan"
						></v-textarea>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" md="4" class="primary text-center text-h6 font-weight-bold">
				<v-row>
					<v-col cols="12" class="accent text-center text-h6 font-weight-bold">
						En contruccion
					</v-col>
					<v-col cols="12" class="accent text-center text-h6 font-weight-bold">
						En contruccion
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.talkbubble {
	margin-top: 15px;
	margin-bottom: 15px;
	position: relative;
	width: 50%;
	padding: 10px;
	border-radius: 15px;
	color: white;
	border: solid #2070e5;
	background: #2070e5;
}

.talkbubble:before {
	content: '';
	position: absolute;
	right: 90%;
	top: 100%;
	width: 0;
	height: 0;

	border-left: 13px solid transparent;
	border-right: 13px solid transparent;
	border-top: 26px solid #2070e5;
}
</style>
