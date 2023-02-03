import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsOptional } from 'class-validator';

export enum Interval {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export class ProductDto {
  @ApiModelProperty({
    example: `Price////`,
  })
  @ApiProperty({
    example: 'cvcv',
    description: 'cvbcvbcvbcvb',
  })
  @IsOptional()
  readonly id: number;
  readonly unit_amount: number;
  readonly currency: string;
  readonly interval: string;
}
