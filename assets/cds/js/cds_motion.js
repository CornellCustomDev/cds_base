/* CDS Motion Design (last update: 2/27/26)
   - -- 
   ------------------------------------------------------------------------- */

(function($){
	
	// Globals
	var tracking_scroll = true; // can be toggled on and off to tune scroll-tracking (e.g., "false" when a nav link is pressed, "true" during manual scrolling)
	
	/* Window Size Tracking
	-- ------------------------------------------------------------------ */
	function resizeChecksMotion() {
		
		// Parallax (vertical offset, reverse-proportional to scrolling)
		$('.cds-motion-parallax').each(function(i) {
			
			var element_height = $(this).height();
			if (element_height < 120) { // for small elements, use a minimum height to feed motion parameters below
				element_height = 120;
			}
		
			$(this).css('transform','translateY(0)');
			$(this).attr('data-offset-start', Math.round( $(this).offset().top - $(window).innerHeight() ));
			$(this).attr('data-offset-end', Math.round( $(this).offset().top + $(window).innerHeight() ));
		
			// @todo: the following calculations are serviceable, but could be better
			// -- the aim is to adjust the amount of animation distance to suit the size of the element and the device viewport
			$(this).attr('data-motion-multiplier', (element_height / 3) / $(window).innerHeight() );
			$(this).attr('data-motion-range', Math.round( element_height / 4 ));
		});
		
		// Reveals
		var default_reveal_at = 0.85; // trigger the element's reveal when it reaches the 85% point of the vertical viewport (15% from the bottom)
		
		$('.cds-motion-fadein, .cds-motion-slidein, .cds-motion-custom').each(function() {
			var reveal_at = default_reveal_at;
			if ( $(this).hasClass('cds-motion-onload') ) {
				reveal_at = 1; // reveal immediately on load
				//$(this).addClass('revealed');
			}
			
			// Reveal: Fade-in (simple, one-time fade-in when element is scrolled into view)
			if ( $(this).hasClass('cds-motion-fadein') ) {
				$(this).attr('data-reveal-start', Math.round( $(this).offset().top - $(window).innerHeight() * reveal_at ));
			}
			// Reveal: Slide-in (simple, one-time fade-in and vertical slide-in when element is scrolled into view)
			else if ( $(this).hasClass('cds-motion-slidein') ) {
				$(this).attr('data-reveal-start', Math.round( $(this).offset().top - $(window).innerHeight() * reveal_at ));
			}
			// Reveal: Custom (no animation is applied, just the "revealed" class when scrolled into view)
			else if ( $(this).hasClass('cds-motion-custom') ) {
				$(this).attr('data-reveal-start', Math.round( $(this).offset().top - $(window).innerHeight() * reveal_at ));
			}
		});
		
		scrollChecksMotion(); // include scroll updates too
	}
	
	/* Scroll Tracking
	-- ------------------------------------------------------------------ */
	function scrollChecksMotion() {
		
		if (tracking_scroll) {
			
			// Parallax
			$('.cds-motion-parallax').each(function() {
				var displace = parseInt($(this).attr('data-motion-range')) + ( parseInt($(this).attr('data-offset-start')) - $(window).scrollTop() ) * parseFloat($(this).attr('data-motion-multiplier'));
				$(this).css('transform','translateY(' + displace + 'px)');
			});
			
			// Reveals
			$('.cds-motion-fadein, .cds-motion-slidein, .cds-motion-custom').each(function() {
				if ( $(window).scrollTop() > $(this).attr('data-reveal-start') && !$(this).hasClass('revealed') ) {
					$(this).addClass('revealed');
				}
			});
		}
	}
	
	/* DOM Events
	-- ------------------------------------------------------------------ */
	$(document).ready(function() {
		
		if ( $('[class*=cds-motion-]').length > 0 ) {
			
			$('[class*=cds-motion-]').addClass('scripted'); // confirm the presence of JavaScript before hiding elements behind animation
			
			// Initialize and Track Events
			resizeChecksMotion();
			$(window).scroll(scrollChecksMotion);
			$(window).resize($.debounce( 200, function() { // throttle resize event (jquery.ba-throttle-debounce.js dependency)
				resizeChecksMotion();
			}));
			
			// Continued in the load event below...
		}
	});
	
	$(window).on('load', function() {
		
		// We want a second opinion on offsets and heights after all data is loaded.
		// We'll also add a brief delay, to ensure that jQuery's load event never occurs before the ready event, even when drawing from cache.
		// In testing, the calculations are not consistently accurate until after ~0.75 second. That's too long, so we'll settle for "close enough" with only a 0.01s delay.
		setTimeout( function() {
			resizeChecksMotion();
		}, 10); // 0.01s delay
	});
	
})(jQuery);