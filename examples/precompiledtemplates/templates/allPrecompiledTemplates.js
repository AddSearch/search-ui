(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['noResults'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"addsearch-searchresults addsearch-searchresults-no-results\">\n  <h2>No search results with keyword <em>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"keyword") || (depth0 != null ? lookupProperty(depth0,"keyword") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"keyword","hash":{},"data":data,"loc":{"start":{"line":2,"column":41},"end":{"line":2,"column":52}}}) : helper)))
    + "</em></h2>\n</div>";
},"useData":true});
templates['numberOfResults'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "Page "
    + container.escapeExpression(container.lambda((depths[1] != null ? lookupProperty(depths[1],"page") : depths[1]), depth0))
    + " of ";
},"3":function(container,depth0,helpers,partials,data) {
    return "+";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"number-of-results\">\n  "
    + ((stack1 = (lookupProperty(helpers,"gt")||(depth0 && lookupProperty(depth0,"gt"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"page") : depth0),1,{"name":"gt","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":43}}})) != null ? stack1 : "")
    + "\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"total_hits") || (depth0 != null ? lookupProperty(depth0,"total_hits") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"total_hits","hash":{},"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":16}}}) : helper)))
    + ((stack1 = (lookupProperty(helpers,"equals")||(depth0 && lookupProperty(depth0,"equals"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"total_hits") : depth0),10000,{"name":"equals","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":56}}})) != null ? stack1 : "")
    + " results\n</div>";
},"useData":true,"useDepths":true});
templates['pagination'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    <button data-page=\"previous\" aria-label=\"Previous page\">❮</button>\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <button data-page=\""
    + alias2(alias1(depth0, depth0))
    + "\" aria-label=\"Go to results page "
    + alias2(alias1(depth0, depth0))
    + "\" "
    + ((stack1 = (lookupProperty(helpers,"equals")||(depth0 && lookupProperty(depth0,"equals"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"currentPage") : depths[1]),depth0,{"name":"equals","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":74},"end":{"line":6,"column":154}}})) != null ? stack1 : "")
    + ">\n      "
    + alias2(alias1(depth0, depth0))
    + "\n    </button>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "data-active=\"true\" aria-current=\"true\"";
},"6":function(container,depth0,helpers,partials,data) {
    return "    <button data-page=\"next\" aria-label=\"Next page\">❯</button>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"addsearch-pagination\">\n"
    + ((stack1 = (lookupProperty(helpers,"gt")||(depth0 && lookupProperty(depth0,"gt"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"currentPage") : depth0),1,{"name":"gt","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"pages") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":9,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"lt")||(depth0 && lookupProperty(depth0,"lt"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"currentPage") : depth0),(depth0 != null ? lookupProperty(depth0,"lastPage") : depth0),{"name":"lt","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":2},"end":{"line":12,"column":9}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useDepths":true});
templates['searchField'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "icon";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <button type=\"button\" aria-label=\"Search button\" >"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"button") || (depth0 != null ? lookupProperty(depth0,"button") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"button","hash":{},"data":data,"loc":{"start":{"line":7,"column":56},"end":{"line":7,"column":66}}}) : helper)))
    + "</button>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"addsearch-searchfield-container\">\n  <form class=\"addsearch-searchfield\" autocomplete=\"off\" action=\"?\" role=\"search\">\n    <div class=\"search-field-wrapper\">\n      <input type=\"search\" placeholder=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":4,"column":40},"end":{"line":4,"column":55}}}) : helper)))
    + "\" aria-label=\"Search field\" class=\""
    + ((stack1 = (lookupProperty(helpers,"not")||(depth0 && lookupProperty(depth0,"not"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"icon") : depth0),false,{"name":"not","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":90},"end":{"line":4,"column":121}}})) != null ? stack1 : "")
    + "\" />\n    </div>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"button") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":8,"column":11}}})) != null ? stack1 : "")
    + "  </form>\n</div>";
},"useData":true});
templates['searchResultImage'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "noimage";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " style=\"background-image: url(data:image/jpeg;base64,"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"main_b64") : stack1), depth0))
    + ")\"";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img src=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"main") : stack1), depth0))
    + "\" alt=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":2,"column":53},"end":{"line":2,"column":62}}}) : helper)))
    + "\" />\n  ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"style") : depth0)) != null ? lookupProperty(stack1,"image_url") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":78}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img src=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"style") : depth0)) != null ? lookupProperty(stack1,"image_url") : stack1), depth0))
    + "\" alt=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":3,"column":65},"end":{"line":3,"column":74}}}) : helper)))
    + "\" />";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"main-image "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"document_type") || (depth0 != null ? lookupProperty(depth0,"document_type") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"document_type","hash":{},"data":data,"loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":41}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"main") : stack1),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":42},"end":{"line":1,"column":83}}})) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"main") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":84},"end":{"line":1,"column":184}}})) != null ? stack1 : "")
    + ">\n  "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"main") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":3,"column":85}}})) != null ? stack1 : "")
    + "\n</span>";
},"useData":true});
templates['searchResults'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"numberOfResultsTemplate"),depth0,{"name":"numberOfResultsTemplate","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <div class=\"hit"
    + ((stack1 = (lookupProperty(helpers,"equals")||(depth0 && lookupProperty(depth0,"equals"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"PROMOTED",{"name":"equals","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":19},"end":{"line":7,"column":66}}})) != null ? stack1 : "")
    + "\">\n      <h3>\n        <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":24}}}) : helper)))
    + "\" data-analytics-click=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":48},"end":{"line":9,"column":54}}}) : helper)))
    + "\">"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":9,"column":56},"end":{"line":9,"column":133}}})) != null ? stack1 : "")
    + "</a>\n      </h3>\n      <div class=\"highlight\">\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"searchResultImageTemplate"),depth0,{"name":"searchResultImageTemplate","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"highlight") || (depth0 != null ? lookupProperty(depth0,"highlight") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"highlight","hash":{},"data":data,"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":23}}}) : helper))) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"not")||(depth0 && lookupProperty(depth0,"not"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"PROMOTED",{"name":"not","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":23},"end":{"line":13,"column":62}}})) != null ? stack1 : "")
    + "\n      </div>\n    </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " promoted";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":9,"column":70},"end":{"line":9,"column":79}}}) : helper)))
    + " ";
},"8":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression((lookupProperty(helpers,"removeTrailingQueriesFromUrl")||(depth0 && lookupProperty(depth0,"removeTrailingQueriesFromUrl"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"url") : depth0),{"name":"removeTrailingQueriesFromUrl","hash":{},"data":data,"loc":{"start":{"line":9,"column":89},"end":{"line":9,"column":125}}}))
    + " ";
},"10":function(container,depth0,helpers,partials,data) {
    return "&#8230;";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"addsearch-searchresults\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"resultcount") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"hits") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":2},"end":{"line":16,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});
})();
