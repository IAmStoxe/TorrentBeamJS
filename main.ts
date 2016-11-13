const Promise = require('bluebird');
const Xray = require('x-ray');
const nightmare = require('x-ray-nightmare');

const config = require('./config');

const x = Xray().driver(nightmare());

const util = require('util');
const path = require('path');

export interface ISiteConfig {
    name: string,
    searchUrl: string,
    testSearchUrl: string,
    resultsCssSelectors: ICssSelectors
}

export interface ICssSelectors {
    links: string,
    titles: string,
    added: string,
    size: string,
    seeds: string,
}

export class TorrentBeam {

    public siteConfig: ISiteConfig[];

    constructor() {
        this.siteConfig = this.loadSiteConfig();
    }

    public searchAll(searchTerm: string) {
        for (let i = 0; i < this.siteConfig.length; i++) {
            let searchUrl = util.format(this.siteConfig[i].searchUrl, searchTerm);
            let search = Promise.promisify(x(searchUrl, this.siteConfig[i].resultsCssSelectors));
            search().then((resp) => console.log(resp)).catch((err) => console.error(err));
        }
    }

    private loadSiteConfig() {
        return JSON.parse(require('fs').readFileSync(path.join(config.rootPath, './search_config.json')));
    }

    private processPage(html: string, cssSelectors: ICssSelectors) {
        let $ = cheerio.load(html);
        let titles = $(cssSelectors.titles).text();
        let seeds = $(cssSelectors.seeds).text();
        let links = $(cssSelectors.links).attr('href');
        console.log({titles: titles, seeds: seeds, links: links});
    }

}





