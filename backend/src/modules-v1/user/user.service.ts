import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  getHashPassword,
  handleResponseRemoveKey,
} from 'src/common/utils/handleResponse';
import { compareSync } from 'bcryptjs';
import { IUser } from 'src/interfaces/common.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkIdExist(id: number): Promise<boolean> {
    const user = await this.userRepository.exist({ where: { id } });
    if (!user) {
      throw new UnprocessableEntityException('Tài khoản không tồn tại');
    }
    return user;
  }
  async create(createUserDto: RegisterUserDto, user: IUser) {
    const { password, email, ...userDetail } = createUserDto;
    const isExists = await this.userRepository.exists({
      where: { email },
    });
    if (isExists) {
      throw new UnprocessableEntityException('Email đã đăng ký');
    }
    delete createUserDto.confirmPassword;
    const createUser = {
      ...userDetail,
      email,
      password: getHashPassword(password),
      created_by: user,
      updated_by: user,
    };

    const userCreated = await this.userRepository.save(createUser);
    return handleResponseRemoveKey(userCreated); // Return the created user
  }

  //Register User
  async register(createUserDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = createUserDto;

    const isExists = await this.userRepository.findOne({
      where: { email: email },
    });

    if (isExists) {
      throw new BadRequestException('Email đã đăng ký');
    }

    const newRegister = await this.userRepository.create({
      name,
      email,
      password: getHashPassword(password),
      age,
      gender,
      address,
      role: 'USER',
    });
    const user = await this.userRepository.save(newRegister);
    return handleResponseRemoveKey(user);
  }
  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnprocessableEntityException('Tài khoản không tồn tại');
    }
    return { ...handleResponseRemoveKey(user) };
  }
  findOneUsername(username: string) {
    return this.userRepository.findOne({
      where: { email: username },
    });
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
  async update(id: number, updateUserDto: UpdateUserDto, user: IUser) {
    await this.checkIdExist(id);
    const updatedUser = {
      ...updateUserDto,
      updated_at: new Date(),
      updated_by: user,
    };
    return await this.userRepository.update(id, updatedUser);
  }

  async remove(id: number, user: IUser) {
    await this.checkIdExist(id);
    const updateUser = {
      isDeleted: true,
      deleted_at: new Date(),
      deleted_by: user,
    };
    return await this.userRepository.update(id, updateUser);
  }

  async updatedUserToken(id: number, refreshToken: string) {
    return await this.userRepository.update(id, { refreshToken });
  }

  async findUserByToken(refreshToken: string) {
    return await this.userRepository.findOne({
      where: { refreshToken: refreshToken },
    });
  }
}
