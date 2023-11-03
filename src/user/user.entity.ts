import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Booking } from '../booking/booking.entity';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  EMPLOYEE = 'employee',
  USER = 'user',
}

export type ValidRoles = `${UserRole}`;

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @Check("email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'")
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany((type) => Hotel, (hotel) => hotel.owner)
  hotels: Hotel[];

  @OneToMany((type) => Booking, (booking) => booking.user)
  bookings: Booking[];
}
