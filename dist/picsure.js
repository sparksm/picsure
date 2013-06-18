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
		this.oneEm = (function () {
			var a = $('<div/>').css({
				position: 'absolute',
				bottom: -1000,
				right: -1000,
				border: 'none',
				margin: 0,
				padding: 0,
				width: '1em'
			}).appendTo($('body'));
			var em = a.width();
			a.remove();
			return em;
		} ());

		this.original = this.$element.attr('src');
		this.setOptions();
		this.set = this.parseParams();
		if (!this.options.picture) {
			this.setPassed(this.tester(this.set));
			this.bind();
		}

	};

	$.picsure.settings = {
		picture: false,
		fluid: false
	};

	$.picsure.prototype = {

		bind: function () {
			var self = this;
			$(window).on('resize', function () {
				self.setPassed(self.tester(self.set));
			});
			$(document).on('load', 'img', function () {
				self.setPassed(self.tester(self.set));
			});
		},

		setOptions: function () {
			this.options = $.extend(true, {}, this.settings, this.options);
		},

		setPassed: function (passed) {
			var self = this;
			if (passed.length === 0) {
				if (self.$element.attr('src') !== self.original) {
					self.$element.attr('src', self.original);
				}
				return;
			}
			$.each(passed, function (i) {
				if (self.$element.attr('src') !== passed[i]) {
					self.$element.attr('src', passed[i]);
				}
			});
		},

		parseSrcset: function (str) {
			var srcset = $.trim(str);
			if (!srcset.match(' ')) {
				return srcset;
			}
			var members = srcset.split(',');
			var set = [];
//			console.log(media);
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
//			console.log(set);
			return set;
		},

		parseParams: function () {
			if (!this.options.picture) {
				var srcset = $.trim(this.$element.attr('srcset'));
//				console.log(this.parseSrcset(srcset));
				return this.parseSrcset(srcset);
			} else {
				this.$element.addClass('picsure_' + this.num);
				var self = this;
				var sources = this.$element.find('source');
//				var styles = [];
				$.each(sources, function (i) {
					var $src = $(sources[i]);
					var media = $src.attr('media');
					var srcset = $src.attr('srcset');
					var set = self.parseSrcset(srcset, media);
					if (typeof media !== 'undefined' && media !== '') {
						self.parseMedia(media, set);
					}
/*
					var bgImg = self.imageSetCss ? 'image-set(' + srcset + ')' : '';
					styles.push([
						'@media all and ', media, '{',
						'.picsure_', self.num, '{',
						'background-image: ', bgImg, ';',
						'}',
						'}'
					].join(''));
*/
				});
/*
				$('head:first()')
					.append([
						'<style>',
						styles.join(''),
						'</style>'
					].join(''));
*/
			}
		},

		parseMedia: function (media) {
			var self = this;
			var str = $.trim(media);
			var rules = str.split('and');
			$.each(rules, function (i) {
				var rule = $.trim(rules[i]);
				var key = $.trim(rule.split(':')[0]);
				if (key.indexOf('(') !== -1) {
					key = key.slice(key.indexOf('(') + 1);
				}
				var value = $.trim(rule.split(':')[1]);
				if (value.indexOf(')') !== -1) {
					value = value.slice(0, value.indexOf(')'));
				}
				var integer = value.match(/(\d.*?)(?!\d)/);
				var unit = value.substring(
					value.indexOf(integer[0]) + integer[0].length,
					value.length
				);
				integer = +(value.substring(
					value.indexOf(integer[0]),
					integer[0].length
				));
				var minMax = key.split('-')[0] || 'max';
				if (unit === 'em') {
					integer = integer * self.oneEm;
				}
				console.log(minMax, integer);
				//				var number = ;
			});
		},

		tester: function (set) {
			var self = this;
			var passed = [];
			$.each(set, function (i) {
				var result = true;
				$.each(set[i], function (j) {
					var condition = set[i][j];
					if (!self.testCondition(condition)) {
						result = false;
					}
				});
				if (result) {
					passed.push(set[i][0].pass);
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