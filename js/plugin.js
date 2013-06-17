/* global jQuery:true,console:true*/
(function ($) {
	'use strict';

	console.log($);

	$.picsure = function (options, element) {
		this.$element = $(element);
	};

	$.picsure.settings = {};

	$.picsure.prototype = {};

	$.fn.picsure = function (options) {
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function () {
				var instance = $.data(this, 'picsure');
				if (!instance) {
					$.error('Cannot call "' + options + '" method prior to initialization.');
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
					$.error('No such method "' + options + '"');
					return;
				}
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function () {
				var instance = $.data(this, 'picsure');
				if (instance) {
					instance.destroy();
				}
				$.data(this, 'picsure', new $.knot(options, this));
			});
		}
		return this;
	};

}(jQuery));