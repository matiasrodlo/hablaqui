import { cloneDeep } from 'lodash'

export default {
  psychologistsMarketPlace: state => {
    const psy = cloneDeep(state.psychologists)
    return psy
      .sort(function randOrd () {
        return Math.round(Math.random()) - 0.5
      })
      .sort(function randOrd (a, b) {
        return b.rating - a.rating
      })
      .sort(function randOrd (a, b) {
        return b.points - a.points
      })
  },
  psychologists: state => state.psychologists,
  psychologist: state => state.psychologist,
  sessions: state => state.sessions,
  transactions: state => state.transactions,
  page: state => state.page,
  payments: state => state.payments,
  loadingPsychologist: state => state.loadingPsychologist,
  sessionsLimit: state => state.sessionsLimit,
  sessionsFormatted: state => state.sessionsFormatted,
  sessionsFormattedAll: state => state.sessionsFormattedAll,
  clients: state => {
    const clients = [...state.clients]
    return clients.sort((a, b) => {
      const fa = a.name.toLowerCase()
      const fb = b.name.toLowerCase()

      if (fa < fb) {
        return -1
      }
      if (fa > fb) {
        return 1
      }
      return 0
    })
  },
  resumeView: state => state.resumeView
}
