import { EntityRepository, Repository } from "typeorm";
import Appointment from "../models/Appointment";

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  // metodo public
  public async findByDate(date: Date): Promise<Appointment | null> {
    const FindAppointment = await this.findOne({ where: { date } });

    return FindAppointment || null;
  }
}

export default AppointmentsRepository;
