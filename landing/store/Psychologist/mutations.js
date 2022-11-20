import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateObjectInArray from '@/plugins/updateArray'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

export default {
  setPsychologists (state, value) {
    state.psychologists = Object.freeze(value)
  },
  setPsychologist (state, value) {
    state.psychologist = value
  },
  setPsychologistsPagination (state, value) {
    state.psychologists = [...state.psychologists, ...value]
  },
  setLoadingPsychologist (state, value) {
    state.loadingPsychologist = value
  },
  setTransactions (state, value) {
    state.transactions = value
  },
  setPage (state, value) {
    state.page = value
  },
  setSessions (state, value) {
    state.sessions = value
  },
  setPayments (state, value) {
    state.payments = value
  },
  setCustomSessions (state, value) {
    state.sessions.push(value)
  },
  setOneSessions (state, { payload, id }) {
    state.sessions = updateObjectInArray(
      state.sessions,
      payload.find(session => session._id === id)
    )
  },
  setSessionsFormatted (state, sessions) {
    dayjs.locale('es')
    state.sessionsFormatted = sessions.map(session => ({
      ...session,
      text: dayjs(session.text).format('ddd'),
      day: dayjs(session.day, 'DD MMM').format('DD MMM')
    }))
  },
  setSessionsFormattedAll (state, items) {
    dayjs.locale('es')
    state.sessionsFormattedAll = items.map(item => {
      return {
        psychologist: item.psychologist,
        sessions: item.sessions.map(el => ({
          ...el,
          text: dayjs(el.text).format('ddd'),
          day: dayjs(el.day, 'DD MMM').format('DD MMM')
        }))
      }
    })
  },
  setSessionsLimit (state, items) {
    dayjs.locale('es')
    state.sessionsLimit = state.sessionsLimit.concat(
      items.map(item => {
        return {
          psychologist: item.psychologist,
          sessions: item.sessions.map(el => ({
            ...el,
            text: dayjs(el.text).format('ddd'),
            day: dayjs(el.day, 'DD MMM').format('DD MMM')
          }))
        }
      })
    )
  },
  setClients (state, value) {
    state.clients = value
  },
  setResumeView (state, value) {
    state.resumeView = value
  },
  setLoading (state) {
    state.loading = !state.loading
  }
}
