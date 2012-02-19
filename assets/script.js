IE9 = (navigator.appVersion.indexOf("MSIE 9.")==-1) ? false : true;
function centerLoader(targ)
{
	if(IE9 == true) {
		var osrc = $(targ).attr("src");
		$(targ).attr('src', osrc.substring(0, osrc.lastIndexOf('?')));
	}
	$(targ).parent().imagesLoaded( function(){runCenter(targ);});
}
function runCenter(targ){
	if($(targ).outerWidth() == 0) return;
	var w = $(targ).parent().outerWidth();
	var h = $(targ).parent().outerHeight();
	var i_w = $(targ).outerWidth();
	var i_h = $(targ).outerHeight();
	var r = w/h;
	if($(targ).outerWidth()/$(targ).outerHeight() > r) {
		$(targ).attr("height", Math.min(h, i_h));
	} else {
		$(targ).attr("width", Math.min(w, i_w));
	}
	$(targ).css("left", "50%");	
	$(targ).css("margin-left", "-" + $(targ).outerWidth()/2 + "px");
	$(targ).css("top", "50%");
	$(targ).css("margin-top", "-" + $(targ).outerHeight()/2 + "px");
	$(targ).fadeTo("normal",1);
}
$(".center_img img").each(function(){centerLoader(this);});
$(function(){ $("#home_side select").uniform({selectClass: 'homeselector'}); });
$(function(){ $(".uniform").uniform({selectClass: 'selector'}); });

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}



$(document).ready(function(){
	$("input[placeholder]").each(function(){
		$(this).val($(this).attr("placeholder"));
		$(this).focus(function(){
			if($(this).val() == $(this).attr("placeholder")) {
				$(this).val("");
			}
		});
		$(this).blur(function(){
			if($(this).val() == "") {
				$(this).val($(this).attr("placeholder"));
			}
		});
	});
	
	
	
	
	
		
	$("#marquee_price").makeTextFit({min_size:10, max_size:57});
	// Masonry
	if(!$("html:first").hasClass("ie7")) {

		var $container = $('.masonry:first');
		
		$container.imagesLoaded( function(){
		  $container.masonry({
		    itemSelector : '.large_product'
		  });
		});
	}
	$("#nav ul li ul").each(function(){
		if($(this).find("li").length < 2) return;
		var li = $(this).parent();
		$(li).css("z-index","1000");
		if($("html:first").hasClass("oldie")) {
			$(this).find("li a").css("background", "#000000");
		} else {
			$(this).find("li a").css("background", "rgba("+hexToR("#000000")+","+hexToG("#000000")+","+hexToB("#000000")+",0.75)");
		}
		$(this).find("li").eq(1).addClass("first");
		$(this).find("li:last").addClass("last");
		
		
		var t = $(this).find("li:first").get();
		
		var paper = Raphael($(this).find("li:first").get(0), 254, 10);

		var c = paper.path("M127 0L137 10L117 10 Z");
		c.attr({"stroke-width": 0, fill:"#000000", "stroke-opacity":0, "stroke":null, "opacity":.75});
		
		$(li).hover(
			function(){
				$(li).addClass("hover");
			},
			function(){
				$(li).removeClass("hover");
			});
	});
	$("#product-photos").makeProductImages($("#image"));
	if(!$("html:first").hasClass("oldie")) {
		$(".large_product_sale").each(function(){
			var R = Raphael($(this).get(0), 300, 300);
			var c = R.rect(0,0,122,23);
			c.attr({stroke: null, "stroke-width":0, fill:"#FFF"});	
			c.rotate(45);
			c.translate(-7,22);
				var t = R.text(0, 0, "ON SALE").attr({
				"font": 'bold 14px Arial',
				"fill":accent_color,
				"stroke-width":0
				});
			t.rotate(45);
			t.translate(50,32);
		});
	}
});
$("select.loc_on_change").change(function(){
	if($(this).attr("value") == "#") return false;
	window.location = $(this).attr("value");
	
});
$.fn.makeProductImages = function(imgs)
{
	return this.each(function() {
		var $this = $(this);
		var $imgs = $(imgs);
		var current_image = 0;
		if( img_data.length <= 1 ) return;
		$active = $imgs.find("a:first");
		var waiting = false;
				
		$this.find("ul li a").each(function(n){
			$(this).attr('data-index',n);
			$(this).click(function(){
				if(waiting) return false;
				waiting = true;
				$this.find("ul li.active").removeClass("active");
				$(this).parent().addClass("active");
				showNewImage(n);
				return false;
			});
		});
		function showNewImage(n) {
			$imgs.css("height", $active.outerHeight());
			$active.fadeOut("fast",function(){
				loadImage(n);
			});
		}
		function loadImage(n) {
			if( img_data[n].loaded ) {
				showImage(n);
			} else {
				$("#photo-frame-bottom .cropper").addClass("loading");
				$imgs.append('<a href="" id="product-img-'+n+'"><img src=""  class="product-photo-large" /></a>');
				var html = $("#product-img-"+n).hide();
				$(html).fancybox();
				$(html).find("img:first").load(function(){
					img_data[n].loaded = true;
					$("#photo-frame-bottom .cropper").removeClass("loading");
					showImage(n);
				});
				$imgs.addClass("loading");
				$(html).attr("href", img_data[n].src);
				$(html).find("img:first").attr("src", img_data[n].src);
			}
		}
		function showImage(n) {
			$active.removeClass("active");
			$active = $("#product-img-"+n);
			$active.css("position","absolute");
			$imgs.animate({height:$active.outerHeight()},"fast",function(){
				$imgs.removeClass("loading");
				$("#product-img-"+n).fadeIn("normal", function(){
					
				$("#product-img-"+n).css("width", $("#product-img-"+n+ " img:first").outerWidth());
				waiting=false;
				}).addClass("active");
			});
		}
	});	
}



