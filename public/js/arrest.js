
window.fbAsyncInit = function() {
	var app_id = '158882867626709';
	FB.init({appId: app_id, status: true, oauth: true, cookie: true, xfbml: true});

	$('#fb-friend').click(function(){
		FB.getLoginStatus(function(response) {
			console.log(response);
			if (response.status === 'connected') {
				FB.api('/me/friends',{locale:'ja'}, function(response){
					var friends = $(response.data).map(function(i, o){
						//$('#friends').append('<tr><td>'+o.name+'</td></tr>');
						//return {value: o.name};
						return {value: o.name};
					}).get();
					$('#name').autoComplete('direct-supply', friends, 'local');
				});
			} else {
				FB.login();
			}
		});
	});

	$('#fb-send').click(function(){
		$('#result .section1').fadeOut('normal', function(){
			$('#result .section2').fadeIn('normal', function(){
				$('#clipboard-copy').zclip({
					path: '/libs/zclip/ZeroClipboard.swf',
					copy: $('#message-template').text(),
					afterCopy: function(){
						$(this).parent().find('span').show().delay(1000).fadeOut('slow');
					}
				});
			});
		});

		FB.getLoginStatus(function(response) {
			console.log(response);
			if (response.status === 'connected') {
				FB.api('/me/friends',{locale:'ja'}, function(response){
					$(response.data).each(function(i, o){
						var tag = '<li id="'+o.id+'"><a href="#"><i class="icon-user"></i>'+o.name+'</a></li>';
						$(tag).click(function(){
							var param = {
								method: 'feed',
								//app_id: app_id,
								to: this.id,
								//link: 'http://arrest.ryun.jp/',
								picture: location.protocol+'//'+location.host+$('#arrest-sheet').attr('src'),
								//caption: $('title').text(),
								//description: $('meta[name=description]').attr('content'),
								//display: 'iframe'
							};
							FB.ui(param, function(response){
								console.log(response);
								if (response && response.post_id) {
									$('.modal-backdrop').click();
								} else {
									alert('error.');
								}
							});
						}).appendTo('#fb-friend-list');
					});
				});
			} else {
				FB.login();
			}
		});

	});

}

jQuery.ajaxSetup({ cache: false, beforeSend: function(xhr){
	xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
}});
$(function(){
	var arrest_id;

	$('#make').click(function(){
		$('#main .section1').fadeOut();
		$('.jumbotron').animate({height:$('#main .section2').height()}, 'normal', function(){
			$('#main .section2').fadeIn();
		});
	});

	$('#cancel').click(function(){
		$('#main .section2').fadeOut();
		$('.jumbotron').animate({height:$('#main .section1').height()}, 'normal', function(){
			$('#main .section1').fadeIn();
		});
	});

	$('#build').click(function(){
		$('#result').find('.section1').show();
		$('#result').find('.section2, .section3').hide();
		$('#result .switch').show();

		$('#main .section2').fadeOut('normal', function(){
			$('#main .section3').fadeIn();
		});
		$.post('api/arrest/add', $('form').serialize(), function(json){
			arrest_id = json.id;
			$('#arrest-sheet').load(function(){
				$(this).unbind('load');
				$('#main .section3').fadeOut('normal', function(){
					$('#result').modal();
					$('.jumbotron').animate({height:$('#main .section1').height()}, 'normal', function(){
						$('#main .section1').fadeIn();
					});
				});
			});
			$('#arrest-sheet').attr('src','/api/arrest/image/'+arrest_id);
		}, 'JSON');
	});
	
	$('#download').click(function(){
		location.href='/api/arrest/download/'+arrest_id;
		$('.modal-backdrop').click();
	});

	$('#contact').click(function(){
		alert('問い合わせんなバーカ');
	});


	$('#latest-list tr').click(function(){

		$('#result .switch').hide();
		$('#main .section1').fadeOut();
		$('.jumbotron').animate({height:$('#main .section3').height()}, 'normal', function(){
			$('#main .section3').fadeIn();
		});

		var arrest_id = this.id;
		$('#arrest-sheet').load(function(){
			$(this).unbind('load');
			$('#result').modal();
			$('#main .section3').fadeOut();
			$('.jumbotron').animate({height:$('#main .section1').height()}, 'normal', function(){
				$('#main .section1').fadeIn();
			});
		});
		$('#arrest-sheet').attr('src','/api/arrest/image/'+arrest_id);
	});

	$('#fb-cancel').click(function(){
		$('#result .section2').fadeOut('normal', function(){
			$('#result .section1').fadeIn();
		});
	});

	$('#name').autoComplete({ajax: ''});
	$('#address').autoComplete({ajax: 'api/suggest/prefecture'});
	$('#guilty_name').autoComplete({ajax: 'api/suggest/guilty'});
	$('#custody_place').autoComplete({ajax: 'api/suggest/police'});

	$('[name=name]').val('犯罪 花子');
	$('[name=age]').val('40');
	$('[name=address]').val('東京都');
	$('[name=job]').val('自営業');
	$('[name=guilty_name]').val('窃盗');
	$('[name=custody_place]').val('網走刑務所');
	$('[name=expire_d]').val('2013-05-30');



});
