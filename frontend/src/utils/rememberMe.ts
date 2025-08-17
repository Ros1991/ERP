// Utility for managing "Remember Me" form data
const REMEMBER_ME_KEY = 'login-remember-me-data';

export interface RememberMeData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const saveRememberMeData = (email: string, password: string, rememberMe: boolean) => {
  if (rememberMe) {
    const data: RememberMeData = { email, password, rememberMe: true };
    localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
  } else {
    // If remember me is unchecked, clear the data
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
};

export const getRememberMeData = (): RememberMeData | null => {
  try {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing remember me data:', error);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
  return null;
};

export const clearRememberMeData = () => {
  localStorage.removeItem(REMEMBER_ME_KEY);
};
