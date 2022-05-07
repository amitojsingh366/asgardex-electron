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
 * @interface SwapHistoryItem
 */
export interface SwapHistoryItem {
    /**
     * Float64 (Basis points, 0-10000, where 10000=100%), the weighted average (by count) of toAssetAverageSlip, toRuneAverageSlip, synthMintAverageSlip, synthRedeemAverageSlip. Big swaps have the same weight as small swaps. 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    averageSlip: string;
    /**
     * Int64, The end time of bucket in unix timestamp
     * @type {string}
     * @memberof SwapHistoryItem
     */
    endTime: string;
    /**
     * Float, the price of Rune based on the deepest USD pool at the end of the interval. 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    runePriceUSD: string;
    /**
     * Int64, The beginning time of bucket in unix timestamp
     * @type {string}
     * @memberof SwapHistoryItem
     */
    startTime: string;
    /**
     * Float64 (Basis points, 0-10000, where 10000=100%), the average slip for swaps from rune to synthetic asset. Big swaps have the same weight as small swaps 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthMintAverageSlip: string;
    /**
     * Int64, count of rune to synthetic asset swaps
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthMintCount: string;
    /**
     * Int64(e8), the fees collected from swaps from rune to synthetic asset (in rune) 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthMintFees: string;
    /**
     * Int64(e8), volume of swaps from rune to synthetic asset denoted in rune
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthMintVolume: string;
    /**
     * Float64 (Basis points, 0-10000, where 10000=100%), the average slip for swaps from synthetic asset to rune. Big swaps have the same weight as small swaps 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthRedeemAverageSlip: string;
    /**
     * Int64, count of synthetic asset to rune swaps
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthRedeemCount: string;
    /**
     * Int64(e8), the fees collected from swaps from synthetic asset to rune (in rune) 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthRedeemFees: string;
    /**
     * Int64(e8), volume of swaps from synthetic asset to rune denoted in rune
     * @type {string}
     * @memberof SwapHistoryItem
     */
    synthRedeemVolume: string;
    /**
     * Float64 (Basis points, 0-10000, where 10000=100%), the average slip for swaps from rune to asset. Big swaps have the same weight as small swaps 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toAssetAverageSlip: string;
    /**
     * Int64, count of swaps from rune to asset
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toAssetCount: string;
    /**
     * Int64(e8), the fees collected from swaps from rune to asset (in rune)
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toAssetFees: string;
    /**
     * Int64(e8), volume of swaps from rune to asset denoted in rune
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toAssetVolume: string;
    /**
     * Float64 (Basis points, 0-10000, where 10000=100%), the average slip for swaps from asset to rune. Big swaps have the same weight as small swaps 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toRuneAverageSlip: string;
    /**
     * Int64, count of swaps from asset to rune
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toRuneCount: string;
    /**
     * Int64(e8), the fees collected from swaps from asset to rune (in rune)
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toRuneFees: string;
    /**
     * Int64(e8), volume of swaps from asset to rune denoted in rune
     * @type {string}
     * @memberof SwapHistoryItem
     */
    toRuneVolume: string;
    /**
     * Int64, toAssetCount + toRuneCount + synthMintCount + synthRedeemCount
     * @type {string}
     * @memberof SwapHistoryItem
     */
    totalCount: string;
    /**
     * Int64(e8), toAssetFees + toRuneFees + synthMintFees + synthRedeemFees
     * @type {string}
     * @memberof SwapHistoryItem
     */
    totalFees: string;
    /**
     * Int64(e8), toAssetVolume + toRuneVolume + synthMintVolume + synthRedeemVolume (denoted in rune) 
     * @type {string}
     * @memberof SwapHistoryItem
     */
    totalVolume: string;
}
