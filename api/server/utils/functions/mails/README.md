# Servicio de envío de correos

## Table of Contents

1. [Lógica de envío de correos](#logic)
1. [Envío de Recordatorio de Sesión](#session)
2. [Envío de Recordatorio de Pago](#payment)
3. [Envío de Mensaje en el Chat](#chat)
4. [Envío de Recordatorio de Renovación de Plan](#renewal)
5. [Procemiento de QA](#QA)

### LOGIC

---

La lógica que se está llevando a cabo es bastante simple. Utiliza algo similar (no igual pero es para que se entienda)
a lo que sería una estructura de dato lineal "cola", ya que a través del cron y el archivo 'mailing.js' (en esta misma carpeta)
se van programando el envío de correos, y si el correo (que queda guardado en la base de datos) no se ha enviado sobrepasando
la fecha de envío es enviado.
Esta fecha de envío depende del tipo de correo que se vaya a enviar, ya que cada uno tiene su propio tiempo de envío. 

---

### SESSION

---

El correo de recordatorio de sesión se envía 1 hora antes de que la sesión se inicie y 1 día antes de que la sesión se inicie.
Esto se hace para que el usuario tenga tiempo de prepararse para la sesión, entre otras cosas.

---

### PAYMENT

---

El correo de recordatorio de pago se envía cuando el usuario le da al botón de pagar y llega a la página de mercadopago para
realizar la compra del plan, no obstante, el usuario no termina de concretar la compra. Este correo se envía para que el usuario
sepa que no se ha realizado el pago y que puede volver a intentarlo. El correo se envía 1 hora después de que el usuario
haya llegado a la página de mercadopago, así también un día después. Después de una semana al usuario le llega un cupón de
descuento para incentivar el pago que es de un 20% de descuento. Estos correos son eliminados una vez que el usuario paga el plan.

---

### CHAT

---

El correo de mensaje en el chat se envía cuando el usuario recibe un mensaje en el chat y no ha sido leido. Este correo se envía
15 minutos después de haya llegado el mensaje y no ha sido leido a través del endpoint scheduleChatEmails que se encuentra
en 'cron.js', este endpoint es importante por que también crea el correo que será programado para enviarse un día después de
que el mensaje no haya sido leido.

---

### RENEWAL

---

El correo de recordatorio de renovación de plan se envía cuando el usuario tiene un plan ya vencido y no ha renovado su plan.
Este correo se envía en tres ocasiones, el primero una hora después de que el plan haya vencido, así también 1 día después.
Finalmente al igual que el correo de recordatorio de pago, se envía un cupón de descuento de un 20% de descuento para incentivar
el pago. Estos correos son eliminados una vez que el usuario paga el plan.

---

### QA

---

Para realizar QA de una o varios correos ya mencionados en este README, lo primero que deberá hacer es ir a la nube 
(GCP o AWS dependiendo si ya se hizo la migración o todavía no). En caso de GCP debes ir a 
https://console.cloud.google.com/cloudscheduler?project=hablaqui-staging-306619 y aquí deberás identificar el trabajo 
llamado "email-scheduiling", le das a los 3 puntitos en la columna de acciones y le das a "Forzar ejecución de trabajo". Esto
lo que hará será programar el envío de los correos que están en la colección de mongodb "emails".
Luego, una vez ya hayas programado los correos debes ir a mongodb, buscar el correo de interés según el asunto del correo
que está determinado por el parametro "type" del documento de email, y una vez encontrado debes modificar la fecha de
envío que está determinado por el parámetro scheduledAt. Se debe modificar por la fecha en la que estés haciendo el qa a alguna
fecha actual para que se envíe el correo.
Una vez hayas modificado la fecha, vuelves a ejecutar nuevamente el mismo cron y después de unos segundos te debería haber
llegado el correo que deseas probar.

---
