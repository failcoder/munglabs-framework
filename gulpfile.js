/**
 *
 *  Failcoder Framework
 *  Copyright 2015 Failcoder (Steven Jackson). All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
'use strict';
var gulp = require('gulp');
var fs = require('fs');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();
var del = require('del');
var vinylPaths = require('vinyl-paths');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var codeFiles = '';
var reload = browserSync.reload;
var path = require('path');
var pkg = require('./package.json');
var through = require('through2');
var swig = require('swig');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' * @copyright 2015 Failcoder (Steven Jackson).',
  ' * @link https://github.com/failcoder/failcoder-framework',
  ' */',
  ''].join('\n');
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
// Prepare Output Directory
gulp.task('prep', del.bind(null, ['css', 'js', '.tmp'], {dot: true}));
// Clean TMP Directory
gulp.task('clean', del.bind(null, ['.tmp'], {dot: true}));
// Lint JavaScript
gulp.task('jscs', function () {
  return gulp.src(['scss/material/**/*.js' , 'gulpfile.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jscs());
});
// Compile and Automatically Prefix Stylesheets (production)
gulp.task('styles', function () {
  return gulp.src([
      'scss/init.scss'
    ])
    .pipe ($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.cssInlineImages({
      webRoot: 'scss/material'
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    .pipe($.concat('munglabs.css'))
    .pipe($.header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./css'))
    .pipe($.if('*.css', $.csso()))
    .pipe($.concat('munglabs.min.css'))
    .pipe($.header(banner, {pkg: pkg}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
    .pipe($.size({title: 'styles'}));
});
// Concatenate And Minify JavaScript
gulp.task('scripts', function () {
  var sources = [
    'scss/material/core.js',
    'scss/material/third_party/**/*.js',
    'scss/material/button/button.js',
    'scss/material/checkbox/checkbox.js',
    'scss/material/icon/icon.js',
    'scss/material/menu/menu.js',
    'scss/material/progress/progress.js',
    'scss/material/radio/radio.js',
    'scss/material/slider/slider.js',
    'scss/material/spinner/spinner.js',
    'scss/material/switch/switch.js',
    'scss/material/tabs/tabs.js',
    'scss/material/textfield/textfield.js',
    'scss/material/tooltip/tooltip.js',
    'scss/material/layout/layout.js',
    'scss/material/datatable/datatable.js',
    //'scss/material/skins/skins.js',
    'scss/material/ripple/ripple.js'
  ];
  return gulp.src(sources)
    .pipe($.sourcemaps.init())
    .pipe($.concat('munglabs.js'))
    .pipe(gulp.dest('./js'))
    .pipe($.uglify({
      sourceRoot: '.',
      sourceMapIncludeSources: true
    }))
    .pipe($.header(banner, {pkg: pkg}))
    .pipe($.concat('munglabs.min.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./js'))
    .pipe($.size({title: 'scripts'}));
});
// Build Production Files, the Default Task
gulp.task('material', ['prep'], function (cb) {
  runSequence(
    ['styles'],
    ['scripts'],
    cb);
});
 /***
  *     /$$$$$$$ /$$   /$$/$$$$$$/$$      /$$$$$$$
  *    | $$__  $| $$  | $|_  $$_| $$     | $$__  $$
  *    | $$  \ $| $$  | $$ | $$ | $$     | $$  \ $$
  *    | $$$$$$$| $$  | $$ | $$ | $$     | $$  | $$
  *    | $$__  $| $$  | $$ | $$ | $$     | $$  | $$
  *    | $$  \ $| $$  | $$ | $$ | $$     | $$  | $$
  *    | $$$$$$$|  $$$$$$//$$$$$| $$$$$$$| $$$$$$$/
  *    |_______/ \______/|______|________|_______/
  *
  *
  *
  */
// Build production files and microsite
gulp.task('default', function (cb) {
  runSequence(
    ['material'],
    ['clean'],
    cb);
});
