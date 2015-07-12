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
            $('#issue-input, #instructions').remove();

            if (window.location.pathname.indexOf('about') == -1) {
                data.getNews(HMHQuery);
                data.getTweets(HMHQuery);

                            $('.donate .button').click(hmh.payment);
            }
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
        $('#instructions').slideUp({duration: 200, complete: function(){ this.remove(); }});

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
                data.getCharities();
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
        data.getCharities();
    },

    issueRemove: function(event)
    {
    	var target = $(event.currentTarget).parent();

    	target.slideUp({ complete: function()
        {
            this.remove(); 
            if ($('#current-issues .box').length) { 
                data.getCandidates();
                data.getCharities();
            } 
        }});

        $('#issue-input').autocomplete('dispose').autocomplete({
            lookup: hmh.notSelectedIssues(),
            onSelect: hmh.issueSelectedCallback
        });

        if ($('#current-issues .box').length == 1) {
            $('#recommendations').fadeOut();
            $('#current-issues .info').fadeOut({duration:200, complete:function() { this.remove();}});
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
        $('#recommendations-candidates .throbber-main').fadeOut(200);

    	var list = $('#recommendations-candidates');
        list.children(':not(.throbber-main)').remove();

    	list.append('<h3>Recommended presidential candidates</h3>');

    	for (var i = 0; i < data.currentCandidates.length; i++) {
            var c = $('<div class="candidate"><div class="portrait" style="background-image:url(' + data.currentCandidates[i].img_url + ');"></div><h4><a href="' + data.currentCandidates[i].url.replace('/api/', '/') + '">' + data.currentCandidates[i].first_name + ' ' + data.currentCandidates[i].last_name + '</a></h4><span class="clear"></span></div>');
    		list.append(c);
    	}
    },

    displayCharities: function()
    {
        $('#recommendations-charities .throbber-main').fadeOut(200);

        var list = $('#recommendations-charities');
        list.children(':not(.throbber-main)').remove();

        list.append('<h3>Recommended charities</h3>');

        if (!data.currentCharities.length) {
            list.append('<p class="info">No charities</p>');
        } else {
            for (var i = 0; i < data.currentCharities.length; i++) {
                var c = $('<p><a href="' + data.currentCharities[i].url.replace('/api/', '/') + '">' + data.currentCharities[i].name + '</a></p>');
                list.append(c);
            }
        }
    },

    displayTweets: function(response)
    {
        var list = $('#current-tweets');
        list.find('.throbber-loader').remove();

        if (!response.length) {
            list.append('<p class="info">No tweets</p>');
        } else {
            for (var i = 0; i < response.length; i++) {
                list.append('<div class="tweet box"><div class="img" style="background-image:url(' + response[i].imgUrl.replace('_normal', '_bigger') + ');"></div>'
                    + '<span class="author">@' + response[i].name + ':</span> ' + response[i].text + '</div>');
            }
        }
    },
    
    displayNews: function(response)
    {
        var list = $('#current-news');
        list.find('.throbber-loader').remove();

        if (!response.length) {
            list.append('<p class="info">No news</p>');
        } else {
            for (var i = 0; i < response.length; i++) {
                list.append('<div class="news box">' + response[i].title + '<br>' + $('<span>' + response[i].snippet + '</span>').text() + ' <a href="' + response[i].link + '" target="_blank">Read more</a></div>');
            }
        }
    },

    payment: function()
    {
        var donate = $('.donate .donate-form');
        donate.parent().find('.button').slideUp({
            duration: 200,
            callback: function() { this.remove();}
        });

        donate.find('.slider').slider({
          value: 20,
          min: 0,
          max: 500,
          slide: function( event, ui ) {
            donate.find('.amount').text( "$" + ui.value );
          }
        });
        donate.find('.amount').text( "$" + donate.find('.slider').slider( "value" ) );

        $('.donate .donate-form').slideDown();
    }
}

$(document).ready(function() {
	hmh.init();
});