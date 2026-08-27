import { BrandList } from "../Interfaces/brandType";
import { AuthResponse } from "../Interfaces/global";

/**
 * Retrieves the access token from localStorage.
 * @returns {string} The access token, or an empty string if not found.
 */
export const getAccessToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (token) return token;
  return "";
};

/**
 * Retrieves the brand ID from localStorage.
 * @returns {{ brand_id: string }} The object containing the brand ID.
 */
export const getBrandId = (): { brand_id: string } => {
  const brand = localStorage.getItem("brandDetail");
  return { brand_id: JSON.parse(brand!)?.id };
};

/**
 * Retrieves the user ID from localStorage.
 * @returns {{ user_id: string }} The object containing the user ID.
 */
export const getUserId = (): { user_id: string } => {
  const user = localStorage.getItem("user");
  return { user_id: JSON.parse(user!)?.id };
};

/**
 * Retrieves the brand details from localStorage.
 * @returns {BrandList | null} The brand details object, or null if not found or error occurs.
 */
export const getBrandDetails = (): BrandList | null => {
  try {
    const data = localStorage.getItem("brandDetail");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Parses a JWT token and extracts user data from it.
 * @param {string} token - The JWT token to parse.
 * @returns {object} The parsed user data object.
 */
export const parseJwt = (token: string): { data: AuthResponse["user"] } => {
  const base64Url = token?.split(".")[1];
  const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

/**
 * Calculates the remaining time until JWT token expiration.
 * @param {string} token - The JWT token.
 * @returns {number | null} Remaining time in milliseconds, or null if calculation fails.
 */
export const getTokenRemainingTime = (token: string): number | null => {
  try {
    const tokenParts = token?.split(".") || [];
    if (tokenParts?.length !== 3) {
      return null;
    }
    const payloadBase64 = tokenParts[1];
    const payloadJson = decodeBase64UrlSafe(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const exp = payload.exp;
    if (!exp) {
      return null;
    }
    const currentTime = Date.now() / 1000;
    const remainingTimeInSeconds = exp - currentTime;
    const remainingTimeInMilliseconds = remainingTimeInSeconds * 1000;
    return remainingTimeInMilliseconds > 0
      ? Math.round(remainingTimeInMilliseconds)
      : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Decodes a base64 URL-safe string.
 * @param {string} base64 - The base64 URL-safe string to decode.
 * @returns {string} The decoded string.
 */
function decodeBase64UrlSafe(base64: string): string {
  const base64Standard = base64.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64Standard.length % 4)) % 4;
  const paddedBase64 = base64Standard + "=".repeat(padLength);
  return decodeURIComponent(
    atob(paddedBase64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

/**
 * The base URL of the API.
 * @type {string}
 */
export const API_URL = import.meta.env.VITE_BASE_URL;
