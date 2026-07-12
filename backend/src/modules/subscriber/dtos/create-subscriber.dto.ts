import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
