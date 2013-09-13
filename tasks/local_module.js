/*
 * grunt-local-module
 * https://github.com/jobara/grunt-local-module
 *
 * Copyright (c) 2013 Justin Obara
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var getModulesImp = function (moduleDependencies, module, exclusions) {
      var dependencies = grunt.util._.difference(module.dependencies, exclusions);
      var paths = [];
      grunt.util._.forEach(dependencies, function (dependency) {
          paths = grunt.util._.union(paths, getModulesImp(moduleDependencies, moduleDependencies[dependency], exclusions));
      });
      paths = grunt.util._.union(paths, module.files);
      return paths;
  };

  var getModules = function (moduleDependencies, inclusions, exclusions) {
      var paths = [];
      var selectedModules = grunt.util._.difference(inclusions, exclusions);
      grunt.util._.forEach(selectedModules, function (module) {
          var modulePaths = getModulesImp(moduleDependencies, moduleDependencies[module], exclusions);
          paths = grunt.util._.union(paths, modulePaths);
      });
      return paths;
  };

  grunt.registerMultiTask('local_module', 'Builds local project modules. Usseful for breaking up a single project into several modular parts which can be assembled in various configurations.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      exclude: [],
      include: null, // null by default as a falsey value is replaced by the set of all dependencies, calculated below.
      configProp: "pkgfiles"
    });

    var dependencies = {};

    // convert comma separated strings to arrays
    var include = typeof options.include === "string" ? options.include.split(",") : options.include;
    var exclude = typeof options.exclude === "string" ? options.exclude.split(",") : options.exclude;

    // Read in all the dependency files into the "dependencies" object
    this.filesSrc.forEach(function (dependencyFile) {
        var dependencyObj = grunt.file.readJSON(dependencyFile);
        grunt.util._.merge(dependencies, dependencyObj);
    });

    // verify that the "include" and "exlude" modules are valid
    grunt.util._.forEach(grunt.util._.union(include || [], exclude), function (moduleName) {
      if (!dependencies[moduleName]) {
        grunt.fail.warn("'" + moduleName + "' is not a valid module.");
      }
    });

    grunt.config.set(options.configProp, getModules(dependencies, include || Object.keys(dependencies), exclude));
  });

};
