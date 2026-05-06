import { useAppContext } from '../context/AppContext';

export const useFormatCurrency = () => {
  const { currency } = useAppContext();

  /**
   * Formats a number as a currency string using the global currency setting.
   */
  const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return showSymbol ? `${currency.symbol}0` : '0';
    }
    
    // Format based on currency code
    const formatted = Math.abs(amount).toLocaleString(currency.code === 'NGN' ? 'en-NG' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    const symbol = showSymbol ? currency.symbol : '';
    return `${symbol}${formatted}`;
  };

  /**
   * Formats a currency amount with a positive or negative sign.
   */
  const formatCurrencyWithSign = (amount: number, type: 'income' | 'expense'): string => {
    const sign = type === 'income' ? '+' : '-';
    const formatted = Math.abs(amount).toLocaleString(currency.code === 'NGN' ? 'en-NG' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return `${sign}${currency.symbol}${formatted}`;
  };

  /**
   * Formats a currency amount into parts for special UI rendering.
   */
  const formatCurrencyParts = (amount: number): { whole: string; decimal: string } => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return { whole: `${currency.symbol}0`, decimal: '.00' };
    }
    const abs = Math.abs(amount);
    const whole = Math.floor(abs).toLocaleString(currency.code === 'NGN' ? 'en-NG' : 'en-US');
    const decimal = (abs % 1).toFixed(2).slice(1);
    return { whole: `${currency.symbol}${whole}`, decimal };
  };

  return {
    formatCurrency,
    formatCurrencyWithSign,
    formatCurrencyParts,
    currencySymbol: currency.symbol,
    currencyCode: currency.code
  };
};
