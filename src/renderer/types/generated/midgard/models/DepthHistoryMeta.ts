// tslint:disable
/**
 * Midgard Public API
 * The Midgard Public API queries THORChain and any chains linked via the Bifröst and prepares information about the network to be readily available for public users. The API parses transaction event data from THORChain and stores them in a time-series database to make time-dependent queries easy. Midgard does not hold critical information. To interact with BEPSwap and Asgardex, users should query THORChain directly.
 *
 * The version of the OpenAPI document: 2.6.9
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface DepthHistoryMeta
 */
export interface DepthHistoryMeta {
    /**
     * Int64(e8), the amount of Asset in the pool at the end of the interval at time endTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    endAssetDepth: string;
    /**
     * Int64, Liquidity Units in the pool at the end of the interval at time endTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    endLPUnits: string;
    /**
     * Int64(e8), the amount of Rune in the pool at the end of the interval at time endTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    endRuneDepth: string;
    /**
     * Int64, Synth Units in the pool at the end of the interval at time endTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    endSynthUnits: string;
    /**
     * Int64, The end time of bucket in unix timestamp
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    endTime: string;
    /**
     * Float, The liquidity unit value index increase between the first and last depth item
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    luviIncrease: string;
    /**
     * Float, The impermanent loss between the first and last depth item
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    priceShiftLoss: string;
    /**
     * Int64(e8), the amount of Asset in the pool at the start of the interval at time startTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    startAssetDepth: string;
    /**
     * Int64, Liquidity Units in the pool at the start of the interval at time startTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    startLPUnits: string;
    /**
     * Int64(e8), the amount of Rune in the pool at the start of the interval at time startTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    startRuneDepth: string;
    /**
     * Int64, Synth Units in the pool at the start of the interval at time startTime
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    startSynthUnits: string;
    /**
     * Int64, The beginning time of bucket in unix timestamp
     * @type {string}
     * @memberof DepthHistoryMeta
     */
    startTime: string;
}
