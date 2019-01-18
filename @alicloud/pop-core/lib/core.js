'use strict';

const assert = require('assert');
const kitx = require('../../../kitx');
const http = require('http');
var ssl = require("ssl");
ssl.ca.loadRootCerts();

function firstLetterUpper(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function formatParams(params) {
  var keys = Object.keys(params);
  var newParams = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    newParams[firstLetterUpper(key)] = params[key];
  }
  return newParams;
}

function timestamp() {
  var date = new Date();
  var YYYY = date.getUTCFullYear();
  var MM = kitx.pad2(date.getUTCMonth() + 1);
  var DD = kitx.pad2(date.getUTCDate());
  var HH = kitx.pad2(date.getUTCHours());
  var mm = kitx.pad2(date.getUTCMinutes());
  var ss = kitx.pad2(date.getUTCSeconds());
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}

function encode(str) {
  var result = encodeURIComponent(str);
  return result.replace(/\!/g, '%21')
    .replace(/\'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function normalize(params) {
  var list = [];
  var keys = Object.keys(params).sort();
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = params[key];
    if (Array.isArray(value)) {
      repeatList(list, key, value);
    } else {
      list.push([encode(key), encode(value)]);
    }
  }
  return list;
}

function canonicalize(normalized) {
  var fields = [];
  for (var i = 0; i < normalized.length; i++) {
    var [key, value] = normalized[i];
    fields.push(key + '=' + value);
  }
  return fields.join('&');
}

class Core {
  constructor(config, verbose) {
    assert(config, 'must pass "config"');
    assert(config.endpoint, 'must pass "config.endpoint"');
    assert(config.apiVersion, 'must pass "config.apiVersion"');
    assert(config.accessKeyId, 'must pass "config.accessKeyId"');
    var accessKeySecret = config.secretAccessKey || config.accessKeySecret;
    assert(accessKeySecret, 'must pass "config.accessKeySecret"');

    if (config.endpoint.endsWith('/')) {
      config.endpoint = config.endpoint.slice(0, -1);
    }
    this.endpoint = config.endpoint;
    this.apiVersion = config.apiVersion;
    this.accessKeyId = config.accessKeyId;
    this.accessKeySecret = accessKeySecret;
    this.verbose = verbose === true;
  }

  request(action, params = {}, opts = {}) {
    action = firstLetterUpper(action);
    if (opts.formatParams !== false) {
      params = formatParams(params);
    }
    var defaults = this._buildParams();
    params = Object.assign({
      Action: action
    }, defaults, params);
    var method = (opts.method || 'GET').toUpperCase();
    var normalized = normalize(params);
    var canonicalized = canonicalize(normalized);
    var stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
    const key = this.accessKeySecret + '&';
    var signature = kitx.sha1(stringToSign, key, 'base64');
    normalized.push(['Signature', encode(signature)]);
    const url = `${this.endpoint}/?${canonicalize(normalized)}`;
    var r = http.get(url).readAll().toString();
    var rs = JSON.parse(r);
    console.notice(rs);
    return rs;
  }

  _buildParams() {
    return {
      Format: 'JSON',
      SignatureMethod: 'HMAC-SHA1',
      SignatureNonce: kitx.makeNonce(),
      SignatureVersion: '1.0',
      Timestamp: timestamp(),
      AccessKeyId: this.accessKeyId,
      Version: this.apiVersion,
    };
  }
}

module.exports = Core;