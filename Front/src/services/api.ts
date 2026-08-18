import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000';
const WOMPI_API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
const WOMPI_PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';

// Obtener productos desde el Backend NestJS
export const getProducts = async () => {
  const res = await axios.get(`${BACKEND_URL}/products`);
  return res.data;
};

// Obtener token de aceptación de términos del comercio
export const getMerchant = async () => {
  const res = await axios.get(`${BACKEND_URL}/checkout/merchant`);
  return res.data;
};

// Tokenizar tarjeta directamente contra la pasarela Sandbox
export const tokenizeCard = async (cardData: {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}) => {
  const res = await axios.post(
    `${WOMPI_API_URL}/tokens/cards`,
    cardData,
    {
      headers: {
        Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
      },
    },
  );
  return res.data.data.id; // Retorna el token (ej: "tok_stagtest_...")
};

// Enviar orden de cobro completa al Backend
export const processPayment = async (payload: any) => {
  const res = await axios.post(`${BACKEND_URL}/checkout/pay`, payload);
  return res.data;
};
