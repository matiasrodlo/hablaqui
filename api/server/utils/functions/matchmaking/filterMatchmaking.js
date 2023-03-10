/**
 * @description Función que filtra los especialistas por disponibilidad
 * @param {Array} arraySpecialist - Array de especialistas
 * @param {Array} scheduleAvaility - Array de disponibilidad de horario entregado por el usuario
 * @returns - Array de especialistas filtrados
 */
export const filterByAvailability = (arraySpecialist, scheduleAvaility) => {
    // Si no hay especialidades a filtrar, se retorna un array vacío
    if (!scheduleAvaility) {
        return arraySpecialist;
    }
    
    // Se filtran los especialistas por disponibilidad
    const arrayFinal = arraySpecialist.filter(specialist => {
        let flag = false;
        // Se obtiene el horario del especialista
        const { availitySpec } = specialist;
		console.log(schedule);
        // Si el horario coincide con la disponibilidad, se retorna el especialista
        if (flag === true) {
            return;
        }
        // Comienza a recorrer el horario del especialista y si coincide con la disponibilidad,
        // marca la bandera como verdadera haciendo que el especialista sea retornado
		for(let i = 0; i < 3; i++) {
			days[i].available.forEach((hora) => {
				if (
					dayjs(hora, 'HH:mm').isBetween(
						dayjs('00:00', 'HH:mm'),
						dayjs('08:59', 'HH:mm')
					) &&
					scheduleAvaility.includes('early')
				) {
					flag = true;
				} else if (
					dayjs(hora, 'HH:mm').isBetween(
						dayjs('09:00', 'HH:mm'),
						dayjs('11:59', 'HH:mm')
					) &&
					scheduleAvaility.includes('morning')
				) {
					flag = true;
				} else if (
					dayjs(hora, 'HH:mm').isBetween(
						dayjs('12:00', 'HH:mm'),
						dayjs('13:59', 'HH:mm')
					) &&
					scheduleAvaility.includes('midday')
				) {
					flag = true;
				} else if (
					dayjs(hora, 'HH:mm').isBetween(
						dayjs('14:00', 'HH:mm'),
						dayjs('17:59', 'HH:mm')
					) &&
					scheduleAvaility.includes('afternoon')
				) {
					flag = true;
				} else if (
					dayjs(hora, 'HH:mm').isBetween(
						dayjs('18:00', 'HH:mm'),
						dayjs('23:59', 'HH:mm')
					) &&
					scheduleAvaility.includes('night')
				) {
					flag = true;
				} else {
					flag = false;
				}
			});
		}
        return flag;
    });

    return arrayFinal;
}