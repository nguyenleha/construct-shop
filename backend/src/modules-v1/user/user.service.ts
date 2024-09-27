import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  handleResponse(user: User) {
    delete user.password;
    delete user.isActive;
    delete user.isDeleted;
    delete user.deleted_at;
    return user;
  }

  async checkIdExist(id: number): Promise<boolean> {
    const user = await this.userRepository.exist({ where: { id } });
    if (!user) {
      throw new UnprocessableEntityException('Tài khoản không tồn tại');
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const { password, ...userDetail } = createUserDto;

    const createUser = {
      ...userDetail,
      password: getHashPassword(password),
    };

    // Save the user to the database
    const userCreated = await this.userRepository.save(createUser);

    return this.handleResponse(userCreated); // Return the created user
  }
  findAll() {
    return this.userRepository.find();
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

  async remove(id: number) {
    await this.checkIdExist(id);
    const updateUser = {
      isDeleted: true,
      deleted_at: new Date(),
    };
    return await this.userRepository.update(id, updateUser);
  }
}
