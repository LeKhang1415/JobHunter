import { IsString, MaxLength, MinLength } from 'class-validator';

export class SelfUserUpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}
