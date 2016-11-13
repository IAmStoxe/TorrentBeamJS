// Bluebird's Promise
const Promise = require('bluebird');

// Web driver(s)
const Xray = require('x-ray');
const nightmare = require('x-ray-nightmare');

// Project config
const config = require('./config');

// Node modules
const util = require('util');
const path = require('path');

export class TorrentBeam {

    public siteConfig: IProviderConfig[];

    public providers: string[];


    constructor() {
        this.siteConfig = this.loadProviderConfig();
        this.providers = this.siteConfig.map(item => item.name);
    }

    /**
     * Searches for the searchTerm at all the currently installed providers per search_config.json
     * @param searchTerm - What we're searching for
     */
    public async searchAll(searchTerm: string) {
        let results = [];
        for (let i = 0; i < this.siteConfig.length; i++) {
            // Absolute URL to perform the search
            let searchUrl = util.format(this.siteConfig[i].searchUrl, searchTerm);
            // Parsed results from the search
            let singleResult = await this.doSearch(searchUrl, this.siteConfig[i].resultsCssSelectors);
            // Add it to the array of all site's results
            results.push(singleResult);
        }
        return results;
    }

    /**
     * The function which performs the actual search and parses out the data on the results page(s)
     * @param searchUrl - Absolute URL for the search
     * @param cssSelectors - search_config.json
     */
    private doSearch(searchUrl: string, cssSelectors: ISearchResultsSelectors) {
        return new Promise(
            (resolve, reject) => {
                // Use nightmare to handle providers where JS is required.
                let nightmareDriver = nightmare();
                const x = Xray().driver(nightmareDriver);
                // Use Promise.promisify to translate callbacks to promises.
                let search = Promise.promisify(x(searchUrl, cssSelectors));
                // Handle success/failure of the searches
                search().then((resp) => {
                    console.log('Resp received successfully.');
                    // Calling this terminates the server
                    nightmareDriver();
                    // Resolve the successful search
                    resolve(resp);
                })
                .catch((err) => {
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
     * Loads the configuration for the sites
     * @returns IProviderConfig[]
     */
    private loadProviderConfig(): IProviderConfig[] {
        let fileName = path.join(config.rootPath, './search_config.json');
        let fileText = require('fs').readFileSync(fileName);
        return JSON.parse(fileText);
    }
}

export interface IProviderConfig {
    name: string,
    searchUrl: string,
    testSearchUrl: string,
    resultsCssSelectors: ISearchResultsSelectors
}

export interface ISearchResultsSelectors {
    links: string,
    titles: string,
    added: string,
    size: string,
    seeds: string,
}


