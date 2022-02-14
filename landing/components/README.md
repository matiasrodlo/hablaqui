# COMPONENTS

## Table of Contents

1. [Auth](#auth)
2. [Chat](#chat)
3. [Dashboard](#dashboard)
4. [Evaluation](#evaluation)
5. [Postulacion](#postulacion)
6. [Psicologos](#psicologos)
7. [Raíz](#raiz)

### AUTH

---

-   **GoogleBtn.vue**: Botón para logearte con google, pero actualmente no se utiliza
-   **SendPasswordRecovery.vue**: Formulario para enviar email de recuperación de contraseña/cuenta
-   **SignIn.vue**: Componente con todo lo relaciona al login
-   **SignUp.vue**: Componente con todo lo relacionado al registro de una cuenta de usuario role user

---

### CHAT

---

-   **CardChat.vue**: Componente de chat utilizado en FloatingChat (este es solamente para usuarios: user)
-   **Channel.vue**: Comoponente en la página de chat. Este es el del chat completo (este es para ambos tipos de usurios: user y psychologist)

---

### DASHBOARD

---

-   **AppbarProfile.vue**: Este es la navegación ubicada en la parte superior en el dashboard (Mi plan premium; Agenda demo; etc)
-   **BankData.vue**: Formulario para rellenar con información de la cuenta bancaria de un psicólogo
-   **ExperienciaFormacion.vue**: Formulario de experiencia y formación de un psicólogo en "Mi cuenta"
-   **FloatingChat.vue**: Chat flotante (solamente para usuarios de rol "user")
-   **General.vue**: Ubicado en "Mi cuenta" que contiene paneles expandibles donde se edita el perfil de un psicólogo
-   **Horario.vue**: Configura el horario de un psicólogo
-   **InformationGeneralPsi.vue**: Formulario de la información general de un psicólogo (Descripción personal y profesional; código; linkedin)
-   **MyPlans.vue**: Pestaña de planes contratados pagados, no pagados y expirados de un usuario de rol "user"
-   **Psicologo.vue**: Pestaña que muestra la información del psicólogo de un usuario de rol "user"
-   **Services.vue**: Pestaña de servicios para usuarios de rol "psychologist"
-   **TablePagos.vue**: Tabla que muestra todos los pagos de un psicólogo
-   **UpdatePassword.vue**: Formulario que permite ingresar una nueva contraseña
-   **UpdateProfile.vue**: Formulario de información personal de un usuario

---

### EVALUATION

---

-   **Precharge.vue**: Muestra que aún están cargando los resultados de la evaluación
-   **Selection**: Lista donde se puede seleccionar el resultado de la evaluación

---

### POSTULACION

---

-   **Plans.vue**: Selector de planes de un psicólogo

---

### PSICOLOGOS

---

-   **FormUserPsy.vue**: Formulario para regitrar a un usuario de rol "psychologist"
-   **GeoPsicologos.vue** : Es la cebecera de psicólgos según la ubicación (/psicologos/santiago)
-   **MiniCalendar.vue**: Calendario para móviles en el perfil de psicólogo
-   **PagosDesktop.vue**: Pagos de plan para usuarios de rol "user" en vista de escritorio
-   **PagosMobile.vue**: Pagos de plan para usuarios de rol "user" en vista de móviles
-   **ProfileDesktop.vue**: Perfil de psicólogo en vista de escritorio
-   **ProfileMobile.vue**: Perfil de psicólogo en vista de móviles
-   **PsicologosDesktop.vue**: Psicólogos en vista de escritorio
-   **PsicologosMobile.vue**: Psicólogos en vista de móviles
-   **Ubicación.vue**: Envoltura para psicólogos por ubicación

---

### RAIZ

---

-   **AppbarBlue.vue**:
-   **AppbarWhite.vue**:
-   **Avatar.vue**:
-   **Calendar.vue**:
-   **CalendarPsychologist.vue**:
-   **CardOnboarding.vue**:
-   **Footer.vue**:
-   **Icon.vue**:
-   **Logo.vue**:
-   **RecruitedOverlay.vue**:
-   **Snackbar.vue**:

---
