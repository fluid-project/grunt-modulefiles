/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/grunt-modulefiles/raw/main/LICENSE.txt
*/

/* eslint-env node */
"use strict";

var grunt = require("grunt"),
    path = require("path");

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

var assertPackage = function (test, testFileName, message) {
    test.expect(1);

    // "tmp/" location is specified in write task of Gruntfile.js
    var actual = grunt.file.read("tmp/" + testFileName);
    var expected = grunt.file.read("test/expected/" + testFileName);
    actual = actual.replace(/\//g, path.sep).trim();
    expected = expected.replace(/\//g, path.sep).trim();
    test.equal(actual, expected, message);

    test.done();
};

var assertPackageFiles = function (test, testFileName) {
    assertPackage(test, testFileName, "Should have accumulated the test files correctly.");
};

var assertPackageDirs = function (test, testFileName) {
    assertPackage(test, testFileName, "Should have accumulated the test directories correctly.");
};

/* eslint-disable camelcase */
exports.modulefiles = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    all_files: function (test) {
        assertPackageFiles(test, "all_files");
    },
    all_dirs: function (test) {
        assertPackageDirs(test, "all_dirs");
    },
    includeNoDependencies_files: function (test) {
        assertPackageFiles(test, "includeNoDependencies_files");
    },
    includeNoDependencies_dirs: function (test) {
        assertPackageDirs(test, "includeNoDependencies_dirs");
    },
    includeWithDependencies_files: function (test) {
        assertPackageFiles(test, "includeWithDependencies_files");
    },
    includeWithDependencies_dirs: function (test) {
        assertPackageDirs(test, "includeWithDependencies_dirs");
    },
    exclude_files: function (test) {
        assertPackageFiles(test, "exclude_files");
    },
    exclude_dirs: function (test) {
        assertPackageDirs(test, "exclude_dirs");
    },
    includeAndExclude_files: function (test) {
        assertPackageFiles(test, "includeAndExclude_files");
    },
    includeAndExclude_dirs: function (test) {
        assertPackageDirs(test, "includeAndExclude_dirs");
    },
    includeArray_files: function (test) {
        assertPackageFiles(test, "includeArray_files");
    },
    includeArray_dirs: function (test) {
        assertPackageDirs(test, "includeArray_dirs");
    },
    excludeArray_files: function (test) {
        assertPackageFiles(test, "excludeArray_files");
    },
    excludeArray_dirs: function (test) {
        assertPackageDirs(test, "excludeArray_dirs");
    },
    nonArrayDependencies_files: function (test) {
        assertPackageFiles(test, "nonArrayDependencies_files");
    },
    nonArrayDependencies_dirs: function (test) {
        assertPackageDirs(test, "nonArrayDependencies_dirs");
    },
    noDependencies_files: function (test) {
        assertPackageFiles(test, "noDependencies_files");
    },
    noDependencies_dirs: function (test) {
        assertPackageDirs(test, "noDependencies_dirs");
    },
    differentName_files: function (test) {
        assertPackageFiles(test, "differentName_files");
    },
    differentName_dirs: function (test) {
        assertPackageDirs(test, "differentName_dirs");
    },
    allWithCwd_files: function (test) {
        assertPackageDirs(test, "allWithCwd_files");
    },
    allWithCwd_dirs: function (test) {
        assertPackageDirs(test, "allWithCwd_dirs");
    },
    includeAndExcludeWithCwd_files: function (test) {
        assertPackageFiles(test, "includeAndExcludeWithCwd_files");
    },
    includeAndExcludeWithCwd_dirs: function (test) {
        assertPackageDirs(test, "includeAndExcludeWithCwd_dirs");
    },
    external_files: function (test) {
        assertPackageFiles(test, "external_files");
    },
    external_dirs: function (test) {
        assertPackageDirs(test, "external_dirs");
    }
/* eslint-enable camelcase */
};
