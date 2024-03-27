import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AmenityType {
  ESSENTIAL = 'essential',
  FEATURE = 'feature'
}

@Entity('amenity')
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  name!: string;

  @Column({
    type: 'enum',
    enum: AmenityType,
    nullable: false
  })
  type!: AmenityType;
}