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

export interface INightmareSwitches {
    switches: {}
}