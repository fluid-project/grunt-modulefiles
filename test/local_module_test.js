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

var assertModuleAssembly = function (test, testFileName) {
  test.expect(1);

  var actual = grunt.file.read('tmp/' + testFileName);
  var expected = grunt.file.read('test/expected/' + testFileName);
  test.equal(actual, expected, 'Should have accumulated the test files correctly.');

  test.done();
};

exports.local_module = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  all: function(test) {
    assertModuleAssembly(test, "all");
  },
  includeNoDependencies: function(test) {
    assertModuleAssembly(test, "includeNoDependencies");
  },
  includeWithDependencies: function(test) {
    assertModuleAssembly(test, "includeWithDependencies");
  },
  exclude: function(test) {
    assertModuleAssembly(test, "exclude");
  },
  includeAndExclude: function(test) {
    assertModuleAssembly(test, "includeAndExclude");
  },
  includeArray: function(test) {
    assertModuleAssembly(test, "includeAndExclude");
  },
  excludeArray: function(test) {
    assertModuleAssembly(test, "excludeArray");
  }
};
