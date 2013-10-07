/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    modulefiles: {
      all: {
        src: ["**/*Dependencies.json"]
      },
      includeNoDependencies: {
        options: {
          include: "moduleA"
        },
        src: "<%= modulefiles.all.src %>"
      },
      includeWithDependencies: {
        options: {
          include: "moduleB"
        },
        src: "<%= modulefiles.all.src %>"
      },
      exclude: {
        options: {
          exclude: "moduleA"
        },
        src: "<%= modulefiles.all.src %>"
      },
      includeAndExclude: {
        options: {
          include: "moduleB",
          exclude: "moduleA"
        },
        src: "<%= modulefiles.all.src %>"
      },
      includeArray: {
        options: {
          include: ["moduleA"]
        },
        src: "<%= modulefiles.all.src %>"
      },
      excludeArray: {
        options: {
          exclude: ["moduleA"]
        },
        src: "<%= modulefiles.all.src %>"
      },
      nonArrayDependencies: {
        options: {
          include: ["moduleC"]
        },
        src: "<%= modulefiles.all.src %>"
      },
      noDependencies: {
        options: {
          include: ["moduleD"]
        },
        src: "<%= modulefiles.all.src %>"
      }
    },

    // write the output of the test actions to a file for testing
    write: {
      all: "<%= modulefiles.all.output %>",
      includeNoDependencies: "<%= modulefiles.includeNoDependencies.output %>",
      includeWithDependencies: "<%= modulefiles.includeWithDependencies.output %>",
      exclude: "<%= modulefiles.exclude.output %>",
      includeAndExclude: "<%= modulefiles.includeAndExclude.output %>",
      includeArray: "<%= modulefiles.includeArray.output %>",
      excludeArray: "<%= modulefiles.excludeArray.output %>",
      nonArrayDependencies: "<%= modulefiles.nonArrayDependencies.output %>",
      noDependencies: "<%= modulefiles.noDependencies.output %>"
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

  });

  // Load this plugin's task.
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Simple task for writing the output to file for testing
  grunt.registerMultiTask('write', 'writes to temp directory', function () {
    grunt.file.write('tmp/' + this.target, this.data);
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task, then test the result.
  grunt.registerTask('test', ['clean', 'modulefiles', 'write', 'nodeunit']);

  // By default, lint, run all tests, and clean.
  grunt.registerTask('default', ['jshint', 'test', 'clean']);

};
