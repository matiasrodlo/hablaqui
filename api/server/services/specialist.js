/**
 * Specialist Service
 * 
 * This module provides specialist management services for the Hablaquí API.
 * It handles specialist profile management, matching, scheduling, and related operations.
 * 
 * @module services/specialist
 */

'use strict'

import { logInfo } from '../config/pino'
import sessionsFunctions from './sessions'
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction'
import Specialist from '../models/specialist'
import Recruitment from '../models/recruitment'
import User from '../models/user'
import { conflictResponse, okResponse } from '../utils/responses/functions'
import dayjs from 'dayjs'
import Sessions from '../models/sessions'
import { getPublicUrl } from '../config/bucket'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import Analytics from 'analytics-node'

// Configure dayjs plugins
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.tz.setDefault('America/Santiago')

// Initialize analytics
const analytics = new Analytics(process.env.SEGMENT_API_KEY)

/**
 * Retrieves all specialists
 * @returns {Promise<Object>} Response object containing list of specialists
 */
const getAll = async () => {
  const specialists = await Specialist.find()
  logInfo('obtuvo todos los especialistas')
  return okResponse('especialistas obtenidos', { specialists })
}

/**
 * Normalizes a score within a range of 0 to 1
 * @param {number} value - Score to normalize
 * @param {number} min - Minimum value of the range
 * @param {number} max - Maximum value of the range
 * @returns {number} Normalized score
 */
const normalize = (value, min, max) => {
  return (value - min) / (max - min)
}

/**
 * Assigns score based on session price
 * @param {Object} spec - Specialist object
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @returns {number} Normalized score
 */
const priceCriterion = (spec, payload, pointsPerCriterion) => {
  let points = 0
  if (payload.price >= spec.sessionPrices.video) {
    points = pointsPerCriterion
  }
  points = normalize(points, 0, pointsPerCriterion)
  return points
}

/**
 * Assigns score based on number of specialty matches
 * @param {Object} spec - Specialist object
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @returns {number} Normalized score
 */
const criteriaNumberSpecialties = (spec, payload, pointsPerCriterion) => {
  const numberOfSpecialities = 3
  let points = 0
  let maximum = 0
  for (let j = 0; j < numberOfSpecialities; j++) {
    if (spec.specialties[j] === payload.themes[j]) {
      points += pointsPerCriterion
    }
    maximum += pointsPerCriterion
  }
  points = normalize(points, 0, maximum)
  return points
}

/**
 * Calculates maximum availability score
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @returns {number} Maximum possible score
 */
const maximumAvailability = (payload, pointsPerCriterion) => {
  let maximum = 0
  if (payload.schedule == 'morning') maximum = (12 - 6) * pointsPerCriterion
  if (payload.schedule == 'midday') maximum = (15 - 13) * pointsPerCriterion
  if (payload.schedule == 'afternoon') {
    maximum = (23 - 16) * pointsPerCriterion
  }
  return maximum
}

/**
 * Assigns score based on availability matches
 * @param {Object} days - Specialist's available days
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @param {number} nextDays - Number of days to check
 * @returns {number} Total points
 */
const pointsDisponibilidad = (days, payload, pointsPerCriterion, nextDays) => {
  let points = 0
  for (let i = 0; i < nextDays; i++) {
    days[i].available.forEach((hora) => {
      if (
        dayjs(hora, 'HH:mm').isBetween(
          dayjs('00:00', 'HH:mm'),
          dayjs('08:59', 'HH:mm')
        ) &&
        payload.schedule == 'early'
      ) {
        points += pointsPerCriterion
      } else if (
        dayjs(hora, 'HH:mm').isBetween(
          dayjs('09:00', 'HH:mm'),
          dayjs('11:59', 'HH:mm')
        ) &&
        payload.schedule == 'morning'
      ) {
        points += pointsPerCriterion
      } else if (
        dayjs(hora, 'HH:mm').isBetween(
          dayjs('12:00', 'HH:mm'),
          dayjs('13:59', 'HH:mm')
        ) &&
        payload.schedule == 'midday'
      ) {
        points += pointsPerCriterion
      } else if (
        dayjs(hora, 'HH:mm').isBetween(
          dayjs('14:00', 'HH:mm'),
          dayjs('17:59', 'HH:mm')
        ) &&
        payload.schedule == 'afternoon'
      ) {
        points += pointsPerCriterion
      } else if (
        dayjs(hora, 'HH:mm').isBetween(
          dayjs('18:00', 'HH:mm'),
          dayjs('23:59', 'HH:mm')
        ) &&
        payload.schedule == 'night'
      ) {
        points += pointsPerCriterion
      }
    })
  }
  return points
}

