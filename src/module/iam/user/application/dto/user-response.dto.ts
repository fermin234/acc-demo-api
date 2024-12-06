import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AppRole } from '@iam/authorization/domain/app-role.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  externalId?: string;

  @ApiProperty()
  roles: AppRole[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiPropertyOptional()
  deletedAt?: string;
}
