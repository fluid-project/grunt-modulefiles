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
          exclude: "moduleA, moduleE"
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
          exclude: ["moduleA", "moduleE"]
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
      },
      differentName: {
        options: {
          include: ["moduleE"]
        },
        src: "<%= modulefiles.all.src %>"
      }
    },

    // write the output of the test actions to a file for testing
    write: {
      all_files: "<%= modulefiles.all.output.files %>",
      all_dirs: "<%= modulefiles.all.output.dirs %>",
      includeNoDependencies_files: "<%= modulefiles.includeNoDependencies.output.files %>",
      includeNoDependencies_dirs: "<%= modulefiles.includeNoDependencies.output.dirs %>",
      includeWithDependencies_files: "<%= modulefiles.includeWithDependencies.output.files %>",
      includeWithDependencies_dirs: "<%= modulefiles.includeWithDependencies.output.dirs %>",
      exclude_files: "<%= modulefiles.exclude.output.files %>",
      exclude_dirs: "<%= modulefiles.exclude.output.dirs %>",
      includeAndExclude_files: "<%= modulefiles.includeAndExclude.output.files %>",
      includeAndExclude_dirs: "<%= modulefiles.includeAndExclude.output.dirs %>",
      includeArray_files: "<%= modulefiles.includeArray.output.files %>",
      includeArray_dirs: "<%= modulefiles.includeArray.output.dirs %>",
      excludeArray_files: "<%= modulefiles.excludeArray.output.files %>",
      excludeArray_dirs: "<%= modulefiles.excludeArray.output.dirs %>",
      nonArrayDependencies_files: "<%= modulefiles.nonArrayDependencies.output.files %>",
      nonArrayDependencies_dirs: "<%= modulefiles.nonArrayDependencies.output.dirs %>",
      noDependencies_files: "<%= modulefiles.noDependencies.output.files %>",
      noDependencies_dirs: "<%= modulefiles.noDependencies.output.dirs %>",
      differentName_files: "<%= modulefiles.differentName.output.files %>",
      differentName_dirs: "<%= modulefiles.differentName.output.dirs %>"
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
