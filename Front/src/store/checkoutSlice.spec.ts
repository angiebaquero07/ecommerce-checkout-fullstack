import { describe, it, expect } from 'vitest';
import checkoutReducer, {
  setProduct,
  openModal,
  closeModal,
  setStep,
  updateCustomer,
  updateDelivery,
  updateCard,
  setTermsAccepted,
  setTransactionResult,
  resetCheckout,
  type Product,
} from './checkoutSlice';

describe('checkoutSlice', () => {
  const initialProduct: Product = {
    id: 'prod-123',
    name: 'Audífonos Inalámbricos Pro Max',
    description: 'Audífonos de prueba',
    priceInCents: 15000000,
    stock: 10,
    imageUrl: 'https://test.com/image.png',
  };

  it('debe manejar el estado inicial', () => {
    const state = checkoutReducer(undefined, { type: 'unknown' });
    expect(state.step).toBe('CARD');
    expect(state.isModalOpen).toBe(false);
    expect(state.product).toBeNull();
    expect(state.termsAccepted).toBe(false);
  });

  it('debe asignar el producto seleccionado', () => {
    const state = checkoutReducer(undefined, setProduct(initialProduct));
    expect(state.product).toEqual(initialProduct);
  });

  it('debe abrir y cerrar el modal correctamente', () => {
    let state = checkoutReducer(undefined, openModal());
    expect(state.isModalOpen).toBe(true);
    expect(state.step).toBe('CARD');

    state = checkoutReducer(state, closeModal());
    expect(state.isModalOpen).toBe(false);
  });

  it('debe actualizar el paso del flujo de pago', () => {
    let state = checkoutReducer(undefined, setStep('DELIVERY'));
    expect(state.step).toBe('DELIVERY');

    state = checkoutReducer(state, setStep('SUMMARY'));
    expect(state.step).toBe('SUMMARY');
  });

  it('debe actualizar los datos del cliente', () => {
    const customerData = {
      fullName: 'Carlos Gómez',
      email: 'carlos@example.com',
      phoneNumber: '+573110000000',
    };
    const state = checkoutReducer(undefined, updateCustomer(customerData));
    expect(state.customer).toEqual(customerData);
  });

  it('debe actualizar los datos de envío', () => {
    const deliveryData = {
      address: 'Carrera 7 # 72-41',
      city: 'Medellín',
      department: 'Antioquia',
    };
    const state = checkoutReducer(undefined, updateDelivery(deliveryData));
    expect(state.delivery).toEqual(deliveryData);
  });

  it('debe actualizar los datos de la tarjeta', () => {
    const cardData = {
      cardNumber: '4242424242424242',
      expMonth: '12',
      expYear: '28',
      cvc: '123',
      cardHolder: 'CARLOS GOMEZ',
      installments: 3,
    };
    const state = checkoutReducer(undefined, updateCard(cardData));
    expect(state.card).toEqual(cardData);
  });

  it('debe actualizar la aceptación de términos y condiciones', () => {
    const state = checkoutReducer(undefined, setTermsAccepted(true));
    expect(state.termsAccepted).toBe(true);
  });

  it('debe guardar el resultado de la transacción y cambiar el paso a STATUS', () => {
    const result = {
      status: 'APPROVED',
      reference: 'REF-12345',
      totalAmountInCents: 16500000,
    };
    const state = checkoutReducer(undefined, setTransactionResult(result));
    expect(state.transactionResult).toEqual(result);
    expect(state.step).toBe('STATUS');
  });

  it('debe reiniciar los datos al llamar resetCheckout', () => {
    let state = checkoutReducer(undefined, setStep('STATUS'));
    state = checkoutReducer(state, resetCheckout());
    expect(state.step).toBe('CARD');
    expect(state.isModalOpen).toBe(false);
    expect(state.transactionResult).toBeNull();
  });
});
