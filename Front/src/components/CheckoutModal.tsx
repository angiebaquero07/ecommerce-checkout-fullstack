import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  closeModal,
  setStep,
  updateCard,
  updateCustomer,
  updateDelivery,
  setTermsAccepted,
  setLoading,
  setError,
  setTransactionResult,
  resetCheckout,
} from '../store/checkoutSlice';
import { tokenizeCard, processPayment } from '../services/api';
import {
  X,
  CreditCard,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Award,
  Shield,
  Calendar
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.checkout);
  const {
    isModalOpen,
    step,
    product,
    customer,
    delivery,
    card,
    termsAccepted,
    permalinkToken,
    acceptanceToken,
    transactionResult,
    loading,
    error,
  } = state;

  const [formErrors, setFormErrors] = useState<string | null>(null);

  useEffect(() => {
    if (formErrors) {
      const timer = setTimeout(() => setFormErrors(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [formErrors]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(setError(null)), 4000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!isModalOpen || !product) return null;

  const formatCOP = (amountInCents: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amountInCents / 100);

  const baseFee = 500000;
  const deliveryFee = 1000000;
  const totalAmount = product.priceInCents + baseFee + deliveryFee;

  const validateCardStep = () => {
    if (
      !card.cardNumber ||
      card.cardNumber.replace(/\s/g, '').length < 15 ||
      !card.expMonth ||
      !card.expYear ||
      !card.cvc ||
      !card.cardHolder
    ) {
      setFormErrors('Por favor completa todos los datos de la tarjeta correctamente.');
      return false;
    }
    if (!termsAccepted) {
      setFormErrors('Debes aceptar los términos y condiciones para continuar.');
      return false;
    }
    setFormErrors(null);
    return true;
  };

  const validateDeliveryStep = () => {
    if (!customer.fullName || !customer.email || !customer.phoneNumber) {
      setFormErrors('Completa todos los datos de contacto.');
      return false;
    }
    if (!delivery.address || !delivery.city) {
      setFormErrors('Completa la dirección de entrega y ciudad.');
      return false;
    }
    setFormErrors(null);
    return true;
  };

  const handlePayment = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const cardToken = await tokenizeCard({
        number: card.cardNumber.replace(/\s/g, ''),
        cvc: card.cvc,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        card_holder: card.cardHolder,
      });

      const result = await processPayment({
        productId: product.id,
        quantity: 1,
        customer,
        delivery,
        cardToken,
        installments: Number(card.installments) || 1,
        acceptanceToken,
      });

      dispatch(setTransactionResult(result));
    } catch (err: any) {
      dispatch(
        setError(
          err.response?.data?.message ||
          'Ocurrió un error al procesar el pago. Verifica los datos de tu tarjeta.',
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    dispatch(updateCard({ cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    let month = clean.slice(0, 2);
    const year = clean.slice(2, 4);
    if (month.length === 2 && parseInt(month) > 12) month = '12';
    if (month.length === 2 && parseInt(month) === 0) month = '01';
    dispatch(updateCard({ expMonth: month, expYear: year }));
  };

  const displayExpiry = card.expMonth ? `${card.expMonth}${card.expMonth.length === 2 && card.expYear || card.expMonth.length === 2 ? '/' : ''}${card.expYear}` : '';

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    dispatch(updateCard({ cvc: clean }));
  };

  const getCardLogo = (number: string) => {
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5')) return 'MASTERCARD';
    if (number.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {(formErrors || error) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px] animate-slide-up">
          <div className="p-4 bg-rose-50/95 backdrop-blur-md border border-rose-200 flex items-center gap-3 text-rose-700 text-sm rounded-2xl font-bold shadow-2xl">
            <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <p className="leading-tight">{formErrors || error}</p>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={() => step !== 'STATUS' && !loading && dispatch(closeModal())}
      />

      <div className="glass-card relative max-w-[480px] w-full max-h-[90vh] flex flex-col animate-slide-up bg-white">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 leading-none mb-1">
                Pago Seguro SSL
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Protección
              </span>
            </div>
          </div>
          {step !== 'STATUS' && (
            <button
              disabled={loading}
              onClick={() => dispatch(closeModal())}
              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step !== 'STATUS' && (
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
            {[
              { id: 'CARD', label: 'Tarjeta', icon: CreditCard },
              { id: 'DELIVERY', label: 'Envío', icon: MapPin },
              { id: 'SUMMARY', label: 'Resumen', icon: FileText }
            ].map((s, index) => {
              const isActive = step === s.id;
              const isPast =
                (step === 'DELIVERY' && s.id === 'CARD') ||
                (step === 'SUMMARY' && (s.id === 'CARD' || s.id === 'DELIVERY'));

              return (
                <div key={s.id} className="flex items-center">
                  <div className={`flex flex-col items-center gap-2 ${isActive ? 'opacity-100' : isPast ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' :
                      isPast ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-indigo-600' : isPast ? 'text-indigo-600' : 'text-slate-500'
                      }`}>
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className="w-10 sm:w-16 h-1 mx-3 rounded-full overflow-hidden bg-slate-100">
                      <div className={`h-full transition-all duration-500 ${isPast ? 'w-full bg-indigo-500' : 'w-0 bg-indigo-500'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 'CARD' && (
            <div className="space-y-6 animate-slide-up">
              <div
                className="relative w-full h-[180px] rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 overflow-hidden transition-all duration-500"
                style={{
                  background: card.cardNumber.startsWith('4') ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' :
                    card.cardNumber.startsWith('5') ? 'linear-gradient(135deg, #7f1d1d, #ef4444)' :
                      'linear-gradient(135deg, #1e293b, #475569)'
                }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <CreditCard className="w-8 h-8 opacity-90" />
                    <span className="font-bold text-xl tracking-widest italic opacity-90">
                      {getCardLogo(card.cardNumber)}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[22px] tracking-[0.15em] mb-2 drop-shadow-md">
                      {card.cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between items-end font-mono text-xs uppercase opacity-80 drop-shadow-sm">
                      <span className="truncate max-w-[65%]">{card.cardHolder || 'NOMBRE DEL TITULAR'}</span>
                      <span className="text-[14px]">{card.expMonth ? `${card.expMonth}/${card.expYear || '••'}` : 'MM/AA'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Número de Tarjeta
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      value={card.cardNumber}
                      onChange={handleCardNumberChange}
                      className="input-modern pl-11 font-mono tracking-widest text-[15px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    placeholder="JUAN PEREZ"
                    value={card.cardHolder}
                    onChange={(e) => dispatch(updateCard({ cardHolder: e.target.value.toUpperCase() }))}
                    className="input-modern uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Fecha de Exp.
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={displayExpiry}
                        onChange={handleExpiryChange}
                        className="input-modern pl-10 text-center font-mono text-lg tracking-widest"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="•••"
                        value={card.cvc}
                        onChange={handleCvcChange}
                        className="input-modern pl-10 text-center font-mono tracking-widest text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Número de Cuotas
                  </label>
                  <select
                    value={card.installments}
                    onChange={(e) => dispatch(updateCard({ installments: Number(e.target.value) }))}
                    className="input-modern cursor-pointer font-medium text-slate-700"
                  >
                    {[1, 3, 6, 12, 24, 36].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'cuota' : 'cuotas'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-start gap-3 mt-6">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => dispatch(setTermsAccepted(e.target.checked))}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                    />
                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <label htmlFor="terms" className="text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none">
                    Acepto el tratamiento de datos personales y los{' '}
                    <a
                      href={permalinkToken || 'https://wompi.co/terminos-y-condiciones/'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-bold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      términos y condiciones
                    </a>{' '}
                    del comercio.
                  </label>
                </div>

                <button
                  onClick={() => validateCardStep() && dispatch(setStep('DELIVERY'))}
                  className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span>Continuar al Envío</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 'DELIVERY' && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  value={customer.fullName}
                  onChange={(e) => dispatch(updateCustomer({ fullName: e.target.value }))}
                  className="input-modern"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={customer.email}
                    onChange={(e) => dispatch(updateCustomer({ email: e.target.value }))}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    placeholder="+573001234567"
                    value={customer.phoneNumber}
                    onChange={(e) => dispatch(updateCustomer({ phoneNumber: e.target.value }))}
                    className="input-modern font-mono"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 my-2" />

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Dirección de Entrega
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Calle 100 # 15-20, Apto 301"
                    value={delivery.address}
                    onChange={(e) => dispatch(updateDelivery({ address: e.target.value }))}
                    className="input-modern pl-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Bogotá"
                    value={delivery.city}
                    onChange={(e) => dispatch(updateDelivery({ city: e.target.value }))}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    placeholder="Cundinamarca"
                    value={delivery.department}
                    onChange={(e) => dispatch(updateDelivery({ department: e.target.value }))}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => dispatch(setStep('CARD'))}
                  className="w-1/3 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={() => validateDeliveryStep() && dispatch(setStep('SUMMARY'))}
                  className="btn-primary w-2/3 py-4 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span>Revisar Resumen</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 'SUMMARY' && (
            <div className="space-y-6 animate-slide-up">
              <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />

                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Detalles del Cargo</h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-600 font-medium">{product.name} <span className="text-slate-400">(x1)</span></span>
                    <span className="font-bold text-slate-900">{formatCOP(product.priceInCents)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-500">Tarifa procesamiento</span>
                    <span className="font-semibold text-slate-700">{formatCOP(baseFee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-500">Seguro de entrega</span>
                    <span className="font-semibold text-slate-700">{formatCOP(deliveryFee)}</span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-dashed border-slate-300">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Total a Pagar
                    </span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tight">
                      {formatCOP(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{customer.fullName}</p>
                    <p className="text-slate-500">{delivery.address}, {delivery.city}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{customer.email}</p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200 my-2" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      •••• {card.cardNumber.slice(-4)}
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] uppercase rounded-md tracking-wider">
                        {card.installments} cuotas
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  disabled={loading}
                  onClick={() => dispatch(setStep('DELIVERY'))}
                  className="w-1/3 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Atrás</span>
                </button>
                <button
                  disabled={loading}
                  onClick={handlePayment}
                  className="btn-primary w-2/3 py-4 flex items-center justify-center gap-2 text-[15px]"
                  style={{
                    background: loading ? '#94a3b8' : undefined,
                    boxShadow: loading ? 'none' : undefined,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Procesando Pago...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Pagar de forma segura</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center gap-1.5 text-slate-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">Pago Seguro SSL</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 text-slate-500">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">Garantía Wompi</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 text-slate-500">
                  <Shield className="w-5 h-5 text-rose-500" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">Datos Protegidos</span>
                </div>
              </div>
            </div>
          )}

          {step === 'STATUS' && (
            <div className="text-center py-8 space-y-6 animate-slide-up">
              {transactionResult?.status === 'APPROVED' ? (
                <>
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12 animate-slide-up" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                      ¡Pago Exitoso!
                    </h3>
                    <p className="text-slate-500 text-sm font-medium px-4">
                      Tu orden ha sido confirmada y se está preparando para el envío.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-rose-500/20">
                    <XCircle className="w-12 h-12 animate-slide-up" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                      Pago Rechazado
                    </h3>
                    <p className="text-slate-500 text-sm font-medium px-4">
                      {transactionResult?.status === 'DECLINED'
                        ? 'La tarjeta fue rechazada por el banco emisor o la pasarela.'
                        : 'Ocurrió un problema validando la transacción.'}
                    </p>
                  </div>
                </>
              )}

              <div className="bg-slate-50 rounded-3xl p-6 text-left border border-slate-100 shadow-inner">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
                  Recibo de Transacción
                </h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-slate-500">Referencia</span>
                    <span className="font-bold text-slate-900 truncate pl-4">
                      {transactionResult?.reference || 'N/A'}
                    </span>
                  </div>
                  {transactionResult?.wompiTransactionId && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-3">
                      <span className="text-slate-500">ID Wompi</span>
                      <span className="font-bold text-slate-900 truncate pl-4">
                        {transactionResult?.wompiTransactionId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-slate-500">Total cobrado</span>
                    <span className="font-bold text-slate-900">
                      {formatCOP(transactionResult?.totalAmountInCents || totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Estado</span>
                    <span
                      className={`font-bold px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase ${transactionResult?.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                        }`}
                    >
                      {transactionResult?.status || 'ERROR'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  dispatch(resetCheckout());
                  window.location.reload();
                }}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 text-[15px]"
              >
                Volver a la Tienda
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
