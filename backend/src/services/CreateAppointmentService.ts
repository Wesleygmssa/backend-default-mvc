/* eslint-disable @typescript-eslint/naming-convention */
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository'; // PARA USAR O REPOSITORIO EXISTENTE
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository); // PARA USAR O REPOSITORIO EXISTENTE

    const appointmentDate = startOfHour(date);
    const FindAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    // service não tem  acesso direto requisição e resposta, será recebido na rota
    if (FindAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    // Acesso ao repositorio
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment); // SALVANDO NO BANCO DE DADOS

    // retornando o agendamento
    return appointment;
  }
}
export default CreateAppointmentService;
