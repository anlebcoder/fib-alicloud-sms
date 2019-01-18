var SMSClient = require('./@alicloud/sms-sdk');

function setClient(e) {
	return new SMSClient(e);
}

function SendSMS(object, v) {
	return object.sendSMS(v);
}

exports.smsclient = function(e) {
	return setClient(e);
}
exports.send = function(object, v) {
	return SendSMS(object, v);
}