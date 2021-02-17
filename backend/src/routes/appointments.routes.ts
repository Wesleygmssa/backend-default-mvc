import { Router } from 'express';
import { parseISO } from 'date-fns';

import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentServices from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated); // aplicanto middlewares em todas as rotas

// lista todos o agendamentos
appointmentsRouter.get('/', async (request, response) => {
  const appointmentRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

// salvando
appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parseDate = parseISO(date);
  const createAppointment = new CreateAppointmentServices(); // classs
  const appointment = await createAppointment.execute({
    provider_id,
    date: parseDate,
  });
  return response.json(appointment);
});
export default appointmentsRouter;
