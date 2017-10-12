var gulp             = require("gulp"),
    sass             = require("gulp-sass"),
    sourcemaps       = require('gulp-sourcemaps'),
    stripCssComments = require('gulp-strip-css-comments'),
    jshint           = require('gulp-jshint'),
    uglify           = require('gulp-uglify'),
    autoprefixer     = require('gulp-autoprefixer'),
    changed          = require('gulp-changed'),
    imagemin         = require('gulp-imagemin'),
    modernizr        = require('gulp-modernizr'),
    // browserSync      = require('browser-sync').create(), // Not working with Docker. If needed npm i browser-sync --save-dev
    livereload       = require('gulp-livereload');



/////////////////////////////
// CONFIG
/////////////////////////////


var CONFIG = {
  'autoprefixerOptions': {
    browsers: ['last 2 versions', '> 5%', 'not ie <= 8']
  },

  'url': '<%= themeMachineName %>.dkr',

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


// BrowserSync
// gulp.task('browser-sync', function() {
//     //watch files
//     var files = [
//       CONFIG.css.Dest + '/*.css',
//       CONFIG.js.Dest + '/*.js',
//       CONFIG.images.Dest + '/**/*'
//     ];

//     //initialize browsersync
//     browserSync.init(files, {
//       //browsersync with a php server
//       proxy: CONFIG.url,
//       browser: ["google chrome"], // ["firefox", "safari"]
//       // port: 3000,
//       // open: false,
//       notify: true
//     });
// });

// Browser-sync reload
// gulp.task('bs-reload', function () {
//     browserSync.reload();
// });


/////////////////////////////
// COMBINED TASKS
/////////////////////////////


// Default task to be run with `gulp`
gulp.task('default', ['css', 'js', 'images'], function () {
    gulp.watch(CONFIG.css.Src, ['css']);
    gulp.watch(CONFIG.js.Src, ['js']);
    gulp.watch(CONFIG.images.Src, ['images']);

});

// gulp.task('sync', ['css', 'js', 'images', 'browser-sync'], function () {
//     gulp.watch(CONFIG.css.Src, ['css']);
//     gulp.watch(CONFIG.js.Src, ['js']);
//     gulp.watch(CONFIG.images.Src, ['images']);
//     gulp.watch([CONFIG.js.Dest + '*.js'], ['bs-reload']);
//     gulp.watch([CONFIG.images.Dest + '/**/*'], ['bs-reload']);
// });

gulp.task('watch', ['css', 'js', 'images'], function () {
    livereload.listen();
    gulp.watch(CONFIG.css.Src, ['css']);
    gulp.watch(CONFIG.js.Src, ['js']);
    gulp.watch(CONFIG.images.Src, ['images']);
    gulp.watch([CONFIG.css.Dest + '/**/*.css', './**/*.twig', CONFIG.js.Dest + '/**/*.js'], function (files){
      livereload.changed(files);
    });
});

gulp.task('watch.dev', ['css.dev', 'js'], function () {
    livereload.listen();
    gulp.watch(CONFIG.css.Src, ['css']);
    gulp.watch(CONFIG.js.Src, ['js']);
    gulp.watch(CONFIG.images.Src, ['images']);
    gulp.watch([CONFIG.css.Dest + '/**/*.css', './**/*.twig', CONFIG.js.Dest + '/**/*.js'], function (files){
      livereload.changed(files);
    });
});

gulp.task('watch.sass', ['css'], function () {
    livereload.listen();
    gulp.watch(CONFIG.css.Src, ['css']);
});

gulp.task('init', ['css.dev', 'js', 'images', 'modernizr']);
