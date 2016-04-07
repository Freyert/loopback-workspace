// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function(ModelMethod) {
  /**
   * Represents a Method of a LoopBack `Model`.
   *
   * @class ModelMethod
   * @inherits WorkspaceEntity
   */

  ModelMethod.getJsonKey = function(data) {
    var version = ModelMethod.app.models.Workspace.loopBackVersion;
    if (encodeStaticFlagInName(version)) {
      var isStatic = data.isStatic;
      if (isStatic !== undefined) {
        var name = data.name;
        var matchName = name.match(/^prototype\.(.*)$/);
        if (!isStatic && (matchName === null || !matchName)) {
          data.name = 'prototype.' + name;
        }
      }
      delete data.isStatic;
    }
    return data.name;
  }

  ModelMethod.getConfigFromData = function(data) {
    var version = ModelMethod.app.models.Workspace.loopBackVersion;
    var properties = this.definition.properties;
    var result = {};
    var prop;

    if (encodeStaticFlagInName(version)) {
      delete data.isStatic;
    }
    
    for (prop in properties) {
      if (properties[prop].json === false) continue;
      result[properties[prop].json || prop] = data[prop];
    }

    return result;
  };
};

function encodeStaticFlagInName(version) {
  var semver = require('semver');
  return version ? !semver.gtr('3.0.0', version) : false;
}