import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictUserNameError,
  ConflictSubscribedPathError,
} from './users.exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(process.env.AUTH_SALT_ROUNDS) || 10,
    );
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
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

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  async findByIds(ids: number[]): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: {
        id: ids,
      },
    });
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ username });
  }

  async findBySubscribedPath(subscribedPath: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ subscribedPath });
  }
}
