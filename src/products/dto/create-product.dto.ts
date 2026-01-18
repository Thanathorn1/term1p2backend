import { IsString, IsNumber, Min, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  color: string[];
}