/**
 * Assigns score based on session availability
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @param {Object} days - Specialist's available days
 * @returns {number} Normalized score
 */
const criterioDisponibilidad = (payload, pointsPerCriterion, days) => {
  let points = 0
  const nextDays = 3
  const maximum = maximumAvailability(payload, pointsPerCriterion)
  points = pointsDisponibilidad(days, payload, pointsPerCriterion, nextDays)
  points = normalize(points, 0, maximum)
  return points
}

/**
 * Assigns score based on therapeutic model matches
 * @param {Object} spec - Specialist object
 * @param {Object} payload - Patient preferences
 * @param {number} pointsPerCriterion - Points per match
 * @returns {number} Normalized score
 */
const criterioModeloTeraupetico = (spec, payload, pointsPerCriterion) => {
  const modelQuantity = 3
  let points = 0
  let maximum = 0
  for (let j = 0; j < modelQuantity; j++) {
    if (spec.model[j] === payload.model[j]) points += pointsPerCriterion
    maximum += pointsPerCriterion
  }
  points = normalize(points, 0, maximum)
  return points
}

/**
 * Calculates weighted match score for specialists
 * @param {Array} matchedList - List of matched specialists
 * @param {Object} payload - Patient preferences
 * @returns {Promise<Array>} List of specialists with weighted scores
 */
const ponderationMatch = async (matchedList, payload) => {
  const pointsPerCriterion = 3
  // Ponderado es un array que contiene el porcentaje de ponderación de cada criterio
  const weighted = [0.1, 0.25, 0.25, 0.2, 0.1]
  // Devuelve una promesa que termina correctamente cuando todas las promesas en el argumento iterable han sido concluídas con éxito
  let newMatchedList = await Promise.all(
    matchedList.map(async (spec) => {
      let criteria = 0
      let points = normalize(spec.points, 0, 100) * weighted[criteria]
      criteria++
      // Se le asigna un puntaje según la cantidad de coincidencias (3 por que son 3 especialidades)
      points +=
        weighted[criteria] *
        criteriaNumberSpecialties(spec, payload, pointsPerCriterion)
      criteria++
      // Se obtiene la disponibilidad del especialista y recorre los primeros 3 días
      const days = await sessionsFunctions.getFormattedSessionsForMatch(
        spec._id
      )
      points +=
        weighted[criteria] *
        criterioDisponibilidad(payload, pointsPerCriterion, days)
      criteria++
      // Se obtiene el precio del especialista y se le asigna un puntaje dado por el precio
      points +=
        priceCriterion(spec, payload, pointsPerCriterion) * weighted[criteria]
      criteria++
      // Se obtiene el modelo terapeutico del especialista y se le asigna un puntaje dado por el modelo
      points +=
        criterioModeloTeraupetico(spec, payload, pointsPerCriterion) *
        weighted[criteria]
      criteria++
      // De documento de mongo se pasa a un formato de objeto JSON
      let specialist = JSON.stringify(spec)
      specialist = JSON.parse(specialist)
      return { ...specialist, points }
    })
  )
  // Se ordena el arreglo por puntuación manual del especialista
  newMatchedList = newMatchedList.sort((a, b) => b.points - a.points)
  // Se imprime los puntajes de cada especialista
  return newMatchedList
}

/**
 * Classifies specialists based on match scores
 * @param {Array} matchedList - List of matched specialists
 * @param {Object} payload - Patient preferences
 * @returns {Promise<Array>} Classified list of specialists
 */
