import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class DeliveryDto {
  @ApiProperty({ example: 'Calle 100 # 15-20, Apto 502' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Cundinamarca', required: false })
  @IsString()
  @IsOptional()
  department?: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-del-producto' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: DeliveryDto })
  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;

  @ApiProperty({ example: 'tok_stagtest_...', description: 'Token de la tarjeta generado por Wompi' })
  @IsString()
  @IsNotEmpty()
  cardToken: string;

  @ApiProperty({ example: 1, description: 'Número de cuotas' })
  @IsNumber()
  @Min(1)
  installments: number;

  @ApiProperty({ description: 'Token de aceptación de términos de Wompi' })
  @IsString()
  @IsNotEmpty()
  acceptanceToken: string;
}
