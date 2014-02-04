/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

'use strict';
var path = require('path');
var _ = require('lodash');

module.exports = function(grunt) {

  /**
   * Converts a string to an array.
   * Each deliminated segment will become an item in the array.
   * @param  {String} value A string to wrap in an array, or parse into array segments.
   * @param  {String} delim A string indecating what to split the string on. "" is not valid, and will default to ","
   * @return {Array}        Array of string segements
   */
  var toArray = function (value, delim) {
    delim = delim || ",";
    value = value || [];
    if (typeof value === "string") {
      value = value.split(delim);
      // removes whitespace around the split string segments
      _.forEach(value, function (seg, idx) {
        value[idx] = seg.trim();
      });
    }
    return value;
  };

  /**
   * Simple implimentation of a "get" function.
   * Will evaluate an EL Path and return the value.
   * If any of the Path segments are undefined, undefined will be returned.
   * @param  {Object} root       The object evaluate the path against
   * @param  {String/Array} path A "." separated string (EL Path) or an array of segments.
   * @return {[type]}            The value found at the end of the path, or undefined if the path is invalid.
   */
  var get = function (root, path) {
    var val = _.clone(root, true);
    var segs = toArray(path, ".");
    _.forEach(segs, function (seg) {
      val = seg === "" ? val : val[seg];
      if (val === undefined) {
        return false;
      }
    });
    return val;
  };

  /**
   * Assembles the set of file paths for the requested modules.
   * @param  {Object} moduleInfo An object containing the information of all modules found
   * @param  {Array} modules     An array of module names. The file paths for these modules will be returned
   * @param  {String/Array} path Optional dot separated string or array of path segments into a module object in moduleInfo
   * @return {Array}             An array of paths
   */
  var getPaths = function (moduleInfo, modules, path) {
    path = toArray(path || "", ".");
    var paths = [];
    _.forEach(modules, function(module) {
      paths = _.union(paths, toArray(get(moduleInfo, [module].concat(path))));
    });
    return paths;
  };

  /**
   * Sorts the modules based on their dependencies. Only the request modules will be included, minus any that are explicity excluded.
   * @param  {Object} moduleDependencies An object containing the information of all modules found
   * @param  {Array} inclusions          An array of module names, refering to the modules to include
   * @param  {Array} exclusions          An array of module names, refering to the modules to excluded (takes priority over included modules)
   * @return {Array}                     A sorted array of module names.
   */
  var sortModules = function (moduleDependencies, inclusions, exclusions) {
    var modules = [];
    var selectedModules = _.difference(inclusions, exclusions);
    _.forEach(selectedModules, function (module) {
      var dependsOn = sortModules(moduleDependencies, moduleDependencies[module].dependencies, exclusions);
      modules = _.union(modules, dependsOn);
      modules.push(module);
    });
    return modules;
  };

  grunt.registerMultiTask('modulefiles', "Enables a project to split its files into a set of modules. A module's information is stored in a json file containing a name for the module, the files it contains, and other modules it depends on. The module files can then be accumulated into various configurations of included and excluded modules, which can be fed into other plugins (e.g. grunt-contrib-concat) for packaging.", function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      exclude: [],
      include: []
    });

    var exclude = toArray(options.exclude);
    var include = toArray(options.include);

    // Read in all the dependency files into the "allModules" object
    // Store their diretory paths in the "moduleDirs" object
    var allModules = {};
    var moduleDirs = {};
    this.filesSrc.forEach(function (dependencyFile) {
      var dependencyObj = grunt.file.readJSON(dependencyFile);
      _.forEach(dependencyObj, function (module, moduleName) {
        module.files = toArray(module.files);
        // Locate the directory of the dependency file
        var moduleDir = path.dirname(dependencyFile);
        // recored the module directory path
        moduleDirs[moduleName] = moduleDir;
        // make file paths relative to root, instead of the depenency file.
        module.files = _.map(module.files, function (file) {
          return path.join(moduleDir, file);
        });
        module.dependencies = toArray(module.dependencies);
      });
      _.merge(allModules, dependencyObj);
    });

    // verify that the "include" and "exlude" modules are valid
    _.forEach(_.union(include, exclude), function (moduleName) {
      if (!allModules[moduleName]) {
        grunt.fail.warn("'" + moduleName + "' is not a valid module.");
      }
    });

    // if no includes were provided, it uses all of the modules.
    include = include.length > 0 ? include : Object.keys(allModules);
    // Sort modules based on their dependencies
    var sortedModules = sortModules(allModules, include, exclude);

    // stores the accumulated dependencies in the target's output property.
    var outputPath = [this.name, this.target, "output"].join(".");
    var output = {
      files: getPaths(allModules, sortedModules, "files"),
      dirs: getPaths(moduleDirs, sortedModules)
    };
    grunt.config.set(outputPath, output);
  });

};
