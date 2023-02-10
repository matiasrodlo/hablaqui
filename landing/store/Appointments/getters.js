import { cloneDeep } from 'lodash'

export default {
  // specialties formateadas
  appointments: state => cloneDeep(state.appointments),
  // specialties sin formatear
  specialties: state => cloneDeep(state.appointments)
}
