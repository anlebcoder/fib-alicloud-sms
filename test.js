"use strict";
var test = require("test");
var fib_alicloud_sms = require('./index');
test.setup();
var client;

describe("fib_alicloud_sms", function() {
	it("短信验证码测试", function() {
		client = fib_alicloud_sms.smsclient({
			accessKeyId: 'accessKeyId',
			secretAccessKey: 'secretAccessKey'
		})
		var rs = fib_alicloud_sms.send(client, {
			PhoneNumbers: '15100000000',
			SignName: 'message test',
			TemplateCode: 'SMS_95620458',
			TemplateParam: '{"code":"252725"}'
		})
		if (rs['Code'] == 'OK') {
			console.log('发送成功');
		} else {
			console.error('发送失败');
		}
		client = fib_alicloud_sms.smsclient({
			accessKeyId: 'accessKeyId',
			secretAccessKey: 'secretAccessKey'
		})
		rs = fib_alicloud_sms.send(client, {
			PhoneNumbers: '15100000000',
			SignName: 'message test',
			TemplateCode: 'SMS_897787',
			TemplateParam: '{"code":"456789"}'
		})
		if (rs['Code'] == 'OK') {
			console.error('发送成功');
		} else {
			console.log('发送失败');
		}
	});
});

test.run(console.DEBUG);