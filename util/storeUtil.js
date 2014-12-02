/*
 * 字符串辅助
 */
var crypto = require('crypto');  




/*创建API参数路径 */
exports.createPreString = function (path,params,system){
  //':param/:system/:deviceId/:versionCode/:mac/:ip/:adv/:timestamp/:sign'
  var param,appkeyCode ;
  var deviceId = system=='0'?'unitTest':'unitTestWP';
  var appkey = system=='0'?'8080':'8081';
  var versionCode = '0';
  var mac = '1:2:3:4';
  var ip = '8.8.8.8';
  var adv = 'unit';
  var timestamp = new Date().getTime();

  if(path==='app-init'){
    param='0';
    appkeyCode='my0q7f4rqm9k4ib1wfrsakf4';
  } else if (path ==='appcheck'||path ==='search'||path ==='rank'||path ==='sublist'||path ==='broadcastupload'){
    param='0';
    appkeyCode=appkey;
  } else{
    param=getFirstParam(params);
    appkeyCode=appkey;
  }
  var str = '';
  str+=param;
  str+=system;
  str+=deviceId;
  str+=versionCode;
  str+=mac;
  str+=ip;
  str+=adv;
  str+=timestamp;
  str+=appkeyCode;

  var sha = crypto.createHash('sha1');
  sha.update(str);
  var sign =  sha.digest('hex');
  var url = params+'/'+system+'/'+deviceId+'/'+versionCode+'/'+mac+'/'+ip+'/'+adv+'/'+timestamp+'/'+sign;
  return url;
}

/* 获取第一个参数*/
function getFirstParam(str){
  var paramArr = str.split('&');
  if (paramArr.length>0) {
    var keyArr = paramArr[0].split('=');
    if (keyArr.length==2) {
      return keyArr[1];
    }
  }
  return '0';
}

String.prototype.isJSON = function () {
    var str = this;
    if (str.blank()) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
}