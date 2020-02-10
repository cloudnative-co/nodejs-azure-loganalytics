# AzureLogAnalytics for Node.js
Node.jsにてAzureLogAnalyticsにログを送信する為のライブラリです。

# npmにて使用する方法
*pacjage.json*内の*dependencies*に`"loganalytics": "git+ssh@github.com:cloudnative-co/nodejs-azure-loganalytics.git"`を追加します。
```{
  "name": "foo",
  "version": "1.0.0",
  "description": "foo bar",
  "private": true,
  "main": "app.js",
  "dependencies": {
    "loganalytics": "git+ssh@github.com:cloudnative-co/nodejs-azure-loganalytics.git"
  }
}
```

*package.json*の修正が行わたらnpmにてインストールを実行し使用します
```
npm install
```
