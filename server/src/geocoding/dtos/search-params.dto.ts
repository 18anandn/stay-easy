import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SearchParamsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  address!: string;
}
