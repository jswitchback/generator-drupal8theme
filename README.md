# generator-drupal8theme [![Build Status](https://secure.travis-ci.org/jswitchback/generator-drupal8theme.png?branch=master)](https://travis-ci.org/jswitchback/generator-drupal8theme)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-drupal8theme from npm, run:

```bash
npm install -g generator-drupal8theme
```

Finally, initiate the generator:

```bash
yo drupal8theme
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT


------------------------------------------------
### RAPID GENERATOR
------------------------------------------------


### Installing locally

Clone the repository, change directory and install the generators dependencies with the following command:

```bash
git clone https://github.com/jswitchback/generator-drupal8theme.git && cd generator-drupal8theme && npm link && npm install
```
Generate a new theme from templates in any directory:

```bash
yo drupal8theme
```

------------------------------------------------
### HELPER COMMANDS
------------------------------------------------


Update local machine with latest code
```bash
npm update -g generator-drupal8theme
or
npm uninstall -g generator-drupal8theme && npm install -g generator-drupal8theme
```

### Miscellanous

Check latest version of package on NPM Registry

```bash
npm -v drupal8theme
```

Check version on your local machine

```bash
npm list -g generator-drupal8theme
```

Patching and publishing after updating github repo
```bash
 npm version patch/major/minor
 npm publish
```