$.fn.slideshow = function()
{
	return this.each(function(){
		var $this = $(this);
		var $slides = $this.find(".slide");
		var current_slide = 0;
		var height_set = false;
		var delay = 5000;
		var speed = 250;
		var z = 101;
		$(".svg_tag").each(function(){
			drawTag($(this).attr("id"));
		});
		if($slides.length < 2) return;
		
		function nextSlide() {
			if(!height_set) {
				if($slides.eq(0).outerHeight() == 0) {
					setTimer();
					return;
				} 
				$this.css("height", $slides.eq(0).outerHeight());
				$slides.css("position", "absolute");
			}
			
			$slides.eq(current_slide).find(".slide_content").fadeTo(speed,0);
			current_slide++;
			if(current_slide > $slides.length - 1) current_slide = 0;
			var $next_slide = $slides.eq(current_slide);
			$next_slide.find(".slide_content").hide();
			$next_slide.css("display", "none").css("z-index", ++z).fadeIn(speed);
			$next_slide.find(".slide_content").clearQueue().delay(speed * .75).fadeTo(speed, 1);
			setTimer();
		}
		
		function setTimer(){
			setTimeout(function(){nextSlide()}, delay);	
		}
		setTimer();
		
		
				
	});
}


function drawTag(targ) {
	var paper = Raphael(targ, 161, 90);
	var st = paper.set();
	st.push(
		paper.path("M 7.12 0.00 L 124.35 0.00 C 126.36 0.62 128.21 1.75 129.52 3.43 C 139.36 15.30 149.03 27.30 158.86 39.18 C 159.89 40.38 160.57 41.83 161.00 43.35 L 161.00 47.38 C 159.94 50.57 157.40 52.87 155.35 55.43 C 146.91 65.63 138.45 75.82 130.01 86.02 C 128.52 87.90 126.55 89.41 124.20 90.00 L 7.13 90.00 C 3.54 89.30 0.69 86.46 0.00 82.87 L 0.00 7.12 C 0.70 3.54 3.54 0.70 7.12 0.00 Z")
	);
	st.attr({"stroke-width": 0, fill: accent_color, "stroke-opacity":0, "stroke":null});
	var c = paper.circle(144,45,6);
	c.attr({"stroke-width": 0, fill:"#FFF", "stroke-opacity":0, "stroke":null});	
}