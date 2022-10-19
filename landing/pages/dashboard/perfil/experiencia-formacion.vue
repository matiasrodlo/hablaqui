<template>
	<v-container style="height: 100vh">
		<appbar class="hidden-sm-and-down mb-16" title="Experiencia y formación" />
		<experiencia-y-formacion :psychologist="psychologist" :set-psychologist="setPsychologist" />
	</v-container>
</template>

<script>
import dayjs from 'dayjs';

export default {
	name: 'ExperienciaFormacion',
	components: {
		appbar: () => import('~/components/dashboard/AppbarProfile'),
		ExperienciaYFormacion: () => import('~/components/dashboard/ExperienciaFormacion'),
	},
	layout: 'dashboard',
	middleware: ['auth'],
	async asyncData({ $axios, $auth }) {
		if ($auth.$state.user.role === 'user') {
			if ($auth.$state.user.sessions.length) {
				// Obtenemos un array con todo los planes solamente
				const plans = $auth.$state.user.sessions.flatMap(item =>
					item.plan.map(plan => ({
						...plan,
						psychologist: item.psychologist,
						user: item.user,
						// dias de diferencia entre el dia que expiró y hoy
						diff: dayjs(plan.expiration).diff(dayjs(), 'days'),
					}))
				);
				const min = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));
				const max = Math.max(...plans.map(el => el.diff).filter(el => el >= 0));

				// retornamos el plan success y sin expirar
				let plan = plans.find(
					item => item.payment === 'success' && dayjs().isBefore(dayjs(item.expiration))
				);
				// retornamos el siguiente plan pendiente
				if (!plan) plan = plans.find(item => item.diff === max);
				// retornamos el ultimo plan succes y que expiro
				if (!plan) plan = plans.find(item => item.diff === min);

				if (plan.psychologist) {
					const { psychologist } = await $axios.$get(
						`/psychologists/one/${plan.psychologist}`
					);
					return { psychologist };
				}
			}
			return { psychologist: null };
		} else {
			let psychologist;
			if ($auth.$state.user.psychologist) {
				const res = await $axios.$get(
					`/psychologists/one/${$auth.$state.user.psychologist}`
				);
				psychologist = res.psychologist;
			} else {
				const res = await $axios.$get(`/recruitment/${$auth.user.email}`);
				psychologist = res.recruited;
			}
			if (!psychologist.formation.length) {
				psychologist.formation.push({
					formationType: '',
					description: '',
					start: '',
					end: '',
				});
			}
			if (!psychologist.experience.length) {
				psychologist.experience.push({ title: '', place: '', start: '', end: '' });
			}
			return { psychologist };
		}
	},
	methods: {
		setPsychologist(value) {
			this.psychologist = value;
		},
	},
};
</script>
