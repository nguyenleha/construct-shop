import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getHashPassword } from 'src/common/utils/handleResponse';
import { compare, compareSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...userDetail } = createUserDto;

    const createUser = {
      ...userDetail,
      password: getHashPassword(password),
    };

    // Save the user to the database
    const userCreated = await this.userRepository.save(createUser);

    return userCreated; // Return the created user
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  findOneUsername(username: string) {
    return this.userRepository.findOne({
      where: { email: username },
    });
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
