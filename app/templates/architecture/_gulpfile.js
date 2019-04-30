var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  stripCssComments = require('gulp-strip-css-comments'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  changed = require('gulp-changed'),
  imagemin = require('gulp-imagemin'),
  modernizr = require('gulp-modernizr'),
  livereload = require('gulp-livereload');

/////////////////////////////
// gulpSettings
/////////////////////////////

var gulpSettings = {
  autoprefixerOptions: {
    browsers: ['last 2 versions', '> 5%', 'not ie <= 8']
  },

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
    crawl: false,
    cache: true,
    options: ['setClasses'],
    tests: [
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
    dest: false
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
// CSS
/////////////////////////////

const css = () =>
  gulp
    .src(gulpSettings.css.Src)
    .pipe(sourcemaps.init())
    .pipe(sass(gulpSettings.sassOptions.prod).on('error', sass.logError))
    .pipe(autoprefixer(gulpSettings.autoprefixerOptions))
    .pipe(stripCssComments({ preserve: false }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(gulpSettings.css.Dest))
    .pipe(livereload());

gulp.task('css', css);

const cssDev = () =>
  gulp
    .src(gulpSettings.css.Src)
    .pipe(sass(gulpSettings.sassOptions.dev).on('error', sass.logError))
    .pipe(autoprefixer(gulpSettings.autoprefixerOptions))
    .pipe(gulp.dest(gulpSettings.css.Dest))
    .pipe(livereload());

gulp.task('css.dev', cssDev);

const cssProd = () =>
  gulp
    .src(gulpSettings.css.Src)
    .pipe(sass(gulpSettings.sassOptions.dev).on('error', sass.logError))
    .pipe(autoprefixer(gulpSettings.autoprefixerOptions))
    .pipe(gulp.dest(gulpSettings.css.Dest));

gulp.task('css.prod', cssProd);

/////////////////////////////
// JS
/////////////////////////////

// gulp.task('minify', function () {
//    gulp.src(gulpSettings.js.Src)
//       .pipe(uglify(gulpSettings.jsOptions).on('error', function(e){
//             console.log(e);
//       }))
//       .pipe(gulp.dest(gulpSettings.js.Dest));
// });

const js = () =>
  gulp
    .src(gulpSettings.js.Src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
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
    // .pipe(concat('app.js')) // Don't have this module yet, but may be useful
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

const monderizr = () =>
  gulp
    .src(gulpSettings.js.Dest + '/*.js')
    .pipe(modernizr(gulpSettings.modernizrOptions))
    .pipe(uglify())
    .pipe(gulp.dest('vendor/modernizr'));

// Modernizr custom builds
gulp.task('modernizr', monderizr);

// Copy files
// gulp.task('copy', function() {
//   gulp.src('src/example/**/*.{woff, ttf, svg}')
//     .pipe(gulp.dest('build/exampleCopy'));
// });

/////////////////////////////
// COMBINED TASKS
/////////////////////////////

// Default task to be run with `gulp`

gulp.task('build', gulp.parallel('css', 'js', 'images', 'modernizr'));

gulp.task('build.prod', gulp.parallel('css.prod', 'js', 'images'));

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

gulp.task(
  'watch.dev',
  gulp.parallel('build', function(done) {
    livereload.listen();
    gulp.watch(gulpSettings.css.Src, cssDev);
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
