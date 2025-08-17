import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from './Input';
import { applyCnpjMask, getCnpjValidationMessage, removeCnpjMask } from '../../utils/cnpj';

interface CNPJInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CNPJInput = forwardRef<HTMLInputElement, CNPJInputProps>(
  ({ label = 'CNPJ', error, className, onChange, value = '', ...props }, ref) => {
    const [maskedValue, setMaskedValue] = useState(() => applyCnpjMask(String(value)));
    const [validationError, setValidationError] = useState<string | undefined>();

    // Sync with external value changes (from react-hook-form)
    useEffect(() => {
      const newMaskedValue = applyCnpjMask(String(value || ''));
      setMaskedValue(newMaskedValue);
      // Clear validation error when value is reset externally
      if (!value) {
        setValidationError(undefined);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove any non-digit characters first, then apply mask
      const rawValue = removeCnpjMask(inputValue);
      const newMaskedValue = applyCnpjMask(rawValue);
      
      console.log('CNPJInput handleChange:', { inputValue, rawValue, newMaskedValue });
      
      setMaskedValue(newMaskedValue);
      
      // Validate CNPJ in real-time
      const validationMessage = getCnpjValidationMessage(newMaskedValue);
      setValidationError(validationMessage);
      
      // Pass raw value to react-hook-form
      if (onChange) {
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: rawValue,
            name: e.target.name
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(newEvent);
      }
    };

    const displayError = error || validationError;

    return (
      <Input
        {...props}
        ref={ref}
        label={label}
        value={maskedValue}
        onChange={handleChange}
        error={displayError}
        className={className}
        placeholder="00.000.000/0000-00"
        maxLength={18} // XX.XXX.XXX/XXXX-XX
      />
    );
  }
);

CNPJInput.displayName = 'CNPJInput';
