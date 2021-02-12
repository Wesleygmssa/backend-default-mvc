
//RESPONSAVEL PELA CRIAÇÃO DO AGENDAMENTO // REGRA DE NEGOCIO

import Appointment from '../models/Appointment';
import { startOfHour, } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository'; //PARA USAR O REPOSITORIO EXISTENTE
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface Request {
    provider_id: string,
    date: Date,
}

class CreateAppointmentService {

    public async execute({ provider_id, date }: Request): Promise<Appointment> {

        const appointmentsRepository = getCustomRepository(AppointmentsRepository); //PARA USAR O REPOSITORIO EXISTENTE

        const appointmentDate = startOfHour(date);

        const FindAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate
        );

        if (FindAppointmentInSameDate) { //trativa de erro na rota

            throw new AppError('this appointment is already booked');
        }

        //criando apointment
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        });

        //salvando appoiments
        await appointmentsRepository.save(appointment); //SALVANDO NO BANCO DE DADOS

        //retornando o agendamento
        return appointment
    }
}
export default CreateAppointmentService;