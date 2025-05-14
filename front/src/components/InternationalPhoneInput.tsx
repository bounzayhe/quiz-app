
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface InternationalPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+81', country: 'JP' },
];

export function InternationalPhoneInput({
  value,
  onChange,
  className,
  placeholder,
}: InternationalPhoneInputProps) {
  const { t } = useTranslation();
  const [countryCode, setCountryCode] = React.useState('+1');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  
  // Parse value on initial render
  React.useEffect(() => {
    if (value) {
      const code = countryCodes.find(c => value.startsWith(c.code))?.code || '+1';
      setCountryCode(code);
      setPhoneNumber(value.slice(code.length).trim());
    }
  }, []);
  
  // Update the combined value when either part changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    onChange(`${countryCode} ${newPhone}`);
  };
  
  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    onChange(`${code} ${phoneNumber}`);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[90px] flex-shrink-0">
          <SelectValue placeholder="+1" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.code} {country.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input 
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className="flex-1 rounded-l-none"
        placeholder={placeholder || t('surveyBuilder.phoneNumber')}
      />
    </div>
  );
}
