/*global module:true*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					port: 3000,
					base: './'
				}
			}
		},

/*
		compass: {
			static: {
				options: {
					sassDir: 'src/scss',
					cssDir: 'static/css',
					imagesDir: 'static/images',
					fontsDir: 'static/fonts',
					outputStyle: 'expanded'
				}
			}
		},
*/

		watch: {
			js: {
				files: [
					'<%= concat.dist.src %>'
				],
				tasks: ['jshint', 'concat', 'uglify']
			}
		},

		concat: {
			dist: {
				src: ['js/**/*.js'],
				dest: 'dist/picsure.js'
			}
		},

		uglify: {
			options: {
				report: 'min'
			},
			dist: {
				files: {
					'dist/picsure.min.js': ['dist/picsure.js']
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: {
				src: ['js/**/*.js']
			}
		},

	});

	// Load plugins
//	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

//	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'compass', 'connect:server', 'watch']);

	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'connect:server', 'watch:js']);


};
