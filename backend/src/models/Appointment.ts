// MODELS ESTÁ RELACIONADO COM UMA TABELA NO BANCO DE DADOS

import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import User from './Users';

/* Relacionamentos
*um para um (OneToOne)
*um para Muitos (OneToMany)
*Muitos para Muitos (ManyToMany)
*
*/

@Entity('appointments') // ENVIA A CLASS COMO PARAMNETRO PARA ENTIDADE.
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default Appointment;
