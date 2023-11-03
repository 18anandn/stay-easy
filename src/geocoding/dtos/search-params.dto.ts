import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SeatrchParamsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  address: string;
}
