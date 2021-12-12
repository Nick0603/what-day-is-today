import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../constants/enum';

@Unique(['username'])
@Unique(['subscribedPath'])
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: UserRole.normal, type: 'varchar' })
  role: UserRole;

  @Column()
  subscribedPath: string;

  @Column({ type: 'timestamp' })
  anniversaryDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