const specialistClasification = async (matchedList, payload) => {
  const nextDays = 7
  let points = 0
  const resultList = []
  const pointsPerCriterion = 1
  // Entre los especialistas ya ponderados se obtiene cual es el que tiene mayor disponibilidad
  const newMatchedList = await Promise.all(
    matchedList.map(async (spec) => {
      spec.points = 0
      const days = await sessionsFunctions.getFormattedSessionsForMatch(
        spec._id
      )
      points = pointsDisponibilidad(days, payload, pointsPerCriterion, nextDays)
      let specialist = JSON.stringify(spec)
      specialist = JSON.parse(specialist)
      return { ...specialist, points }
    })
  )
  newMatchedList.sort((a, b) => b.points - a.points)
  // Se elmina el primer elemento del arreglo
  resultList.push(newMatchedList.shift(0))
  // Se obtiene el especialista que tenga menor precio
  if (
    newMatchedList[0].sessionPrices.video <
    newMatchedList[1].sessionPrices.video
  ) {
    resultList.push(newMatchedList[0])
    resultList.unshift(newMatchedList[1])
  } else {
    resultList.push(newMatchedList[1])
    resultList.unshift(newMatchedList[0])
  }
  return resultList
}

/**
 * Matches a patient with suitable specialists
 * @param {Object} body - Matching criteria
 * @returns {Promise<Object>} Response object containing matched specialists
 */
const match = async (body) => {
  const { payload } = body
  let matchedSpecialists = []
  let perfectMatch = true

  if (payload.gender == 'transgender') {
    // Machea por género (transgenero)
    matchedSpecialists = await Specialist.find({
      isTrans: true,
      specialties: { $in: payload.themes }, // Filtra por especialidades
    })
  } else {
    // Si no es transgenero
    matchedSpecialists = await Specialist.find({
      gender: payload.gender || {
        // Se buscan los especialistas por género, prioriza payload.gender el genero entregado por el cliente.
        $in: ['male', 'female', 'transgender'],
      },
      specialties: { $in: payload.themes },
    })
  }

  // Agregar de nuevo modelo terapeutico
  // Se obtiene la lista de especialistas que coinciden con los temas
  if (matchedSpecialists.length < 3) {
    matchedSpecialists = await Specialist.find()
    perfectMatch = false
  }

  // Se busca el mejor match según criterios
  matchedSpecialists = await ponderationMatch(matchedSpecialists, payload)

  // Se deja solo los 3 mejores especialistas
  while (matchedSpecialists.length > 3) {
    matchedSpecialists.pop()
  }

  // Se busca entre los primeros 3 especialistas el más barato, con mayor disponibilidad, y el mejor match
  matchedSpecialists = await specialistClasification(
    matchedSpecialists,
    payload
  )

  return okResponse('especialistas encontrados', {
    matchedSpecialists,
    perfectMatch,
  })
}

/**
 * Reschedules a therapy session
 * @param {string} sessionsId - Session document ID
 * @param {string} planId - Plan ID
 * @param {string} sessionId - Session ID
 * @param {string} newDate - New session date
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const rescheduleSession = async (sessionsId, planId, sessionId, newDate) => {
  // Se da formato a la fecha
  newDate = dayjs(newDate, 'YYYY-MM-DDTHH:mm').format('MM/DD/YYYY HH:mm')
  // Se busca la sesion que se va a reprogramar y se actualiza la fecha
  const sessions = await Sessions.findOneAndUpdate(
    {
      _id: sessionsId,
      'plan._id': planId,
      'plan.session._id': sessionId,
    },
    {
      $set: {
        'plan.$[].session.$[session].date': newDate,
      },
    },
    { arrayFilters: [{ 'session._id': sessionId }], new: true }
  ).populate('specialist user')
  // Se verifica que la sesion exista
  if (!sessions) {
    return conflictResponse('Sesion no encontrada')
  }
  // Se verifica si el plan sigue vigente
  sessions.plan.forEach((plan) => {
    for (let i = 0; i < plan.session.length; i++) {
      if (
        plan.session[i]._id.toString() === sessionId.toString() &&
        dayjs(plan.session[i].date, 'MM/DD/YYYY HH:mm').isAfter(
          dayjs(plan.expiration, 'MM/DD/YYYY HH:mm')
        ) &&
        plan._id.toString() === planId.toString()
      ) {
        // Se actualiza la fecha de vencimiento a 50 minutos despues de la ultima sesion
        plan.expiration = dayjs
          .tz(dayjs(newDate, 'MM/DD/YYYY HH:mm').add(50, 'minutes'))
          .format()
      }
    }
  })
  await sessions.save()
  return okResponse('Hora actualizada', { sessions })
}

/**
 * Updates a specialist's subscription plan
 * @param {string} specialistId - Specialist ID
 * @param {Object} planInfo - New plan information
 * @returns {Promise<Object>} Response object containing updated plan
 */
