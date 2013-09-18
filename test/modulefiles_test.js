/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var assertPackageFiles = function (test, testFileName) {
  test.expect(1);

  // 'tmp/' location is specified in write task of Gruntfile.js
  var actual = grunt.file.read('tmp/' + testFileName);
  var expected = grunt.file.read('test/expected/' + testFileName);
  test.equal(actual, expected, 'Should have accumulated the test files correctly.');

  test.done();
};

exports.modulefiles = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  all: function(test) {
    assertPackageFiles(test, "all");
  },
  includeNoDependencies: function(test) {
    assertPackageFiles(test, "includeNoDependencies");
  },
  includeWithDependencies: function(test) {
    assertPackageFiles(test, "includeWithDependencies");
  },
  exclude: function(test) {
    assertPackageFiles(test, "exclude");
  },
  includeAndExclude: function(test) {
    assertPackageFiles(test, "includeAndExclude");
  },
  includeArray: function(test) {
    assertPackageFiles(test, "includeAndExclude");
  },
  excludeArray: function(test) {
    assertPackageFiles(test, "excludeArray");
  }
};
