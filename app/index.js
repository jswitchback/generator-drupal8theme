'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


var Drupal8themeGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Drupal8theme generator!'
    ));

    var prompts = [
    // {
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // },
    {
      name: 'themeName',
      message: 'Name your theme:',
      default: 'Project title',
      validate: function (input) {
        if (input === '') {
          return 'Please enter your theme\'s name';
        }
        return true;
      }
    },
    {
      name: 'themeMachineName',
      message: 'What\'s the machine name of your theme:',
      default: 'project_name',
      validate: function (input) {
        // @todo error on capital letters and spaces
        if (input === '') {
          return 'Please enter your theme\'s name';
        }
        return true;
      }
    },
    {
      name: 'themeDesc',
      message: 'Describe your theme:',
      default: 'Project description here.',
      validate: function (input) {
        if (input === '') {
          return 'Please enter your theme\'s description';
        }
        return true;
      }
    },


    ];

    this.prompt(prompts, function (props) {

      this.promptinput                  = {};
      this.promptinput.themeName        = props.themeName;
      this.promptinput.themeDesc        = props.themeDesc;
      this.promptinput.themeMachineName = props.themeMachineName; // String(_(_.slugify(props.themeName)).underscored());

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir(this.promptinput.themeMachineName);

      // Set our destination to be the new directory.
      this.destinationRoot(this.promptinput.themeMachineName);


      // this.dest.mkdir('src');
    },

    architecture: function () {
      this.directory('architecture/src', 'src');
      this.directory('architecture/sass-dependencies', 'sass-dependencies');
      this.directory('architecture/vendor', 'vendor');
      this.src.copy('architecture/editorconfig', '.editorconfig');
      this.src.copy('architecture/jshintrc', '.jshintrc');
      this.src.copy('architecture/bower.json', 'bower.json');
      this.src.copy('architecture/bowerrc', '.bowerrc');
      this.template('architecture/_gulpfile.js', 'gulpfile.js', this.promptinput);
      this.template('architecture/_package.json', 'package.json', this.promptinput);

    },

    drupal: function () {
      var themeMachineName = this.promptinput.themeMachineName;

      this.template('drupal/_theme.info.yml', themeMachineName + '.info.yml', this.promptinput);
      this.template('drupal/_theme.libraries.yml', themeMachineName + '.libraries.yml', this.promptinput);
      this.template('drupal/_theme.breakpoints.yml', themeMachineName + '.breakpoints.yml', this.promptinput);
      // this.template('drupal/_theme.settings.yml', 'config/install/' + themeMachineName + '.settings.yml', this.promptinput); // Will error install if there are no settings as of Drupal 8.1
      this.template('drupal/_theme.theme', themeMachineName + '.theme', this.promptinput);
      this.template('drupal/_scripts.js', 'src/js/scripts.js', this.promptinput);
      this.template('drupal/_README.txt', 'README.txt', this.promptinput);
      this.directory('drupal/templates', 'templates');
      this.dest.mkdir('templates/taxonomy');
      this.src.copy('drupal/favicon.ico', 'favicon.ico');
      this.src.copy('drupal/logo.png', 'logo.png');
      this.src.copy('drupal/screenshot.png', 'screenshot.png');
    }
  },

  end: function () {

    var skippingInstall = this.options['skip-install'];

    this.installDependencies({

    // Runs npm install, bower install by default.
    // Grunt commands ran in callback.
      skipInstall: skippingInstall,
      // bower: false,
      // npm: false,
      callback: function () {
        // Emit a new event - dependencies installed
        if (!skippingInstall) {
          this.emit('dependenciesInstalled');
        } else {
          this.log(yosay('******** SCAFFOLDING COMPLETE. BE SURE TO RUN NPM INSTALL, BOWER INSTALL & GULP INIT TO COMPLETE THE BUILD ********'));
        }
      }.bind(this) // Bind the callback to the parent scope.
    });

    // Now you can bind to the dependencies installed event
    this.on('dependenciesInstalled', function () {

      // Initial build of css, js & images
      this.log(yosay('******** SCAFFOLDING COMPLETE. RUNNING INITIAL GULP TASKS ********'));
      this.spawnCommand('gulp', ['build']);

    });

  }
});

module.exports = Drupal8themeGenerator;
