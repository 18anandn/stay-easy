import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Type(() => String)
  @Expose({ name: 'id' })
  userId!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: string;

  @Expose()
  msg!: Object;
}
