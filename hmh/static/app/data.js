var data = {
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
		    onSelect: function (suggestion) {
		        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
		    }
		});
	}
}