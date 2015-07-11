var data = {
	currentCandidates: [],
	issues: [],

	getIssues: function()
	{
		$.getJSON('/api/issue', data.getIssuesCallback);
	},

	getIssuesCallback: function(response)
	{
		data.issues = response;

		var lookupData = [];
		for (var i = 0; i < data.issues.length; i++) {
			lookupData.push({ value: data.issues[i].short_desc, data: i });
		}

		$('#issue-input').autocomplete({
		    lookup: lookupData,
		    onSelect: hmh.issueSelectedCallback
		});
	},

	getCandidates: function()
	{
		var params = {};
		var issues = $('#current-issues .box');
		for (var i = 0; i < issues.length; i++) {
			var item = $(issues[i]);
			params[item.attr('data-id')] = item.find('.slider').slider('value');
		}

		$.getJSON('/api/candidate?sliders=' + JSON.stringify(params), data.getCandidatesCallback);
	},

	getCandidatesCallback: function(response)
	{
		data.currentCandidates = response;

		hmh.displayCandidates();
	}
}