# API

## Table of Contents

1. [Composición del back](#back)
2. [Librerias que se utilizan](#librerias)

### BACK

---

- **routes**: Carpeta que contiene todas los endpoints de la API separado por servicios
- **controllers**: Carpeta que contiene todos los controladores de la API separado por servicios, solo se encarga de extraer la
  información y enviarla al endpoint correspondiente
- **services**: Carpeta que contiene los servicios de la API, se encarga de la lógica de negocio y de la conexión con la base de datos
- **models**: Carpeta que contiene los modelos de la base de datos (mongodb)
- **schemas**: Carpeta que contiene los schemas que son utilizados para validar los datos que se reciben en los endpoints (se
  utiliza la libreria joi y el middleware validation)
- **middleware**: Carpeta que contiene los middlewares de la API
- **static**: Carpeta que contiene los archivos estáticos de la API
- **utils**: Carpeta que contiene funciones útiles para la API

---

### LIBRERIAS

---

- **axios**: Libreria que se utiliza para hacer peticiones http (se hace desde front)
- **analytics-node**: Libreria que se utiliza para hacer peticiones a segment
- **bcrypt**: Libreria que se utiliza para encriptar las contraseñas
- **body-parser**: Libreria que se utiliza para parsear los datos que llegan en el body de las peticiones
- **cors**: Libreria que se utiliza para habilitar el cors
- **dayjs**: Libreria que se utiliza para manejar fechas
- **dotenv**: Libreria que se utiliza para cargar las variables de entorno
- **express**: Libreria que se utiliza para crear el servidor
- **jsonwebtoken**: Libreria que se utiliza para crear tokens
- **mercadopago**: Libreria que se utiliza para hacer pagos con stripe
- **mongoose**: Libreria que se utiliza para conectar con la base de datos
- **nodemon**: Libreria que se utiliza para reiniciar el servidor cuando se detectan cambios
- **passport**: Libreria que se utiliza para autenticar usuarios
- **passport-jwt**: Libreria que se utiliza para autenticar usuarios con jwt
- **passport-local**: Libreria que se utiliza para autenticar usuarios con local
- **pino**: Libreria que se utiliza para mostrar los logs
- **sengrid**: Libreria que se utiliza para enviar correos
- **socket.io**: Libreria que se utiliza para crear sockets
- **twilio**: Libreria que se utiliza para video llamadas

---
