import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Booking } from '../booking/booking.entity';

@Entity('cabin')
export class Cabin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', nullable: false })
  cabin_capacity: number;

  @ManyToOne((type) => Hotel)
  @JoinColumn({
    name: 'hotel_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_hotel_id',
  })
  hotel: Hotel;

  @Column({ nullable: false })
  hotel_id: string;

  @OneToMany((type) => Booking, (booking) => booking.cabin)
  bookings: Booking[];
}
