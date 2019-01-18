'use strict';

const {
	RPCClient
} = require('../pop-core');

function hasOwnProperty(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

class Client extends RPCClient {
	constructor(config) {
		config.apiVersion = '2017-05-25';
		super(config);
	}
	sendSms(params = {}, options) {
		return this.request('SendSms', params, options);
	}
}

module.exports = Client;