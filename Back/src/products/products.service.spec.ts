import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: any;

  const mockProduct: Product = {
    id: 'prod-123',
    name: 'Audífonos Pro Max',
    description: 'Descripción de prueba',
    priceInCents: 15000000,
    stock: 10,
    imageUrl: 'https://test.com/image.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    count: jest.fn().mockResolvedValue(1),
    find: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    save: jest.fn().mockImplementation((prod) => Promise.resolve(prod)),
    create: jest.fn().mockImplementation((prod) => prod),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe retornar todos los productos', async () => {
    const products = await service.findAll();
    expect(products).toEqual([mockProduct]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('debe retornar un producto por su ID', async () => {
    const product = await service.findOne('prod-123');
    expect(product).toEqual(mockProduct);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'prod-123' } });
  });

  it('debe descontar el stock correctamente', async () => {
    await service.decreaseStock('prod-123', 1);
    expect(repo.save).toHaveBeenCalled();
  });
});
