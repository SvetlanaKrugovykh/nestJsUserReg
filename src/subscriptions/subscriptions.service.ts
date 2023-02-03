import { Injectable } from '@nestjs/common';
import { ProductDto, Interval } from './dto/product.dto';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  constructor(private productDto: ProductDto) {}

  async createPrice(productDto: ProductDto, STRIPE_SECRET_KEY: string) {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    console.log('STRIPE_SECRET_KEY: ', STRIPE_SECRET_KEY);
    stripe.products
      .create({
        name: 'Subscription for Internet Service Provider',
        description: 'subscription for internet service provider',
      })
      .then((product) => {
        stripe.prices
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
                productDto.id,
            );
            console.log(
              'Success! Here is your premium subscription price id: ' +
                price.id,
            );
          });
      });
    return productDto;
  }
}
