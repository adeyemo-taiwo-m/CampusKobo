import { useAppContext } from '../context/AppContext';
import { translate } from '../utils/i18n';

export const useTranslation = () => {
  const { language } = useAppContext();

  const t = (key: string): string => {
    return translate(key, language.code);
  };

  return { t, languageCode: language.code };
};
