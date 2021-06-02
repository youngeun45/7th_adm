var $cont,$contPt;

$(function(){
	$cont = $('#contents');
	if($cont.length > 0){
		$contPt = parseInt($cont.css('padding-top'));
		$(window).resize(function(){
			$contPt = parseInt($cont.css('padding-top'));
		})
	}else{
		$contPt = 0;
	}
	
	headerUI();
	formStyle();
	tableUI();
	popupUI();
	tapMotion();
	topBtn();
	etcUI();
});

function headerUI(){
	var title = $('#pageTit').text();
	
	if(!title == ''){
		document.title = title + ' | 7번가피자 관리자';
	}
	var current = $.trim(title);
	//console.log(title);
	
	//gnb active
	gnbActive(current);
	
	$('#gnb>ul>li>a').click(function(e){
		if(!$(this).hasClass('open')){
			e.preventDefault();
			$(this).next('ul').stop().slideToggle().parent().toggleClass('on').siblings().removeClass('on').children('ul').slideUp();
		}
		
	});
	
	/*
	$('#gnb a').blur(function(){
		setTimeout(function(){
			if( !$('#gnb a').is(':focus') ) {
				 gnbReset();
			}
		},10);
	});	
	
	$('.gnb_wrap').mouseleave(function(){
		 gnbReset()
	})
	*/
	
	function gnbReset(){
		$('#gnb>ul>li').removeClass('on');
		$('#gnb>ul>li>ul').stop().slideUp();
		$('#gnb>ul>li.active>ul').stop().slideDown();
	}
};
function gnbActive(txt){
	$('#gnb a').each(function() {
		 if ( $(this).text() == txt) {
			$(this).parents('li').addClass('active').siblings('li').removeClass('active');
		}
	});
}

/*폼요소*/
function formStyle(){
	//checkbox, radio
	$('.checkbox input, .radio input').focus(function(){
		$(this).parent().addClass('on');
	}).blur(function(){
		$(this).parent().removeClass('on');
	});
	$('.radio .input').focus(function(){
		$(this).parent().parent('.radio').addClass('on');
		$(this).parent().parent('.radio').children('[name="discount"]').attr('checked','checked');
	})

	//datepicker
	if($('.datepicker').length > 0){
		$( '.datepicker' ).datepicker({
			closeText: '닫기',
			prevText: '이전달',
			nextText: '다음달',
			currentText: '오늘',
			monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			dateFormat: 'yy-mm-dd',
			showMonthAfterYear: true,
			showOn: 'both',
			buttonText: '기간조회'
		});
	}

	//inp_file
	$('.inp_file > input').focus(function(){
		$(this).closest('.inp_file').find('.btn_file input').trigger('click');
	});	
	$('.inp_file .btn_file .button').click(function(e){
		e.preventDefault();
		$(this).closest('.inp_file').find('.btn_file input').trigger('click');
	});	
	$('.inp_file .btn_file input').change(function(){
		$(this).closest('.inp_file').find('> input').val($(this).val());
	});


	if($('.inp_spinner').length > 0){
		$('.inp_spinner').each(function(){
			var $this = $(this),
				$min = $this.data('min'),
				$max = $this.data('max'),
				$input = $this.find('.input'),
				$inputVal = $input.val(),
				$btn = $this.find('.btn');
				
			$input.after('<select class="select" title="수량선택"><option value="0">직접입력</option></select>');
			var $select = $this.find('.select');
			
			//console.log($inputVal)			
			
			//세팅
			for(i = $min;i <= $max;i++){
				$select.append($('<option>',{value: i,text : i}));
			}
			if($inputVal == '' ||$inputVal == null){
				$input.val($min)
				$select.val($min);
			}

			//셀렉트
			$select.change(function(){
				var $val = $(this).val();
				if($val == '0'){
					$select.addClass('hide');
					$input.addClass('on').attr("readonly",false).focus();
				}else{
					$input.val($val);
				}
			})
			
			//숫자 입력시
			$input.change(function(){
				var $val = $(this).val();
				if($min <= $val && $val <= $max){
					$select.val($val).removeClass('hide');
					$input.removeClass('on').attr("readonly",true);
				}else{
					alert($min+'에서 '+$max+'까지만 입력 가능합니다.\n다시 입력해주세요')
					$input.val($min);
					$select.val($min);
				}
			})
			var $firstVal
			$input.focusin(function(){
				$firstVal = $(this).val();
			})
			$input.focusout(function(){
				var $lastVal = $(this).val();				
				if($firstVal == $lastVal){
					//console.log($firstVal,$lastVal)
					$select.val($lastVal).removeClass('hide');
					$input.removeClass('on').attr("readonly",true);
				}
			})
			
			//버튼 클릭
			$btn.click(function(e){
				e.preventDefault();
				var $val = $input.val(),
					$val2 = $select.val();
				if($(this).hasClass('btn_minus')){
					$val--;
					if($val < $min){
						alert('최소수량은 '+$min+'개 입니다.')
						$val = $min;
					}
				}else{
					$val++;
					if($val > $max){
						alert('최대수량은 '+$max+'개 입니다.')
						$val = $max;
					}
				}
				//var last = Math.max($min,Math.min($val,$max))
				
				$input.val($val);
				$select.val($val);
			})
		});
	}
	$(document).on('change','.chk_lst .lst-chk-all',function(){
		var $lst = $(this).closest('.chk_lst'),
			$chk = $lst.find('.lst-chk');

	    if($(this).prop('checked')){
	        $chk.prop('checked', true).closest('.checkbox').addClass('on');
	    }else{
	        $chk.prop('checked', false).closest('.checkbox').removeClass('on')
	    }
	});
}

