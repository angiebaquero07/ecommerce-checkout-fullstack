import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { openModal } from '../store/checkoutSlice';
import { ShoppingBag, ShieldCheck, Truck, Star, Zap } from 'lucide-react';

export const ProductCard: React.FC = () => {
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => state.checkout.product);

  if (!product) {
    return (
      <div className="w-full rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden animate-pulse">
        <div className="h-72 bg-slate-200" />
        <div className="p-8 space-y-4">
          <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-200 rounded-lg w-full" />
          <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-14 bg-slate-200 rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(product.priceInCents / 100);

  const pricePerMonth = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(product.priceInCents / 100 / 12);

  return (
    <div className="w-full group">
      {/* Main card */}
      <div className="glass-card overflow-hidden relative transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 bg-white">

        {/* Product image */}
        <div className="relative h-[280px] overflow-hidden bg-slate-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

          {/* Top badges */}
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
              <span className="text-xs font-bold">4.9</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-sm ${
              product.stock > 0
                ? 'bg-white/90 border-emerald-100 text-emerald-600'
                : 'bg-white/90 border-rose-100 text-rose-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 relative">
          <div className="inline-flex items-center justify-center px-2.5 py-1 mb-3 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 tracking-widest uppercase">
            Audio Premium
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
            {product.description}
          </p>

          {/* Price container */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/50 transition-colors">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total a pagar</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{formattedPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cuotas desde</p>
              <p className="text-base font-bold text-indigo-600">{pricePerMonth}<span className="text-xs font-semibold text-slate-500">/mes</span></p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <Truck className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Envío Gratis</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Pago Seguro</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => dispatch(openModal())}
            disabled={product.stock === 0}
            className="btn-primary w-full py-4 px-6 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[15px]">Continuar al Checkout</span>
          </button>
        </div>
      </div>
      
      {/* Footer text below card */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Zap className="w-4 h-4 text-amber-500" />
          Transacción ultrarrápida
        </div>
      </div>
    </div>
  );
};
