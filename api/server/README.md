# COMPONENTS

## Table of Contents

1. [Composición del back](#back)
2. [Servicios](#servicios)
3. [Librerias que se utilizan](#librerias)

### BACK

---

-   **routes**: Carpeta que contiene todas las rutas de la API separado por servicios
-   **controllers**: Carpeta que contiene todos los controladores de la API separado por servicios, solo se encarga de extraer la
                    información y enviarla al endpoint correspondiente
-   **services**: Carpeta que contiene los servicios de la API, se encarga de la lógica de negocio y de la conexión con la base de datos
-   **models**: Carpeta que contiene los modelos de la base de datos (mongodb)
-   **schemas**: Carpeta que contiene los schemas de la base de datos (mongodb)
-   **middleware**: Carpeta que contiene los middlewares de la API 
-   **static**: Carpeta que contiene los archivos estáticos de la API
-   **utils**: Carpeta que contiene funciones útiles para la API

---

### SERVICIOS

---
-   **appointments**: Servicio que se encarga de obtener las citas de los psicólogos
-   **auth**: Servicio que se encarga de la autenticación de los usuarios
-   **chat**: Servicio que se encarga de la comunicación entre psicólogos y usuarios
-   **coupon**: Servicio que se encarga de los cupones de descuento en los pagos
-   **cron**: Servicio que se encarga de las tareas programadas
-   **evaluation**: Servicio que se encarga de la evaluación de los psicólogos
-   **mercadopago**: Servicio que se encarga de los pagos con mercadopago
-   **psychologist**: Servicio que contiene las acciones que involucran a los psicólogos
-   **recruitment**: Servicio que se encarga de la postulación de los psicólogos
-   **retool**: Servicio que contiene retool, retool es un herramienta que se utilizaba como dashboard (ya se esta dejando de usar)
-   **sessions**: Servicio que se encarga de las sesiones
-   **transaction**: Servicio que se encarga de las transacciones de los pagos
-   **users**: Servicio que contiene las acciones que involucran a los usuarios

---

### LIBRERIAS

---
-   **axios**: Libreria que se utiliza para hacer peticiones http (se hace desde front)
-   **analytics-node**: Libreria que se utiliza para hacer peticiones a segment
-   **bcrypt**: Libreria que se utiliza para encriptar las contraseñas
-   **body-parser**: Libreria que se utiliza para parsear los datos que llegan en el body de las peticiones
-   **cors**: Libreria que se utiliza para habilitar el cors
-   **dayjs**: Libreria que se utiliza para manejar fechas
-   **dotenv**: Libreria que se utiliza para cargar las variables de entorno
-   **express**: Libreria que se utiliza para crear el servidor
-   **jsonwebtoken**: Libreria que se utiliza para crear tokens
-   **mercadopago**: Libreria que se utiliza para hacer pagos con stripe
-   **mongoose**: Libreria que se utiliza para conectar con la base de datos
-   **nodemon**: Libreria que se utiliza para reiniciar el servidor cuando se detectan cambios
-   **passport**: Libreria que se utiliza para autenticar usuarios
-   **passport-jwt**: Libreria que se utiliza para autenticar usuarios con jwt
-   **passport-local**: Libreria que se utiliza para autenticar usuarios con local
-   **pino**: Libreria que se utiliza para mostrar los logs
-   **sengrid**: Libreria que se utiliza para enviar correos
-   **socket.io**: Libreria que se utiliza para crear sockets
-   **twilio**: Libreria que se utiliza para video llamadas
