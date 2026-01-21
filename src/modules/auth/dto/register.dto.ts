// auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MainRoleEnum } from '../../../shared/enums/main-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({
    enum: MainRoleEnum,
    example: MainRoleEnum.USER,
    required: false,
  })
  role?: MainRoleEnum;
}