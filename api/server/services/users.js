"use strict"; // Sirve para que el código sea mas estricto y evitar errores

import User from "../models/user";
import Psychologist from "../models/psychologist";
import Recruitment from "../models/recruitment";
import { logInfo } from "../config/winston";
import bcrypt from "bcryptjs";
import servicesAuth from "./auth";
import { actionInfo } from "../utils/logger/infoMessages";
import { conflictResponse, okResponse } from "../utils/responses/functions";
import { bucket } from "../config/bucket";
import mailServiceAccount from "../utils/functions/mails/accountsShares";
import Sessions from "../models/sessions";
import Coupon from "../models/coupons";
import moment from "moment";
import crypto from "crypto";
import { room } from "../config/dotenv";
import Auth from "./auth";
import Analytics from "analytics-node";
moment.tz.setDefault("America/Santiago");

const analytics = new Analytics(process.env.SEGMENT_API_KEY);

const usersService = {
  async getProfile(id) {
    // Se busca al usuario con su id, se comprueba que exista y se retorna el objeto del usuario
    const user = await User.findById(id);
    if (!user) {
      return conflictResponse("perfil no encontrado");
    }
    return okResponse("perfil obtenido", {
      user: await servicesAuth.generateUser(user),
    });
  },
  async changeActualPassword(user, newPassword) {
    // Se encripta la contraseña, se edita la contraseña del usuario y se guarda en la base de datos
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    logInfo(actionInfo(user.email, "actualizo su contraseña"));
    return okResponse("Actualizó su contraseña");
  },
  async updatePassword(user, oldPassword, newPassword) {
    // Busca al usuario por su id, se comprueba que la contraseñas sean distintas (actual y nueva)
    const foundUser = await User.findById(user._id);
    const samePassword = oldPassword === newPassword;
    if (samePassword)
      return conflictResponse("no puede ser la misma contraseña");
    // Se comprueba que el usuario haya introducido correctamente su contraseña actual
    const isEqual = bcrypt.compareSync(oldPassword, foundUser.password);
    if (!isEqual)
      return conflictResponse("la contraseña anterior no es correcta");
    else return await this.changeActualPassword(foundUser, newPassword);
  },
  async passwordRecovery(user, newPassword) {
    // Se busca al usuario por su id, luego comparar la contraseña actual con la nueva bajo la lógica
    // de que no deben ser iguales, luego se cambia la contraseña actual por la nueva
    const foundUser = await User.findById(user._id);
    const isEqual = bcrypt.compareSync(newPassword, foundUser.password);
    if (isEqual) return conflictResponse("no puede ser la misma contraseña");
    else return await this.changeActualPassword(foundUser, newPassword);
  },
  async updateProfile(id, profile) {
    // Busca el usuario por su id y se actualiza su perfil con los datos modificados en profile
    const updated = await User.findByIdAndUpdate(id, profile, {
      new: true,
      runValidators: true,
      context: "query",
    });

    return okResponse("Actualizado exitosamente", {
      user: await servicesAuth.generateUser(updated),
    });
  },

  async updatePlan(user, newPlan) {
    // Busca el usuario por su id y actualiza el plan con el nuevo plan newPlan
    let updated = null;
    updated = await User.findByIdAndUpdate(
      user._id,
      { myPlan: newPlan },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    logInfo(actionInfo(user.email, "actualizo su plan"));
    return okResponse("plan actualizado", { profile: updated });
  },
  async updatePsychologist(user, newPsychologist, oldPsychologist) {
    // Se realiza una busqueda del plan del consultante
    const oldSession = await Sessions.findOne({
      psychologist: oldPsychologist,
      user: user,
    });

    // Se verifica que la sesión exista
    if (!oldSession) {
      return conflictResponse("No se encontró la sesión");
    }
    if (oldSession.plan.length === 0) {
      return conflictResponse("No se encontró el plan");
    }
    const ultimoPlan = oldSession.plan[oldSession.plan.length - 1];
    if (Date.now() > Date.parse(ultimoPlan.expiration)) {
      return conflictResponse("El plan ha expirado");
    }

    // Se cuenta la cantidad de sesiones agendadas que aún no han sido realizadas
    const sessionesPendientes = ultimoPlan.session.filter(
      (session) => session.status === "pending" // || session.status === 'upnext'
    ).length;
    const sessionesRealizadas = ultimoPlan.session.filter(
      (session) =>
        Date.parse(session.date) < Date.now() && session.status === "success"
    ).length;

    // Se crea un nuevo plan para el consultante con el nuevo psicólogo
    const newPlan = {
      title: ultimoPlan.title,
      period: ultimoPlan.period,
      totalPrice: ultimoPlan.totalPrice,
      sessionPrice: ultimoPlan.sessionPrice,
      payment: ultimoPlan.payment,
      datePayment: ultimoPlan.datePayment,
      expiration: ultimoPlan.expiration,
      usedCoupon: ultimoPlan.usedCoupon,
      totalSessions: (
        Number(ultimoPlan.totalSessions) - sessionesRealizadas
      ).toString(),
      remainingSessions: (
        Number(ultimoPlan.remainingSessions) + sessionesPendientes
      ).toString(),
      tokenToPay: ultimoPlan.tokenToPay,
      session: [],
    };

    // Se busca si el usuario tiene una sesión con el nuevo psicólogo, si no la tiene se crea una
    let newSession = await Sessions.findOne({
      psychologist: newPsychologist,
      user: user,
    });
    if (newSession === null) {
      newSession = await Sessions.create({
        psychologist: newPsychologist,
        user: user,
        plan: [newPlan],
        roomsUrl: oldSession.roomsUrl,
      });
    } else {
      newSession.plan.push(newPlan);
      await newSession.save();
    }

    // Se cambia el plan de expiración del plan antiguo
    ultimoPlan.expiration = moment().subtract(1, "days").format();

    // Se filtran las sesiones que no a la fecha no se han realizado
    ultimoPlan.session = ultimoPlan.session.filter(
      (session) =>
        Date.parse(session.date) < Date.now() && session.status === "success"
    );

    ultimoPlan.remainingSessions = 0;

    await oldSession.save();
    return okResponse("plan actualizado", { profile: user });
  },
  async uploadAvatar({
    userLogged,
    avatar,
    avatarThumbnail,
    role,
    idPsychologist,
    _id,
    oldAvatar,
    oldAvatarThumbnail,
  }) {
    let psychologist;
    let userRole = role;
    let userID = _id;

    // Se comprueba que exista una imagen de avatar y una imagen de avatarThumbnail
    if (!avatar && !avatarThumbnail)
      return conflictResponse("Ha ocurrido un error inesperado");

    // En caso de que el usuario sea super usuario se busca al psicologo por su id para
    // encontrar al usuario, y se obtiene el id y su rol del usuario.
    if (userLogged.role === "superuser") {
      const psy = await Psychologist.findById(idPsychologist);
      const userSelected = await User.findOne({
        email: psy.email,
        role: "psychologist",
      });
      userRole = userSelected.role;
      userID = userSelected._id;
    }

    // Hace la distinción de casos por que los psy tienen el modelo de usuario y psicologo
    if (userRole === "psychologist") {
      const userData = await User.findById(userID);
      await mailServiceAccount.sendUploadPicture(userData);
      // En caso de los psy, en el campo de psy, se les asigna el ID del documento de psicologo
      if (userData.psychologist) {
        // La imagen queda a probación al subirla
        psychologist = await Psychologist.findByIdAndUpdate(
          idPsychologist,
          {
            avatar,
            avatarThumbnail,
            approveAvatar: false,
          },
          { new: true }
        );
      } else {
        // Si por alguna razón no esta asignado el psy, se busca su documento de recruitment y actualiza la imagen
        psychologist = await Recruitment.findByIdAndUpdate(
          userID,
          {
            avatar,
            avatarThumbnail,
            approveAvatar: false,
          },
          { new: true }
        );
      }
    }

    // Se actualiza la foto en el documento de usuario, se elimina las fotos antiguas, y se retorna el objeto actualizado
    const profile = await User.findByIdAndUpdate(
      userID,
      {
        avatar,
        avatarThumbnail,
      },
      {
        new: true,
      }
    );
    await this.deleteFile(oldAvatar, oldAvatarThumbnail).catch(console.error);
    logInfo(`${userLogged.email} actualizo su avatar`);

    return okResponse("Avatar actualizado", {
      user: profile,
      psychologist,
    });
  },

  async deleteFile(oldAvatar, oldAvatarThumbnail) {
    // Se verifican que las imagenes existan y se eliminan, de lo contrario se retorna un error
    if (oldAvatar)
      await bucket
        .file(oldAvatar.split("https://cdn.hablaqui.cl/").join(""))
        .delete();
    if (oldAvatarThumbnail)
      await bucket
        .file(oldAvatarThumbnail.split("https://cdn.hablaqui.cl/").join(""))
        .delete();
  },

  async setUserOnline(user) {
    // setUserOnline establece el estado de un usuario como en línea
    // const data = {
    // 	...user,
    // 	status: true,
    // };
    // pusher.trigger('user-status', 'online', data, pusherCallback);
    return okResponse("Usuario conectado", user);
  },

  async setUserOffline(user) {
    // setUserOffline establece el estado de un usuario como desconectado
    // const data = {
    // 	...user,
    // 	status: false,
    // };
    // pusher.trigger('user-status', 'offline', data, pusherCallback);
    return okResponse("Usuario desconectado", user);
  },

  async registerUser(user, body) {
    if (user.role !== "psychologist")
      return conflictResponse("Usuario activo no es psicologo");
    if (await User.exists({ email: body.email }))
      return conflictResponse("Correo electronico en uso");

    // Se crea una contraseña aleatoria y se crea un objeto de usuario con los datos
    // enviados por el body
    const pass =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const newUser = {
      //psychologist: user._id,
      isInvited: true,
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      password: bcrypt.hashSync(pass, 10),
      role: "user",
      rut: body.rut,
      phone: body.phone,
      invitedBy: user.psychologist,
    };
    // Se crea el usuario, se guarda en la base de datos, se genera un token con el que se
    // genera un link de verificación y se envia un correo con el link
    const createdUser = await User.create(newUser);
    const token = Auth.generateJwt(createdUser);
    const verifyurl = `${process.env.VUE_APP_LANDING}verificacion-email?id=${createdUser._id}&token=${token}`;
    await mailServiceAccount.sendVerifyEmail(createdUser, verifyurl);

    // Se hace el trakeo en segment
    if (
      process.env.API_URL.includes("hablaqui.cl") ||
      process.env.DEBUG_ANALYTICS === "true"
    ) {
      analytics.identify({
        userId: createdUser._id.toString(),
        traits: {
          name: user.name,
          email: user.email,
          type: user.role,
          referencerId: user._id,
          referencerName: `${user.name} ${user.lastName}`,
        },
      });
      analytics.track({
        userId: createdUser._id.toString(),
        event: "referral-user-signup",
        properties: {
          name: user.name,
          email: user.email,
          type: user.role,
          referencerId: user.psychologist.toString(),
          referencerName: `${user.name} ${user.lastName}`,
        },
      });
    }
    const roomId = crypto
      .createHash("md5")
      .update(`${createdUser._id}${user._id}`)
      .digest("hex");

    const newPlan = {
      title: "Plan inicial",
      period: "Plan inicial",
      totalPrice: 0,
      sessionPrice: 0,
      payment: "success",
      expiration: moment("12/12/2000", "MM/DD/YYYY HH:mm").toISOString(),
      invitedByPsychologist: true,
      usedCoupon: "",
      totalSessions: 0,
      remainingSessions: 0,
      session: [],
    };

    if (user.role === "psychologist" && createdUser.role === "user")
      await Sessions.create({
        plan: [newPlan],
        user: createdUser._id,
        psychologist: user.psychologist,
        roomsUrl: `${room}room/${roomId}`,
      });

    if (process.env.NODE_ENV === "development")
      logInfo(
        actionInfo(user.email, `Usuario registrado ${newUser.email} ${pass}`)
      );

    await mailServiceAccount.sendGuestNewUser(user, newUser, pass);

    return okResponse("Nuevo usuario creado", {
      user: await servicesAuth.generateUser(createdUser),
    });
  },
  async changePsychologist(sessionsId) {
    // Se busca el plan con el Id del documento de sesiones
    const foundPlan = await Sessions.findById(sessionsId).populate(
      "psychologist user"
    );
    if (!foundPlan) return conflictResponse("No hay planes");

    // Se filtran los planes vigentes y que hayan sido pagados
    const planData = foundPlan.plan.filter(
      (plan) =>
        plan.payment === "success" && moment().isBefore(moment(plan.expiration))
    );
    if (!planData) return conflictResponse("No hay planes para cancelar");

    // Se comienza a recorrer los planes y se obtienen algunos datos que
    // son almacenados en el array de sessionsData
    let sessionsData = [];
    planData.forEach((plan) => {
      const sessions = {
        plan: plan._id,
        remainingSessions: plan.remainingSessions,
        price: plan.sessionPrice,
        session: plan.session.filter((session) => session.status !== "success"),
      };
      sessionsData.push(sessions);
    });

    // Se comienza a obtener las sessiones que se van a cancelar, se obtienen las sessiones
    // pendientes y se logra obtener un descuento que se usará en el cupón
    let discount = 0;
    let sessionsToDelete = [];
    sessionsData.forEach((data) => {
      const remaining = data.session.length + data.remainingSessions;
      discount += remaining * data.price;
      sessionsToDelete.push(data.session);
    });

    planData.forEach(async (plan) => {
      // Se busca en la base de datos y modifica el plan
      await Sessions.updateOne(
        {
          _id: sessionsId,
          "plan._id": plan._id,
        },
        {
          $set: {
            "plan.$.payment": "failed",
            "plan.$.remainingSessions": 0,
          },
        }
      );

      // Se eliminan las sessiones
      plan.session.forEach(async (session) => {
        await Sessions.updateOne(
          {
            _id: sessionsId,
            "plan._id": plan._id,
            "plan.session._id": session._id,
          },
          {
            $pull: {
              "plan.$.session": { _id: session._id },
            },
          }
        );
      });
    });

    const now = new Date();
    let expiration = now;
    expiration.setDate(expiration.getDate() + 3);

    // Se crea el cupón y se envía un correo al usuario notificando el cambio
    const newCoupon = {
      code: foundPlan.user.name + now.getTime(),
      discount,
      discountType: "static",
      restrictions: {
        user: foundPlan.user._id,
      },
      expiration: expiration.toISOString(),
    };
    await mailServiceAccount.sendChangePsycologistToUser(
      foundPlan.user,
      foundPlan.psychologist,
      newCoupon
    );
    await Coupon.create(newCoupon);
    return okResponse("Cupón hecho");
  },
};

export default usersService;
