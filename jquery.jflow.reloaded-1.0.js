/**
 * jquery.jflow.reloaded.js
 * @author: kidh0
 * @version: 1.0
 *
 * Created by Henrique Boaventura 2011-07-01. Please report any bug at http://www.hboaventura.com
 * 
 * Remake, refactor, bug fix and new features on the original jFlow plugin by 
 * Kean Loong Tan http://www.gimiti.com/kltan
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
	$.fn.jFlow = function(options) {
    var opts = $.extend({}, $.fn.jFlow.defaults, options);
	  var randNum = Math.floor(Math.random()*11);
  	var jFC = opts.controller;
  	var jFS =  opts.slideWrapper;
  	var jSel = opts.selectedWrapper;

    var local = $(this);

		var cur = 0;
		var timer;
		var maxi = $(jFC,$(this)).length;

		// sliding function
		var slide = function (dur, i) {
			$(opts.slides).children().css({
				overflow:"hidden"
			});
			$(opts.slides + " iframe").hide().addClass("temp_hide");
			$(opts.slides).animate({
				marginLeft: "-" + (i * $(opts.slides).find(":first-child").width() + "px")
				},
				opts.duration*(dur),
				opts.easing,
				function(){
					$(opts.slides).children().css({
						overflow:"hidden"
					});
					$(".temp_hide").show();
				}
			);

		}
		$(this).find(jFC).each(function(i){
			$(this).click(function(){
				dotimer();
				if ($(opts.slides).is(":not(:animated)")) {
					$(jFC).removeClass(jSel);
					$(this).addClass(jSel);
					var dur = Math.abs(cur-i);
					slide(dur,i);
					cur = i;
				}
			});
		});

		$(opts.slides).before('<div id="'+jFS.substring(1, jFS.length)+'"></div>').appendTo(jFS);
		$(opts.slides).find("div").each(function(){
			$(this).before('<div class="jFlowSlideContainer"></div>').appendTo($(this).prev());
		});

		//initialize the controller
		$(jFC,$(this)).eq(cur).addClass(jSel);

		var resize = function (x){
			$(jFS).css({
				position:"relative",
				width: opts.width,
				height: opts.height,
				overflow: "hidden"
			});
			//opts.slides or #mySlides container
			$(opts.slides).css({
				position:"relative",
				width: $(jFS).width()*$(jFC).length+"px",
				height: $(jFS).height()+"px",
				overflow: "hidden"
			});
			// jFlowSlideContainer
			$(opts.slides).children().css({
				position:"relative",
				width: $(jFS).width()+"px",
				height: $(jFS).height()+"px",
				"float":"left",
				overflow:"hidden"
			});

			$(opts.slides).css({
				marginLeft: "-" + (cur * $(opts.slides).find(":eq(0)").width() + "px")
			});
		}

		// sets initial size
		resize();

		// resets size
		$(window).resize(function(){
			resize();
		});

    //bind to the next/prev buttons the behavior 
		$(opts.prev, local).click(function(){
			dotimer();
			doprev();
		});
		$(opts.next, local).click(function(){
			dotimer();
			donext();
		});

		var doprev = function (x){
			if ($(opts.slides).is(":not(:animated)")) {
				var dur = 1;
				if (cur > 0)
					cur--;
				else {
					cur = maxi -1;
					dur = cur;
				}
				$(jFC,local).removeClass(jSel);
				slide(dur,cur);
				$(jFC,local).eq(cur).addClass(jSel);
			}
		}

		var donext = function (x){
			if ($(opts.slides).is(":not(:animated)")) {
				var dur = 1;
				if (cur < maxi - 1)
					cur++;
				else {
					cur = 0;
					dur = maxi -1;
				}
				$(jFC, local).removeClass(jSel);
				slide(dur, cur);
				$(jFC, local).eq(cur).addClass(jSel);
			}

		}

		var dotimer = function (x){
			if((opts.auto) == true) {
				if(timer != null)
					clearInterval(timer);
        		timer = setInterval(function() {
	                	$(opts.next,local).click();
						}, opts.duration);
			}
		}

		dotimer();
    //Pause/Resume at hover
		$(opts.slides).hover(
  		function() {
  		clearInterval(timer);
		},

		function() {
  		dotimer();
		}
		);
	};

	$.fn.jFlow.defaults = {
		controller: ".jFlowControl", // must be class, use . sign
		slideWrapper : "#jFlowSlide", // must be id, use # sign
		selectedWrapper: "jFlowSelected",  // just pure text, no sign
		auto: false, //auto slide
		auto_duration: 10000 //time between auto slide (ms)
		easing: "swing",
		duration: 400, //duration of the transition
		width: "100%",
		slides: '.jflow-content-slider',
		prev: ".jFlowPrev", // must be class, use . sign
		next: ".jFlowNext" // must be class, use . sign

	};

})(jQuery);

