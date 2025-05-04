'use client';

import clsx from 'clsx';
import {useParams} from 'next/navigation';
import {Locale, useLocale, useTranslations} from 'next-intl';
import {ChangeEvent, ReactNode, useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import { DropdownMenu, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label
}: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [isPending, startTransition] = useTransition();

  const onChange = (value: string) => {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Globe />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={locale} onValueChange={onChange}>
            {children}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}