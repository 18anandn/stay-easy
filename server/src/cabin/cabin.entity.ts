import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Home } from '../home/home.entity';
import { Booking } from '../booking/booking.entity';

@Entity('cabin')
@Unique(['id', 'number'])
export class Cabin {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'smallint', nullable: false })
  number!: number;

  @ManyToOne(() => Home, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'home_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_home_id',
  })
  home!: Home;

  @Column({ nullable: false })
  home_id!: string;

  @OneToMany((type) => Booking, (booking) => booking.cabin)
  bookings!: Booking[];
}
