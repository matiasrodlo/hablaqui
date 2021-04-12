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
						<div
							v-for="(item, i) in messages"
							:key="i"
							class="talkbubble"
							:class="item.sender == 'yo' ? 'talkbubble__one' : 'talkbubble__two'"
						>
							<p style="max-height: 75px;overflow-y: auto">
								{{ item.msj }}
							</p>
						</div>
					</v-card-text>
					<v-card-text>
						<v-form>
							<v-textarea
								rows="1"
								no-resize
								prepend-inner-icon="mdi-plus-circle-outline"
								append-icon="mdi-microphone"
								label="Mensaje a Juan"
							></v-textarea>
						</v-form>
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
export default {
	data() {
		return {
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
};
</script>

<style lang="scss" scoped>
$color__one: #bdbdbd;
$color__two: #2070e5;
$font__color_one: #424242;
$font__color_two: #ffffff;
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
