/**
 * Access [Website Carbon's API](https://api.websitecarbon.com/) for checking
 * carbon emissions for websites.
 *
 * ## Example for site
 * ```ts
 * import { site } from 'jsr:@timharek/wcarbon';
 *
 * const siteUrl = 'example.org';
 * const result = await site(siteUrl);
 * ```
 *
 * ## Example for data
 * ```ts
 * import { data } from 'jsr:@timharek/wcarbon';
 *
 * const result = await data({bytes: 1024, hasGreenHosting: true});
 * ```
 * @module
 */

export { data, site } from './src/wcarbon.ts';
