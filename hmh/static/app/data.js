var data = {
	currentCandidates: [],
	currentCharities: [],
	issues: [],

	getIssues: function()
	{
		$.getJSON('/api/issue', data.getIssuesCallback);
	},

	getIssuesCallback: function(response)
	{
		data.issues = response;

		var lookupData = hmh.notSelectedIssues();

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

        $('#recommendations-candidates .throbber-main').fadeIn(200);
	},

	getCandidatesCallback: function(response)
	{
		data.currentCandidates = response;

		hmh.displayCandidates();
	},

	getCharities: function()
	{
		var params = {};
		var issues = $('#current-issues .box');
		for (var i = 0; i < issues.length; i++) {
			var item = $(issues[i]);
			params[item.attr('data-id')] = item.find('.slider').slider('value');
		}

		$.getJSON('/api/charity?sliders=' + JSON.stringify(params), data.getCharitiesCallback);

        $('#recommendations-charities .throbber-main').fadeIn(200);
	},

	getCharitiesCallback: function(response)
	{
		data.currentCharities = response;

		hmh.displayCharities();
	},

	getPaymentToken: function()
	{
		$.getJSON('/api/payments/token', data.getPaymentTokenCallback);
	},

	getPaymentTokenCallback: function(response)
	{
      	braintree.setup(response.client_token, "dropin", {
        	container: "payment-form"
      	});
	},

	postPaymentData: function(obj)
	{
    	$.post('/api/payments/purchase', obj, data.postPaymentDataCallback, 'json');
	},

	postPaymentDataCallback: function(response)
	{
		$('.payment').empty().append(response.status);
	},

	getTweets: function(query)
	{
		$.getJSON('/api/tweets?query=' + encodeURI(query), data.getTweetsCallback);
	},

	getTweetsCallback: function(response)
	{
		hmh.displayTweets(response.tweets);
	},

	getNews: function(query)
	{
		$.getJSON('/api/news?query=' + encodeURI(query), data.getNewsCallback);
	},

	getNewsCallback: function(response)
	{
		hmh.displayNews(response.news);
	}
}