import { IsString, IsNumber, Min, IsArray, ArrayNotEmpty, IsOptional, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number) // แปลงจาก form-data (string) เป็น number
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @ArrayNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @IsString({ each: true })
  color: string[];

  @IsOptional()
  @IsString()
  @IsNotEmptyObject()
  imageUrl?: string;
}