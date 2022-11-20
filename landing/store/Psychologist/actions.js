import { snackBarError, snackBarSuccess } from '@/utils/snackbar'

export default {
  async getPsychologists ({ commit }) {
    try {
      commit('setLoadingPsychologist', true)
      const { psychologists } = await this.$axios.$get('/psychologists/all')
      commit('setPsychologists', psychologists)
      commit('setLoadingPsychologist', false)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getTransactions ({ commit }) {
    try {
      const { transactions } = await this.$axios.$get('/psychologist/transactions/all')
      commit('setTransactions', transactions)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getSessions ({ commit }, { idUser }) {
    try {
      const { sessions } = await this.$axios.$get(`/psychologists/sessions/${idUser}`)
      commit('setSessions', sessions)
      return sessions
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getFormattedSessions ({ commit }, payload) {
    try {
      const { sessions } = await this.$axios.$get(
				`/psychologists/formattedSessions/${payload.id}/${payload.type}`
      )
      commit('setSessionsFormatted', sessions)
      return sessions
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  // Obtiene solo agendas de los psicologos soliciotados
  async getSessionsLimit ({ commit }, ids) {
    try {
      const { data } = await this.$axios('/psychologists/sessionsLimit', {
        method: 'POST',
        data: { ids }
      })
      commit('setSessionsLimit', data.sessions)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getFormattedSessionsAll ({ commit }, idPsychologist) {
    try {
      const { sessions } = await this.$axios.$get('/psychologists/formattedSessionsAll')
      commit('setSessionsFormattedAll', sessions)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getClients ({ commit }, id) {
    try {
      const { users } = await this.$axios.$get(`/psychologist/clients/${id}`)
      commit('setClients', users)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async searchClients ({ commit }, search) {
    try {
      const { users } = await this.$axios.$get(`/psychologist/${search}`)
      commit('setClients', users)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getPsychologist ({ commit }, id) {
    try {
      const { psychologist } = await this.$axios.$get(`/psychologists/one/${id}`)
      return psychologist
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getPayments ({ commit }) {
    try {
      const { payments } = await this.$axios.$get('/psychologist/payments/all')
      commit('setPayments', payments)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async deletePsychologist ({ commit }, id) {
    try {
      const { psychologists } = await this.$axios(`/psychologist/${id}`, {
        method: 'delete'
      })
      commit('setPsychologists', psychologists)
      return psychologists
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async updatePaymentMethod ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologist/update-payment-method', {
        method: 'PATCH',
        data: { payload }
      })
      snackBarSuccess('Metodo de pago actualizado')(commit)
      return data.psychologist
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async checkUsername ({ commit }, username) {
    try {
      const { data } = await this.$axios('/psychologist/check-username', {
        method: 'POST',
        data: { username }
      })
      return data.available
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async paymentRequest ({ commit }, username) {
    try {
      await this.$axios('/psychologist/payment-request', {
        method: 'POST'
      })
      snackBarSuccess('Pago solicitado')(commit)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async updatePsychologist ({ commit }, profile) {
    try {
      const { data } = await this.$axios('/psychologist/update-profile', {
        method: 'PUT',
        data: { profile }
      })
      snackBarSuccess('Actualizado exitosamente')(commit)
      return data.psychologist
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async updateSessions ({ commit }, payload) {
    try {
      await this.$axios('/psychologists/update/sessions', {
        method: 'PUT',
        data: payload
      })
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async approveAvatar ({ commit }, id) {
    try {
      const { data } = await this.$axios(`/psychologist/${id}/approve-avatar`, {
        method: 'PUT'
      })
      snackBarSuccess(data.message)(commit)
      return data.psychologist
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async toggleStatus ({ commit }) {
    try {
      const { data } = await this.$axios('/psychologist/status/inmediate-attention', {
        method: 'POST'
      })
      snackBarSuccess(data.message)(commit)
      commit('setPsychologist', data.psychologist)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async createCustomSession ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologist/new-custom-session', {
        method: 'POST',
        data: payload
      })
      commit('setCustomSessions', data.sessions)
      snackBarSuccess('Sesión agregada')(commit)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },

  async ratingPsychologist ({ commit }, { id, payload }) {
    try {
      const response = await this.$axios(`/user/evaluation:/${id}`, {
        method: 'POST',
        data: payload
      })
      snackBarSuccess('Tu evaluacion ha sido envida')(commit)
      return response
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async setReschedule ({ commit }, { id, sessionsId, newDate }) {
    try {
      const { data } = await this.$axios(`/psychologists/reschedule/${sessionsId}/${id}`, {
        method: 'POST',
        data: { newDate }
      })
      snackBarSuccess('Sesión reprogramada')(commit)
      commit('setOneSessions', { payload: data.sessions, id })
      return data.sessions
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async matchPsi ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologists/match', {
        method: 'POST',
        data: { payload }
      })
      const { matchedPsychologists } = data
      if (matchedPsychologists[0]) matchedPsychologists[0].type = 'Recomendado'
      if (matchedPsychologists[1]) matchedPsychologists[1].type = 'Disponibilidad'
      if (matchedPsychologists[2]) matchedPsychologists[2].type = 'Economico'
      return matchedPsychologists
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async mercadopagoPay ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/mercadopago/create-preference', {
        method: 'POST',
        data: payload
      })
      return data
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async mercadopagoSuccess ({ commit }, { sessionsId, planId }) {
    try {
      await this.$axios(`/mercadopago/success-pay/${sessionsId}/${planId}`, {
        method: 'get'
      })
      snackBarSuccess('Pago aprobado')(commit)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async setPaymentPreferences ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/mercadopago/psychologist-preference', {
        method: 'POST',
        data: payload
      })
      if (payload.plan === 'premium') { snackBarSuccess('Redirigientote a mercado pago')(commit) } else snackBarSuccess('Plan basico establecido')(commit)
      return data
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async createSession ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologists/session/create', {
        method: 'POST',
        data: { payload }
      })
      return data
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async cancelSession ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologist/cancel-session', {
        method: 'delete',
        data: payload
      })
      commit('setSessions', data.sessions)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async addSession ({ commit }, { id, idPlan, payload }) {
    try {
      const { data } = await this.$axios(`/psychologists/session/${id}/plan/${idPlan}`, {
        method: 'put',
        data: payload
      })
      snackBarSuccess('Sesión agregada')(commit)
      commit('setSessions', data.sessions)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async updateSession ({ commit }, payload) {
    try {
      const { psyId, userId, sessionId } = payload
      const { data } = await this.$axios(
				`/mercadopago/success-pay/${psyId}/${userId}/${sessionId}`,
				{
				  method: 'POST'
				}
      )
      return data
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async setSchedule ({ commit }, payload) {
    try {
      const { data } = await this.$axios('/psychologist/set-schedule', {
        method: 'PATCH',
        data: { payload }
      })
      return data.psychologist
    } catch (e) {
      snackBarError(e)(commit)
    }
  }
}
