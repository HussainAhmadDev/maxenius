/**
 * Represents a paginated response containing an array of websites.
 *
 * @typedef {Object} WebsiteResponse
 * @property {Array<Website>} results - An array of website objects.
 * @property {number} page - The current page number.
 * @property {number} count - The number of items per page.
 * @property {number} total - The total number of items.
 * @property {number} pages - The total number of pages.
 */
export type WebsiteResponse = {
  results: Website[];
  page: number;
  count: number;
  total: number;
  pages: number;
};

/**
 * Represents a website object.
 *
 * @typedef {Object} Website
 * @property {string} id - The unique identifier of the website.
 * @property {string} title - The title of the website.
 * @property {string} consumer_key - The consumer key for the website.
 * @property {string} consumer_secret - The consumer secret for the website.
 * @property {string} site_url - The URL of the website.
 * @property {string} [authorization_key] - The authorization key for the website (optional).
 * @property {string} brand_id - The ID of the brand associated with the website.
 * @property {boolean|null} prescription - Indicates if the website is for prescription or not (true, false, or null).
 * @property {boolean} is_trash - Indicates if the website is trashed.
 * @property {string} label_template - The label template for the website.
 * @property {string} organization_id - The ID of the organization associated with the website.
 */
export interface Website {
  id: string;
  title: string;
  consumer_key: string;
  consumer_secret: string;
  site_url: string;
  authorization_key?: string; // Optional property with a question mark
  brand_id: string;
  prescription: boolean | null; // Can be true, false, or null
  is_trash: boolean;
  label_template: string;
  organization_id: string;
  platform: string;
}

/**
 * Represents the response for creating a website.
 *
 * @typedef {Object} WebsiteCreateResponse
 * @property {string} consumer_secret - The consumer secret for the created website.
 * @property {string} consumer_key - The consumer key for the created website.
 * @property {string} id - The unique identifier of the created website.
 * @property {string} title - The title of the created website.
 * @property {string} site_url - The URL of the created website.
 * @property {string} authorization_key - The authorization key for the created website.
 * @property {string} label_template - The label template for the created website.
 * @property {boolean} is_trash - Indicates if the created website is trashed.
 * @property {boolean} prescription - Indicates if the created website is for prescription.
 * @property {string} brand_id - The ID of the brand associated with the created website.
 */
export interface WebsiteCreateResponse {
  consumer_secret: string;
  consumer_key: string;
  id: string;
  title: string;
  site_url: string;
  authorization_key: string;
  label_template: string;
  is_trash: boolean;
  prescription: boolean;
  brand_id: string;
}

/**
 * Represents the body for creating a website.
 *
 * @typedef {Object} WebsiteCreateBody
 * @property {string} title - The title of the website.
 * @property {string} site_url - The URL of the website.
 * @property {string} consumer_secret - The consumer secret for the website.
 * @property {string} consumer_key - The consumer key for the website.
 * @property {string} authorization_key - The authorization key for the website.
 * @property {string} brand_id - The ID of the brand associated with the website.
 */
export interface WebsiteCreateBody {
  title: string;
  site_url: string;
  consumer_secret: string;
  consumer_key: string;
  authorization_key: string;
  brand_id: string;
  platform: string;
}
