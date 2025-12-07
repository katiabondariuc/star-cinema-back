import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MainRoleEnum } from '../../../shared/enums/main-role.enum';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
      description: 'Role',
      example: 'USER',
      required: false,
    })
    @IsOptional()
    role?: MainRoleEnum = MainRoleEnum.USER;
}