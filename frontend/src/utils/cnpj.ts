// CNPJ utilities - mask and validation

export const applyCnpjMask = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 5) {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
  } else if (numericValue.length <= 8) {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
  } else if (numericValue.length <= 12) {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
  } else {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8, 12)}-${numericValue.slice(12, 14)}`;
  }
};

export const removeCnpjMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCnpj = (cnpj: string): boolean => {
  // Remove mask
  const numericCnpj = removeCnpjMask(cnpj);
  
  // Empty is valid (optional field)
  if (numericCnpj === '') {
    return true;
  }
  
  // Must have exactly 14 digits
  if (numericCnpj.length !== 14) {
    return false;
  }
  
  // Check for invalid patterns (all same digits)
  if (/^(\d)\1+$/.test(numericCnpj)) {
    return false;
  }
  
  // CNPJ validation algorithm
  const digits = numericCnpj.split('').map(Number);
  
  // First check digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const remainder1 = sum % 11;
  const checkDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  
  if (digits[12] !== checkDigit1) {
    return false;
  }
  
  // Second check digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const remainder2 = sum % 11;
  const checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  
  return digits[13] === checkDigit2;
};

export const getCnpjValidationMessage = (cnpj: string): string | undefined => {
  const numericCnpj = removeCnpjMask(cnpj);
  
  // Empty is valid
  if (numericCnpj === '') {
    return undefined;
  }
  
  // Check length - too short
  if (numericCnpj.length < 14) {
    return `CNPJ incompleto (${numericCnpj.length}/14 dígitos)`;
  }
  
  // Check length - too long
  if (numericCnpj.length > 14) {
    return 'CNPJ deve ter exatamente 14 dígitos';
  }
  
  // Check for invalid patterns (all same digits)
  if (/^(\d)\1+$/.test(numericCnpj)) {
    return 'CNPJ não pode ter todos os dígitos iguais';
  }
  
  // Validate CNPJ algorithm
  if (!validateCnpj(cnpj)) {
    return 'CNPJ com dígitos verificadores inválidos';
  }
  
  return undefined;
};
