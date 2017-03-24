(function ($, _) {
  // config
  var endpoint = '//gis.phila.gov/arcgis/rest/services/LNI/LI_PERMIT_APPLICATION_STATUS/FeatureServer/1/query'
  // var FAILED_OR_INCOMPLETE_TEXT = "\
  //       PLAN REVIEW COMPLETED; IF 'APPROVED' A BILLING STATEMENT HAS BEEN \
  //       ISSUED BY THE DEPARTMENT TO THE PRIMARY APPLICANT. IF 'INCOMPLETE' OR \
  //       'FAILED' A REQUEST FOR ADDITIONAL INFORMATION LETTER HAS BEEN ISSUED \
  //       BY THE DEPARTMENT TO THE PRIMARY APPLICANT; PLEASE CONTACT THE \
  //       PRIMARY APPLICANT AS LISTED ON THE APPLICATION FOR PERMIT.\
  //     ";
  var FAILED_OR_INCOMPLETE_TEXT = "\
        PLAN REVIEW COMPLETED; A REQUEST FOR ADDITIONAL INFORMATION LETTER HAS \
        BEEN ISSUED BY THE DEPARTMENT TO THE PRIMARY APPLICANT; PLEASE CONTACT \
        THE PRIMARY APPLICANT AS LISTED ON THE APPLICATION FOR PERMIT.\
      ",
      DATE_FORMAT = 'dddd, MMMM Do YYYY'
	
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
            comments = attrs.COMMENTS;
        
		// added in else if
		if (status === 'FAILED' || status === 'INCOMPLETE') {
          comments = FAILED_OR_INCOMPLETE_TEXT;
		
		  if (status === 'INCOMPLETE' && !attrs.suspdt) 
			  comments = attrs.COMMENTS;
		  } 
		  
        if (!attrs.suspdt) {
			attrs.suspdt = "Date not set";
		}
			
		
		
	

		
		

        var templateData = {
          application_number:   attrs.APNO,
          comments:             comments,
    		  stat:					        status,
    		  stno:					        attrs.STNO,
    		  predir:				        attrs.PREDIR,
    		  stname:				        attrs.STNAME,
    		  suffix:				        attrs.SUFFIX,
    		  apdttm:		            moment(attrs.APDTTM).utc().format(DATE_FORMAT),
    		  suspdt:				        moment(attrs.SUSPDT).utc().format(DATE_FORMAT),
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