/* 테이블 관련 */
function tableUI(){
	$(document).on('change','table .tbl-chk-all',function(){
		var $table = $(this).closest('table'),
			$chk = $table.find('tbody .tbl-chk');

	    if($(this).prop('checked')){
	        $chk.prop('checked', true).closest('tr').addClass('on');
	    }else{
	        $chk.prop('checked', false).closest('tr').removeClass('on')
	    }
	});
	$(document).on('change','table .tbl-chk',function(){
        var $table = $(this).closest('table'),
        	$thChk = $table.find('.tbl-chk-all'),
        	$tdChk = $table.find('.tbl-chk'),
        	$length = $tdChk.length,
        	$checked = $tdChk.filter(":checked").length;

        if( $length == $checked){
            $thChk.prop('checked', true);
        }else{
            $thChk.prop('checked', false);
        }

        if($(this).prop('checked')){
           $(this).closest('tr').addClass('on')
        }else{
           $(this).closest('tr').removeClass('on')
        }
    });
    
	//trClick
    $(document).on('click','.tr_click tbody tr',function(){
    	var $chk = $(this).find('.tbl-chk');

		$(this).toggleClass('on');
    	if($chk.length > 0){
			$chk.trigger('click');
    	}
    }).on('click','.tbl-chk',function(e) {
		e.stopPropagation();
	});;

    //tbl_row
	/*$(window).load(function(){
		if($('.tbl_row').length > 0){
			$('.tbl_row tbody tr:odd').addClass('even');
		}
    })*/
}	

//팝업
function popOpen(tar){
	var $speed = 300,
		$ease = 'easeOutQuart',
		$pop = $(tar).find('.popup');
	var $wrapH,$popH,$mT

	$('body').addClass('hidden');
	$(tar).fadeIn($speed);
	popPositin(tar)
	$(window).resize(function(){
		popPositin(tar)
	})
}

//공통 안내 팝업
function popAlert(msg, func){
	var tar = '#popAlert';
	var $speed = 300,
		$ease = 'easeOutQuart',
		$pop = $(tar).find('.pop_wrap');
	var $wrapH,$popH,$mT
	
	if(msg !== undefined){
		$('#alert_msg').html(msg);
	}
	if(func !== undefined){
		$('#alert_func').attr('onclick', func);
	}
	
	
	$('body').addClass('hidden');
	$(tar).fadeIn($speed);
	$(tar).css('z-index', 600);
	popPositin(tar)
	$(window).resize(function(){
		popPositin(tar)
	})
}

function popPositin(tar,speed){
	//console.log($(tar).attr('id'))
	var $wrapH = $(tar).height(),
		$pop = $(tar).find('.popup'),
		$popH = $pop.outerHeight(),
		$mT = Math.max(0,($wrapH-$popH)/2);
	
	$pop.css({'margin-top':$mT});
}
function popupUI(){
	$('.pop_open').click(function(e) {
		e.preventDefault();
		var pop = $(this).attr('href');
		popOpen(pop);
	});
	$('.pop_close').click(function(e) {
		e.preventDefault();
		var pop = $(this).closest('.pop_wrap');
		pop_close(pop);
	});
}
function pop_close(tar) {	
	$('body').removeClass('hidden');
	$(tar).fadeOut(300,function(){
		$(tar).find('.popup').removeAttr('style')
	})
}

