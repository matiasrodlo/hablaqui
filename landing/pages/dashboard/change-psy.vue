<template>
	<v-container style="height: 100vh; max-width: 1200px">
		<appbar class="hidden-sm-and-down" title="Cambio de psicologo" />
		<v-form @submit.prevent="change">
			<v-row class="pa-5">
				<v-col cols="2" class="pt-0 pb-0 bl br bb bt primary white--text">
					<div class="d-flex align-center" style="height: 100%">Id de consultante:</div>
				</v-col>
				<v-col cols="4" class="pt-0 pb-0">
					<v-text-field
						v-model="userId"
						label="Id consultante"
						:error-messages="idUserErrors"
					/>
				</v-col>
			</v-row>
			<v-row class="pa-5">
				<v-col cols="2" class="pt-0 pb-0 bl br bb bt primary white--text">
					<div class="d-flex align-center" style="height: 100%">
						Id de psicólogo actual:
					</div>
				</v-col>
				<v-col cols="4" class="pt-0 pb-0">
					<v-text-field
						v-model="currentPsyId"
						label="Id psicologo actual"
						:error-messages="idCurrentPsyErrors"
					/>
				</v-col>
			</v-row>
			<v-row class="pa-5">
				<v-col cols="2" class="pt-0 pb-0 bl br bb bt primary white--text">
					<div class="d-flex align-center" style="height: 100%">
						Id de psicólogo nuevo:
					</div>
				</v-col>
				<v-col cols="4" class="pt-0 pb-0">
					<v-text-field
						v-model="newPsyId"
						label="Id psicologo nuevo"
						:error-messages="idNewPsyErrors"
					/>
				</v-col>
			</v-row>
			<v-card-actions>
				<v-spacer />
				<v-btn :loading="loadingChange" type="submit">Cambiar psicólogo</v-btn>
				<v-spacer />
			</v-card-actions>
			<v-row class="pa-5">
				<v-col> </v-col>
			</v-row>
		</v-form>
	</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';
export default {
	name: 'Cambio',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
	},
	mixins: [validationMixin],
	layout: 'dashboard',
	data() {
		return {
			userId: '',
			currentPsyId: '',
			newPsyId: '',
			loadingChange: false,
		};
	},
	computed: {
		idUserErrors() {
			const errors = [];
			if (!this.$v.userId.$dirty) return errors;
			!this.$v.userId.required && errors.push('El id de consultante es querido');
			return errors;
		},
		idCurrentPsyErrors() {
			const errors = [];
			if (!this.$v.currentPsyId.$dirty) return errors;
			!this.$v.currentPsyId.required && errors.push('El id del actual psicologo es querido');
			return errors;
		},
		idNewPsyErrors() {
			const errors = [];
			if (!this.$v.newPsyId.$dirty) return errors;
			!this.$v.newPsyId.required && errors.push('El id del nuevo psicologo es querido');
			return errors;
		},
	},
	methods: {
		async change() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					this.loadingChange = true;
					await this.$axios(`/dashboard/update/psychologist`, {
						method: 'PUT',
						data: {
							newPsychologist: this.newPsyId,
							oldPsychologist: this.currentPsyId,
							user: this.userId,
						},
					});
				} catch (error) {
					this.snackBar({ content: evaluateErrorReturn(error), color: 'error' });
				} finally {
					this.loadingChange = false;
				}
			}
		},
		...mapMutations({
			snackBar: 'Snackbar/showMessage',
		}),
	},
	validations: {
		userId: {
			required,
		},
		currentPsyId: {
			required,
		},
		newPsyId: {
			required,
		},
	},
};
</script>
