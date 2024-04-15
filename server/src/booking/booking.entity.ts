import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Home } from '../home/home.entity';
import { Cabin } from '../cabin/cabin.entity';
import { User } from '../user/user.entity';

@Entity('booking')
export class Booking {
  @PrimaryColumn('varchar', {
    length: 27,
    nullable: false,
    default: () => 'generate_booking_id()',
  })
  id!: string;

  @Column({ type: 'date', nullable: false })
  from_date!: Date;

  @Column({ type: 'date', nullable: false })
  to_date!: Date;

  @Column({ type: 'smallint', nullable: false })
  guests!: Date;

  @ManyToOne(() => Home)
  @JoinColumn({
    name: 'home_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_home_id',
  })
  home!: Home;

  @Column({ nullable: false })
  home_id!: string;

  @Column({ type: 'decimal', nullable: false })
  paid!: number;

  @ManyToOne((type) => Cabin)
  @JoinColumn({
    name: 'cabin_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_cabin_id',
  })
  cabin!: Cabin;

  @Column({ nullable: false })
  cabin_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user!: User;

  @Column({ nullable: false })
  user_id!: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_date!: string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_date!: string;
}
