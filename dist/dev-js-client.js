/*! addsearch-js-client 0.6.6 */
window.AddSearchClient=function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=4)}([function(t,e,s){(function(e,s){
  /*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   v4.2.8+1e68dce6
   */var i;i=function(){"use strict";function t(t){return"function"==typeof t}var i=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},n=0,r=void 0,o=void 0,a=function(t,e){p[n]=t,p[n+1]=e,2===(n+=2)&&(o?o(g):w())},c="undefined"!=typeof window?window:void 0,u=c||{},h=u.MutationObserver||u.WebKitMutationObserver,l="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),f="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function d(){var t=setTimeout;return function(){return t(g,1)}}var p=new Array(1e3);function g(){for(var t=0;t<n;t+=2)(0,p[t])(p[t+1]),p[t]=void 0,p[t+1]=void 0;n=0}var y,m,b,v,w=void 0;function T(t,e){var s=this,i=new this.constructor(S);void 0===i[_]&&R(i);var n=s._state;if(n){var r=arguments[n-1];a((function(){return C(n,i,r,s._result)}))}else k(s,i,t,e);return i}function F(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(S);return x(e,t),e}l?w=function(){return e.nextTick(g)}:h?(m=0,b=new h(g),v=document.createTextNode(""),b.observe(v,{characterData:!0}),w=function(){v.data=m=++m%2}):f?((y=new MessageChannel).port1.onmessage=g,w=function(){return y.port2.postMessage(0)}):w=void 0===c?function(){try{var t=Function("return this")().require("vertx");return void 0!==(r=t.runOnLoop||t.runOnContext)?function(){r(g)}:d()}catch(t){return d()}}():d();var _=Math.random().toString(36).substring(2);function S(){}function A(e,s,i){s.constructor===e.constructor&&i===T&&s.constructor.resolve===F?function(t,e){1===e._state?E(t,e._result):2===e._state?P(t,e._result):k(e,void 0,(function(e){return x(t,e)}),(function(e){return P(t,e)}))}(e,s):void 0===i?E(e,s):t(i)?function(t,e,s){a((function(t){var i=!1,n=function(t,e,s,i){try{t.call(e,s,i)}catch(t){return t}}(s,e,(function(s){i||(i=!0,e!==s?x(t,s):E(t,s))}),(function(e){i||(i=!0,P(t,e))}),t._label);!i&&n&&(i=!0,P(t,n))}),t)}(e,s,i):E(e,s)}function x(t,e){if(t===e)P(t,new TypeError("You cannot resolve a promise with itself"));else if(n=typeof(i=e),null===i||"object"!==n&&"function"!==n)E(t,e);else{var s=void 0;try{s=e.then}catch(e){return void P(t,e)}A(t,e,s)}var i,n}function O(t){t._onerror&&t._onerror(t._result),j(t)}function E(t,e){void 0===t._state&&(t._result=e,t._state=1,0!==t._subscribers.length&&a(j,t))}function P(t,e){void 0===t._state&&(t._state=2,t._result=e,a(O,t))}function k(t,e,s,i){var n=t._subscribers,r=n.length;t._onerror=null,n[r]=e,n[r+1]=s,n[r+2]=i,0===r&&t._state&&a(j,t)}function j(t){var e=t._subscribers,s=t._state;if(0!==e.length){for(var i=void 0,n=void 0,r=t._result,o=0;o<e.length;o+=3)i=e[o],n=e[o+s],i?C(s,i,n,r):n(r);t._subscribers.length=0}}function C(e,s,i,n){var r=t(i),o=void 0,a=void 0,c=!0;if(r){try{o=i(n)}catch(t){c=!1,a=t}if(s===o)return void P(s,new TypeError("A promises callback cannot return that same promise."))}else o=n;void 0!==s._state||(r&&c?x(s,o):!1===c?P(s,a):1===e?E(s,o):2===e&&P(s,o))}var B=0;function R(t){t[_]=B++,t._state=void 0,t._result=void 0,t._subscribers=[]}var z=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(S),this.promise[_]||R(this.promise),i(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?E(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&E(this.promise,this._result))):P(this.promise,new Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var e=0;void 0===this._state&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var s=this._instanceConstructor,i=s.resolve;if(i===F){var n=void 0,r=void 0,o=!1;try{n=t.then}catch(t){o=!0,r=t}if(n===T&&void 0!==t._state)this._settledAt(t._state,e,t._result);else if("function"!=typeof n)this._remaining--,this._result[e]=t;else if(s===D){var a=new s(S);o?P(a,r):A(a,t,n),this._willSettleAt(a,e)}else this._willSettleAt(new s((function(e){return e(t)})),e)}else this._willSettleAt(i(t),e)},t.prototype._settledAt=function(t,e,s){var i=this.promise;void 0===i._state&&(this._remaining--,2===t?P(i,s):this._result[e]=s),0===this._remaining&&E(i,this._result)},t.prototype._willSettleAt=function(t,e){var s=this;k(t,void 0,(function(t){return s._settledAt(1,e,t)}),(function(t){return s._settledAt(2,e,t)}))},t}(),D=function(){function e(t){this[_]=B++,this._result=this._state=void 0,this._subscribers=[],S!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof e?function(t,e){try{e((function(e){x(t,e)}),(function(e){P(t,e)}))}catch(e){P(t,e)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return e.prototype.catch=function(t){return this.then(null,t)},e.prototype.finally=function(e){var s=this.constructor;return t(e)?this.then((function(t){return s.resolve(e()).then((function(){return t}))}),(function(t){return s.resolve(e()).then((function(){throw t}))})):this.then(e,e)},e}();return D.prototype.then=T,D.all=function(t){return new z(this,t).promise},D.race=function(t){var e=this;return i(t)?new e((function(s,i){for(var n=t.length,r=0;r<n;r++)e.resolve(t[r]).then(s,i)})):new e((function(t,e){return e(new TypeError("You must pass an array to race."))}))},D.resolve=F,D.reject=function(t){var e=new this(S);return P(e,t),e},D._setScheduler=function(t){o=t},D._setAsap=function(t){a=t},D._asap=a,D.polyfill=function(){var t=void 0;if(void 0!==s)t=s;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var i=null;try{i=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===i&&!e.cast)return}t.Promise=D},D.Promise=D,D},t.exports=i()}).call(this,s(6),s(2))},function(t,e,s){s(7),t.exports=self.fetch.bind(self)},function(t,e){var s;s=function(){return this}();try{s=s||new Function("return this")()}catch(t){"object"==typeof window&&(s=window)}t.exports=s},function(t,e,s){(function(e){t.exports={isFunction:function(t){return t&&"[object Function]"==={}.toString.call(t)},base64:function(t){return e.window={},window&&window.btoa?window.btoa(t):Buffer?Buffer.from(t).toString("base64"):void 0}}}).call(this,s(2))},function(t,e,s){"use strict";var i=s(5),n=s(8),r=s(9),o=s(10),a=s(3),c=s(11);t.exports=function t(e,s){this.sitekey=e,this.privatekey=s,this.apiHostname="api.addsearch.com",this.settings=new o,this.sessionId=("a-"+1e8*Math.random()).substring(0,10),this.search=function(t,e){var s=null,n=null;if(t&&a.isFunction(e))s=t,n=e;else if(!e&&a.isFunction(t))s=this.settings.getSettings().keyword,n=t;else{if(!this.settings.getSettings().callback)throw"Illegal search parameters. Should be (keyword, callbackFunction) or (callbackFunction)";s=this.settings.getSettings().keyword,n=this.settings.getSettings().callback}this.settings.setCallback(n),this.settings.setKeyword(s),this.throttledSearchFetch||(this.throttledSearchFetch=c(this.settings.getSettings().throttleTimeMs,i)),this.throttledSearchFetch(this.apiHostname,this.sitekey,"search",this.settings.getSettings(),n)},this.suggestions=function(t,e){if(!t||!e||!a.isFunction(e))throw"Illegal suggestions parameters. Should be (prefix, callbackFunction)";this.settings.setSuggestionsPrefix(t),this.throttledSuggestionsFetch||(this.throttledSuggestionsFetch=c(this.settings.getSettings().throttleTimeMs,i)),this.throttledSuggestionsFetch(this.apiHostname,this.sitekey,"suggest",this.settings.getSettings(),e)},this.autocomplete=function(t,e,s){if(!(t&&e&&s&&a.isFunction(s)))throw"Illegal autocomplete parameters. Should be (field, prefix, callbackFunction)";this.settings.setAutocompleteParams(t,e),this.throttledAutocompleteFetch||(this.throttledAutocompleteFetch=c(this.settings.getSettings().throttleTimeMs,i)),this.throttledAutocompleteFetch(this.apiHostname,this.sitekey,"autocomplete",this.settings.getSettings(),s)},this.fetchCustomApi=function(t,e,s){var n=Object.assign({},this.settings.getSettings());n.facetFields=n.facetFields.filter((function(e){return t===e})),i(this.apiHostname,this.sitekey,"search",n,s,null,e)},this.fetchRangeFacets=function(t,e){var s=Object.assign({},this.settings.getSettings());s.rangeFacets||(s.rangeFacets=[]),s.rangeFacets.push({field:t.field,ranges:t.ranges}),i(this.apiHostname,this.sitekey,"search",s,e)},this.cloneClient=function(){return console.log("+++ client",t,this),this},this.getDocument=function(t){return n.getDocument(this.apiHostname,this.sitekey,this.privatekey,t)},this.saveDocument=function(t){return n.saveDocument(this.apiHostname,this.sitekey,this.privatekey,t)},this.saveDocumentsBatch=function(t){if(!t||!t.documents||!Array.isArray(t.documents))throw"Please provide an array of documents: {documents: []}";return n.saveDocumentsBatch(this.apiHostname,this.sitekey,this.privatekey,t)},this.deleteDocument=function(t){return n.deleteDocument(this.apiHostname,this.sitekey,this.privatekey,t)},this.deleteDocumentsBatch=function(t){if(!t||!t.documents||!Array.isArray(t.documents))throw"Please provide an array of document ids: {documents: []}";return n.deleteDocumentsBatch(this.apiHostname,this.sitekey,this.privatekey,t)},this.setApiHostname=function(t){this.apiHostname=t},this.getSettings=function(){return this.settings.getSettings()},this.setLanguage=function(t){this.settings.setLanguage(t)},this.setCategoryFilters=function(t){this.settings.setCategoryFilters(t)},this.addCustomFieldFilter=function(t,e){this.settings.addCustomFieldFilter(t,e)},this.removeCustomFieldFilter=function(t,e){this.settings.removeCustomFieldFilter(t,e)},this.setPriceRangeFilter=function(t,e){this.settings.setPriceRangeFilter(t,e)},this.setDateFilter=function(t,e){this.settings.setDateFilter(t,e)},this.setJWT=function(t){this.settings.setJWT(t)},this.setUserToken=function(t){this.settings.setUserToken(t)},this.setPaging=function(t,e,s,i){this.settings.setPaging(t,e,s,i)},this.nextPage=function(){this.settings.nextPage()},this.previousPage=function(){this.settings.previousPage()},this.setSuggestionsSize=function(t){this.settings.setSuggestionsSize(t)},this.setAutocompleteSize=function(t){this.settings.setAutocompleteSize(t)},this.addFacetField=function(t){this.settings.addFacetField(t)},this.addHierarchicalFacetSetting=function(t){this.settings.addHierarchicalFacetSetting(t)},this.addRangeFacet=function(t,e){this.settings.addRangeFacet(t,e)},this.addStatsField=function(t){this.settings.addStatsField(t)},this.setNumberOfFacets=function(t){this.settings.setNumberOfFacets(t)},this.setResultType=function(t){this.settings.setResultType(t)},this.setPersonalizationEvents=function(t){this.settings.setPersonalizationEvents(t)},this.setFilterObject=function(t){this.settings.setFilterObject(t)},this.setShuffleAndLimitTo=function(t){this.settings.setShuffleAndLimitTo(t)},this.setFuzzyMatch=function(t){this.settings.setFuzzyMatch(t)},this.setPostfixWildcard=function(t){this.settings.setPostfixWildcard(t)},this.setCacheResponseTime=function(t){this.settings.setCacheResponseTime(t)},this.setCollectAnalytics=function(t){this.settings.setCollectAnalytics(t)},this.setAnalyticsTag=function(t){this.settings.setAnalyticsTag(t)},this.setThrottleTime=function(t){this.settings.setThrottleTime(t)},this.setStatsSessionId=function(t){this.sessionId=t},this.getStatsSessionId=function(){return this.sessionId},this.enableLogicalOperators=function(t){this.settings.enableLogicalOperators(t)},this.setSearchOperator=function(t){this.settings.setSearchOperator(t)},this.sendStatsEvent=function(t,e,s){if("search"===t){s={action:"search",session:this.sessionId,keyword:e,numberOfResults:s.numberOfResults,analyticsTag:this.getSettings().analyticsTag};r(this.apiHostname,this.sitekey,s)}else{if("click"!==t)throw"Illegal sendStatsEvent type parameters. Should be search or click)";s={action:"click",session:this.sessionId,keyword:e,docid:s.documentId,position:s.position,analyticsTag:this.getSettings().analyticsTag};r(this.apiHostname,this.sitekey,s)}},this.searchResultClicked=function(t,e){this.sendStatsEvent("click",this.settings.getSettings().keyword,{documentId:t,position:e})}}},function(t,e,s){"use strict";s(0).polyfill(),s(1);t.exports=function t(e,s,i,n,r,o,a){var c=function(t,e){return t||!1===t?"&"+e+"="+t:""};if("search"===i||"suggest"===i||"autocomplete"===i){var u="",h="",l=null;if("search"===i){l=i,u=n.keyword,u=n.enableLogicalOperators?u.replace(/ and /g," AND ").replace(/ or /g," OR ").replace(/ not /g," NOT "):u.replace(/ AND /g," and ").replace(/ OR /g," or ").replace(/ NOT /g," not "),u=encodeURIComponent(u);var f=n.fuzzy;if("retry"===f&&(f=!0===o),"search"===i){if(h=c(n.lang,"lang")+c(f,"fuzzy")+c(n.collectAnalytics,"collectAnalytics")+c(n.postfixWildcard,"postfixWildcard")+c(n.categories,"categories")+c(n.priceFromCents,"priceFromCents")+c(n.priceToCents,"priceToCents")+c(n.dateFrom,"dateFrom")+c(n.dateTo,"dateTo")+c(n.paging.page,"page")+c(n.paging.pageSize,"limit")+c(n.paging.sortBy,"sort")+c(n.paging.sortOrder,"order")+c(n.shuffleAndLimitTo,"shuffleAndLimitTo")+c(n.jwt,"jwt")+c(n.resultType,"resultType")+c(n.userToken,"userToken")+c(n.numFacets,"numFacets")+c(n.cacheResponseTime,"cacheResponseWithTtlSeconds")+c(n.searchOperator,"defaultOperator")+c(n.analyticsTag,"analyticsTag")+c(n.hierarchicalFacetSetting,"hierarchicalFacets"),n.customFieldFilters)for(var d=0;d<n.customFieldFilters.length;d++)h=h+"&customField="+n.customFieldFilters[d];if(n.facetFields)for(d=0;d<n.facetFields.length;d++)h=h+"&facet="+n.facetFields[d];if(n.rangeFacets&&(h=h+"&rangeFacets="+JSON.stringify(n.rangeFacets)),n.statsFields)for(d=0;d<n.statsFields.length;d++)h=h+"&fieldStat="+n.statsFields[d];if(n.personalizationEvents&&Array.isArray(n.personalizationEvents))for(d=0;d<n.personalizationEvents.length;d++){var p=n.personalizationEvents[d],g=Object.keys(p);h=h+"&personalizationEvent="+encodeURIComponent(g+"="+p[g])}a?h=h+"&filter="+encodeURIComponent(JSON.stringify(a)):n.filterObject&&(h=h+"&filter="+encodeURIComponent(JSON.stringify(n.filterObject)))}}else"suggest"===i?(l=i,h=c(n.suggestionsSize,"size"),u=n.suggestionsPrefix):"autocomplete"===i&&(l="autocomplete/document-field",h=c(n.autocomplete.field,"source")+c(n.autocomplete.size,"size"),u=n.autocomplete.prefix);fetch("https://"+e+"/v1/"+l+"/"+s+"?term="+u+h).then((function(t){return t.json()})).then((function(a){if("search"===i&&"retry"===n.fuzzy&&0===a.total_hits&&!0!==o)t(e,s,i,n,r,!0);else{if(!0===o){var c=n.paging.pageSize;a.total_hits>=c&&(a.total_hits=c)}r(a)}})).catch((function(t){console.log(t),r({error:{response:500,message:"invalid server response"}})}))}else r({error:{response:400,message:"invalid query type"}})}},function(t,e){var s,i,n=t.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function a(t){if(s===setTimeout)return setTimeout(t,0);if((s===r||!s)&&setTimeout)return s=setTimeout,setTimeout(t,0);try{return s(t,0)}catch(e){try{return s.call(null,t,0)}catch(e){return s.call(this,t,0)}}}!function(){try{s="function"==typeof setTimeout?setTimeout:r}catch(t){s=r}try{i="function"==typeof clearTimeout?clearTimeout:o}catch(t){i=o}}();var c,u=[],h=!1,l=-1;function f(){h&&c&&(h=!1,c.length?u=c.concat(u):l=-1,u.length&&d())}function d(){if(!h){var t=a(f);h=!0;for(var e=u.length;e;){for(c=u,u=[];++l<e;)c&&c[l].run();l=-1,e=u.length}c=null,h=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===o||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t)}}function p(t,e){this.fun=t,this.array=e}function g(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var s=1;s<arguments.length;s++)e[s-1]=arguments[s];u.push(new p(t,e)),1!==u.length||h||a(d)},p.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=g,n.addListener=g,n.once=g,n.off=g,n.removeListener=g,n.removeAllListeners=g,n.emit=g,n.prependListener=g,n.prependOnceListener=g,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}},function(t,e,s){"use strict";s.r(e),s.d(e,"Headers",(function(){return p})),s.d(e,"Request",(function(){return T})),s.d(e,"Response",(function(){return _})),s.d(e,"DOMException",(function(){return A})),s.d(e,"fetch",(function(){return x}));var i="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==i&&i,n="URLSearchParams"in i,r="Symbol"in i&&"iterator"in Symbol,o="FileReader"in i&&"Blob"in i&&function(){try{return new Blob,!0}catch(t){return!1}}(),a="FormData"in i,c="ArrayBuffer"in i;if(c)var u=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],h=ArrayBuffer.isView||function(t){return t&&u.indexOf(Object.prototype.toString.call(t))>-1};function l(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw new TypeError('Invalid character in header field name: "'+t+'"');return t.toLowerCase()}function f(t){return"string"!=typeof t&&(t=String(t)),t}function d(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return r&&(e[Symbol.iterator]=function(){return e}),e}function p(t){this.map={},t instanceof p?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function g(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function y(t){return new Promise((function(e,s){t.onload=function(){e(t.result)},t.onerror=function(){s(t.error)}}))}function m(t){var e=new FileReader,s=y(e);return e.readAsArrayBuffer(t),s}function b(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function v(){return this.bodyUsed=!1,this._initBody=function(t){var e;this.bodyUsed=this.bodyUsed,this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:o&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:a&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:n&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():c&&o&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=b(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):c&&(ArrayBuffer.prototype.isPrototypeOf(t)||h(t))?this._bodyArrayBuffer=b(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):n&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var t=g(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){if(this._bodyArrayBuffer){var t=g(this);return t||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}return this.blob().then(m)}),this.text=function(){var t,e,s,i=g(this);if(i)return i;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,s=y(e),e.readAsText(t),s;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),s=new Array(e.length),i=0;i<e.length;i++)s[i]=String.fromCharCode(e[i]);return s.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a&&(this.formData=function(){return this.text().then(F)}),this.json=function(){return this.text().then(JSON.parse)},this}p.prototype.append=function(t,e){t=l(t),e=f(e);var s=this.map[t];this.map[t]=s?s+", "+e:e},p.prototype.delete=function(t){delete this.map[l(t)]},p.prototype.get=function(t){return t=l(t),this.has(t)?this.map[t]:null},p.prototype.has=function(t){return this.map.hasOwnProperty(l(t))},p.prototype.set=function(t,e){this.map[l(t)]=f(e)},p.prototype.forEach=function(t,e){for(var s in this.map)this.map.hasOwnProperty(s)&&t.call(e,this.map[s],s,this)},p.prototype.keys=function(){var t=[];return this.forEach((function(e,s){t.push(s)})),d(t)},p.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),d(t)},p.prototype.entries=function(){var t=[];return this.forEach((function(e,s){t.push([s,e])})),d(t)},r&&(p.prototype[Symbol.iterator]=p.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function T(t,e){if(!(this instanceof T))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var s,i,n=(e=e||{}).body;if(t instanceof T){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new p(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new p(e.headers)),this.method=(s=e.method||this.method||"GET",i=s.toUpperCase(),w.indexOf(i)>-1?i:s),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(n),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==e.cache&&"no-cache"!==e.cache)){var r=/([?&])_=[^&]*/;if(r.test(this.url))this.url=this.url.replace(r,"$1_="+(new Date).getTime());else{this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}}function F(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var s=t.split("="),i=s.shift().replace(/\+/g," "),n=s.join("=").replace(/\+/g," ");e.append(decodeURIComponent(i),decodeURIComponent(n))}})),e}function _(t,e){if(!(this instanceof _))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===e.statusText?"":""+e.statusText,this.headers=new p(e.headers),this.url=e.url||"",this._initBody(t)}T.prototype.clone=function(){return new T(this,{body:this._bodyInit})},v.call(T.prototype),v.call(_.prototype),_.prototype.clone=function(){return new _(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new p(this.headers),url:this.url})},_.error=function(){var t=new _(null,{status:0,statusText:""});return t.type="error",t};var S=[301,302,303,307,308];_.redirect=function(t,e){if(-1===S.indexOf(e))throw new RangeError("Invalid status code");return new _(null,{status:e,headers:{location:t}})};var A=i.DOMException;try{new A}catch(t){(A=function(t,e){this.message=t,this.name=e;var s=Error(t);this.stack=s.stack}).prototype=Object.create(Error.prototype),A.prototype.constructor=A}function x(t,e){return new Promise((function(s,n){var r=new T(t,e);if(r.signal&&r.signal.aborted)return n(new A("Aborted","AbortError"));var a=new XMLHttpRequest;function u(){a.abort()}a.onload=function(){var t,e,i={status:a.status,statusText:a.statusText,headers:(t=a.getAllResponseHeaders()||"",e=new p,t.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t})).forEach((function(t){var s=t.split(":"),i=s.shift().trim();if(i){var n=s.join(":").trim();e.append(i,n)}})),e)};i.url="responseURL"in a?a.responseURL:i.headers.get("X-Request-URL");var n="response"in a?a.response:a.responseText;setTimeout((function(){s(new _(n,i))}),0)},a.onerror=function(){setTimeout((function(){n(new TypeError("Network request failed"))}),0)},a.ontimeout=function(){setTimeout((function(){n(new TypeError("Network request failed"))}),0)},a.onabort=function(){setTimeout((function(){n(new A("Aborted","AbortError"))}),0)},a.open(r.method,function(t){try{return""===t&&i.location.href?i.location.href:t}catch(e){return t}}(r.url),!0),"include"===r.credentials?a.withCredentials=!0:"omit"===r.credentials&&(a.withCredentials=!1),"responseType"in a&&(o?a.responseType="blob":c&&r.headers.get("Content-Type")&&-1!==r.headers.get("Content-Type").indexOf("application/octet-stream")&&(a.responseType="arraybuffer")),!e||"object"!=typeof e.headers||e.headers instanceof p?r.headers.forEach((function(t,e){a.setRequestHeader(e,t)})):Object.getOwnPropertyNames(e.headers).forEach((function(t){a.setRequestHeader(t,f(e.headers[t]))})),r.signal&&(r.signal.addEventListener("abort",u),a.onreadystatechange=function(){4===a.readyState&&r.signal.removeEventListener("abort",u)}),a.send(void 0===r._bodyInit?null:r._bodyInit)}))}x.polyfill=!0,i.fetch||(i.fetch=x,i.Headers=p,i.Request=T,i.Response=_)},function(t,e,s){"use strict";s(1);var i=s(3),n=s(0).Promise,r=function(t,e){return{Authorization:"Basic "+i.base64(t+":"+e),"Content-Type":"application/json"}};t.exports={getDocument:function(t,e,s,i){return new n((function(n,o){fetch("https://"+t+"/v2/indices/"+e+"/documents/"+i,{method:"GET",headers:r(e,s)}).then((function(t){200==t.status?n(t.json()):o({status:t.status,text:t.statusText})})).catch((function(t){o({status:400,text:t})}))}))},saveDocument:function(t,e,s,i){var o=i.id||i.url;return new n((function(n,a){fetch("https://"+t+"/v2/indices/"+e+"/documents/",{method:o?"PUT":"POST",headers:r(e,s),body:JSON.stringify(i)}).then((function(t){202==t.status?n({status:t.status,text:t.statusText}):a({status:t.status,text:t.statusText})})).catch((function(t){a({status:400,text:t})}))}))},saveDocumentsBatch:function(t,e,s,i){return new n((function(n,o){fetch("https://"+t+"/v2/indices/"+e+"/documents:batch",{method:"PUT",headers:r(e,s),body:JSON.stringify(i)}).then((function(t){202==t.status?n({status:t.status,text:t.statusText}):o({status:t.status,text:t.statusText})})).catch((function(t){o({status:400,text:t})}))}))},deleteDocument:function(t,e,s,i){return new n((function(n,o){fetch("https://"+t+"/v2/indices/"+e+"/documents/"+i,{method:"DELETE",headers:r(e,s)}).then((function(t){202==t.status?n({status:t.status,text:t.statusText}):o({status:t.status,text:t.statusText})})).catch((function(t){o({status:400,text:t})}))}))},deleteDocumentsBatch:function(t,e,s,i){return new n((function(n,o){fetch("https://"+t+"/v2/indices/"+e+"/documents:batch",{method:"DELETE",headers:r(e,s),body:JSON.stringify(i)}).then((function(t){202==t.status?n({status:t.status,text:t.statusText}):o({status:t.status,text:t.statusText})})).catch((function(t){o({status:400,text:t})}))}))}}},function(t,e,s){"use strict";s(0).polyfill(),s(1);t.exports=function(t,e,s){"undefined"!=typeof window&&window.navigator&&window.navigator.sendBeacon?navigator.sendBeacon("https://"+t+"/v1/stats/"+e+"/",JSON.stringify(s)):fetch("https://"+t+"/v1/stats/"+e+"/",{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(s)})}},function(t,e,s){"use strict";t.exports=function(){this.settings={keyword:"*",callback:null,throttleTimeMs:200,fuzzy:"auto",paging:{page:1,pageSize:10,sortBy:"relevance",sortOrder:"desc"},customFieldFilters:[],userToken:null,suggestionsSize:10,facetFields:[],autocomplete:{size:10},searchOperator:null,enableLogicalOperators:!1,cacheResponseTime:null},this.getSettings=function(){return this.settings},this.setKeyword=function(t){this.settings.keyword=t||"*"},this.setCallback=function(t){this.settings.callback=t},this.setThrottleTime=function(t){this.settings.throttleTimeMs=t},this.setSuggestionsPrefix=function(t){this.settings.suggestionsPrefix=t},this.setSuggestionsSize=function(t){this.settings.suggestionsSize=t},this.setAutocompleteSize=function(t){this.settings.autocomplete.size=t},this.setAutocompleteParams=function(t,e){this.settings.autocomplete.field=t,this.settings.autocomplete.prefix=e},this.setLanguage=function(t){if(t&&2!==t.length)throw'use 2-char language code (e.g. "en")';this.settings.lang=t},this.setFuzzyMatch=function(t){if(!0!==t&&!1!==t&&"auto"!==t&&"retry"!==t)throw"fuzzy matching can be true, false, 'auto', or 'retry'";this.settings.fuzzy=t},this.enableLogicalOperators=function(t){this.settings.enableLogicalOperators=t},this.setCacheResponseTime=function(t){this.settings.cacheResponseTime=t},this.setPostfixWildcard=function(t){this.settings.postfixWildcard=t},this.setCollectAnalytics=function(t){this.settings.collectAnalytics=t},this.setAnalyticsTag=function(t){this.settings.analyticsTag=t},this.setCategoryFilters=function(t){this.settings.categories=t},this.setFilterObject=function(t){this.settings.filterObject=t},this.setPriceRangeFilter=function(t,e){this.settings.priceFromCents=t,this.settings.priceToCents=e},this.addCustomFieldFilter=function(t,e){var s=encodeURIComponent(t+"="+e);-1===this.settings.customFieldFilters.indexOf(s)&&this.settings.customFieldFilters.push(s)},this.removeCustomFieldFilter=function(t,e){var s=!1,i=encodeURIComponent(t+"="+e);e||(s=!0,i=encodeURIComponent(t+"="));for(var n=this.settings.customFieldFilters.length;n>0;n--){var r=this.settings.customFieldFilters[n-1];(s&&0===r.indexOf(i)||r===i)&&this.settings.customFieldFilters.splice(n-1,1)}},this.setDateFilter=function(t,e){this.settings.dateFrom=t,this.settings.dateTo=e},this.setKeyword=function(t){this.settings.keyword=t||"*"},this.setJWT=function(t){this.settings.jwt=t},this.setUserToken=function(t){this.settings.userToken=t},this.setPersonalizationEvents=function(t){this.settings.personalizationEvents=t},this.setResultType=function(t){this.settings.resultType=t},this.addFacetField=function(t){-1===this.settings.facetFields.indexOf(t)&&this.settings.facetFields.push(t)},this.addHierarchicalFacetSetting=function(t){this.settings.hierarchicalFacetSetting=JSON.stringify(t)},this.addRangeFacet=function(t,e){this.settings.rangeFacets||(this.settings.rangeFacets=[]),this.settings.rangeFacets.push({field:t,ranges:e})},this.addStatsField=function(t){this.settings.statsFields||(this.settings.statsFields=[]),-1===this.settings.statsFields.indexOf(t)&&this.settings.statsFields.push(t)},this.setNumberOfFacets=function(t){this.settings.numFacets=t},this.setPaging=function(t,e,s,i){if(t<1)throw"page must be 1 or bigger";if(e<1||e>300)throw"pageSize must be 1-300";if("asc"!==i&&"desc"!==i)throw"sortOrder must be asc or desc";this.settings.paging.page=t,this.settings.paging.pageSize=e,this.settings.paging.sortBy=s,this.settings.paging.sortOrder=i},this.setShuffleAndLimitTo=function(t){this.settings.shuffleAndLimitTo=t},this.nextPage=function(){this.settings.paging.page=this.settings.paging.page+1},this.previousPage=function(){this.settings.paging.page>0&&(this.settings.paging.page=this.settings.paging.page-1)},this.setSearchOperator=function(t){if("and"!==t&&"or"!==t)throw"operator must be 'and' || 'or'";this.settings.searchOperator=t}}},function(t,e){t.exports=function(t,e){var s,i=0;function n(){s&&clearTimeout(s)}return function(){var r=this,o=Date.now()-i,a=arguments;function c(){i=Date.now(),e.apply(r,a)}n(),o>t?c():s=setTimeout(c,t-o)}}}]);