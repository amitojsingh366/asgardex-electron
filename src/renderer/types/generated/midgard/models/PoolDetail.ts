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
 * @interface PoolDetail
 */
export interface PoolDetail {
    /**
     * @type {string}
     * @memberof PoolDetail
     */
    asset: string;
    /**
     * Int64(e8), the amount of Asset in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    assetDepth: string;
    /**
     * Float, price of asset in rune. I.e. rune amount / asset amount.
     * @type {string}
     * @memberof PoolDetail
     */
    assetPrice: string;
    /**
     * Float, the price of asset in USD (based on the deepest USD pool).
     * @type {string}
     * @memberof PoolDetail
     */
    assetPriceUSD: string;
    /**
     * Int64, Liquidity Units in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    liquidityUnits: string;
    /**
     * Float, Average Percentage Yield: annual return estimated using last weeks income, taking compound interest into account.
     * @type {string}
     * @memberof PoolDetail
     */
    poolAPY: string;
    /**
     * Int64(e8), the amount of Rune in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    runeDepth: string;
    /**
     * The state of the pool, e.g. Available, Staged.
     * @type {string}
     * @memberof PoolDetail
     */
    status: string;
    /**
     * Int64, Synth supply in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    synthSupply: string;
    /**
     * Int64, Synth Units in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    synthUnits: string;
    /**
     * Int64, Total Units (synthUnits + liquidityUnits) in the pool.
     * @type {string}
     * @memberof PoolDetail
     */
    units: string;
    /**
     * Int64(e8), the total volume of swaps in the last 24h to and from Rune denoted in Rune.
     * @type {string}
     * @memberof PoolDetail
     */
    volume24h: string;
}
