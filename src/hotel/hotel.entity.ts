import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Cabin } from '../cabin/cabin.entity';
import { Booking } from '../booking/booking.entity';
import { Amenity } from '../amenity/amenity.entity';
import { S3File } from '../upload/s3file.entity';

@Entity('hotel')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: Point;

  @Column({ type: 'money', nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 35, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 35, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 35, nullable: false })
  country: string;

  @Column({ type: 'text', nullable: false })
  complete_address: string;

  @Column({ type: 'text', nullable: true })
  location_name: string;

  @ManyToOne((type) => User)
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_owner_id',
  })
  owner: User;

  @Column({ type: 'uuid', nullable: false })
  owner_id: string;

  @OneToOne(() => S3File)
  @JoinColumn({
    name: 'main_image_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_main_image_id',
  })
  main_image: S3File;

  @Column({ type: 'uuid', nullable: true })
  main_image_id: string;

  @ManyToMany(() => S3File)
  @JoinTable({
    name: 'hotel_images',
    joinColumn: {
      name: 'hotel',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_hotel_images_hotelId',
    },
    inverseJoinColumn: {
      name: 'image',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_hotel_images_imageId',
    },
  })
  extra_images: S3File[];

  @Column({ type: 'integer', nullable: false })
  cabin_amount: number;

  @Column({ type: 'integer', nullable: false })
  cabin_capacity: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany((type) => Cabin, (cabin) => cabin.hotel)
  cabins: Cabin[];

  @OneToMany((type) => Booking, (booking) => booking.hotel)
  bookings: Booking[];

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'hotel_amenities',
    joinColumn: {
      name: 'hotel',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_hotel_amenities_hotelId',
    },
    inverseJoinColumn: {
      name: 'amenity',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_hotel_amenities_amenityId',
    },
  })
  amenities: Amenity[];
}
