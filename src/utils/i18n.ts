/**
 * Simple i18n implementation for CampusKobo
 */

export type LanguageCode = 'en' | 'fr' | 'es' | 'yo' | 'ha' | 'ig';

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'dashboard.balance': 'Current Balance',
    'dashboard.income': 'Income',
    'dashboard.expenses': 'Expenses',
    'dashboard.budget': 'Budget',
    'dashboard.savings': 'Savings',
    'settings.currency': 'Currency',
    'settings.language': 'Language',
    'settings.support': 'Help & Support',
    'settings.logout': 'Logout',
    // ... more
  },
  yo: {
    'dashboard.balance': 'Iwọntunwọnsi lọwọlọwọ',
    'dashboard.income': 'Owo ti n wọle',
    'dashboard.expenses': 'Awọn inawo',
    'dashboard.budget': 'Isuna',
    'dashboard.savings': 'Ifowopamọ',
    'settings.currency': 'Owo ti a n lo',
    'settings.language': 'Ede',
    'settings.support': 'Iranlọwọ',
    'settings.logout': 'Jade kuro',
  },
  // Add more as needed
  fr: {
    'dashboard.balance': 'Solde actuel',
    'dashboard.income': 'Revenu',
    'dashboard.expenses': 'Dépenses',
    'dashboard.budget': 'Budget',
    'dashboard.savings': 'Épargne',
    'settings.currency': 'Devise',
    'settings.language': 'Langue',
    'settings.support': 'Aide et support',
    'settings.logout': 'Déconnexion',
  },
  es: {
    'dashboard.balance': 'Saldo actual',
    'dashboard.income': 'Ingresos',
    'dashboard.expenses': 'Gastos',
    'dashboard.budget': 'Presupuesto',
    'dashboard.savings': 'Ahorros',
    'settings.currency': 'Moneda',
    'settings.language': 'Idioma',
    'settings.support': 'Ayuda y soporte',
    'settings.logout': 'Cerrar sesión',
  },
  ha: {
    'dashboard.balance': 'Balance na yanzu',
    'dashboard.income': 'Kudin shiga',
    'dashboard.expenses': 'Kashe kudi',
    'dashboard.budget': 'Kasafin kudi',
    'dashboard.savings': 'Ajiye kudi',
  },
  ig: {
    'dashboard.balance': 'Ego fọrọ afọ',
    'dashboard.income': 'Ego batara',
    'dashboard.expenses': 'Ego e jere nri',
    'dashboard.budget': 'Atụmatụ ego',
    'dashboard.savings': 'Ego echekwara',
  }
};

export const translate = (key: string, lang: string = 'en'): string => {
  const code = (lang as LanguageCode) || 'en';
  const dict = translations[code] || translations.en;
  return dict[key] || translations.en[key] || key;
};
