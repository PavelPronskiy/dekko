
var syntaxSCSS    = '.scss',
	syntaxJS      = '.js',
	sites         = 'modules/bar/**/**',
	gulp          = require('gulp'),
	gutil         = require('gulp-util'),
	sass          = require('gulp-sass'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	minify        = require('gulp-minify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify"),
	rsync         = require('gulp-rsync');


gulp.task('styles', function() {
	return gulp.src(sites + syntaxSCSS)
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest(function(file){
		return file.base;
	}))
});


gulp.task('jscript', function() {
	return gulp.src([ sites + syntaxJS, '!' + sites + '/*.min.js'])
	.pipe(rename({ suffix: '.min' }))
	.pipe(minify({
		noSource: true,
		ext:{
			min: '.min.js'
		},
		ignoreFiles: ['.min.js']
	}))
	.pipe(gulp.dest(function(file){
		return file.base;
	}))
});

gulp.task('watch', function() {
	gulp.watch(sites + syntaxSCSS, gulp.series('styles'));
});

// gulp.watch(sites + syntaxJS, gulp.series('jscript'));