const updatePlan = async (specialistId, planInfo) => {
  // Funcion para actualizar el plan de un especialista, se busca el especialista por su id y se actualiza
  const updatedSpecialist = await Specialist.findByIdAndUpdate(
    specialistId,
    {
      $push: {
        specPlans: { paymentStatus: 'success', ...planInfo },
      },
    },
    { new: true }
  )
  return okResponse('Plan creado', { specialist: updatedSpecialist })
}

/**
 * Retrieves a specialist by username
 * @param {string} username - Specialist's username
 * @returns {Promise<Object>} Response object containing specialist profile
 */
const getByData = async (username) => {
  // Funcion para obtener un especialista por su username
  const usernameSearch = await Specialist.findOne({ username })
  if (!usernameSearch) {
    const idSearch = await Specialist.findOne({ _id: username })
    return okResponse('Especialista encontrado', {
      specialist: idSearch,
    })
  }
  return okResponse('Especialista encontrado', {
    specialist: usernameSearch,
  }) // Se retorna una respuesta con el especialista
}

/**
 * Updates a specialist's availability schedule
 * @param {Object} user - Specialist object
 * @param {Object} payload - New schedule information
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const setSchedule = async (user, payload) => {
  let response
  // Si el user es un psicologo, se busca el psicologo por su id y se actualiza el horario
  if (user.role === 'superuser') {
    response = await Specialist.findByIdAndUpdate(
      payload.specialist,
      {
        $set: {
          schedule: {
            monday: payload.monday,
            tuesday: payload.tuesday,
            wednesday: payload.wednesday,
            thursday: payload.thursday,
            friday: payload.friday,
            saturday: payload.saturday,
            sunday: payload.sunday,
          },
        },
      },
      { new: true }
    )
  } else {
    if (user.specialist) {
      response = await Specialist.findByIdAndUpdate(
        user.specialist,
        {
          $set: {
            schedule: {
              monday: payload.monday,
              tuesday: payload.tuesday,
              wednesday: payload.wednesday,
              thursday: payload.thursday,
              friday: payload.friday,
              saturday: payload.saturday,
              sunday: payload.sunday,
            },
          },
        },
        { new: true }
      )
    }
    // Si el user es un postulante (specialist === undefined), pero no un user
    else {
      response = await Recruitment.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            schedule: {
              monday: payload.monday,
              tuesday: payload.tuesday,
              wednesday: payload.wednesday,
              thursday: payload.thursday,
              friday: payload.friday,
              saturday: payload.saturday,
              sunday: payload.sunday,
            },
          },
        },
        { new: true }
      )
    }
  }
  return okResponse('Horario actualizado', {
    specialist: response,
  })
}

/**
 * Updates a specialist's payment method
 * @param {Object} user - Specialist object
 * @param {Object} payload - New payment method information
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const updatePaymentMethod = async (user, payload) => {
  if (user.role !== 'specialist') {
    return conflictResponse('No eres un especialista.')
  } else {
    // Si el user es un especialista se busca por su id y se actualiza el metodo de pago
    let foundSpecialist
    if (user.specialist) {
      foundSpecialist = await Specialist.findById(user.specialist)
    } else {
      // Si el user es un postulante
      foundSpecialist = await Recruitment.findOne({
        email: user.email,
      })
    }
    // Se crea un nuevo metodo de pago, se agregan los datos y se guarda
    const newPaymentMethod = {
      bank: payload.bank || foundSpecialist.paymentMethod.bank,
      accountType:
        payload.accountType || foundSpecialist.paymentMethod.accountType,
      accountNumber:
        payload.accountNumber || foundSpecialist.paymentMethod.accountNumber,
      rut: payload.rut || foundSpecialist.paymentMethod.rut,
      name: payload.name || foundSpecialist.paymentMethod.name,
      email: payload.email || foundSpecialist.paymentMethod.email,
    }
    foundSpecialist.paymentMethod = newPaymentMethod
    await foundSpecialist.save()
    return okResponse('Metodo de pago actualizado', {
      specialist: foundSpecialist,
    })
  }
}

/**
 * Updates a specialist's profile information
 * @param {Object} user - Specialist object
 * @param {Object} profile - Updated profile information
 * @returns {Promise<Object>} Response object containing updated profile
 */
