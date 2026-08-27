export const getValueFromLocalStorage = (key: string) => {
  const property = localStorage.getItem(key);
  if (!property) {
    return null;
  }
  return JSON.parse(property);
};

export const setValueInLocalStorage = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));
