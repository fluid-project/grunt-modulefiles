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

  /*
   * @param {Object} moduleDependencies, an object containing the dependency information for all modules
   * @param {Object} module, an object containing the dependency information for a single module
   * @param {Array} exclusions, an array of the modules to be excluded
   *
   * Will accumulate the given module's files along with those of all of the modules it depends on,
   * minus the excluded modules.
   *
   * @return {Array} The accumulated file paths, in the order that they are depended on.
   */
  var getFilesImp = function (moduleDependencies, module, exclusions) {
      var dependencies = grunt.util._.difference(module.dependencies, exclusions);
      var paths = [];
      grunt.util._.forEach(dependencies, function (dependency) {
          paths = grunt.util._.union(paths, getFilesImp(moduleDependencies, moduleDependencies[dependency], exclusions));
      });
      paths = grunt.util._.union(paths, module.files);
      return paths;
  };

  /*
   * @param {Object} moduleDependencies, an object containing the dependency information for all modules
   * @param {Array} inclusions, an array of the modules to be included
   * @param {Array} exclusions, an array of the modules to be excluded`
   *
   * Will accumulate the files required by all included modules and their dependencies, minus any excluded modules.
   *
   * @return {Array} The accumulated file paths, in the order that they are depended on.
   */
  var getFiles = function (moduleDependencies, inclusions, exclusions) {
      var paths = [];
      var selectedModules = grunt.util._.difference(inclusions, exclusions);
      grunt.util._.forEach(selectedModules, function (module) {
          var modulePaths = getFilesImp(moduleDependencies, moduleDependencies[module], exclusions);
          paths = grunt.util._.union(paths, modulePaths);
      });
      return paths;
  };

  grunt.registerMultiTask('modulefiles', "Enables a project to split its files into a set of modules. A module's information is stored in a json file containing a name for the module, the files it contains, and other modules it depends on. The module files can then be accumulated into various configurations of included and excluded modules, which can be fed into other plugins (e.g. grunt-contrib-concat) for packaging.", function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      exclude: [],
      include: null // null by default as a falsey value is replaced by the set of all dependencies, calculated below.
    });

    // convert comma separated strings to arrays
    var include = typeof options.include === "string" ? options.include.split(",") : options.include;
    var exclude = typeof options.exclude === "string" ? options.exclude.split(",") : options.exclude;

    // Read in all the dependency files into the "dependencies" object
    var dependencies = {};
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

    // stores the accumulated file paths in the target's output property.
    var outputPath = [this.name, this.target, "output"].join(".");
    grunt.config.set(outputPath, getFiles(dependencies, include || Object.keys(dependencies), exclude));
  });

};