const updateSpecialist = async (user, profile) => {
  if (user.role === 'user') return conflictResponse('No tienes poder.')
  if (user.role === 'superuser' && !user.specialist) {
    user.specialist = profile._id
  }
  if (user.specialist) {
    // Si el user es un especialista intenta actualizar el especialista
    try {
      const spec = await Specialist.findById(profile._id)
      if (spec.sessionPrices.video !== profile.sessionPrices.video) {
        // Si existe una fecha de vencimiento, y esta está antes de la fecha actual adelantado un mes
        if (
          spec.stampSetPrices &&
          dayjs().isBefore(dayjs(spec.stampSetPrices).add(1, 'months'))
        ) {
          profile.sessionPrices = spec.sessionPrices
        } else profile.stampSetPrices = dayjs.tz().format()
      }
      const updated = await Specialist.findByIdAndUpdate(profile._id, profile, {
        new: true,
        runValidators: true,
        context: 'query',
      })
      // Hace el trackeo de segment
      if (
        process.env.API_URL.includes('hablaqui.cl') ||
        process.env.DEBUG_ANALYTICS === 'true'
      ) {
        const getUser = await User.findOne({ email: user.email })
        const id = getUser._id
        analytics.track({
          userId: id.toString(),
          event: 'spec-updated-profile',
        })
        analytics.identify({
          userId: id.toString(),
          traits: {
            email: updated.email,
            name: updated.name,
            lastName: updated.lastName,
            username: updated.username,
            code: updated.code,
            avatar: updated.avatar,
            country: updated.country,
            marketplaceVisibility: updated.preferences.marketplaceVisibility,
            birthDate: updated.birthDate,
            comuna: updated.comuna,
            region: updated.region,
            isVerified: updated.isVerified,
            approveAvatar: updated.approveAvatar,
            freeFirstSession: updated.freeFirstSession,
            hasPersonalDescription: updated.personalDescription != '',
            hasProfessionalDescription: updated.professionalDescription != '',
            personalDescription: updated.personalDescription,
            professionalDescription: updated.professionalDescription,
            role: 'specialist',
          },
        })
      }

      logInfo(user.email, 'actualizo su perfil de especialista')
      return okResponse('Actualizado exitosamente', {
        specialist: updated,
      })
    } catch (err) {
      logInfo(err.stack)
      return conflictResponse(
        'Ocurrió un error al actualizar el perfil. Verifica los campos.'
      )
    }
  } else {
    try {
      // Se intenta actualizar el especialista
      const updated = await Recruitment.findByIdAndUpdate(
        profile._id,
        profile,
        {
          new: true,
        }
      )
      // Se hace el trackeo de segment
      if (
        process.env.API_URL.includes('hablaqui.cl') ||
        process.env.DEBUG_ANALYTICS === 'true'
      ) {
        analytics.track({
          userId: user.id.toString(),
          event: 'recruited-updated-profile',
        })
        analytics.identify({
          userId: user.id.toString(),
          traits: {
            email: updated.email,
            name: updated.name,
            lastName: updated.lastName,
            username: updated.username,
            code: updated.code,
            avatar: updated.avatar,
            country: updated.country,
            marketplaceVisibility: updated.preferences.marketplaceVisibility,
            birthDate: updated.birthDate,
            comuna: updated.comuna,
            region: updated.region,
            isVerified: updated.isVerified,
            approveAvatar: updated.approveAvatar,
            freeFirstSession: updated.freeFirstSession,
            hasPersonalDescription: updated.personalDescription != '',
            hasProfessionalDescription: updated.professionalDescription != '',
            personalDescription: updated.personalDescription,
            professionalDescription: updated.professionalDescription,
            role: 'recruited',
          },
        })
      }
      return okResponse('Actualizado exitosamente', {
        specialist: updated,
      })
    } catch (err) {
      logInfo(err.stack)
      return conflictResponse(
        'Ocurrió un error al actualizar el perfil. Verifica los campos.'
      )
    }
  }
}

