import { useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { DropdownMenuRadioItem } from './ui/dropdown-menu';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
        {routing.locales.map((cur) => (
          <DropdownMenuRadioItem key={cur} value={cur}>
            {t('locale', {locale: cur})}
          </DropdownMenuRadioItem>
        ))}
    </LocaleSwitcherSelect>
  );
}