import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({ example: 1, description: 'Número da página' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de itens por página',
  })
  @Type(() => Number)
  @IsInt()
  @Max(100)
  limit?: number = 10;
}
