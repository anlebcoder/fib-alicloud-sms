'use strict';
const fs = require('fs');
const os = require('os');
var crypto = require('crypto');

exports.makeHasher = function(algorithm) {
  return function(data, encoding) {
    var shasum = crypto.createHash(algorithm);
    shasum.update(data);
    return shasum.digest(encoding);
  };
};

exports.md5 = exports.makeHasher('md5');

exports.sha1 = function(data, key, encoding) {
  var hmac_sha1 = crypto.createHmac('sha1', key);
  hmac_sha1.update(data);
  return hmac_sha1.digest().toString(encoding);
};

exports.makeNonce = (function() {
  var counter = 0;
  var last;
  const machine = os.hostname();
  const pid = process.pid;

  return function() {
    var val = Math.floor(Math.random() * 1000000000000);
    if (val === last) {
      counter++;
    } else {
      counter = 0;
    }
    last = val;
    var uid = `${machine}${pid}${val}${counter}`;
    return exports.md5(uid, 'hex');
  };
}());

exports.pad2 = function(num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};