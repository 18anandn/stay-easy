import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home } from '../home/home.entity';
import { Booking } from '../booking/booking.entity';
import { EnumValues } from '../types/EnumValues';
import { UserRole, UserRoleEnum } from './enums/UserRole.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  verified!: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  forgot_password!: boolean;

  @Column({ type: 'text', nullable: true })
  verification_token: string | null = null;

  @Column({ type: 'varchar', length: 30, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  last_name: string | null = null;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @Check("email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'")
  email!: string;

  @Column({ type: 'varchar', length: 72, nullable: true })
  password: string | null = null;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role!: UserRole;

  @OneToMany((type) => Home, (hotel) => hotel.owner)
  homes!: Home[];

  @OneToMany((type) => Booking, (booking) => booking.user)
  bookings!: Booking[];
}
