import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCryptocurrencyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  symbol!: string;

  @Matches(/^\d+(\.\d{1,8})?$/, {
    message: 'price must have up to 8 decimal places',
  })
  price!: string;
}
