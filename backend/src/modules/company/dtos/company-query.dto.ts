import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

export class CompanyQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
