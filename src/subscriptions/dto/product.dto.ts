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
    example: '{"unit_amount": "100","currency":  "usd", "interval":"month"}',
    description: 'Product and price',
  })
  @IsOptional()
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly unit_amount: number;
  readonly unit_amount_category1: number;
  readonly currency: string;
  readonly interval: string;
  readonly startedAt: Date;
  readonly finishedAt: Date;
}
