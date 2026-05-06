import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in ErrorBoundary', error, {
      componentStack: errorInfo.componentStack
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-amber-500" size={40} />
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Ops! Algo deu errado.</h1>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Ocorreu um erro inesperado na aplicação. Nossa equipe técnica já foi notificada.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                >
                  <RotateCcw size={18} /> Tentar Novamente
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3 px-6 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  <Home size={18} /> Voltar para o Início
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-slate-100 rounded-xl text-left overflow-auto max-h-40">
                  <p className="text-xs font-mono text-slate-500 whitespace-pre-wrap">
                    {this.state.error?.toString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Erro ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
