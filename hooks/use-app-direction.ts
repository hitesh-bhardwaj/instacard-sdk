import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar'] as const;

export function useAppDirection() {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const language = i18n.language?.split('-')[0] ?? 'en';
    const isRTL = (RTL_LANGUAGES as readonly string[]).includes(language);
    return { isRTL, language };
  }, [i18n.language]);
}

