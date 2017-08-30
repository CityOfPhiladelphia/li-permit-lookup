(function ($, _) {
  // config
  var endpoint = '//gis.phila.gov/arcgis/rest/services/LNI/LI_PERMITS_LOOKUP/FeatureServer/1/query'
  // var FAILED_OR_INCOMPLETE_TEXT = "\
  //       PLAN REVIEW COMPLETED; IF 'APPROVED' A BILLING STATEMENT HAS BEEN \
  //       ISSUED BY THE DEPARTMENT TO THE PRIMARY APPLICANT. IF 'INCOMPLETE' OR \
  //       'FAILED' A REQUEST FOR ADDITIONAL INFORMATION LETTER HAS BEEN ISSUED \
  //       BY THE DEPARTMENT TO THE PRIMARY APPLICANT; PLEASE CONTACT THE \
  //       PRIMARY APPLICANT AS LISTED ON THE APPLICATION FOR PERMIT.\
  //     ";
  var DATE_FORMAT = 'dddd, MMMM Do YYYY'
      

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
      where: "CONTRACTORNAME = '" + params.id + "'",
      outFields: '*',
      f: 'pjson',
    }
    $.getJSON(endpoint, requestParams, function (response) {
      var features = response.features
      if (!features || features.length < 1) {
        // If there's no feature, indicate such
        resultContainer.html(templates.error({ contractor : params.id }))
      } else {
        // Otherwise display the first feature (which should be the only
        // feature)

        // Rename/manipulate API response to fit our HTML template
        var attrs = response.features[0].attributes

  
			
		console.log('testing')	
			
			
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
			  
			  address: 				attrs.ADDRESS,
			  ownername: 			attrs.OWNERNAME,
			  permit_number:		attrs.PERMITNUMBER,
			  permit_type:			attrs.PERMITTYPE,
			  permit_descript:		attrs.PERMITDESCRIPTION,
			  stat:					attrs.PERMITSTATUS,
			  contractor:			attrs.CONTRACTORNAME,
			  
			  
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
