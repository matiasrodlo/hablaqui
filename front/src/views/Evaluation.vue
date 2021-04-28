<template>
	<div>
		<div
			class="primary white--text text-center"
			style="position: relative; padding: 100px 0; height: 400px"
		>
			<div class="title text-h5 text-sm-h4 font-weight-bold">
				EXPLICAR PORQUE Y PARA QUE ES LA ENCUESTA
			</div>
			<div class="d-flex justify-center text-h6">
				<div style="width: 500px">
					Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
					euismod tincidunt ut
				</div>
			</div>
			<v-card class="centerCard" width="500" color="white">
				<v-card-text class="primary--text title text-h5 text-sm-h4 font-weight-bold">
					Lorem ipsum dolor sit
				</v-card-text>
				<v-card-text class="primary--text title text-h5 text-sm-h4 font-weight-bold">
					<v-btn block x-large rounded color="primary" class="my-3">
						Lorem ipsum dolor sit amet, consecte
					</v-btn>
					<v-btn
						outlined
						block
						x-large
						rounded
						class="my-3"
						color="#BDBDBD"
						style="border-color: #e0e0e0;"
					>
						Lorem ipsum dolor sit amet, consecte
					</v-btn>
					<v-btn
						outlined
						block
						x-large
						rounded
						class="my-3"
						color="#BDBDBD"
						style="border-color: #e0e0e0;"
					>
						Lorem ipsum dolor sit amet, consecte
					</v-btn>
					<v-btn
						outlined
						block
						x-large
						rounded
						class="my-3"
						color="#BDBDBD"
						style="border-color: #e0e0e0;"
					>
						Lorem ipsum dolor sit amet, consecte
					</v-btn>
				</v-card-text>
			</v-card>
		</div>
		<v-container style="margin-top: 200px">
			<v-row>
				<v-col cols="6">
					<v-card>
						<v-card-text
							>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, et
							earum, distinctio sint mollitia accusantium aut sed vel molestiae
							eveniet repudiandae libero assumenda quisquam totam eum. Explicabo
							reiciendis sunt velit.</v-card-text
						>
					</v-card>
				</v-col>
				<v-col cols="6">
					<v-card>
						<v-card-text
							>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, et
							earum, distinctio sint mollitia accusantium aut sed vel molestiae
							eveniet repudiandae libero assumenda quisquam totam eum. Explicabo
							reiciendis sunt velit.</v-card-text
						>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: 'Evaluation',
};
</script>

<style lang="scss" scoped>
.centerCard {
	position: absolute;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
	border-radius: 25px !important;
}
</style>
