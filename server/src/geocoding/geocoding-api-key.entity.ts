import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('geocoding_api_key')
@Check('max_calls', 'calls <= 2950')
export class GeocodingApiKey {
  @PrimaryGeneratedColumn('identity')
  readonly id!: number;

  @Column({ type: 'smallint', nullable: false, unique: true })
  key_num!: number;

  @Column({ type: 'smallint', nullable: false, default: 0 })
  calls!: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly created_at!: Date;
}
