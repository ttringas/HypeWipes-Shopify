/* 
MakeTextFit.js  v0.6
Description: Targets a fixed-width, single line element of text. If the text is too long, it will be reduced in font-size until it fits perfectly.
If it reaches the minimum defined font-size and still doesn't fit, it will be truncated until it does fit. If the text fills less than the defined
percentage of the area, it will grow the font-size until it fits or until it reaches the maximum defined font-size.

Author: Derrick Pelletier
Date: Monday Aug 08

*/


$.fn.makeTextFit = function(options)
{
	return this.each(function() {
		var opts = $.extend({ min_size: null, max_size: null, compression: 1, truncation_string: "...",	ignored_percentage: .95, full_words:false,	animate: false,	animation_speed: 100, animation_easing: "linear"}, options);
		var $target = $(this);
		$target.attr("title", $target.html());
		$target.css({"white-space":"nowrap","overflow":"hidden"});
		var target_width = $target.outerWidth();
		var current_size = parseFloat($target.css("font-size"));
		opts.min_size = (opts.min_size == null) ? current_size - 8 : opts.min_size;
		opts.max_size = (opts.max_size == null) ? current_size + 8 : opts.max_size;
		var unit_type = $target.css("font-size").substring(current_size.toString().length);
		var modifier = (unit_type == "em") ? .1 : 1;
		$target.append("<div class='makeFitHidden'><span>" + $target.html() + "</span></div>");
		var $hid = $target.find(".makeFitHidden:first").css({"visibility":"hidden","width":target_width,"font-size":current_size+unit_type});
		var $inner = $target.find("span:first");
		function currentWidth() {
			return $inner.outerWidth() * opts.compression;
		}
		function shrinkAndGrow(checking) {
			while(current_size < opts.max_size && ( currentWidth() < target_width && currentWidth()/target_width < opts.ignored_percentage ) ){
				$hid.css("font-size", (current_size += modifier)+unit_type);
			}
			while(current_size > opts.min_size && currentWidth() > target_width){
				$hid.css("font-size", (current_size -= modifier)+unit_type);
			}
			if(currentWidth() > target_width) {
				var sans_trunc = $inner.html();
				while(currentWidth() > target_width) {
					if(opts.full_words) {
						sans_trunc = sans_trunc.substring(0, sans_trunc.lastIndexOf(" "));
					} else {
						sans_trunc = $.trim(sans_trunc.substring(0, sans_trunc.length - 1));
					}
					$inner.html( sans_trunc + opts.truncation_string );
				}
			}
			if(checking) {
				$target.html($inner.html()).animate({ fontSize: current_size}, ((opts.animate) ? opts.animation_speed : 0) ,opts.animation_easing);
			} else {
				shrinkAndGrow(true);
			}
		}
//		if( ( currentWidth() < target_width && currentWidth()/target_width < opts.ignored_percentage ) || (currentWidth() > target_width) ) {
			shrinkAndGrow();
//		}
//		$target.hide().css("visibility","visible").fadeIn("fast");
	});
};