'use strict';

const DysmsapiClient = require('../../@alicloud/dysmsapi/client')
const DYSMSAPI_ENDPOINT = 'http://dysmsapi.aliyuncs.com'

class SMSClient {
    constructor(options) {
        let {
            accessKeyId,
            secretAccessKey
        } = options
        if (!accessKeyId) {
            throw new TypeError('parameter "accessKeyId" is required');
        }
        if (!secretAccessKey) {
            throw new TypeError('parameter "secretAccessKey" is required');
        }
        this.dysmsapiClient = new DysmsapiClient({
            accessKeyId,
            secretAccessKey,
            endpoint: DYSMSAPI_ENDPOINT
        })
        this.expire = []
        this.mnsClient = []
    }
    sendSMS(params) {
        return this.dysmsapiClient.sendSms(params)
    }
}

module.exports = SMSClient