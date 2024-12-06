import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Genre } from '@genre/domain/genre.entity';

export class BookResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiPropertyOptional()
  deletedAt?: string;

  @ApiPropertyOptional()
  genre?: Genre;
}