function alertTip(tar,txt) {
	var $this = $(tar),
		$delay = 1000,
		$speed = 300;

	if($this.length > 0){
		var $left = $this.offset().left,
			$top = $this.offset().top,
			$width = $this.outerWidth(),
			$height = $this.outerHeight(),
			$tip = $('<div class="alert_tip" style="left:'+$left+'px;top:'+($top+$height)+'px;max-width:'+$width+'px">'+txt+'</div>')

		$('body').append($tip);
		//$tip.fadeIn($speed).delay($delay).fadeOut($speed,function(){		
		//	$tip.remove();
		//})
		$this.addClass('error').focus().delay($delay).queue(function(next){
			$this.removeClass('error');
			next();
		});
	}
}

function vaMid(tar){
	var $this = $(tar),
		$thisH = $this.outerHeight(),
		$parent = $this.parent(),
		$parentH = $parent.height(),
		$top = Math.max(0,($parentH-$thisH)/2);
	//console.log($parentH , $thisH, $top)

	$this.css({'top':$top});
}

/* 탭 */
function tapMotion(){
	var $tab = $('.tab_motion'),
		$wrap = $('.tab_wrap');
		
	$tab.on('click','a',function(e) {
		if(!$(this).parent().hasClass('on')){
			var href = $(this).attr('href');		
			$(href).show().siblings('.tab_cont').hide();
			$(this).parent().addClass('on').siblings().removeClass('on');
			$(this).parents('.tabmenu').removeClass('tab_open')
		}else{
			$(this).parents('.tabmenu').toggleClass('tab_open')
		}
		e.preventDefault();
    });
	
	
	$(window).load(function(){
		var speed = 500,
			$href = location.href,
			$tabId = $.url($href).param('tabId'),
			$tabIdx = $.url($href).param('tabIdx'),
			$SclId = $.url($href).param('SclId'),
			$id = $('#'+$SclId);
			
		if($tab.length > 0){	
			$tab.each(function(index, element) {
				var $this = $(this),
					$id2 = $this.attr('id');
				if($id2 == $tabId && $tabIdx > 0){
					$this.children('li').eq($tabIdx).find('a').trigger('click');
				}else{
					$this.children('li').eq(0).find('a').trigger('click');
				}
			});
		}

		if($id.length > 0 && $id.is(':visible')){
			var $top = $id.offset().top;
			$(window).scrollTo($top-$contPt,speed);
		}
	

		if($wrap.length > 0){
			$(window).scroll(function(){
				var $scrollTop = $(this).scrollTop();

				$wrap.each(function(index, element){
					var $this = $(this),
						$top2 = $this.offset().top,
						$st = Math.floor($top2 - $contPt);
					//console.log(index,$scrollTop,$contPt,$st)
					if($st <= $scrollTop){
						//console.log(index)
						$this.addClass('fixed');
					}else{
						$this.removeClass('fixed');
					}
				});
			})
		}
	})
	
}


/* TOP 버튼 */
function topBtn(){
	var settings ={
			button		:'#btnTop',
			text		:'컨텐츠 상단으로 이동',
			min			:100,
			fadeIn		:400,
			fadeOut		:400,
			scrollSpeed :800,
			easingType  :'easeInOutExpo'
		}

	$('body').append('<a href="#" id="' + settings.button.substring(1) + '" title="' + settings.text + '"><i class="fa fa-arrow-up" aria-hidden="true"></i><span class="blind">' + settings.text + '</span></a>');
	$(settings.button).on('click', function(e){
		$('html, body').animate({scrollTop :0}, settings.scrollSpeed, settings.easingType);
		e.preventDefault();
	})
	.on('mouseenter', function(){
		$(settings.button).addClass('hover');
	})
	.on('mouseleave', function(){
		$(settings.button).removeClass('hover');
	});

	$(window).scroll(function(){
		var position = $(window).scrollTop();
		if(position > settings.min){$(settings.button).fadeIn(settings.fadeIn);}
		else{$(settings.button).fadeOut(settings.fadeOut);}
	});
}

