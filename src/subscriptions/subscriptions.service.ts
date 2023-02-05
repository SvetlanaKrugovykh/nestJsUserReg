import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductDto, Interval } from './dto/product.dto';
import { Product } from './models/product.model';
import { Subscription } from './models/subscription.model';
import { Price } from './models/price.model';
import { Paymethods } from './models/paymethods.model';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import Stripe from 'stripe';
import { User } from 'src/users/users.model';

@Injectable()
export class SubscriptionsService {
  [x: string]: any;
  private stripe: Stripe;
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Price) private priceRepository: typeof Price,
    @InjectModel(Paymethods) private paymethodsRepository: typeof Paymethods,
    @InjectModel(Subscription)
    private subscriptionRepository: typeof Subscription,
    private userService: UsersService,
    private productDto: ProductDto,
  ) {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const STRIPE_API_VERSION = process.env.STRIPE_API_VERSION;

    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async customerRegistration(userDto: UserDto) {
    const customerDto = await this.userService.getcustomerDto(userDto);
    const customer = await this.stripe.customers.create(customerDto);
    return customer;
  }

  async setCustomerPaymentMethod(userDto: UserDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 8,
        exp_year: 2027,
        cvc: '314',
      },
    });
    const customerDto = await this.userService.getcustomerDto(userDto);
    const paymethods = await this.paymethodsRepository.create(userDto);
    paymethods.extPaymethodsId = paymentMethod.id;
    paymethods.customerId = customerDto.id;
    paymethods.save();
    const assugnPayMethod = await this.stripe.paymentMethods.attach(
      paymentMethod.id,
      { customer: customerDto.id },
    );
    return paymentMethod;
  }

  async subscriptionCreate(productDto: ProductDto) {
    const user = await this.userService.getUserByOneProp(
      'email',
      productDto.email,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const localSubscription = await this.createLocalSubscription(productDto);
    if (!user.customerId) throw new Error('Customer not found');
    const price = await this.getPriceByProductName('name', productDto.name);
    const paymethod = await this.paymethodsRepository.findOne({
      where: { ['customerId']: user.customerId },
      include: { all: true },
    });
    const extPaymethodsId = paymethod.extPaymethodsId;

    const subscription = await this.stripe.subscriptions.create({
      customer: user.customerId,
      currency: productDto.currency,
      default_payment_method: extPaymethodsId,
      items: [{ price: price.extPriceId }],
    });
    localSubscription.extSubscriptionId = subscription.id;
    localSubscription.save();
    return subscription;
  }

  async getPriceByProductName(prop: string, value: string) {
    const product = await this.productRepository.findOne({
      where: { [prop]: value },
      include: { all: true },
    });
    const price = await this.priceRepository.findOne({
      where: { ['productId']: product.id },
      include: { all: true },
    });
    return price;
  }

  async createPrice(productDto: ProductDto) {
    const localProduct = await this.createLocalProduct(productDto);
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
            this.setRegisteredIbSpripeProduct(productDto, product.id);
            console.log(
              'Success! Here is your starter subscription product id: ' +
                product.id,
            );
            this.createLocalPrice(productDto, localProduct.id, price.id);
            console.log(
              'Success! Here is your premium subscription price id: ' +
                price.id,
            );
          });
      });
    return productDto;
  }

  async createLocalProduct(productDto: ProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: productDto.name },
      include: { all: true },
    });
    if (existingProduct) {
      return existingProduct;
    } else {
      const newProduct = await this.productRepository.create(productDto);
      return newProduct;
    }
  }

  async createLocalPrice(productDto: ProductDto, productId, exPriceId) {
    const existingPrice = await this.priceRepository.findOne({
      where: { ['productId']: productId },
      include: { all: true },
    });
    if (existingPrice) {
      existingPrice.registeredInStripe = true;
      existingPrice.productId = productId;
      existingPrice.extPriceId = exPriceId;
      existingPrice.save();
    } else {
      const newPrice = await this.priceRepository.create(productDto);
      newPrice.productId = productId;
      newPrice.registeredInStripe = true;
      newPrice.extPriceId = exPriceId;
      newPrice.save();
      return newPrice;
    }
  }

  async createLocalSubscription(productDto: ProductDto) {
    const user: User = await this.userService.getUserByOneProp(
      'email',
      productDto.email,
    );
    const userId = user.id;

    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { ['userId']: userId },
      include: { all: true },
    });

    if (existingSubscription) {
      return existingSubscription;
    } else {
      productDto.userId = userId;
      const newSubscription = await this.subscriptionRepository.create(
        productDto,
      );
      return newSubscription;
    }
  }

  async setRegisteredIbSpripeProduct(productDto: ProductDto, productId) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: productDto.name },
      include: { all: true },
    });
    if (existingProduct) {
      existingProduct.registeredInStripe = true;
      existingProduct.extProductId = productId;
      existingProduct.save();
    } else {
      throw new Error('Local product not found');
    }
  }
}
