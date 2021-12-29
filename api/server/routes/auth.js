"use strict";

import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth";
import validation from "../middleware/validation";
import authSchema from "../schemas/auth";

const authRouter = Router();

/**
 * Endpoint de autenticacion.
 */
authRouter.post(
  "/auth/login",
  [validation(authSchema.login, "body"), passport.authenticate("local")],
  authController.login
);

/**
 * No se usa.
 */
authRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  }),
  authController.generateJwt
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.FRONTEND_URL + "/auth",
  }),
  authController.googleAuthCallback
);

/**
 * Endpoint de registro.
 * req.body = { email: string, password: string }
 */
authRouter.post(
  "/auth/register",
  validation(authSchema.register, "body"),
  authController.register
);

/**
 * Recuperar contraseña
 * req.body = { email: string }
 */
authRouter.get(
  "/auth/send-password-recover/:email",
  authController.sendPasswordRecover
);

/**
 * Cambiar contraseña
 * req.body = { password: string }
 */
authRouter.put(
  "/auth/user/password",
  passport.authenticate("jwt"),
  authController.changeUserPassword
);

export default authRouter;
