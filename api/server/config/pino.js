import pino from 'pino' // pino es un logger de nodejs, un logger es un sistema que registra eventos en un archivo o en la consola

export const logger = pino({ // exporta un objeto logger que es un objeto pino
  prettyPrint: { // prettyPrint es un objeto que contiene la configuración para el formato de impresión de los logs
    ignore: 'pid,hostname,time', // ignore es un string que contiene los campos que no se deben imprimir
    levelFirst: true 	// levelFirst es un booleano que indica si el nivel del log debe imprimirse primero
  },
  level: 'info' // level es un string que indica el nivel mínimo de los logs que se deben imprimir
})
// => es un operador de flecha que indica que la función es anónima y que el resultado de la función es el valor que se encuentra a la derecha del operador
// que una función sea anónima significa que no tiene nombre
export const logError = err => logger.error(err.message || err) // exporta una función que recibe un error y lo imprime en el logger en el nivel error

export const logInfo = info => logger.info(info) // exporta una función que recibe un string y lo imprime en el logger en el nivel info
