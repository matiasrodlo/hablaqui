"use strict";
import authService from "../services/auth";
import { restResponse } from "../utils/responses/functions";
import { errorCallback } from "../utils/functions/errorCallback";

const authController = {
  async register(req, res) {
    try {
      const { body } = req;
      const { data, code } = await authService.register(body, res);
      return restResponse(data, code, res);
    } catch (error) {
      errorCallback(error, res, "Ha ocurrido un error en el registro");
    }
  },
  async login(req, res) {
    try {
      const { user } = req;
      const { data, code } = await authService.login(user);
      return restResponse(data, code, res);
    } catch (e) {
      errorCallback(e, res);
    }
  },
  async logout(req, res) {
    try {
      const { user } = req;
      const { data, code } = await authService.logout(user);
      return restResponse(data, code, res);
    } catch (e) {
      errorCallback(e, res);
    }
  },
  async sendPasswordRecover(req, res) {
    try {
      const { email } = req.params;
      const { data, code } = await authService.sendPasswordRecover(email);
      return restResponse(data, code, res);
    } catch (e) {
      errorCallback(e, res);
    }
  },
  changeUserPassword(req, res) {
    const { password } = req.body;
    const user = req.user;
    return authService.changeUserPassword(user, password, res);
  },
  async changeVerifiedStatus(req, res) {
    try {
      const { id } = req.params;
      const { data, code } = await authService.changeVerifiedStatus(id);
      return restResponse(data, code, res);
    } catch (error) {
      errorCallback(error, res, "Ha ocurrido un error al verificar");
    }
  },
};

export default Object.freeze(authController);
