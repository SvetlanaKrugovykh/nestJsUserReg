import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: 'Add price' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/add-price')
  createPrice(@Body() productDto: ProductDto) {
		const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
		console.log(STRIPE_SECRET_KEY);
    return this.subscriptionsService.createPrice(productDto,STRIPE_SECRET_KEY);
  }
}
