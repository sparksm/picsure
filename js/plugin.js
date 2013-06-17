/* global jQuery:true,console:true,window:true,document:true*/
(function ($) {
	'use strict';

	console.log($);

	$.picsure = function (options, element) {
		this.$element = $(element);
		this.options = options;
		this.num = Math.round(Math.random() * 1E20);
		this.density = +(window.devicePixelRatio) || 1;
		this.imageSetCss = (function () {
			var a = document.createElement('div');
			a.style.backgroundImage = '';
			a.style.backgroundImage = '-webkit-image-set(url() 1x)';
			if (a.style.backgroundImage !== '') {
				return true;
			}
			return false;
		} ());

		this.original = this.$element.attr('src');
		this.setOptions();
		this.set = this.parseParams();
		if (!this.options.picture) {
			this.passed = this.tester();
			this.setPassed();
			this.bind();
		}

	};

	$.picsure.settings = {
		picture: false
	};

	$.picsure.prototype = {

		bind: function () {
			var self = this;
			$(window).on('resize', function () {
				self.passed = self.tester();
				self.setPassed();
			});
		},

		setOptions: function () {
			this.options = $.extend(true, {}, this.settings, this.options);
		},

		setPassed: function () {
			var self = this;
			if (self.passed.length === 0) {
				if (self.$element.attr('src') !== self.original) {
					self.$element.attr('src', self.original);
				}
				return;
			}
			$.each(self.passed, function (i) {
				if (self.$element.attr('src') !== self.passed[i]) {
					self.$element.attr('src', self.passed[i]);
				}
			});
		},

		parseParams: function () {
			if (!this.options.picture) {
				var srcset = $.trim(this.$element.attr('srcset'));
				if (!srcset.match(' ')) {
					return srcset;
				}
				var members = srcset.split(',');
				var set = [];
				$.each(members, function (i) {
					var value = '';
					var conditions = [];
					var params = $.trim(members[i]).split(' ');
					$.each(params, function (j) {
						if (j === 0) {
							value = params[j];
							return;
						}
						var lastChar = params[j][params[j].length - 1];
						if (lastChar.match(/[whx]/)) {
							conditions.push({
								type: lastChar,
								value: +(params[j].slice(0, params[j].length - 1)),
								pass: value
							});
						}
					});
					set.push(conditions);
				});
				return set;
			} else {
				this.$element.addClass('picsure_' + this.num);
			}
		},

		tester: function () {
			var self = this;
			var passed = [];
			$.each(self.set, function (i) {
				var result = true;
				$.each(self.set[i], function (j) {
					var condition = self.set[i][j];
					if (!self.testCondition(condition)) {
						result = false;
					}
				});
				if (result) {
					passed.push(self.set[i][0].pass);
				}
			});
			return passed;
		},

		testCondition: function (test) {
			switch (test.type) {
			case 'w':
				if ($(window).width() < test.value) {
					return true;
				}
				return false;
			case 'h':
				if ($(window).height() < test.value) {
					return true;
				}
				return false;
			case 'x':
				if (this.density === test.value) {
					return true;
				}
				return false;
			default:
				return false;
			}
		}

	};

	$.fn.picsure = function (options) {
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function () {
				var instance = $.data(this, 'picsure');
				if (!instance) {
					$.error('Cannot call "' + options + '" method prior to initialization.');
					return;
				}
				if (!$.isFunction(instance[options])) {
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
				$.data(this, 'picsure', new $.picsure(options, this));
			});
		}
		return this;
	};

	$(function () {
		var imgs = $('img:not(picture img)');
		var pix = $('picture');
		imgs.picsure();
		pix.picsure({
			picture: true
		});
	});

}(jQuery));