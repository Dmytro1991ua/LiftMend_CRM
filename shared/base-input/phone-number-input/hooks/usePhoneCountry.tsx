import { useCallback, useState } from 'react';

type usePhoneCountryResult = {
  onResetPhoneInputCountry: () => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
};

export const usePhoneCountry = (): usePhoneCountryResult => {
  const [selectedCountry, setSelectedCountry] = useState('us');

  const onSelectCountry = useCallback((country: string) => {
    setSelectedCountry(country);
  }, []);

  const onResetPhoneInputCountry = useCallback(() => {
    setSelectedCountry('us');
  }, []);

  return { onResetPhoneInputCountry, selectedCountry, onSelectCountry };
};
