import { MainRoleEnum } from 'src/shared/enums/main-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;


  @Column({
    length: 20,
  })
  username: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;


  @Column({
    type: 'enum',
    enum: MainRoleEnum,
    default: MainRoleEnum.USER,
  })
  role: MainRoleEnum;

    @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}