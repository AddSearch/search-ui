declare module "addsearch-search-ui" {
  class AddSearchUI {
    constructor(client: any, settings?: any);
    start(): void;
    executeSearch(
      keyword: string,
      options?: any,
      appendResults?: boolean,
      fieldForInstantRedirect?: string,
      fieldForInstantRedirectInConfiguration?: string
    ): void;
    fetchRecommendation(containerId: string): void;
    searchField(conf: any): void;
    autocomplete(conf: any): void;
    searchResults(conf: any): void;
    segmentedSearchResults(conf: any): void;
    facets(conf: any): void;
    hierarchicalFacets(conf: any): void;
    rangeFacets(conf: any): void;
    filters(conf: any): void;
    sortBy(conf: any): void;
    pagination(conf: any): void;
    loadMore(conf: any): void;
    activeFilters(conf: any): void;
    recommendations(conf: any): void;
    search(keyword: string): void;
    hideAutocomplete(): void;
    clear(): void;
    registerHandlebarsHelper(name: string, helper: Function): void;
    registerHandlebarsPartial(name: string, partial: string): void;
  }

  namespace AddSearchUI {
    const AUTOCOMPLETE_TYPE: {
      SEARCH: string;
      SUGGESTIONS: string;
      CUSTOM_FIELDS: string;
    };

    const FILTER_TYPE: {
      CHECKBOX_GROUP: string;
      RADIO_GROUP: string;
      SELECT_LIST: string;
      RANGE: string;
      TABS: string;
      TAGS: string;
    };

    const SORTBY_TYPE: {
      SELECT_LIST: string;
      RADIO_GROUP: string;
    };

    const LOAD_MORE_TYPE: {
      BUTTON: string;
      INFINITE_SCROLL: string;
    };

    const RECOMMENDATION_TYPE: {
      FREQUENTLY_BOUGHT_TOGETHER: string;
      RELATED_ITEMS: string;
    };

    const RANGE_FACETS_TYPE: {
      CHECKBOX: string;
      SLIDER: string;
    };

    const Handlebars_runtime: any;
  }

  export = AddSearchUI;
}
