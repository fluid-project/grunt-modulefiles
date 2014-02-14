# grunt-modulefiles

> Enables a project to split its files into a set of modules. A module's information is stored in a json file containing a name for the module, the files it contains, and other modules it depends on. The module files can then be accumulated into various configurations of included and excluded modules, which can be fed into other plugins (e.g. grunt-contrib-concat) for packaging.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-modulefiles --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-modulefiles');
```

## The "modulefiles" task

### Overview
In your project's Gruntfile, add a section named `modulefiles` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  modulefiles: {
    your_target: {
      options: {
        // Target-specific options go here.
      },
      src: []// Target-specific file lists go here.
    }
  }
})
```

The `modulefiles` task will look for json dependency files in your project matching the specified file pattern.
These json dependency files contain a name for the module, the files it contains, and other modules it depends on. The included files and dependencies should all be listed in the order of their dependence. The files should be paths relative to the dependency file. The dependency file itself, should be located within a directory representing the module.

```json
{
  "moduleName": {
    "files": ["file1.js", "file2.js"],
    "dependencies": ["moduleA", "moduleB"]
  }
}

```

### Options

#### options.exclude
Type: `String or Array`
Default value: `[]`

Either an array or comma separated string listing the modules to be excluded from the set of dependencies.

#### options.include
Type: `String or Array`
Default value: `null`

Either an array or comma separated string listing the modules to be included in the set of dependencies.
If the value is falesy the entire set of modules, minus exclusions (see option.exclude), will be used.

### Output

An object containing arrays of all the files and directories returned from the task, is stored at the targets output property.

```js
{
  files: [/*file paths*/],
  dirs: [/*directory paths*/]
}
```

This can be accessed using either grunt.config.prop or "<%= modulefiles.targetName.output =>". (see: http://gruntjs.com/api/grunt.config)

```js
grunt.initConfig({
  modulefiles: {
    your_target: {
      src: ["**/*Dependencies.json"]
    }
  },
  // example passing in the files to the concat task
  concat: {
    all: {
      src: "<%= modulefiles.your_target.output.files %>",
      dest: "package.js"
    }
  }
})
```

### Usage Examples

#### Default Options
In this example the json dependency files are found by matching the src pattern. There are no include and exclude options specified, so all of the modules found will be used. An array of all the files is stored in the 'modulefiles.all.output' config property.

```js
grunt.initConfig({
  modulefiles: {
    all: {
      src: ["**/*Dependencies.json"]
    }
  }
})
```

#### Custom Options
In this example modules "moduleA" and "moduleB" are included, but "moduleC" and
"moduleD" are excluded. The resulting set of files is stored at the "modulefiles.some.output" config property.

```js
grunt.initConfig({
  modulefiles: {
    some: {
      options: {
        exclude: ["moduleC", "moduleD"],
        include: "moduleA, moduleB"
      },
      src: ["**/*Dependencies.json"]
    }
  }
})
```

#### Retrieve output files and directories in a path that they are relative to
In this example, "cwd" sets the root directory for locating the dependency files from. The returned paths for the source files and directories will be relative to the new root directory.

```js
grunt.initConfig({
  modulefiles: {
    all: {
      cwd: "path/",
      src: ["**/*Dependencies.json"]
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
