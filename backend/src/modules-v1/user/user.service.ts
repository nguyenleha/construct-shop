import { PaginationService } from './../../common/utils/pagination.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import {
  getHashPassword,
  handleResponseRemoveKey,
} from 'src/common/utils/handleResponse';
import { compareSync } from 'bcryptjs';
import { IUser } from 'src/interfaces/common.interface';
import { Role } from '../roles/entities/role.entity';
import { GetParamsUserDto } from './dto/get-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private paginationService: PaginationService,
    private configService: ConfigService,
  ) {}

  async checkIdExist(id: number): Promise<boolean> {
    const user = await this.userRepository.exist({ where: { id } });
    if (!user) {
      throw new UnprocessableEntityException('Tài khoản không tồn tại');
    }
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  handleConvertRole(user: User) {
    const roles = [];
    user.roles.forEach((role) => {
      role.pagePermission.forEach((pagePermissionRelation) => {
        roles.push({
          role: role.name,
          page: pagePermissionRelation.page.name,
          permission: pagePermissionRelation.permission.name,
        });
      });
    });
    return roles;
  }
  async create(createUserDto: CreateUserDto, user?: IUser) {
    const { password, email, roleIds, ...userDetail } = createUserDto;
    const isExists = await this.userRepository.exists({
      where: { email },
    });
    if (isExists) {
      throw new UnprocessableEntityException('Email đã đăng ký');
    }

    const createUser = {
      ...userDetail,
      email,
      password: getHashPassword(password),
      roles: undefined,
      created_by: undefined,
      updated_by: undefined,
    };
    if (user) {
      createUser.created_by = user;
      createUser.updated_by = user;
    }

    if (roleIds?.length && user) {
      const roles = await this.roleRepository.findByIds(roleIds);
      if (roles.length) {
        for (const roleId of roleIds) {
          if (!roles.find((role) => role.id === roleId)) {
            throw new NotFoundException(`Role id:\'${roleId}\' không tìm thấy`);
          }
        }
        createUser.roles = roles;
      }
    }

    const userCreated = await this.userRepository.save(createUser);

    return handleResponseRemoveKey(userCreated); // Return the created user
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, user: IUser) {
    await this.checkIdExist(id);
    const { roleIds, email, ...userDetail } = updateUserDto;
    const isExist = await this.userRepository.exists({
      where: { email, id: Not(id) },
    });
    if (isExist) {
      throw new UnprocessableEntityException('Email đã được đăng ký');
    }
    const updateUser = {
      ...userDetail,
      email,
      updated_by: user,
      updated_at: new Date(),
      roles: undefined,
    };
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'], // Lấy các vai trò hiện tại
    });
    console.log('roleId', roleIds);
    if (roleIds.length) {
      const roles = await this.roleRepository.findByIds(roleIds);
      console.log('Roles found:', roles); // Kiểm tra xem roles có tìm thấy không
      if (roles.length) {
        for (const roleId of roleIds) {
          if (!roles.find((role) => role.id === roleId)) {
            throw new NotFoundException(`Role id:\'${roleId}\' không tìm thấy`);
          }
        }
        if (roles.length) {
          updateUser.roles = roles; // Gán lại roles nếu có
        } else {
          console.log('No roles found or empty roles.');
        }
      }
    }
    // Cập nhật thông tin người dùng, bao gồm cả vai trò
    const userUpdated = await this.userRepository.save({
      ...existingUser,
      ...updateUser,
    });
    console.log('User Roles:', userUpdated.roles);
    return handleResponseRemoveKey(userUpdated);
  }

  async findAll(qs: GetParamsUserDto) {
    const { page, per_page, orderByField, order, ...data } = qs;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.age',
        'user.gender',
        'user.address',
        'user.isActive',
        'user.created_at',
        'user.updated_at',
      ])
      .orderBy(`user.${orderByField || 'id'}`, order || 'DESC');
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        queryBuilder.andWhere(`user.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
    });
    return await this.paginationService.paginateEntity<User>(
      queryBuilder,
      page,
      per_page,
      '/api/v1/user',
      this.configService,
    );
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
  async findOneUsername(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: [
        'roles.pagePermission.page',
        'roles.pagePermission.permission',
      ],
    });
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

  // async updatedUserToken(id: number, refreshToken: string) {
  //   return await this.userRepository.update(id, { refreshToken });
  // }

  // async findUserByToken(refreshToken: string) {
  //   return await this.userRepository.findOne({
  //     where: { refreshToken: refreshToken },
  //   });
  // }
}
