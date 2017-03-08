
=================
FRONT-END TOOLING
=================

(Gulp, Bower and Node.js)

Requires:
Node.js (https://nodejs.org/en/)
Gulp (http://gulpjs.com/ ... Terminal command: "npm install gulp -g")
Bower (https://bower.io/)

/////////////////
// GULP
/////////////////

1.) Install this projects dependencies:
In Terminal, "cd" to this theme directory with "gulpfile.js" as root.
Run "npm install".

2.) All gulp dependencies should be downloaded and you are good to go! Look in "gulpfile.js" for tasks. Here's a short list to get started:

gulp watch // Watch CSS/JS/Images and compile on save (Can also use "npm run watch")
gulp js
gulp css
gulp images
gulp modernizr // Download custom version of modernizr dependant upon settings in gulpfile.js

/////////////////
// BOWER
/////////////////

Install packages via Bower. "cd" to this directory and run:
bower install <package name or guthub url>

Examples:
bower install modernizr
or
bower install https://github.com/Modernizr/Modernizr (* Not recommended as it pulls in a lot of unused build files and clutter)

How to:
http://bower.io/docs/api/#install
