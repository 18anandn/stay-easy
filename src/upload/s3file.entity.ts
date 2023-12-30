import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('s3file')
export class S3File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  object_key: string;
}
