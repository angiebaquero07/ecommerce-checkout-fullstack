import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productRepository.count();
    if (count === 0) {
      const defaultProduct = this.productRepository.create({
        name: 'Audífonos Inalámbricos Pro Max',
        description: 'Audífonos de alta fidelidad con cancelación activa de ruido y hasta 30 horas de autonomía.',
        priceInCents: 15000000,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      });
      await this.productRepository.save(defaultProduct);
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async decreaseStock(id: string, quantity: number): Promise<void> {
    const product = await this.findOne(id);
    if (product) {
      product.stock = Math.max(0, product.stock - quantity);
      await this.productRepository.save(product);
    }
  }
}
