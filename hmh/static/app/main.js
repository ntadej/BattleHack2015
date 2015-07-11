var hmh = {
	init: function()
	{
		data.getIssues();
	},

	issueSelectedCallback: function(suggestion)
	{
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

        var list = $('#current-issues');

        var item = $('<div class="box" style="display:none;" data-id="' + data.issues[suggestion.data].id + '"></div>');
        item.append('<h4>' + data.issues[suggestion.data].short_desc + '</h4>');
        item.append('<div class="slider"></div>');
        item.append('<p>' + data.issues[suggestion.data].description + '</p>');

        item.find('.slider').slider({
      		value: 0,
		    min: -2,
	        max: 2,
		    change: function(event, ui) {
		        console.log(ui.value);
		        data.getCandidates();
		    }
		});

		list.prepend(item);
		item.slideDown();

		$('#issue-input').val('');

		data.getCandidates();
    },

    displayCandidates: function()
    {
    	var list = $('#recommendations').empty();

    	for (var i = 0; i < data.currentCandidates.length; i++) {
    		list.append('<p>' + data.currentCandidates[i].first_name + ' ' + data.currentCandidates[i].last_name + '</p>');
    	}
    }
}

$(document).ready(function() {
	hmh.init();
});