import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Delivery } from '../entities/delivery.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CheckoutService {
  private readonly wompiApiUrl = process.env.WOMPI_API_URL || 'https://api-sandbox.co.uat.wompi.dev/v1';
  private readonly wompiPublicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly wompiIntegrityKey = process.env.WOMPI_INTEGRITY_KEY;

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly productsService: ProductsService,
  ) {}

  async getMerchantInfo() {
    try {
      const response = await fetch(`${this.wompiApiUrl}/merchants/${this.wompiPublicKey}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new BadRequestException('Error al consultar configuración del comercio');
    }
  }

  private generateSignature(reference: string, amountInCents: number, currency = 'COP'): string {
    const rawString = `${reference}${amountInCents}${currency}${this.wompiIntegrityKey}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  // Esperar a que la pasarela resuelva el estado de PENDING a APPROVED o DECLINED
  private async pollTransactionStatus(transactionId: string, maxAttempts = 6): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Esperar 1.5s entre consultas

      const response = await fetch(`${this.wompiApiUrl}/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${this.wompiPrivateKey}` },
      });
      const result = await response.json();
      const status = result?.data?.status;

      if (status && status !== 'PENDING') {
        return result.data;
      }
    }
    return null;
  }

  async processPayment(dto: CreatePaymentDto) {
    // 1. Validar producto y stock
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (product.stock < dto.quantity) throw new BadRequestException('Stock insuficiente');

    // 2. Calcular montos
    const productTotalInCents = product.priceInCents * dto.quantity;
    const baseFeeInCents = 500000;
    const deliveryFeeInCents = 1000000;
    const totalAmountInCents = productTotalInCents + baseFeeInCents + deliveryFeeInCents;

    // 3. Crear o actualizar Cliente
    let customer = await this.customerRepo.findOne({ where: { email: dto.customer.email } });
    if (!customer) {
      customer = this.customerRepo.create(dto.customer);
      customer = await this.customerRepo.save(customer);
    }

    // 4. Crear Entrega
    const delivery = this.deliveryRepo.create({
      ...dto.delivery,
      customerId: customer.id,
      status: 'PENDING',
    });
    await this.deliveryRepo.save(delivery);

    // 5. Firma y Referencia
    const reference = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const signature = this.generateSignature(reference, totalAmountInCents, 'COP');

    // 6. Crear transacción en Wompi
    const payload = {
      acceptance_token: dto.acceptanceToken,
      amount_in_cents: totalAmountInCents,
      currency: 'COP',
      signature: signature,
      customer_email: customer.email,
      payment_method: {
        type: 'CARD',
        token: dto.cardToken,
        installments: dto.installments,
      },
      reference: reference,
      customer_data: {
        phone_number: customer.phoneNumber,
        full_name: customer.fullName,
      },
      shipping_address: {
        address_line_1: delivery.address,
        city: delivery.city,
        country: 'CO',
        phone_number: customer.phoneNumber,
        region: delivery.department || 'Cundinamarca',
      },
    };

    const response = await fetch(`${this.wompiApiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.wompiPrivateKey}`,
      },
      body: JSON.stringify(payload),
    });

    const wompiResult = await response.json();
    let finalWompiData = wompiResult?.data;
    const wompiTxId = finalWompiData?.id || null;

    // Si la pasarela responde PENDING, consultar hasta obtener APPROVED o DECLINED
    if (finalWompiData?.status === 'PENDING' && wompiTxId) {
      const resolvedData = await this.pollTransactionStatus(wompiTxId);
      if (resolvedData) {
        finalWompiData = resolvedData;
      }
    }

    const transactionStatus = finalWompiData?.status || 'PENDING';

    // 7. Guardar Transacción en BD
    const transaction = this.transactionRepo.create({
      reference,
      productId: product.id,
      customerId: customer.id,
      deliveryId: delivery.id,
      productAmountInCents: productTotalInCents,
      baseFeeInCents: baseFeeInCents,
      deliveryFeeInCents: deliveryFeeInCents,
      totalAmountInCents: totalAmountInCents,
      status: transactionStatus,
      wompiTransactionId: wompiTxId,
      paymentMethod: 'CARD',
    });
    await this.transactionRepo.save(transaction);

    // 8. Descontar stock si la transacción fue aprobada
    if (transactionStatus === 'APPROVED') {
      await this.productsService.decreaseStock(product.id, dto.quantity);
      delivery.status = 'IN_TRANSIT';
      await this.deliveryRepo.save(delivery);
    }

    return {
      success: transactionStatus === 'APPROVED',
      status: transactionStatus,
      reference: reference,
      transactionId: transaction.id,
      wompiTransactionId: wompiTxId,
      totalAmountInCents: totalAmountInCents,
      wompiResponse: finalWompiData,
    };
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepo.findOne({ where: { id } });
    if (!transaction) throw new NotFoundException('Transacción no encontrada');
    return transaction;
  }
}
