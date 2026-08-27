/**
 * @typedef {object} QueryPagination
 * @property {string} count - The number of items to be fetched per page.
 * @property {string} page - The current page number.
 */

/**
 * @typedef {object} WebsiteCreateBody
 * @property {string} name - The name of the website.
 * @property {string} url - The URL of the website.
 * @property {string} brand_id - The brand ID associated with the website.
 * @property {string} [description] - Optional description of the website.
 */

/**
 * @typedef {object} WebsiteCreateResponse
 * @property {string} id - The unique ID of the website.
 * @property {string} name - The name of the website.
 * @property {string} url - The URL of the website.
 * @property {string} brand_id - The brand ID associated with the website.
 * @property {string} [description] - Optional description of the website.
 * @property {string} created_at - The timestamp when the website was created.
 * @property {string} updated_at - The timestamp when the website was last updated.
 */

/**
 * @typedef {object} websiteResponseDefination
 * @property {string} id - The unique ID of the website.
 * @property {string} name - The name of the website.
 * @property {string} url - The URL of the website.
 * @property {string} brand_id - The brand ID associated with the website.
 * @property {string} [description] - Optional description of the website.
 * @property {boolean} is_trash - Flag indicating if the website is trashed.
 * @property {string} created_at - The timestamp when the website was created.
 * @property {string} updated_at - The timestamp when the website was last updated.
 */

/**
 * @callback FetchWebsites
 * @param {URLSearchParams} searchParams - The search parameters to filter the websites.
 * @param {boolean} [isTrash=false] - Flag to indicate if trashed websites should be included in the result.
 * @returns {Promise<websiteResponseDefination[]>} The promise resolving to an array of websiteResponseDefination objects.
 */

/**
 * @callback FetchWebsiteByID
 * @param {string | undefined} websiteID - The ID of the website to fetch.
 * @returns {Promise<WebsiteCreateResponse>} The promise resolving to a WebsiteCreateResponse object.
 */

/**
 * @callback CreateWebsite
 * @param {WebsiteCreateBody} websiteData - The data for the new website.
 * @returns {Promise<WebsiteCreateResponse>} The promise resolving to a WebsiteCreateResponse object.
 */

/**
 * @callback UpdateWebsite
 * @param {string | undefined} websiteID - The ID of the website to update.
 * @param {Partial<WebsiteCreateBody>} websiteData - The updated data for the website.
 * @returns {Promise<WebsiteCreateResponse>} The promise resolving to a WebsiteCreateResponse object.
 */

/**
 * @callback TrashWebsite
 * @param {string} websiteID - The ID of the website to trash.
 * @returns {Promise<void>} The promise resolving when the website is trashed.
 */

/**
 * @callback RestoreWebsite
 * @param {string} websiteID - The ID of the website to restore.
 * @returns {Promise<void>} The promise resolving when the website is restored.
 */

/**
 * @type {FetchWebsites}
 */
let FetchWebsites;

/**
 * @type {FetchWebsiteByID}
 */
let fetchWebsiteByID;

/**
 * @type {CreateWebsite}
 */
let createWebsite;

/**
 * @type {UpdateWebsite}
 */
let updateWebsite;

/**
 * @type {TrashWebsite}
 */
let trashWebsite;

/**
 * @type {RestoreWebsite}
 */
let restoreWebsite;

export {
  FetchWebsites,
  fetchWebsiteByID,
  createWebsite,
  updateWebsite,
  trashWebsite,
  restoreWebsite
};
