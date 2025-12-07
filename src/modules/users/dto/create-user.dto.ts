import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MainRoleEnum } from '../../../shared/enums/main-role.enum';



export class CreateUserDto {
  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'Role',
    example: 'USER',
    required: false,
  })
  @IsOptional()
  role?: MainRoleEnum = MainRoleEnum.USER;
}