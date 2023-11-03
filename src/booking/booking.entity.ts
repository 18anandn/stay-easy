import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Cabin } from '../cabin/cabin.entity';
import { User } from '../user/user.entity';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false })
  from_date: Date;

  @Column({ type: 'date', nullable: false })
  to_date: Date;

  @ManyToOne((type) => Hotel)
  @JoinColumn({
    name: 'hotel_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_hotel_id',
  })
  hotel: Hotel;

  @Column({ nullable: false })
  hotel_id: string;

  @ManyToOne((type) => Cabin)
  @JoinColumn({
    name: 'cabin_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_cabin_id',
  })
  cabin: Cabin;

  @Column({ nullable: false })
  cabin_id: string;

  @ManyToOne((type) => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user: User;

  @Column({ nullable: false })
  user_id: string;
}
