import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Cabin } from '../cabin/cabin.entity';
import { User } from '../user/user.entity';

@Entity('booking')
export class Booking {
  // @PrimaryColumn('bigint')
  // @Generated('increment')
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 30, nullable: true })
  booking_id: string;

  @Column({ type: 'date', nullable: false })
  from_date: Date;

  @Column({ type: 'date', nullable: false })
  to_date: Date;

  @ManyToOne((type) => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'hotel_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_hotel_id',
  })
  hotel: Hotel;

  @Column({ nullable: false })
  hotel_id: string;

  @Column({ type: 'decimal', nullable: false })
  paid: number;

  @ManyToOne((type) => Cabin, { onDelete: 'CASCADE' })
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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
