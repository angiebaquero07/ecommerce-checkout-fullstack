import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
}

export interface CustomerData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface DeliveryData {
  address: string;
  city: string;
  department: string;
}

export interface CardData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
  installments: number;
}

interface CheckoutState {
  product: Product | null;
  step: 'CARD' | 'DELIVERY' | 'SUMMARY' | 'STATUS';
  isModalOpen: boolean;
  customer: CustomerData;
  delivery: DeliveryData;
  card: CardData;
  acceptanceToken: string;
  permalinkToken: string;
  termsAccepted: boolean;
  transactionResult: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CheckoutState = {
  product: null,
  step: 'CARD',
  isModalOpen: false,
  customer: { fullName: '', email: '', phoneNumber: '' },
  delivery: { address: '', city: 'Bogotá', department: 'Cundinamarca' },
  card: { cardNumber: '', expMonth: '', expYear: '', cvc: '', cardHolder: '', installments: 1 },
  acceptanceToken: '',
  permalinkToken: '',
  termsAccepted: false,
  transactionResult: null,
  loading: false,
  error: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    },
    openModal: (state) => {
      state.isModalOpen = true;
      state.step = 'CARD';
      state.error = null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setStep: (state, action: PayloadAction<'CARD' | 'DELIVERY' | 'SUMMARY' | 'STATUS'>) => {
      state.step = action.payload;
    },
    updateCustomer: (state, action: PayloadAction<Partial<CustomerData>>) => {
      state.customer = { ...state.customer, ...action.payload };
    },
    updateDelivery: (state, action: PayloadAction<Partial<DeliveryData>>) => {
      state.delivery = { ...state.delivery, ...action.payload };
    },
    updateCard: (state, action: PayloadAction<Partial<CardData>>) => {
      state.card = { ...state.card, ...action.payload };
    },
    setTokens: (state, action: PayloadAction<{ acceptanceToken: string; permalinkToken: string }>) => {
      state.acceptanceToken = action.payload.acceptanceToken;
      state.permalinkToken = action.payload.permalinkToken;
    },
    setTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.termsAccepted = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTransactionResult: (state, action: PayloadAction<any>) => {
      state.transactionResult = action.payload;
      state.step = 'STATUS';
    },
    resetCheckout: (state) => {
      state.step = 'CARD';
      state.isModalOpen = false;
      state.card = initialState.card;
      state.transactionResult = null;
      state.error = null;
    },
  },
});

export const {
  setProduct,
  openModal,
  closeModal,
  setStep,
  updateCustomer,
  updateDelivery,
  updateCard,
  setTokens,
  setTermsAccepted,
  setLoading,
  setError,
  setTransactionResult,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
