"use strict";

import matchModel from "../models/match";
import { okResponse, conflictResponse } from "../utils/responses/functions";

const createAnswers = async (userId, answers) => {
  // Crea las respuestas de un usuario
  const newAnswers = {
    ...answers,
    user: userId,
  };
  const created = await matchModel.create(newAnswers);
  return okResponse("Respuestas guardadas", { answers: created });
};

const getAnswers = async (userId) => {
  // Obtiene las respuestas de un usuario
  const found = await matchModel.findOne({ user: userId });
  if (!found) return conflictResponse("No se encontraron respuestas");
  return okResponse("Respuestas encontradas", { answers: found });
};

const updateAnswers = async (userId, answers) => {
  // Actualiza las respuestas de un usuario
  const updated = await matchModel.findOneAndUpdate(
    { user: userId },
    { $set: answers },
    { new: true }
  );
  return okResponse("Respuestas actualizadas", { answers: updated });
};

const deleteAnswers = async (userId) => {
  // Elimina las respuestas de un usuario
  const deleted = await matchModel.findOneAndDelete({ user: userId });
  return okResponse("Respuestas eliminadas", { answers: deleted });
};

const matchService = {
  createAnswers,
  getAnswers,
  updateAnswers,
  deleteAnswers,
};

export default Object.freeze(matchService);
