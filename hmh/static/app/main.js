var hmh = {
	init: function()
	{
		function csrfSafeMethod(method) {
		    // these HTTP methods do not require CSRF protection
		    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		}
		$.ajaxSetup({
		    beforeSend: function(xhr, settings) {
		        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
		            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
		        }
		    }
		});

		data.getIssues();
	},

    notSelectedIssues: function()
    {
        var current = $('#current-issues');
        var lookupData = [];
        for (var i = 0; i < data.issues.length; i++) {
            if (!current.find('.box[data-id="' + data.issues[i].id + '"]:not(:animated)').length) {
                lookupData.push({ value: data.issues[i].short_desc, data: i });
            }
        }
        return lookupData;
    },

	issueSelectedCallback: function(suggestion)
	{
        $('body').removeClass('initial');
        
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

        var list = $('#current-issues');

        var item = $('<div class="box" style="display:none;" data-id="' + data.issues[suggestion.data].id + '"></div>');
        item.append('<div class="close"><i class="fa fa-times"></i></div>');
        item.append('<h4>' + data.issues[suggestion.data].short_desc + '</h4>');
        item.append('<div class="slider-wrapper" data-toggle="tooltip" data-placement="left" title="' + data.issues[suggestion.data].min_label + '">'
        	 + '<div class="slider-wrapper" data-toggle="tooltip" data-placement="right" title="' + data.issues[suggestion.data].max_label + '">'
        	 + '<div class="slider"></div></div></div>');
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
		item.find('.slider').tooltip();
		item.find('.slider-wrapper').tooltip();


		item.find('.close').click(hmh.issueRemove);

        list.prepend(item);

		$('#issue-input').val('');
        $('#issue-input').autocomplete('dispose').autocomplete({
            lookup: hmh.notSelectedIssues(),
            onSelect: hmh.issueSelectedCallback
        });

        item.slideDown();

		data.getCandidates();
    },

    issueRemove: function(event)
    {
    	var target = $(event.currentTarget).parent();

    	target.slideUp({ complete: function() { data.getCandidates(); this.remove(); }});

        $('#issue-input').autocomplete('dispose').autocomplete({
            lookup: hmh.notSelectedIssues(),
            onSelect: hmh.issueSelectedCallback
        });
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

    	list.append('<h3>Recommended presidential candidate</h3>');
    	list.append('<div class="first-candidate"><h4>' + first.first_name + ' ' + first.last_name + '</h4><div class="portrait" style="background-image:url(' + first.img_url + ');"></div></div>');

    	for (var i = 1; i < data.currentCandidates.length; i++) {
    		list.append('<p>' + data.currentCandidates[i].first_name + ' ' + data.currentCandidates[i].last_name + '</p>');
    	}

    	list.fadeIn();
    },

    initPayment: function()
    {
    	var container = $('<div class="payment box" style="display:none;"></div>');

        container.append('<form id="checkout" method="post"><div id="payment-form"></div><input type="submit" value="Pay $10"></form>');
        container.find('#checkout').submit(hmh.paymentSubmit);

    	$('body').append(container);

    	data.getPaymentToken();

    	container.fadeIn();


    },

    paymentSubmit: function(event)
    {
    	event.preventDefault();

    	var obj = {
    		'payment_method_nonce': $('.payment input[name="payment_method_nonce"]').val()
    	}

    	data.postPaymentData(obj);

    	return false;
    }
}

$(document).ready(function() {
	hmh.init();
});