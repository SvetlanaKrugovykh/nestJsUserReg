import { Injectable } from '@nestjs/common';
import { ProductDto, Interval } from './dto/product.dto';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(private productDto: ProductDto) {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPrice(productDto: ProductDto) {
    await this.stripe.products
      .create({
        name: productDto.name,
        description: productDto.description,
      })
      .then(async (product) => {
        await this.stripe.prices
          .create({
            unit_amount: productDto.unit_amount,
            currency: productDto.currency,
            recurring: {
              interval: productDto.interval as Interval,
            },
            product: product.id,
          })
          .then((price) => {
            console.log(
              'Success! Here is your starter subscription product id: ' +
                product.id,
            );
            console.log(
              'Success! Here is your premium subscription price id: ' +
                price.id,
            );
          });
      });

    return productDto;
  }

	async createProductIntoDB(productDto: ProductDto) {
		const product = await this.productModel.create(productDto);
		return product;
	}	
}
