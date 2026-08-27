export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
export const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
export const AUTH_AUDEINCE = import.meta.env.VITE_AUTH_AUDEINCE;

export const REST_AUTH_CLIENT_ID = import.meta.env.VITE_REST_AUTH_CLIENT_ID;
export const REST_AUTH_CLIENT_SCRETE = import.meta.env.VITE_REST_AUTH_CLIENT_SCRETE;

export const getAccessToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (token) return token;
  return "";
};

export const getRefreshToken = (): string => {
  const token = localStorage.getItem("refresh_token");
  if (token) return token;
  return "";
};

export const getBrandId = (): string => {
  const token = localStorage.getItem("brand_id");
  if (token) return token;
  return "";
};

export const geAuthtAccessToken = async () => {
  const tokenOptions = {
    client_id: `${REST_AUTH_CLIENT_ID}`,
    client_secret: `${REST_AUTH_CLIENT_SCRETE}`,
    audience: `${AUTH_AUDEINCE}`,
    grant_type: "client_credentials"
  };

  const tokenResponse = await fetch(`https://${AUTH_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "did=s%3Av0%3A72dac3b0-e298-11ee-819c-4d305e03fe16.eTnKRhZm03g%2BSb7Gucf43gXufUZQN%2Bz%2Fo906h60HhkM; did_compat=s%3Av0%3A72dac3b0-e298-11ee-819c-4d305e03fe16.eTnKRhZm03g%2BSb7Gucf43gXufUZQN%2Bz%2Fo906h60HhkM"
    },
    body: JSON.stringify(tokenOptions)
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to get access token");
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  return accessToken;
};
