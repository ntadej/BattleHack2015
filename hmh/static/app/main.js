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

        if (window.location.pathname == '/') {            
            data.getIssues();
        } else {
            $('body').removeClass('initial');
            $('#issue-input').remove();

            data.getNews(HMHQuery);
            data.getTweets(HMHQuery);

            $('.donate .button').click(function() { $('.donate .donate-form').slideDown(); })
        }
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

        if (!list.find('.box').length) {
            var inn = $('<div class="info" style="display:none;">Set your preferences using sliders.</div>');
            list.append(inn);
            inn.fadeIn();
        }

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

        $('#recommendations').fadeIn();
		data.getCandidates();
    },

    issueRemove: function(event)
    {
    	var target = $(event.currentTarget).parent();

    	target.slideUp({ complete: function()
        {
            this.remove(); 
            if ($('#current-issues .box').length) { 
                data.getCandidates();
            } 
        }});

        $('#issue-input').autocomplete('dispose').autocomplete({
            lookup: hmh.notSelectedIssues(),
            onSelect: hmh.issueSelectedCallback
        });

        if ($('#current-issues .box').length == 1) {
            $('#recommendations').fadeOut();
        }
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
        $('#recommendations .throbber-main').fadeOut(200);

    	var list = $('#recommendations');
        list.children(':not(.throbber-main)').remove();

    	list.append('<h3>Recommended presidential candidates</h3>');

    	for (var i = 0; i < data.currentCandidates.length; i++) {
            var c = $('<div class="candidate"><div class="portrait" style="background-image:url(' + data.currentCandidates[i].img_url + ');"></div><h4><a href="' + data.currentCandidates[i].url.replace('/api/', '/') + '">' + data.currentCandidates[i].first_name + ' ' + data.currentCandidates[i].last_name + '</a></h4><span class="clear"></span></div>');
    		list.append(c);
    	}
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
    },

    displayTweets: function(response)
    {
        var list = $('#current-tweets');

        for (var i = 0; i < response.length; i++) {
            list.append('<div class="tweet box"><div class="img" style="background-image:url(' + response[i].imgUrl.replace('_normal', '_bigger') + ');"></div>'
                + '<span class="author">@' + response[i].name + ':</span> ' + response[i].text + '</div>');
        }
    },
    
    displayNews: function(response)
    {
        var list = $('#current-news');

        for (var i = 0; i < response.length; i++) {
            list.append('<div class="news box">' + response[i].title + '<br>' + $('<span>' + response[i].snippet + '</span>').text() + ' <a href="' + response[i].link + '" target="_blank">Read more</a></div>');
        }
    }
}

$(document).ready(function() {
	hmh.init();
});