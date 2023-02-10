import { snackBarError } from '~/utils/snackbar'

export default {
  async getAppointments ({ commit }) {
    try {
      const { appointments } = await this.$axios.$get('/appointments/all')
      commit('setAppointments', appointments)
    } catch (e) {
      snackBarError(e)(commit)
    }
  }
}
