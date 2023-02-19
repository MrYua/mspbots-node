import normalize from 'normalize-url';

export const safeUrl = (input: string): string => {
  return normalize(input.toLowerCase().trim());
};
