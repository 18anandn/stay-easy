import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test')
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  city: string;

  @Column({ type: 'text', nullable: false })
  country: string;

  @Column({ type: 'text', nullable: false })
  street_address: string;

  @Column({ type: 'text', nullable: false })
  description: string;
}