/**
 * Deletes a specialist
 * @param {Object} user - Specialist object
 * @param {string} id - Specialist ID
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const deleteOne = async (user, id) => {
  if (user.role !== 'superuser') {
    return conflictResponse(
      'No tienes permisos suficientes para realizar esta acción'
    )
  }

  // Se elimina el especialista, se busca por id y se elimina
  await Specialist.deleteOne({ _id: id })
  const specialists = await Specialist.find()
  return okResponse('Especialista eliminado', { specialists })
}

/**
 * Updates a specialist's session prices
 * @param {Object} user - Specialist object
 * @param {Object} newPrice - New price information
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const setPrice = async (user, newPrice) => {
  newPrice = Number(newPrice)
  if (user.role != 'specialist') {
    return conflictResponse('No tienes permisos')
  }
  const spec = await Specialist.findById(user.specialist)

  // Si el especialista ya esta establecido, y el precio aún no expira
  if (
    spec.stampSetPrices &&
    dayjs().isBefore(dayjs(spec.stampSetPrices).add(1, 'months'))
  ) {
    return conflictResponse(
      'Tiene que esperar 1 mes para volver a cambiar el precio'
    )
  }

  // Se actualiza el precio
  const updatedSpecialist = await Specialist.findByIdAndUpdate(
    user.specialist,
    {
      sessionPrices: {
        text: newPrice * 0.75,
        video: newPrice,
        full: newPrice * 1.25,
      },
      stampSetPrices: dayjs.tz().format(),
    },
    { new: true }
  )
  return okResponse('Precios actualizados', {
    specialist: updatedSpecialist,
  })
}

/**
 * Retrieves all clients assigned to a specialist
 * @param {Object} specialist - Specialist object
 * @returns {Promise<Object>} Response object containing list of clients
 */
const getClients = async (specialist) => {
  // Se busca las sessiones de un especialista en particular y se filtran por las que estan pagadas
  const sessions = await Sessions.find({
    specialist,
  }).populate('user')

  return okResponse('Usuarios encontrados', {
    users: sessions
      .filter((item) => item.user)
      .map((item) => ({
        _id: item.user._id,
        avatar: item.user.avatar,
        avatarThumbnail: item.user.avatarThumbnail,
        createdAt: item.user.createdAt,
        direction: item.user.direction,
        email: item.user.email,
        fullname: `${item.user.name} ${
          item.user.lastName ? item.user.lastName : ''
        }`,
        lastName: item.user.lastName,
        birthDate: item.user.birthDate,
        lastSession: getLastSession(item) || 'N/A',
        name: item.user.name,
        observation: item.observation,
        phone: item.user.phone,
        plan: item.plan.find(
          (plan) =>
            plan.payment === 'success' &&
            dayjs().isBefore(dayjs(plan.expiration))
        ),
        role: item.user.role,
        roomsUrl: item.roomsUrl,
        rut: item.user.rut,
        sessionsId: item._id,
      })),
  })
}

/**
 * Gets the last session for a client
 * @param {Object} item - Client session information
 * @returns {Object} Last session details
 */
const getLastSession = (item) => {
  // Se obtiene la ultima sesion de un documento Sessions, se le da formato, se ordena, se filtra y se retorna
  return item.plan
    .flatMap((plan) =>
      plan.session.map((session) =>
        dayjs.tz(dayjs(session.date, 'MM/DD/YYYY HH:mm')).format('DD/MM/YYYY')
      )
    )
    .sort((a, b) => new Date(b) - new Date(a))
    .find((sessionDate) =>
      dayjs(sessionDate, 'DD/MM/YYYY').isSameOrBefore(dayjs())
    )
}

/**
 * Searches for clients based on criteria
 * @param {string} search - Search query
 * @returns {Promise<Object>} Response object containing matching clients
 */
const searchClients = async (search) => {
  // Se busca un usuario por nombre y correo
  const foundUser = await User.find({ email: search, name: search })
  if (!foundUser) {
    return okResponse('No se encontró al usuario', { users: [] })
  }
  return okResponse('Usuario encontrado', { users: foundUser })
}

/**
 * Checks if a username is available
 * @param {string} username - Username to check
 * @returns {Promise<Object>} Response object indicating availability
 */
const usernameAvailable = async (username) => {
  // Se verifica si el nombre de usuario ya existe para saber si el usuario está disponible
  let available = true
  if (await Specialist.exists({ username })) available = false
  return okResponse(
    available ? 'Usuario disponible' : 'Usuario ya esta ocupado',
    { available }
  )
}

/**
 * Updates a specialist's formation and experience
 * @param {Object} user - Specialist object
 * @param {Object} payload - Updated formation and experience information
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const updateFormationExperience = async (user, payload) => {
  if (user.role != 'specialist') {
    return conflictResponse('No eres especialista')
  }

  /**
   * Payload schema:
   * 	models: array
   * 	specialties: array
   * 	languages: array
   * 	formation: array
   * 	experience: array
   */

  const updatedSpecialist = await Specialist.findByIdAndUpdate(
    user.specialist,
    payload,
    { new: true }
  )
  return okResponse('especialista actualizado', {
    specialist: updatedSpecialist,
  })
}

