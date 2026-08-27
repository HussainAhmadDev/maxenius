export const doubleSnakeToCamel = (s: string) =>
  s.replace(/__./g, x => x[1].toUpperCase());

export const snakeToCamel = (s: string) => s.replace(/_./g, x => x[1].toUpperCase());

export const camelToSnake = (s: string) =>
  s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const camelToDoubleSnake = (s: string) =>
  s.replace(/[A-Z]/g, letter => `__${letter.toLowerCase()}`);

export const isoToMarshmallow = (date: Date) =>
  //only iso date string format
  date.toISOString().replace(/T.*/, "");
