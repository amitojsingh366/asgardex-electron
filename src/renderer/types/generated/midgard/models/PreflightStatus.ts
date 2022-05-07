// tslint:disable
/**
 * Midgard Public API
 * The Midgard Public API queries THORChain and any chains linked via the Bifröst and prepares information about the network to be readily available for public users. The API parses transaction event data from THORChain and stores them in a time-series database to make time-dependent queries easy. Midgard does not hold critical information. To interact with BEPSwap and Asgardex, users should query THORChain directly.
 *
<<<<<<< HEAD
 * The version of the OpenAPI document: 2.6.3
=======
 * The version of the OpenAPI document: 2.6.9
>>>>>>> ea066f27754ebd2e48ff9b4381188a9c9c3c68d3
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface PreflightStatus
 */
export interface PreflightStatus {
    /**
     * @type {number}
     * @memberof PreflightStatus
     */
    code: number;
    /**
     * @type {string}
     * @memberof PreflightStatus
     */
    reason: string;
    /**
     * @type {string}
     * @memberof PreflightStatus
     */
    status: string;
}