/**
 * Uploads a specialist's profile picture
 * @param {string} specID - Specialist ID
 * @param {Object} picture - Picture information
 * @returns {Promise<Object>} Response object containing updated profile
 */
const uploadProfilePicture = async (specID, picture) => {
  if (!picture) return conflictResponse('No se ha enviado ninguna imagen')
  const { name, lastName, _id } = await User.findById(specID)
  const awsname = `${specID}-${name}-${lastName}`
  await uploadFile(awsname, picture.buffer)

  // Se hace el trackeo de la imagen en segment
  if (
    process.env.API_URL.includes('hablaqui.cl') ||
    process.env.DEBUG_ANALYTICS === 'true'
  ) {
    analytics.track({
      userId: _id.toString(),
      event: 'updated-profile-picture',
      properties: {
        avatar: getPublicUrlAvatar(awsname),
      },
    })
  }

  await Specialist.findByIdAndUpdate(specID, {
    avatar: getPublicUrlAvatar(awsname),
    avatarThumbnail: getPublicUrlAvatarThumb(awsname),
  })

  return okResponse('Imagen subida', {
    // Se retorna una respuesta de exito
    avatar: getPublicUrlAvatar(awsname),
    avatarThumbnail: getPublicUrlAvatarThumb(awsname),
  })
}

/**
 * Approves a specialist's profile picture
 * @param {Object} user - Specialist object
 * @param {string} id - Specialist ID
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const approveAvatar = async (user, id) => {
  if (user.role !== 'superuser') {
    return conflictResponse(
      'No tienes permisos suficientes para realizar esta acción'
    )
  }

  // Se busca el especialista y se le aprueba la imagen de avatar
  const specialist = await Specialist.findByIdAndUpdate(
    id,
    {
      approveAvatar: true,
    },
    { new: true }
  )
  return okResponse('Avatar aprobado', {
    specialist,
  })
}

/**
 * Updates a specialist's status to accept immediate attention
 * @param {Object} spec - Specialist object
 * @returns {Promise<Object>} Response object indicating success or failure
 */
const changeToInmediateAttention = async (spec) => {
  let specialist = await Specialist.findById(spec)
  // Si la atención inmediata está activada, se desactiva
  if (specialist.inmediateAttention.activated) {
    specialist = await Specialist.findOneAndUpdate(
      { _id: spec },
      {
        $set: {
          inmediateAttention: {
            activated: false,
            expiration: '',
          },
        },
      },
      { new: true }
    )
  } else {
    // Si no esta activado el plan inmediato de atención
    let sessions = await getAllSessionsFunction(spec)
    const now = new Date()
    // Se filtran las sesiones que si la fecha de la sesión es menor a la fecha actual mas 3 horas
    sessions = sessions.filter((session) => {
      const date = dayjs.tz(dayjs(session.date)).format('DD/MM/YYYY HH:mm')
      return (
        session.status !== 'success' &&
        dayjs(date).isBefore(dayjs(now).add(3, 'hours')) &&
        dayjs(date).add(50, 'minutes').isAfter(dayjs(now))
      )
    })

    if (sessions.length !== 0) {
      return conflictResponse('Tiene sesiones próximas')
    }

    // Se activa el plan inmediato de atención
    specialist = await Specialist.findOneAndUpdate(
      { _id: spec },
      {
        $set: {
          inmediateAttention: {
            activated: true,
            expiration: dayjs.tz(dayjs(now).add(1, 'hour')).format(),
          },
        },
      },
      { new: true }
    )
  }

  const msj = specialist.inmediateAttention.activated
    ? 'Estaras disponible durante las proxima 3 horas'
    : 'Atención inmediata desactivada'

  return okResponse(msj, {
    specialist,
  })
}

export default {
  getAll,
  match,
  rescheduleSession,
  getByData,
  setSchedule,
  updatePaymentMethod,
  updateSpecialist,
  deleteOne,
  setPrice,
  getClients,
  searchClients,
  usernameAvailable,
  updateFormationExperience,
  approveAvatar,
  uploadProfilePicture,
  changeToInmediateAttention,
}
