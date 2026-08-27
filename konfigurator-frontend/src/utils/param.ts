const extractSearchQuery = (url?: any) => {
  const params: Record<string, number | string> = {};
  if (url && typeof url === 'string') {
    const queryString = url?.split('?')?.[1];
    if (typeof queryString === 'string') {
      queryString?.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        params[key] = isNaN(Number(value)) ? value : Number(value);
      });
    }
  }
  return params;
};

export { extractSearchQuery };
