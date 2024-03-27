import {
  Column,
  Entity,
  Generated,
  PrimaryColumn,
} from 'typeorm';

@Entity('s3file')
export class S3File {
  @PrimaryColumn({ type: 'bigint' })
  @Generated('increment')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  object_key!: string;
}
