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

import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { map, concatMap } from 'rxjs/operators';

export const BASE_PATH = 'http://localhost'.replace(/\/+$/, '');

export interface ConfigurationParameters {
    basePath?: string; // override base path
    middleware?: Middleware[]; // middleware to apply before/after rxjs requests
    username?: string; // parameter for basic security
    password?: string; // parameter for basic security
    apiKey?: string | ((name: string) => string); // parameter for apiKey security
    accessToken?: string | ((name?: string, scopes?: string[]) => string); // parameter for oauth2 security
}

export class Configuration {
    constructor(private configuration: ConfigurationParameters = {}) {}

    get basePath(): string {
        return this.configuration.basePath || BASE_PATH;
    }

    get middleware(): Middleware[] {
        return this.configuration.middleware || [];
    }

    get username(): string | undefined {
        return this.configuration.username;
    }

    get password(): string | undefined {
        return this.configuration.password;
    }

    get apiKey(): ((name: string) => string) | undefined {
        const apiKey = this.configuration.apiKey;
        if (!apiKey) {
            return undefined;
        }
        return typeof apiKey === 'string' ? () => apiKey : apiKey;
    }

    get accessToken(): ((name: string, scopes?: string[]) => string) | undefined {
        const accessToken = this.configuration.accessToken;
        if (!accessToken) {
            return undefined;
        }
        return typeof accessToken === 'string' ? () => accessToken : accessToken;
    }
}

/**
 * This is the base class for all generated API classes.
 */
export class BaseAPI {
    private middleware: Middleware[] = [];

    constructor(protected configuration = new Configuration()) {
        this.middleware = configuration.middleware;
    }

    withMiddleware = (middlewares: Middleware[]) => {
        const next = this.clone();
        next.middleware = next.middleware.concat(middlewares);
        return next;
    };

    withPreMiddleware = (preMiddlewares: Array<Middleware['pre']>) =>
        this.withMiddleware(preMiddlewares.map((pre) => ({ pre })));

    withPostMiddleware = (postMiddlewares: Array<Middleware['post']>) =>
        this.withMiddleware(postMiddlewares.map((post) => ({ post })));

    protected request = <T>(requestOpts: RequestOpts): Observable<T> =>
        this.rxjsRequest(this.createRequestArgs(requestOpts)).pipe(
            map((res) => {
                if (res.status >= 200 && res.status < 300) {
                    return res.response as T;
                }
                throw res;
            })
        );

    private createRequestArgs = (requestOpts: RequestOpts): RequestArgs => {
        let url = this.configuration.basePath + requestOpts.path;
        if (requestOpts.query !== undefined && Object.keys(requestOpts.query).length !== 0) {
            // only add the queryString to the URL if there are query parameters.
            // this is done to avoid urls ending with a '?' character which buggy webservers
            // do not handle correctly sometimes.
            url += '?' + queryString(requestOpts.query);
        }

        return {
            url,
            method: requestOpts.method,
            headers: requestOpts.headers,
            body: requestOpts.body instanceof FormData ? requestOpts.body : JSON.stringify(requestOpts.body),
            responseType: requestOpts.responseType || 'json',
        };
    }

    private rxjsRequest = (params: RequestArgs): Observable<AjaxResponse> =>
        of(params).pipe(
            map((request) => {
                this.middleware.filter((item) => item.pre).forEach((mw) => (request = mw.pre!(request)));
                return request;
            }),
            concatMap((args) =>
                ajax(args).pipe(
                    map((response) => {
                        this.middleware.filter((item) => item.post).forEach((mw) => (response = mw.post!(response)));
                        return response;
                    })
                )
            )
        );

    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */
    private clone = (): BaseAPI =>
        Object.assign(Object.create(Object.getPrototypeOf(this)), this);
}

/**
 * @deprecated
 * export for not being a breaking change
 */
export class RequiredError extends Error {
    name: 'RequiredError' = 'RequiredError';
}

export const COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};

export type Json = any;
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type HttpHeaders = { [key: string]: string };
export type HttpQuery = Partial<{ [key: string]: string | number | null | boolean | Array<string | number | null | boolean> }>; // partial is needed for strict mode
export type HttpBody = Json | FormData;

export interface RequestOpts {
    path: string;
    method: HttpMethod;
    headers?: HttpHeaders;
    query?: HttpQuery;
    body?: HttpBody;
    responseType?: 'json' | 'blob' | 'arraybuffer' | 'text';
}

export const encodeURI = (value: any) => encodeURIComponent(String(value));

const queryString = (params: HttpQuery): string => Object.keys(params)
    .map((key) => {
        const value = params[key];
        return (value instanceof Array)
            ? value.map((val) => `${encodeURI(key)}=${encodeURI(val)}`).join('&')
            : `${encodeURI(key)}=${encodeURI(value)}`;
    })
    .join('&');

// alias fallback for not being a breaking change
export const querystring = queryString;

/**
 * @deprecated
 */
export const throwIfRequired = (params: {[key: string]: any}, key: string, nickname: string) => {
    if (!params || params[key] == null) {
        throw new RequiredError(`Required parameter ${key} was null or undefined when calling ${nickname}.`);
    }
};

export const throwIfNullOrUndefined = (value: any, nickname?: string) => {
    if (value == null) {
        throw new Error(`Parameter "${value}" was null or undefined when calling "${nickname}".`);
    }
};

// alias for easier importing
export interface RequestArgs extends AjaxRequest {}
export interface ResponseArgs extends AjaxResponse {}

export interface Middleware {
    pre?(request: RequestArgs): RequestArgs;
    post?(response: ResponseArgs): ResponseArgs;
}
