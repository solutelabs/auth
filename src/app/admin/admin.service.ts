import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLES } from 'src/core/constant';
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from 'src/core/error';
import { compareHash, generateHash } from 'src/core/utility';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find({
      where: {
        role: ROLES.USER,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('User does not exists');
    if (user.role === ROLES.ADMIN)
      throw new BadRequestException('Admin cannot be deleted');
    await this.userRepository.delete(id);
    return {
      user,
      message: 'User deleted successfully',
    };
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('User does not exists');
    if (user.role === ROLES.ADMIN)
      throw new BadRequestException('Admin cannot be deactivated');
    if (user.is_active === false)
      throw new BadRequestException('User is already deactivated');
    user.is_active = false;
    await this.userRepository.save(user);
    return {
      user,
      message: 'User is deactivated',
    };
  }

  async activateUser(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('User does not exists');
    if (user.is_active === true)
      throw new BadRequestException('User is already activated');
    user.is_active = true;
    await this.userRepository.save(user);
    return {
      user,
      message: 'User is activated',
    };
  }

  async createUser(user: CreateUserDto) {
    const { email, username, password } = user;
    if (
      (await this.userRepository.findOne({ where: { username } })) ||
      (await this.userRepository.findOne({ where: { email } }))
    )
      throw new BadRequestException(USER_ALREADY_EXISTS);
    const hashedPassword = await generateHash(password);
    user.password = hashedPassword;
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return {
      newUser,
      message: 'User has been created',
    };
  }

  async updateUser(user: UpdateUserDto) {
    let existing_user: UserEntity = await this.userRepository.findOne(user.id);
    if (!existing_user) throw new BadRequestException(USER_NOT_FOUND);

    if (user.email && user.email !== existing_user.email) {
      if (await this.userRepository.findOne({ where: { email: user.email } }))
        throw new BadRequestException(
          'User with the updated email already exists',
        );
    }

    if (user.contact && user.contact !== existing_user.contact) {
      if (
        await this.userRepository.findOne({ where: { contact: user.contact } })
      )
        throw new BadRequestException(
          'User with the updated contact already exists',
        );
    }
    if (user.password) {
      if (!(await compareHash(user.password, existing_user.password))) {
        user.password = await generateHash(user.password);
      } else
        throw new BadRequestException('New and Old password cannot be same');
    }
    Object.assign(existing_user, user);
    const updatedUser = await this.userRepository.save(existing_user);
    return {
      updatedUser,
      message: 'User has been updated',
    };
  }
}
