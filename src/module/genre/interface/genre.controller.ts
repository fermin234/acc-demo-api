import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/page-query-params.dto';
import { ControllerEntity } from '@common/base/application/interface/decorators/endpoint-entity.decorator';

import { CreateGenreDto } from '@genre/application/dto/create-genre.dto';
import { GenreFilterQueryParamsDto } from '@genre/application/dto/genre-filter-query-params.dto';
import { GenreResponseDto } from '@genre/application/dto/genre-response.dto';
import { GenreSortQueryParamsDto } from '@genre/application/dto/genre-sort-query-params.dto';
import { UpdateGenreDto } from '@genre/application/dto/update-genre.dto';
import { CreateGenrePolicyHandler } from '@genre/application/policy/create-genre-policy.handler';
import { DeleteGenrePolicyHandler } from '@genre/application/policy/delete-genre-policy.handler';
import { ReadGenrePolicyHandler } from '@genre/application/policy/read-genre-policy.handler';
import { UpdateGenrePolicyHandler } from '@genre/application/policy/update-genre-policy.handler';
import { GenreService } from '@genre/application/service/genre.service';
import { GENRE_ENTITY_NAME } from '@genre/domain/genre.name';

import { Policies } from '@iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PoliciesGuard } from '@iam/authorization/infrastructure/policy/guard/policy.guard';

@Controller('/genre')
@ControllerEntity(GENRE_ENTITY_NAME)
@UseGuards(PoliciesGuard)
@ApiTags('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @Policies(ReadGenrePolicyHandler)
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: GenreFilterQueryParamsDto,
    @Query('sort') sort: GenreSortQueryParamsDto,
  ): Promise<ManySerializedResponseDto<GenreResponseDto>> {
    return this.genreService.getAll({
      page,
      filter,
      sort,
    });
  }

  @Get(':id')
  @Policies(ReadGenrePolicyHandler)
  async getOneByIdOrFail(
    @Param('id') id: number,
  ): Promise<OneSerializedResponseDto<GenreResponseDto>> {
    return this.genreService.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateGenrePolicyHandler)
  async saveOne(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<OneSerializedResponseDto<GenreResponseDto>> {
    return this.genreService.saveOne(createGenreDto);
  }

  @Patch(':id')
  @Policies(UpdateGenrePolicyHandler)
  async updateOneOrFail(
    @Param('id') id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<OneSerializedResponseDto<GenreResponseDto>> {
    return this.genreService.updateOne(id, updateGenreDto);
  }

  @Policies(DeleteGenrePolicyHandler)
  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: number): Promise<void> {
    return this.genreService.deleteOneOrFail(id);
  }
}
