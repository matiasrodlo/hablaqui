import { snackBarError } from '@/utils/snackbar'

export default {
  async startConversation ({ commit }, idSpecialist) {
    try {
      await this.$axios.$post(`/chat/start-conversation/${idSpecialist}`)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getMessages ({ commit }) {
    try {
      const { data } = await this.$axios('/chat/get-chats', {
        method: 'GET'
      })
      commit('setChats', data.chats)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async sendMessage ({ commit }, { payload, specialistId, userId }) {
    try {
      const { data } = await this.$axios(`/chat/send-message/${specialistId}/${userId}`, {
        method: 'POST',
        data: { content: payload }
      })
      commit('setChat', data.chat)
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async getChat ({ commit }, { spec, user }) {
    try {
      const { data } = await this.$axios(`/chat/get-messages/${spec}/${user}`, {
        method: 'GET'
      })
      commit('setChat', { ...data.messages, url: data.url })
    } catch (e) {
      snackBarError(e)(commit)
    }
  },
  async updateMessage ({ commit }, chatId) {
    try {
      await this.$axios(`/chat/read-message/${chatId}`, {
        method: 'PATCH'
      })
    } catch (e) {
      snackBarError(e)(commit)
    }
  }
}
