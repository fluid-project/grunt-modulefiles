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
    local_module: {
      all: {
        options: {
          configPath: "actual.allFiles"
        },
        src: ["**/*Dependencies.json"]
      },
      includeNoDependencies: {
        options: {
          configPath: "actual.includeNoDependencies",
          include: "moduleA"
        },
        src: "<%= local_module.all.src %>"
      },
      includeWithDependencies: {
        options: {
          configPath: "actual.includeWithDependencies",
          include: "moduleB"
        },
        src: "<%= local_module.all.src %>"
      },
      exclude: {
        options: {
          configPath: "actual.exclude",
          exclude: "moduleA"
        },
        src: "<%= local_module.all.src %>"
      },
      includeAndExclude: {
        options: {
          configPath: "actual.includeAndExclude",
          include: "moduleB",
          exclude: "moduleA"
        },
        src: "<%= local_module.all.src %>"
      },
      includeArray: {
        options: {
          configPath: "actual.includeArray",
          include: ["moduleA"]
        },
        src: "<%= local_module.all.src %>"
      },
      excludeArray: {
        options: {
          configPath: "actual.excludeArray",
          exclude: ["moduleA"]
        },
        src: "<%= local_module.all.src %>"
      }
    },

    // write the output of the test actions to a file for testing
    write: {
      all: "<%= actual.allFiles %>",
      includeNoDependencies: "<%= actual.includeNoDependencies %>",
      includeWithDependencies: "<%= actual.includeWithDependencies %>",
      exclude: "<%= actual.exclude %>",
      includeAndExclude: "<%= actual.includeAndExclude %>",
      includeArray: "<%= actual.includeArray %>",
      excludeArray: "<%= actual.excludeArray %>"
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
  grunt.registerTask('test', ['clean', 'local_module', 'write', 'nodeunit']);

  // By default, lint, run all tests, and clean.
  grunt.registerTask('default', ['jshint', 'test', 'clean']);

};
