import Evaluation from '../../models/evaluation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

export const getAllEvaluationsFunction = async spec => {
  let evaluations = await Evaluation.find({ specialist: spec }).populate('user')

  evaluations = evaluations.flatMap(item => {
    return item.evaluations.map(evaluation => {
      return {
        _id: evaluation._id,
        evaluationsId: item._id,
        comment: evaluation.comment,
        approved: evaluation.approved,
        global: evaluation.global,
        puntuality: evaluation.puntuality,
        attention: evaluation.attention,
        internet: evaluation.internet,
        name: item.user.name,
        userId: item.user._id,
        moderatingDate: evaluation.moderatingDate,
        createdAt: dayjs.tz(dayjs(evaluation.createdAt)).format(),
      }
    })
  })

  return evaluations
}

export const getScores = evaluations => {
  const global =
    evaluations.reduce(
      (sum, value) =>
        typeof value.global === 'number' ? sum + value.global : sum,
      0
    ) / evaluations.length
  const puntuality =
    evaluations.reduce(
      (sum, value) =>
        typeof value.puntuality === 'number' ? sum + value.puntuality : sum,
      0
    ) / evaluations.length
  const attention =
    evaluations.reduce(
      (sum, value) =>
        typeof value.attention === 'number' ? sum + value.attention : sum,
      0
    ) / evaluations.length
  const internet =
    evaluations.reduce(
      (sum, value) =>
        typeof value.internet === 'number' ? sum + value.internet : sum,
      0
    ) / evaluations.length
  return { global, internet, puntuality, attention }
}
