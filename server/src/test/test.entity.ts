import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test')
export class Test {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  readonly id!: number;

  @Column({ type: 'timestamp without time zone' })
  start!: Date;

  @Column({ type: 'timestamp without time zone' })
  end!: Date;
}
