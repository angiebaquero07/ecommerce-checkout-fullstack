import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Delivery } from '../entities/delivery.entity';
import { Transaction } from '../entities/transaction.entity';
import { ProductsService } from '../products/products.service';
import { NotFoundException } from '@nestjs/common';

describe('CheckoutService', () => {
  let service: CheckoutService;

  const mockProductRepo = {
    findOne: jest.fn(),
  };

  const mockCustomerRepo = {
    findOne: jest.fn(),
    create: jest.fn((dto) => ({ id: 'cust-1', ...dto })),
    save: jest.fn((cust) => Promise.resolve(cust)),
  };

  const mockDeliveryRepo = {
    create: jest.fn((dto) => ({ id: 'del-1', ...dto })),
    save: jest.fn((del) => Promise.resolve(del)),
  };

  const mockTransactionRepo = {
    create: jest.fn((dto) => ({ id: 'tx-1', ...dto })),
    save: jest.fn((tx) => Promise.resolve(tx)),
    findOne: jest.fn(),
  };

  const mockProductsService = {
    decreaseStock: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(Customer), useValue: mockCustomerRepo },
        { provide: getRepositoryToken(Delivery), useValue: mockDeliveryRepo },
        { provide: getRepositoryToken(Transaction), useValue: mockTransactionRepo },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe lanzar NotFoundException si el producto no existe', async () => {
    mockProductRepo.findOne.mockResolvedValue(null);

    await expect(
      service.processPayment({
        productId: 'invalido',
        quantity: 1,
        customer: { fullName: 'Juan', email: 'j@test.com', phoneNumber: '123' },
        delivery: { address: 'Calle 1', city: 'Bogota' },
        cardToken: 'tok_test',
        installments: 1,
        acceptanceToken: 'acc_test',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
