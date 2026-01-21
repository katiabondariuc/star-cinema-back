import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { MainRoleEnum } from 'src/shared/enums/main-role.enum';

@Exclude()
export class UserResponseDto {
  @ApiProperty({
    description: 'user id',
    example: '1',
  }

  )
  @Expose()
  id: number;
  
  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @Expose()
  password: string;

  @ApiProperty({
    description: 'Role',
    example: 'USER',
    required: false,
  })
  @Expose()
  @IsOptional()
  role?: MainRoleEnum = MainRoleEnum.USER;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  created_at?: Date;
}