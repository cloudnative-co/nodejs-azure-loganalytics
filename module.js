const crypto = require('crypto');
const {promisify} = require('util');
const  request = promisifyRequest(require('request'));


function promisifyRequest(req) {
    return function(options) {
        let args = [options];
        return new Promise ( (resolve, reject) => {
            args.push(
                (e, response, body) => {
                    if (response) {
                        if (response.statusCode >= 200 && response.statusCode <= 299){
                            return resolve({
                                "status": response.statusCode,
                                "message": response.statusMessage,
                                "error": null,
                                "response": response,
                                "body": body
                            });
                        } else {
                            var msg = JSON.parse(body)
                            return reject({
                                "status": response.statusCode,
                                "message": msg.Message,
                                "error": msg.Error,
                                "response": response,
                                "body": body
                            });
                        }
                    }
                    else if (e) {
                        return reject({
                            "status": null,
                            "message": null,
                            "error": e,
                            "response": response,
                            "body": body
                        });
                    }
                }
            );
            req.apply(null, args);
        });
    };
}
/*
 @brief         初期化
 @params[in]    workspaceId(str)    L   og Analytics ワークスペースの一意識別子
 @params[in]    shardKey(str)           PrimaryKeyを指定
 @params[in]    apiVersion(str)         APIバージョンを指定
 @n                                     無指定で2016-04-01
*/
function mdlClient(workspaceId, sharedKey, apiVersion = '2016-04-01') {
    this.workspaceId = workspaceId;
    this.sharedKey = sharedKey;
    this.apiVersion = apiVersion;
}
/*
 @brief         Authorizationヘッダーの作成
 @params[in]    contentLength(str)      送信するデータの長さを指定
 [params[in]    processingDate(str)     RFC1123による要求処理日付を指定
*/
mdlClient.prototype.createAuth = function createAuth(contentLength, processingDate) {
    const stringToSign = 'POST\n' + contentLength + '\napplication/json\nx-ms-date:' + processingDate + '\n/api/logs';
    const signature = crypto.createHmac('sha256', new Buffer.from(this.sharedKey, 'base64')).update(stringToSign, 'utf-8').digest('base64');
    const authorization = 'SharedKey ' + this.workspaceId + ':' + signature;
    return authorization
}
/*
 @brief         ログの送信
 @params[in]    data[list)              送信するログデータ
 @params[in]    logType(str)            送信中のデータのレコード型
 @params[in]    azureResourceId(str)    データを関連付けるAzureリソースID
 @params[in]    timeGenerated(str)      データ項目の日時を含むフィールドの名
*/
mdlClient.prototype.postLog = function postLog(data, logType, azureResourceId, timeGenerated) {
    const processingDate = new Date().toUTCString();
    const body = JSON.stringify(data)
    const contentLength = Buffer.byteLength(body)
    const authorization = this.createAuth(contentLength, processingDate)
    const headers = {
        "content-type": "application/json",
        "Authorization": authorization,
        "Log-Type": logType,
        "x-ms-date": processingDate
    };
    if (AzureResourceId != undefined) {
        headers["x-ms-AzureResourceId"] = azureResourceId
    }
    if (timeGenerated) {
        headers["time-generated-field"] = timeGenerated
    }
    const url = 'https://' + this.workspaceId  + '.ods.opinsights.azure.com/api/logs?api-version=' + this.apiVersion
    options = {
        url: url,
        headers: headers,
        method: 'POST',
        body: body
    }
    return
    return request(options)
};

module.exports = mdlClient;
