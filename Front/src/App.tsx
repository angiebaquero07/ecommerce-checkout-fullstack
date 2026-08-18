import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProduct, setTokens } from './store/checkoutSlice';
import { getProducts, getMerchant } from './services/api';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { ShieldCheck, Lock, Zap } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar producto inicial desde el Backend
    getProducts()
      .then((products) => {
        if (products && products.length > 0) {
          dispatch(setProduct(products[0]));
        }
      })
      .catch((err) => console.error('Error cargando producto:', err));

    // Cargar tokens de aceptación desde el comercio
    getMerchant()
      .then((merchant) => {
        if (merchant?.presigned_acceptance) {
          dispatch(
            setTokens({
              acceptanceToken: merchant.presigned_acceptance.acceptance_token,
              permalinkToken: merchant.presigned_acceptance.permalink,
            }),
          );
        }
      })
      .catch((err) => console.error('Error cargando comercio:', err));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background elegant elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="leading-none">
              <p className="font-extrabold text-slate-900 text-lg tracking-tight">TechStore</p>
              <p className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">Pay</p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Sandbox activo</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">SSL 256-bit</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 w-full">
        <div className="w-full max-w-md animate-slide-up">
          <ProductCard />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 py-6">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Pagos seguros</span>
          </div>
          <span className="text-slate-300">|</span>
          <span>© 2025 TechStore Pay</span>
        </div>
      </footer>

      <CheckoutModal />
    </div>
  );
}
