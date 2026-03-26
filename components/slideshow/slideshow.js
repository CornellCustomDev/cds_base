(function (Drupal) {
	'use strict';
	
	Drupal.behaviors.slideshow = {
		attach: function (context, settings) {
			let headerSlider = document.querySelector("[data-slider-header='true']");
			if (headerSlider) {
				let header = document.querySelector("#header");
				header.classList.add("cds-slider");
				header.append(headerSlider);
			}
		},
	};
})(Drupal);