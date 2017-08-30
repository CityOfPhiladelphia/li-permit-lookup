function ($, dom, on, Query, QueryTask, _) {
  // config
  var endpoint = '//gis.phila.gov/arcgis/rest/services/LNI/LI_PERMITS_LOOKUP/FeatureServer/1/query'
  
  var params = qs(window.location.search.substr(1))
  // Use mustache.js style brackets in templates
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }
  var templates = {
    result: _.template($('#tmpl-result').html()),
    error: _.template($('#tmpl-error').html()),
    loading: $('#tmpl-loading').html()
  }
  var resultContainer = $('#result')
  
  
  if (params.id) {
    resultContainer.html(templates.loading)
    var requestParams = {
      where: 'CONTRACTORNAME = ' + params.id,
      outFields: '*',
      f: 'pjson',
    }
    $.getJSON(endpoint, requestParams, function (response) {
      var features = response.features
      if (features.length < 1) {
        // If there's no feature, indicate such
        resultContainer.html(templates.error({ CONTRACTORNAME : params.id }))
      } else {
        // Otherwise display the first feature (which should be the only
        // feature)
  
		// Rename/manipulate API response to fit our HTML template
       var attrs = response.features[0].attributes
  
  
       var queryTask = new QueryTask("http://gis.phila.gov/arcgis/rest/services/LNI/LI_PERMITS_LOOKUP/FeatureServer/1");
        
		// Rename/manipulate API response to fit our HTML template
       var attrs = response.features[0].attributes
	   var templateData = {
			  permit_number:   				attrs.PERMITNUMBER,
    		  stat:					        attrs.STATUS,
    		  address:					    attrs.ADDRESS,
    		  permitissuedttm:              formatDate(attrs.PERMITISSUEDATE),
    		  descript:               		attrs.PERMITDESCRIPTION,
    		  permittype:					attrs.PERMITTYPE,
    		  contractor:				    attrs.CONTRACTORNAME,
			  
        }
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [
		  "PERMITNUMBER", "PERMITTYPE", "PERMITDESCRIPTION", 
		  "STATUS", "CONTRACTORNAME", "PERMITISSUEDATE", "ADDRESS"
        ];

        on(dom.byId("execute"), "click", execute);

        function execute () {
          query.text = dom.byId("CONTRACTORNAME").value;
          queryTask.execute(query, showResults);
        }

        function showResults (results) {
          var resultItems = [];
          var resultCount = results.features.length;
          for (var i = 0; i < resultCount; i++) {
            var featureAttributes = results.features[i].attributes;
            for (var attrs in featureAttributes) {
              resultItems.push("<b>" + attrs + ":</b>  " + featureAttributes[attrs] + "<br>");
            }
            resultItems.push("<br>");
          }
          dom.byId("info").innerHTML = resultItems.join("");
        }
      
  var params = qs(window.location.search.substr(1))
  // Use mustache.js style brackets in templates
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }
  var templates = {
    result: _.template($('#tmpl-result').html()),
    error: _.template($('#tmpl-error').html()),
    loading: $('#tmpl-loading').html()
  }
  

 // decode a uri into a kv representation :: str -> obj
  // https://github.com/yoshuawuyts/sheet-router/blob/master/qs.js
  function qs (uri) {
    var obj = {}
    var reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    uri.replace(/^.*\?/, '').replace(reg, map)
    return obj

    function map (a0, a1, a2, a3) {
      obj[window.decodeURIComponent(a1)] = window.decodeURIComponent(a3)
    }
  }
})(window.jQuery, window._)
	  
	  
	  
	  
	  
	  
	  
	  
	























/* (function ($, _) {
  // config
  var endpoint = '//gis.phila.gov/arcgis/rest/services/LNI/LI_PERMITS_LOOKUP/FeatureServer/1/query'
  // var FAILED_OR_INCOMPLETE_TEXT = "\
  //       PLAN REVIEW COMPLETED; IF 'APPROVED' A BILLING STATEMENT HAS BEEN \
  //       ISSUED BY THE DEPARTMENT TO THE PRIMARY APPLICANT. IF 'INCOMPLETE' OR \
  //       'FAILED' A REQUEST FOR ADDITIONAL INFORMATION LETTER HAS BEEN ISSUED \
  //       BY THE DEPARTMENT TO THE PRIMARY APPLICANT; PLEASE CONTACT THE \
  //       PRIMARY APPLICANT AS LISTED ON THE APPLICATION FOR PERMIT.\
  //     ";
  var //FAILED_OR_INCOMPLETE_TEXT = "\
        PLAN REVIEW COMPLETED; A REQUEST FOR ADDITIONAL INFORMATION LETTER HAS \
        BEEN ISSUED BY THE DEPARTMENT TO THE PRIMARY APPLICANT; PLEASE CONTACT \
        THE PRIMARY APPLICANT AS LISTED ON THE APPLICATION FOR PERMIT.\
      ",
      DATE_FORMAT = 'dddd, MMMM Do YYYY',
      INVALID_DATE_TEXT = 'Date not set'

  var params = qs(window.location.search.substr(1))
  // Use mustache.js style brackets in templates
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }
  var templates = {
    result: _.template($('#tmpl-result').html()),
    error: _.template($('#tmpl-error').html()),
    loading: $('#tmpl-loading').html()
  }
  var resultContainer = $('#result')

  if (params.id) {
    resultContainer.html(templates.loading)
    var requestParams = {
      where: 'APNO = ' + params.id,
      outFields: '*',
      f: 'pjson',
    }
    $.getJSON(endpoint, requestParams, function (response) {
      var features = response.features
      if (features.length < 1) {
        // If there's no feature, indicate such
        resultContainer.html(templates.error({ application_number : params.id }))
      } else {
        // Otherwise display the first feature (which should be the only
        // feature)

        // Rename/manipulate API response to fit our HTML template
        var attrs = response.features[0].attributes

        // handle comments
        var status = attrs.STATUS,
            comments = attrs.COMMENTS

        // if failed, or incomplete and there's a review date
    		if (status === 'FAILED' || (status === 'INCOMPLETE' && attrs.SUSPDT)) {
          comments = FAILED_OR_INCOMPLETE_TEXT
  		  }

        function formatDate(input) {
          var dateFormatted

          // make sure date isn't just whitespace
          if (!/\S/.test(input)) {
            input = null;
          }

          // if we have a valid string
          if (input) {
            // format it with moment
            dateFormatted = moment(input).utc().format(DATE_FORMAT)
          }
          // otherwise return invalid date text
          else {
            dateFormatted = INVALID_DATE_TEXT
          }

          return dateFormatted
        }

        var templateData = {
          application_number:   attrs.APNO,
          comments:             comments,
    		  stat:					        status,
    		  stno:					        attrs.STNO,
    		  predir:				        attrs.PREDIR,
    		  stname:				        attrs.STNAME,
    		  suffix:				        attrs.SUFFIX,
    		  apdttm:               formatDate(attrs.APDTTM),
    		  suspdt:               formatDate(attrs.SUSPDT),
    		  loc:					        attrs.LOC,
    		  apdesc:				        attrs.APDESC,
        }

        // Render template
        resultContainer.html(templates.result(templateData))
      }
    }).fail(function () {
      resultContainer.html(templates.error({ application_number : params.id }))
    })
  }

  // decode a uri into a kv representation :: str -> obj
  // https://github.com/yoshuawuyts/sheet-router/blob/master/qs.js
  function qs (uri) {
    var obj = {}
    var reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    uri.replace(/^.*\?/, '').replace(reg, map)
    return obj

    function map (a0, a1, a2, a3) {
      obj[window.decodeURIComponent(a1)] = window.decodeURIComponent(a3)
    }
  }
})(window.jQuery, window._)
 */