function etcUI(){
	//faq_list
	$('.faq_list').on('click','> dt > a',function() {
		$(this).parent('dt').toggleClass('on').siblings('dt').removeClass('on');
		$(this).parent().next().slideToggle(300).siblings('dd').slideUp(300);
		return false;
	});	
	$('.faq_list').on('click','>li> p>a',function(){
		$(this).parent().next('div').slideToggle(300).parent().toggleClass('on').siblings('li').removeClass('on').children('div').slideUp(300);
		return false;
	});	

	// 숫자 업시키는 클래스 .countUp
	if($('.countUp').length > 0){
		$(window).load(function(){
			$('.countUp').counterUp({
				delay:10,
				time:1000
			});
		})
	}

	//tooltip
	$(document).tooltip({
      items:".tooltip, .tooltip-img, [data-tooltip-img]",
	  track:true,
      content:function() {
        var element = $( this );
        if(element.is( "[data-tooltip-img]" ) ) {
			var img = element.data('tooltip-img'),
				alt = element.data('tooltip-alt');			
			return "<img src='"+ img +"' alt='"+alt+"'>";
        }        
        if(element.hasClass("tooltip-img")){
			return element.attr("alt" );
        }
		if(element.hasClass("tooltip")){
			return element.attr("title");
        }
      }
    });

	//btn_scroll
	$('.btn_scroll').click(function(e){
		e.preventDefault();
		var $speed = 500,
			$href = $(this).attr('href'),
			$id = $($href);

		if($id.length > 0 && $id.is(':visible')){
			var $top = $id.offset().top;
			$(window).scrollTo($top-$contPt,$speed);
		}
	})
	
	$(document).on('click','.img_file img',function(){
		imgWindow(this);
	})
	

	$('.menuView').on('click',function(e){
		e.preventDefault();
		var menuDetail = $(this).next(),
			$arr = $(this).children('.fa');

		menuDetail.slideToggle(300);
		if(!$arr.hasClass('on')){
			$arr.addClass('on');
		} else {
			$arr.removeClass('on');
		}
		return false;
	})
	$('.menuViewAll').on('click',function(e){
		e.preventDefault();
		var menuList = $('.menuView').next(),
			$arr = $('.menuView').children('.fa'),
			$allArr = $(this).children('.fa');

		if(menuList.is(':hidden')){
			menuList.slideDown(300);
			$arr.addClass('on');
			$allArr.addClass('on');
		}else{
			menuList.slideUp(300);
			$arr.removeClass('on');
			$allArr.removeClass('on');
		}
	})
}

function imgWindow(tar){
	var src = $(tar).attr('src'),
		imgW = $(tar).get(0).naturalWidth,
		imgH = $(tar).get(0).naturalHeight,
		gap = 16; //body margin
	console.log(imgW,imgH)
	var imgWindow = window.open("", "_image_view_", "width="+(imgW+gap)+", height="+(imgH+gap));
	imgWindow.document.write("<img src='"+src+"'>");
}

function loadingShow(){
	var $loading = $('<div id="loading"><div><p>G</p><p>N</p><p>I</p><p>D</p><p>A</p><p>O</p><p>L</p></div></div>'),
		$id = $('#loading');
	
	if($id.length == 0){
		$('body').append($loading);
	}
	
}

function loadingHide(){
	var $id = $('#loading');
	$id.remove();
}


/*17.07 Aida 김영은*/
$(function(){
	//현재 날짜
	var $date = $('.date')
	if($date.length > 0){
		var myDate = new Date()
		var year = myDate.getYear()
		var month = myDate.getMonth() +1
		var day = myDate.getDate()
		var dday=new Array('일','월','화','수','목','금','토');
		var weekend = myDate.getDay();
		//var hours = myDate.getHours();
		//var min = myDate.getMinutes();
		year = (year < 1000) ? year + 1900 : year;
	    $('.head_timer .date').html( "<span><b>" + year + "</b>년</span><span><b>" + month + "</b>월</span><span><b>" + day +  "</b>일</span><span>"+ dday[weekend] + "요일</span>") 
		var clock = $('.head_timer .clock').FlipClock({
			clockFace: 'TwentyFourHourClock'
		});
	}
});
/*//17.07 Aida 김영은*/

