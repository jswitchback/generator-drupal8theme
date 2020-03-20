var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stripCssComments = require('gulp-strip-css-comments'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    modernizr = require('gulp-modernizr');

/////////////////////////////
// Gulp Settings
/////////////////////////////

var gulpSettings = {
  sassOptions: {
    dev: {
      errLogToConsole: true,
      outputStyle: 'expanded',
      precision: 10
    },
    prod: {
      errLogToConsole: true,
      outputStyle: 'expanded',
      // outputStyle: 'compressed',
      precision: 10
    }
  },

  jsOptions: {
    mangle: false // Prevent Uglify from changing variable names
    // preserveComments: 'all'
  },

  css: {
    Src: 'src/sass/**/*.scss',
    Dest: 'build/css'
  },

  js: {
    Src: 'src/js/**/*.js',
    Dest: 'build/js'
  },

  images: {
    Src: 'src/images/**/*',
    Dest: 'build/images'
  },

  modernizrOptions: {
    "crawl" : false,
    "cache" : true,
    "options" : [
        "setClasses"
    ],
    "tests" : [
      'svg',
      'details', // Require by Drupal Core js
      'inputtypes', // Required by Drupal Core js
      'touchevents', // Required by Drupal Core js
      'addtest', // Required by Drupal Core js
      'prefixes', // Required by Drupal Core js
      'setclasses', // Required by Drupal Core js
      'teststyles', // Required by Drupal Core js
      'flexbox'
    ],
    "dest" : false
    // "excludeTests": [],
    // "customTests" : []
    // "devFile" : false,
    // "useBuffers": false,
    // "files" : {
    //     "src": [
    //         "*[^(g|G)runt(file)?].{js,css,scss}",
    //         "**[^node_modules]/**/*.{js,css,scss}",
    //         "!lib/**/*"
    //     ]
    // },
  }
};

/////////////////////////////
// Miscellaneous
/////////////////////////////

// Modernizr custom builds
const featureDetection = () =>
  gulp
  .src(gulpSettings.js.Dest + '/*.js')
  .pipe(modernizr(gulpSettings.modernizrOptions))
  .pipe(uglify())
  .pipe(gulp.dest(gulpSettings.js.Dest));

gulp.task('modernizr', modernizr);

/////////////////////////////
// CSS
/////////////////////////////

const css = () =>
  gulp
    .src(gulpSettings.css.Src)
    .pipe(sourcemaps.init())
    .pipe(sass(gulpSettings.sassOptions.prod).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(stripCssComments({ preserve: false }))
    .pipe(gulp.dest(gulpSettings.css.Dest))
    .pipe(livereload());

gulp.task('css', css);

/////////////////////////////
// JS
/////////////////////////////

const js = () =>
  gulp
    .src(gulpSettings.js.Src)
    .pipe(
      uglify(gulpSettings.jsOptions).on('error', function(e) {
        var message =
          'Javascript minification (gulp-uglify) has failed. Likely due to javascript errors listed above.';

        // Console colors
        // https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
        console.log('\x1b[44m', message);
        //console.log(e);
      })
    )
    .pipe(gulp.dest(gulpSettings.js.Dest));

gulp.task('js', js);

/////////////////////////////
// IMAGES
/////////////////////////////

const images = () =>
  gulp
    .src(gulpSettings.images.Src)
    .pipe(changed(gulpSettings.images.Dest))
    .pipe(imagemin())
    .pipe(gulp.dest(gulpSettings.images.Dest));

gulp.task('images', images);

/////////////////////////////
// MISCELLANEOUS
/////////////////////////////


/////////////////////////////
// COMBINED TASKS
/////////////////////////////

// Default task to be run with `gulp`
gulp.task('build', gulp.parallel('css', 'js', 'images', 'featureDetection'));

gulp.task('default', gulp.parallel('build'));

gulp.task(
  'watch',
  gulp.parallel('build', function(done) {
    livereload.listen();
    gulp.watch(gulpSettings.css.Src, css);
    gulp.watch(gulpSettings.js.Src, js);
    gulp.watch(gulpSettings.images.Src, images);
    gulp
      .watch([
        gulpSettings.css.Dest + '/**/*.css',
        './**/*.twig',
        gulpSettings.js.Dest + '/**/*.js'
      ])
      .on('change', files => livereload.changed(files));
    done();
  })
);