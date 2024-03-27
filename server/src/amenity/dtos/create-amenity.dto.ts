import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { AmenityType } from "../amenity.entity";

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name!: string

  @IsEnum(AmenityType)
  @IsNotEmpty()
  type!: AmenityType
}