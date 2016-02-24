'use strict';
var glob = require('glob');
var yamlFront = require('yaml-front-matter');
var fs = require('fs');
var path = require('path');

// Figures out where the data should lay in our
// data object based on its path on the filesystem.
// A path of data/foo/bar/baz.yaml would yield ['foo', 'bar', 'baz']
function getDataPath(topLevel, filePath) {
  var parsedPath = path.parse(filePath);
  var dirs = parsedPath.dir.split(path.sep);
  if (dirs.length > 0 && dirs[0] === topLevel) {
    dirs.shift();
  }
  dirs.push(parsedPath.name);
  return dirs;
}

// Alters an object by populating the `paths` with `newData`.
// E.g. populatePaths({}, ['foo', 'bar'], {'kyle': 'bad'}) will
// populate the first argument with {'foo': {'bar': {'kyle': 'bad'}}}.
function populatePaths(object, paths, newData){
  var current = object;
  for (var i = 0; i < paths.length; i++) {
    // Do not overwrite existing data
    if (!(paths[i] in current)) {
      current[paths[i]] = (i === paths.length -1 )? newData : {};
    }
    current = current[paths[i]];
  }
}

function loadYamlFiles() {
  var data = {};
  var directory = 'data';
  var files = glob.sync(directory + '/**/*.yaml');
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var dataPath = getDataPath(directory, f);
    var content = fs.readFileSync(f);
    var newData = yamlFront.loadFront(content);
    populatePaths(data, dataPath, newData);
  }
  return data;
}

module.exports = loadYamlFiles;
