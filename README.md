#fib-alicloud-sms
1.支持阿里云平台短信验证码发送功能。

# Install

```bash
$ npm install fib-alicloud-sms
```

# Usage


```
var fib_alicloud_sms = require("fib-alicloud-sms");

var client = fib_alicloud_sms.smsclient({
				accessKeyId: 'accessKeyId',
				secretAccessKey: 'secretAccessKey'
			 });		//替换实际KeyId和AccessKey值，初始化客户端。
			 
fib_alicloud_sms.send(client, {
	PhoneNumbers: '15100000000',
	SignName: 'message test',
	TemplateCode: 'SMS_96945021',
	TemplateParam: '{"code":"255277"}'
});			//替换实际业务参数，发送信息。

```