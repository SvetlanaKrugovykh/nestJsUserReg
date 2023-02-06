import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { SubscriptionsService } from './subscriptions.service';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: 'Add product and `price' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/add-price')
  createPrice(@Body() productDto: ProductDto) {
    return this.subscriptionsService.createPrice(productDto);
  }

  @ApiOperation({ summary: 'Customer registration' })
  @ApiResponse({ status: 200, type: UserDto })
  @Post('/customer-registration')
  customerRegistration(@Body() userDto: UserDto) {
    return this.subscriptionsService.customerRegistration(userDto);
  }

  @ApiOperation({ summary: 'Subscription creating' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/subscription-create')
  subscriptionCreate(@Body() productDto: ProductDto) {
    return this.subscriptionsService.subscriptionCreate(productDto);
  }

  @ApiOperation({ summary: 'Set customer payment method' })
  @ApiResponse({ status: 200, type: UserDto })
  @Post('/set-customer-payment-method')
  setCustomerPaymentMethod(@Body() userDto: UserDto) {
    return this.subscriptionsService.setCustomerPaymentMethod(userDto);
  }

  @ApiOperation({ summary: 'Set customer payment method' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/charge')
  chargePayment(@Body() productDto: ProductDto) {
    return this.subscriptionsService.chargePayment(productDto);
  }

  @ApiOperation({ summary: 'Set customer payment method' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/process-payment')
  doProcessPayment(@Body() productDto: ProductDto) {
    return this.subscriptionsService.doProcessPayment(productDto);
  }

  @Post('/google-api-test')
  googleApiTest(@Body() productDto: ProductDto) {
    return this.subscriptionsService.googleApiTest(productDto);
  }
}
