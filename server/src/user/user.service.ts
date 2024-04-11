import { Injectable, NotFoundException, Body } from '@nestjs/common';
import { User} from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleEnum } from './UserRole.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`No user with id: ${userId}`);
    }
    return user;
  }

  updateUser(body: UpdateUserDto, userId: string) {
    return this.usersRepository.update({ id: userId }, { ...body });
  }

  updateOwner = (userId: string) => {
    return this.usersRepository.update(
      { id: userId },
      { role: UserRoleEnum.OWNER },
    );
  };
}
