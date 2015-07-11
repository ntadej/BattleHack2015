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
        item.append('<div class="close"><i class="fa fa-times"></i></div>');
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
		hmh.setSliderTicks(item.find('.slider').removeClass('ui-corner-all'));

		item.find('.close').click(hmh.issueRemove);

		list.prepend(item);
		item.slideDown();

		$('#issue-input').val('');

		data.getCandidates();
    },

    issueRemove: function(event)
    {
    	var target = $(event.currentTarget).parent();

    	target.slideUp({ complete: function() { data.getCandidates(); this.remove(); }});
    },

    setSliderTicks: function(slider)
    {
	    var max = slider.slider("option", "max") + Math.abs(slider.slider("option", "min"));    
	    var spacing = 100 / max;

	    slider.find('.ui-slider-tick-mark').remove();
	    for (var i = 0; i <= max ; i++) {
	        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo(slider);
	        if (i == 0) {
	        	slider.find('.ui-slider-tick-mark').css('margin-left', -1);
	        }
     	}
	},

    displayCandidates: function()
    {
    	var list = $('#recommendations').empty();

    	var first = data.currentCandidates[0];

    	var tmp = 'http://img.wonkette.com/wp-content/uploads/2014/11/President_Hillary_Clinton-403x514.jpg';

    	list.append('<h3>Recommended presidential candidate</h3>');
    	list.append('<div class="first-candidate"><h4>' + first.first_name + ' ' + first.last_name + '</h4><div class="portrait" style="background-image:url(' + tmp + ');"></div></div>');

    	for (var i = 1; i < data.currentCandidates.length; i++) {
    		list.append('<p>' + data.currentCandidates[i].first_name + ' ' + data.currentCandidates[i].last_name + '</p>');
    	}

    	list.fadeIn();
    }
}

$(document).ready(function() {
	hmh.init();
});