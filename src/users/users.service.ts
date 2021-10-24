import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictUserNameError,
  ConflictSubscribedPathError,
} from './users.exceptions';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(process.env.AUTH_SALT_ROUNDS) || 10,
    );
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { subscribedPath: createUserDto.subscribedPath },
      ],
    });
    if (existUser) {
      if (existUser.username === createUserDto.username) {
        throw new ConflictUserNameError(createUserDto.username);
      }
      if (existUser.subscribedPath === createUserDto.subscribedPath) {
        throw new ConflictSubscribedPathError(createUserDto.subscribedPath);
      }
    }
    const passwordHash = await this.hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      username: createUserDto.username,
      subscribedPath: createUserDto.subscribedPath,
      anniversaryDate: createUserDto.anniversaryDate,
      passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async updatePassword(id: number, password: string) {
    const passwordHash = await this.hashPassword(password);
    this.logger.debug(
      `[user updatedPassword] id: ${id}, passwordHash: ${passwordHash}`,
    );
    return this.usersRepository.update(id, { passwordHash });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.usersRepository.findOne({
      subscribedPath: updateUserDto.subscribedPath,
    });
    if (existUser && existUser.id !== id) {
      throw new ConflictSubscribedPathError(updateUserDto.subscribedPath);
    }
    this.logger.debug(
      `[user update] id: ${id}, passwordHash: ${JSON.stringify(updateUserDto)}`,
    );

    return this.usersRepository.update(id, updateUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async findBySubscribedPath(subscribedPath: string): Promise<User> {
    return this.usersRepository.findOne({ subscribedPath });
  }
}
