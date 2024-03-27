import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Cabin } from '../cabin/cabin.entity';
import { Booking } from '../booking/booking.entity';
import { Amenity } from '../amenity/amenity.entity';
import { S3File } from '../upload/s3file.entity';
import { Verification } from './verification.enum';

@Entity('home')
@Check(
  'check_valid_time_zone',
  'time_zone IS NULL OR is_valid_timezone(time_zone) = true',
)
@Check('check_description_max_length', 'char_length(description) <= 1500')
@Check(
  'check_verification_status',
  "(verification_status = 'approved' AND time_zone IS NOT NULL AND city IS NOT NULL AND state IS NOT NULL AND country IS NOT NULL AND postcode IS NOT NULL) OR verification_status IN ('pending', 'rejected')",
)
@Check(
  'check_message_on_rejection',
  "(verification_status != 'rejected') OR (verification_status = 'rejected' AND message IS NOT NULL AND char_length(message) <= 1000)",
)
export class Home {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Generated('increment')
  @Column('bigint')
  number!: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_sample!: boolean;

  @Column({ type: 'enum', enum: Verification, default: Verification.Pending })
  verification_status!: Verification;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  @Index({ spatial: true })
  location!: Point;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  time_zone!: string;

  @Column({ type: 'decimal', nullable: false })
  price!: number;

  @Column({ type: 'decimal', nullable: false })
  price_per_guest!: number;

  @Column({ type: 'varchar', length: 35, nullable: true })
  city!: string;

  @Column({ type: 'varchar', length: 35, nullable: true })
  state!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  postcode!: string;

  @Column({ type: 'varchar', length: 35, nullable: true })
  country!: string;

  @Column({ type: 'text', nullable: false })
  address!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ type: 'text', nullable: true })
  message?: string | null;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_owner_id',
  })
  owner!: User;

  @Column({ type: 'uuid', nullable: false })
  owner_id!: string;

  @OneToOne(() => S3File)
  @JoinColumn({
    name: 'main_image_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_main_image_id',
  })
  main_image!: S3File;

  @Column({ type: 'uuid', nullable: true })
  main_image_id!: string;

  @ManyToMany(() => S3File)
  @JoinTable({
    name: 'home_images',
    joinColumn: {
      name: 'home',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_home_images_hotelId',
    },
    inverseJoinColumn: {
      name: 'image',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_home_images_imageId',
    },
  })
  extra_images!: S3File[];

  @Column({ type: 'smallint', nullable: false })
  number_of_cabins!: number;

  @Column({ type: 'smallint', nullable: false })
  cabin_capacity!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_date!: Date;

  @OneToMany(() => Cabin, (cabin) => cabin.home)
  cabins!: Cabin[];

  @OneToMany(() => Booking, (booking) => booking.home)
  bookings!: Booking[];

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'home_amenities',
    joinColumn: {
      name: 'home',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_home_amenities_homeId',
    },
    inverseJoinColumn: {
      name: 'amenity',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_home_amenities_amenityId',
    },
  })
  amenities!: Amenity[];
}
