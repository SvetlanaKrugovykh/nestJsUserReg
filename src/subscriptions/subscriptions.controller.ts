import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { SubscriptionsService } from './subscriptions.service';
import { UserDto } from '../users/dto/user.dto';
import { RolesGuard } from 'src/auth/guards/roles.quard';

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
  @UseGuards(RolesGuard)
  subscriptionCreate(@Body() productDto: ProductDto) {
    return this.subscriptionsService.subscriptionCreate(productDto);
  }

  @ApiOperation({ summary: 'Set customer payment method' })
  @ApiResponse({ status: 200, type: UserDto })
  @Post('/set-customer-payment-method')
  setCustomerPaymentMethod(@Body() userDto: UserDto) {
    return this.subscriptionsService.setCustomerPaymentMethod(userDto);
  }

  @ApiOperation({ summary: 'Charge payment method' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/charge')
  chargePayment(@Body() productDto: ProductDto) {
    return this.subscriptionsService.chargePayment(productDto);
  }

  @ApiOperation({ summary: 'Do payment' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/process-payment')
  doProcessPayment(@Body() productDto: ProductDto) {
    return this.subscriptionsService.doProcessPayment(productDto);
  }

  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Post('/subscription-cancel')
  @UseGuards(RolesGuard)
  subscriptionCancel(@Body() productDto: ProductDto) {
    return this.subscriptionsService.subscriptionCancel(productDto);
  }

  @ApiOperation({ summary: 'Get distance between users addresses' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Get('/get-distance')
  findAll(@Req() request: any) {
    return this.subscriptionsService.getDistance(
      Number(request.query.user1),
      Number(request.query.user2),
    );
  }

  @Post('/google-api-test')
  googleApiTest(@Body() productDto: ProductDto) {
    return this.subscriptionsService.googleApiTest(productDto);
  }
  @Post('/callback')
  googleСallback(@Body() body: any) {
    return this.subscriptionsService.googleСallback(body);
  }
}
