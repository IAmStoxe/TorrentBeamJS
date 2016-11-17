// Types
import {IProviderConfig, INightmareSwitches, ISearchResults} from "./typings";

const debug = require('debug')('torrentbeam');

// Bluebird's Promise
const bbPromise = require('bluebird');

// Web driver(s)
const Xray = require('x-ray');
const nightmare = require('x-ray-nightmare');

// Project config
const config = require('./cfg/config');

// Node modules
const util = require('util');
const path = require('path');

export class TorrentBeam {

    public providerConfigs: IProviderConfig[];
    public providers: string[];
    public nightmareSwitches: INightmareSwitches;

    constructor(nightmareSwitches?: INightmareSwitches) {
        this.providerConfigs = this.loadProviderConfig();
        this.providers = this.getLoadedProvidersNames();
        this.nightmareSwitches = nightmareSwitches || {switches: {}};
    }


    /**
     * Gets the names of all of the providers in this.providers
     * @returns {string[]}
     */
    private getLoadedProvidersNames() {
        let names: string[] = [];
        for (let key in this.providerConfigs) {
            names.push(key);
        }
        return names;
    }

    /**
     * Searches for the searchTerm at all the currently installed providers per search_config.json
     * @param searchTerm - What we're searching for
     * @returns {Promise<ISearchResults[]>}
     */
    public async searchAll(searchTerm: string): Promise<ISearchResults[]> {
        let results = [];
        for (let i = 0; i < this.providers.length; i++) {
            // Parsed results from the search
            let currentProvider = this.getProviderConfigByName(this.providers[i]);
            let singleResult = await this.doSearch(currentProvider, searchTerm);
            // Add it to the array of all site's results
            results.push(singleResult);
        }
        return results;
    }

    /**
     * Searches a single provider
     * @param provider - The provider's name which we want to search
     * @param searchTerm - What we're searching for
     * @returns {Promise<ISearchResults>}
     */
    public async searchSingle(provider: string, searchTerm: string): Promise<ISearchResults> {
        if (!this.isValidProvider(provider)) {
            throw new Error('Invalid Provider Specified!');
        }
        let providerConf = this.getProviderConfigByName(provider);
        return await this.doSearch(providerConf, searchTerm);

    }


    /**
     * Verified the supplied name:string is a valid provider
     * @param provider - The name of the provider
     * @returns {boolean}
     */
    private isValidProvider(provider: string) {
        return this.providers.indexOf(provider) !== -1;
    }

    /**
     * Gets the IProviderConfig with the matching name property.
     * @param provider - The name of the provider we're looking for
     * @returns {IProviderConfig}
     */
    public getProviderConfigByName(provider: string): IProviderConfig {
        return this.providerConfigs[provider];
    }

    /**
     * The function which performs the actual search and parses out the data on the results page(s)
     * @param provider
     * @param searchTerm
     * returns {Promise<ISearchResults>}
     */
    private doSearch(provider: string|IProviderConfig, searchTerm: string): Promise<ISearchResults> {
        return new bbPromise(
            (resolve, reject) => {
                let providerConf: IProviderConfig;
                if ('string' === typeof provider) {
                    providerConf = this.getProviderConfigByName(provider);
                } else {
                    providerConf = provider;
                }
                console.log(providerConf);
                // Use nightmare to handle providers where JS is required.
                let nightmareDriver = nightmare(this.nightmareSwitches);
                const x = Xray().driver(nightmareDriver);
                // Create our absolute search URL.
                let searchUrl = this.createSearchUrl(providerConf, searchTerm);
                // Use bbPromise.promisify to translate callbacks to promises.
                let search = bbPromise.promisify(x(searchUrl, providerConf.resultsCssSelectors));
                // Handle success/failure of the searches
                search().then(resp => {
                    console.log('Resp received successfully.');
                    // Calling this terminates the server
                    nightmareDriver();
                    // Resolve the successful search
                    resolve({
                        provider: providerConf.name,
                        results: resp
                    });
                })
                .catch(err => {
                    console.error('Error!');
                    console.error(err);
                    // Calling this terminates the server
                    nightmareDriver();
                    // Reject the failed search
                    reject(err);
                });
            });
    }


    /**
     * Uses util.format() to format our search url
     * @param providerConf
     * @param searchTerm
     * @returns {string}
     */
    private createSearchUrl(providerConf: IProviderConfig, searchTerm: string): string {
        return util.format(providerConf.searchUrl, searchTerm);
    }

    /**
     * Loads the configuration for the sites
     * @returns {IProviderConfig[]}
     */
    public loadProviderConfig(): IProviderConfig[] {
        let providerConfigPath = path.join(config.rootPath, '/providers/');
        return require('require-dir')(providerConfigPath);
    }
}



