var gulp             = require("gulp"),
    watch            = require('gulp-watch'), // More performant for Gulp 3. Replace with Gulp core watch method until Gulp 4.0 is officially released (it's stable but the docs aren't done... 9/1/2018)
    sass             = require("gulp-sass"),
    sourcemaps       = require('gulp-sourcemaps'),
    stripCssComments = require('gulp-strip-css-comments'),
    jshint           = require('gulp-jshint'),
    uglify           = require('gulp-uglify'),
    autoprefixer     = require('gulp-autoprefixer'),
    changed          = require('gulp-changed'),
    imagemin         = require('gulp-imagemin'),
    modernizr        = require('gulp-modernizr'),
    livereload       = require('gulp-livereload');



/////////////////////////////
// CONFIG
/////////////////////////////


var CONFIG = {
  'autoprefixerOptions': {
    browsers: ['last 2 versions', '> 5%', 'not ie <= 8']
  },

  'sassOptions': {
    'dev': {
      errLogToConsole: true,
      outputStyle: 'expanded',
      precision: 10
    },
    'prod': {
      errLogToConsole: true,
      outputStyle: 'expanded',
      // outputStyle: 'compressed',
      precision: 10
    }
  },

  'jsOptions': {
    mangle: false // Prevent Uglify from changing variable names
    // preserveComments: 'all'
  },

  'css': {
    'Src': 'src/sass/**/*.scss',
    'Dest': 'build/css'
  },

  'js': {
    'Src': 'src/js/**/*.js',
    'Dest': 'build/js'
  },

  'images': {
    'Src': 'src/images/**/*',
    'Dest': 'build/images'
  },

  'modernizrOptions': {
    'crawl': false,
    'cache': true,
    'options': [
        'setClasses'
    ],
    'tests' : [
      'svg',
      'details', // Require by Drupal Core js
      'inputtypes', // Required by Drupal Core js
      'touchevents', // Required by Drupal Core js
      'addtest', // Required by Drupal Core js
      'prefixes', // Required by Drupal Core js
      'setclasses', // Required by Drupal Core js
      'teststyles', // Required by Drupal Core js
      'cssanimations',
      'flexbox'
    ],
    'dest' : false
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


gulp.task('css', function () {
    gulp.src(CONFIG.css.Src)
        .pipe(sourcemaps.init())
        .pipe(sass(CONFIG.sassOptions.prod).on('error', sass.logError))
        .pipe(autoprefixer(CONFIG.autoprefixerOptions))
        .pipe(stripCssComments({preserve: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(CONFIG.css.Dest))
        .pipe(livereload());
});

gulp.task('css.dev', function () {
    gulp.src(CONFIG.css.Src)
        .pipe(sass(CONFIG.sassOptions.dev).on('error', sass.logError))
        .pipe(autoprefixer(CONFIG.autoprefixerOptions))
        .pipe(gulp.dest(CONFIG.css.Dest))
        .pipe(livereload());
});



/////////////////////////////
// JS
/////////////////////////////



// gulp.task('minify', function () {
//    gulp.src(CONFIG.js.Src)
//       .pipe(uglify(CONFIG.jsOptions).on('error', function(e){
//             console.log(e);
//       }))
//       .pipe(gulp.dest(CONFIG.js.Dest));
// });

gulp.task('js', function () {
    gulp.src(CONFIG.js.Src)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify(CONFIG.jsOptions).on('error', function(e){
          var message = 'Javascript minification (gulp-uglify) has failed. Likely due to javascript errors listed above.';

          // Console colors
          // https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
          console.log("\x1b[44m", message);
          //console.log(e);

      }))
      // .pipe(concat('app.js')) // Don't have this module yet, but may be useful
      .pipe(gulp.dest(CONFIG.js.Dest));
});



/////////////////////////////
// IMAGES
/////////////////////////////



gulp.task('images', function() {
  gulp.src(CONFIG.images.Src)
    .pipe(changed(CONFIG.images.Dest))
    .pipe(imagemin())
    .pipe(gulp.dest(CONFIG.images.Dest));

  // Just move over images that can't be minified
  // gulp.src(CONFIG.images.Src + '/**/*.{woff}')
  //   .pipe(gulp.dest(CONFIG.images.Dest));
});



/////////////////////////////
// MISCELLANEOUS
/////////////////////////////



// Modernizr custom builds
gulp.task('modernizr', function() {
  gulp.src(CONFIG.js.Dest + '/*.js')
    .pipe(modernizr(CONFIG.modernizrOptions))
    .pipe(uglify())
    .pipe(gulp.dest('vendor/modernizr'));
});

// Copy files
// gulp.task('copy', function() {
//   gulp.src('src/example/**/*.{woff, ttf, svg}')
//     .pipe(gulp.dest('build/exampleCopy'));
// });


/////////////////////////////
// COMBINED TASKS
/////////////////////////////


// Default task to be run with `gulp`
gulp.task('default', ['css', 'js', 'images']);

gulp.task('watch', ['css', 'js', 'images'], function () {
    livereload.listen();

    watch(CONFIG.css.Src, function(){
        gulp.start('css');
    });

    watch(CONFIG.js.Src, function(){
        gulp.start('js');
    });

    watch(CONFIG.images.Src, function(){
        gulp.start('images');
    });
  
    watch([CONFIG.css.Dest + '/**/*.css', './**/*.twig', CONFIG.js.Dest + '/**/*.js'], function (files){
      livereload.changed(files);
    });
});

gulp.task('watch.dev', ['css.dev', 'js'], function () {
    livereload.listen();

    watch(CONFIG.css.Src, function(){
        gulp.start('css.dev');
    });

    watch(CONFIG.js.Src, function(){
        gulp.start('js');
    });

    watch(CONFIG.images.Src, function(){
        gulp.start('images');
    });

    watch([CONFIG.css.Dest + '/**/*.css', './**/*.twig', CONFIG.js.Dest + '/**/*.js'], function (files){
      livereload.changed(files);
    });
});

gulp.task('init', ['css', 'js', 'images', 'modernizr']);
