import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home } from '../home/home.entity';
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
  id!: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  verified!: boolean;

  @Column({ type: 'varchar', length: 20, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  last_name!: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @Check("email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'")
  email!: string;

  @Column({ type: 'varchar', length: 72, nullable: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @OneToMany((type) => Home, (hotel) => hotel.owner)
  homes!: Home[];

  @OneToMany((type) => Booking, (booking) => booking.user)
  bookings!: Booking[];
}
