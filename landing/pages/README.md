# PAGES

## Table of Contents

1. [Dashboard](#dashboard)

    - [Consultantes](#consultantes)
    - [Pagos](#pagos)
    - [Perfil](#perfil)

2. [Psicologos](#psicologos)
3. [Raíz](#raiz)

### DASHBOARD

---

-   #### consultantes:

    -   **consultante-seleccionado.vue**: Muestra la información del consultante seleccionado
    -   **index.vue**: Muestra una tabla con la información de todos los consultante (dashboard/consultantes)

-   #### pagos:

    -   **historial.vue**: Detalles de las transacciones de un psicólogo
    -   **index.vue**: Historial de pagos de un psicólogo
    -   **success.vue**: Páginas de pagos satisfactorios. Por ahora es de planes satisfactorios de usuarios de rol "user"

-   #### perfil:

    -   **configuracion-personal.vue**: Edita el perfil (utilizado en móviles)
    -   **datos-bancarios.vue**: Edita los datos bancarios del psicólogo (utilizado en móviles)
    -   **experiencia-formacion.vue**: Edita la experiencia y formación de un psicólogo(utilizado en móviles)
    -   **horario.vue**: Edita el horario de un psicólogo (utilizado en móviles)
    -   **index.vue**: Vista principal de "Mi cuenta"
    -   **informacion-general.vue**: Edita los datos profesiones de un psicólogo (utilizado en móviles)
    -   **services.vue**: Servicios de un psicólogo

-   **agenda.vue**: Vista con el calendario
-   **chat.vue**: Vista de chat
-   **panel.vue**: Panel del super usuario
-   **planes.vue**: Muestra los planes que puede contratar un psicólogo

---

### PSICOLOGOS

---

-   **\_slug.vue**: Renderiza las vistas dinámicas de psicólogos por ciudad
-   **index.vue**: Muestra todos los psicólogos
-   **pagos.vue**: Muestra la información detallada de un pago de un plan para un usuario rol "user"
-   **ubicaciones.vue**: Vista con las listas de todas las ciudades por regiones

---

### RAIZ

---

-   **\_slug.vue**: Página dinámica que renderiza el perfil del psicólogo. El parámetro "\_slug" es el "username" del psicólogo
-   **auth.vue**: Vista de autenticación
-   **condiciones.vue**: Términos y condiciones
-   **evaluacion.vue**: Matchmaking de psicólogo en según preferencias del usuario
-   **faq.vue**: Preguntas frecuentes
-   **index.vue**: Vista principal
-   **nuevo-psicologo.vue**: Para crear un nuevo psicólogo (sin utilizar)
-   **para-especialistas.vue**: Vista que crea un usuario con rol "psychologist" (usado actualmente)
-   **password-reset.vue**: Cambia de contraseña según enlace enviado por email
-   **politicas.vue**: Vista con las políticas de Hablaquí
-   **postulaciones.vue**: Vista de postulaciones de psicólogos
-   **review.vue**: Vista que permite la evaluación de un psicólogo
-   **terminos-y-condiciones-especilistas.vue**: Términos y condiciones especilistas
-   **verificacion-email.vue**: Vista que verifica el correo

---
