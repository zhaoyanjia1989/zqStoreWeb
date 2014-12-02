var express = require('express');
var superagent = require('superagent');
var storeUtil = require('../util/storeUtil');
var log4js = require('log4js');
var log = log4js.getLogger("app");

var router = express.Router();


var URLSTRING = 'androidstore.zqgame.com';
//var URLSTRING = 'localhost:9080';
var PAGESIZE = 10;
/* GET home page. */
router.get('/', function(req, res) {
	 res.redirect("/winphone/index");
});

/*推荐首页*/
router.get('/index', function(req, res) {
	var data = req.query;
	var type = data['type']||12;
	var title = "";
	var url = URLSTRING+'/app-index/'+storeUtil.createPreString('app-index','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	switch(Number(type)) {
    case 12:
        title="热门";
        break;
    case 15:
        title="游戏";
        break;
    case 13:
        title="应用";
        break;
    case 14:
        title="最新";
        break;
	}
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: response.message,
		        error: {}
		    });
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.render('winphone/applist',{title:title,app:result.data.app.resList,adv:result.data.adv.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE});
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});

/*应用详情*/
router.get('/appinfo',function(req,res){
	var appId = req.query.appId;
	var url = URLSTRING+'/appinfo/'+storeUtil.createPreString('appinfo','appId='+appId,'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: error.message,
		        error: {}
		    }).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			var commentUrl = URLSTRING+'/comment-list/'+storeUtil.createPreString('comment-list','appId='+appId+'&pageSize='+PAGESIZE+'&pageNum=1','1');
			superagent
				.get(commentUrl)
				.set('Accept', 'application/json')
				.end(function(error, response){
					if(error){
					    log.error(error);
					    res.status(response.status || 500);
					    res.render('error', {
					        message: error.message,
					        error: {}
					    }).end();
					}
					if(response.status==200){
						var commentResult = JSON.parse(response.text);
						result.app.infoImgDetail=[];
						result.app.infoImg.forEach(function(img){
							result.app.infoImgDetail.push(img.substr(0,img.lastIndexOf("."))+"_detail"+img.substr(img.lastIndexOf(".")));
						})
						res.render('winphone/appinfo',{title:'应用详情',app:result.app,typeList:result.typeList,appId:appId,commentList:commentResult.commentList,pageNum:1,pageSize:PAGESIZE});
					}
					else{
				    res.status(response.status || 500);
				    res.render('error', {
				        message: response.message,
				        error: {}
				    });
					}
			  });
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});

/*分类专题*/
router.get('/classify',function(req,res){
	var data = req.query;
	var type = data['type']||1;
	var title = "应用";
	var url = URLSTRING+'/classify/'+storeUtil.createPreString('classify','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	switch(Number(type)) {
    case 0:
        title="应用分类";
        break;
    case 1:
        title="专题评测";
        break;
	}
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: error.message,
		        error: {}
		    }).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.render('winphone/apptypes',{title:title,appTypeList:result.data.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE});
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});

/*榜单*/
router.get('/rank',function(req,res){
	var data = req.query;
	var type = data['type']||12;
	var title = "总排行";
	var url = URLSTRING+'/rank/'+storeUtil.createPreString('rank','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	switch(Number(type)) {
    case 12:
        title="总排行";
        break;
    case 15:
        title="游戏榜";
        break;
    case 14:
        title="应用榜";
        break;
	}
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: error.message,
		        error: {}
		    });
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.render('winphone/ranklist',{title:title,app:result.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE});
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});




/* 搜索应用*/
router.get('/search',function(req, res){
	var data = req.query;
	var title = "'"+data['appName']+"'搜索结果";
	var url = URLSTRING+'/search/'+storeUtil.createPreString('search','appName='+data['appName']+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: error.message,
		        error: {}
		    });
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.render('winphone/searchlist',{title:title,app:result.resList,appName:data['appName'],pageNum:(data['pageNum']||1),pageSize:PAGESIZE});
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});


/*分类详情*/
router.get('/apptypeInfo', function(req, res) {
	var data = req.query;
	var type = data['type']||1;
	var title = "分类详情";
	var url = URLSTRING+'/sublist/'+storeUtil.createPreString('sublist','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.render('error', {
		        message: response.message,
		        error: {}
		    });
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.render('winphone/applistoftype',{title:title,app:result.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE});
		}
		else{
	    res.status(response.status || 500);
	    res.render('error', {
	        message: response.message,
	        error: {}
	    });
		}
  });
});



/*****************ajax*******************/

/* ajax  获取app列表*/
router.get('/loadAppList',function(req, res){
	var data = req.query;
	var type = data['type']||12;
	var url = URLSTRING+'/app-index/'+storeUtil.createPreString('app-index','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.send({message:response.message,error: error}).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.send({app:result.data.app.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE}).end();
		}
		else{
	    res.status(response.status || 500);
	    res.send({message:response.message,error: {}}).end();
		}
  });
});

/* ajax  获取评论列表*/
router.get('/loadCommentList',function(req,res){
	var data = req.query;
	var appId = data['appId'];
	var url = URLSTRING+'/comment-list/'+storeUtil.createPreString('comment-list','appId='+appId+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.send({message:response.message,error: error}).end();
		}
		if(response.status==200){
			var commentResult = JSON.parse(response.text);
			res.send({appId:appId,commentList:commentResult.commentList,pageNum:(data['pageNum']||1),pageSize:PAGESIZE}).end();
		}
		else{
	    res.status(response.status || 500);
	    res.send({message: response.message,error: {}}).end();
		}
  });
});

/* ajax  获取榜单列表*/
router.get('/loadRankList',function(req, res){
	var data = req.query;
	var type = data['type']||12;
	var url = URLSTRING+'/rank/'+storeUtil.createPreString('rank','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.send({message:response.message,error: error}).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.send({app:result.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE}).end();
		}
		else{
	    res.status(response.status || 500);
	    res.send({message:response.message,error: {}}).end();
		}
  });
});

/* ajax  获取搜索列表*/
router.get('/loadSearchList',function(req, res){
	var data = req.query;
	var url = URLSTRING+'/search/'+storeUtil.createPreString('search','appName='+data['appName']+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.send({message:response.message,error: error}).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.send({app:result.resList,appName:data['appName'],pageNum:(data['pageNum']||1),pageSize:PAGESIZE}).end();
		}
		else{
	    res.status(response.status || 500);
	    res.send({message:response.message,error: {}}).end();
		}
  });
});

/* ajax  获取分类详情列表*/
router.get('/loadAppTypeInfoList',function(req, res){
	var data = req.query;
	var type = data['type']||1;
	var url = URLSTRING+'/sublist/'+storeUtil.createPreString('sublist','type='+type+'&pageSize='+PAGESIZE+'&pageNum='+(data['pageNum']||1),'1');
	superagent
	.get(url)
	.set('Accept', 'application/json')
	.end(function(error, response){
		if(error){
		    log.error(error);
		    res.status(response.status || 500);
		    res.send({message:response.message,error: error}).end();
		}
		if(response.status==200){
			var result = JSON.parse(response.text);
			res.send({app:result.resList,type:type,pageNum:(data['pageNum']||1),pageSize:PAGESIZE}).end();
		}
		else{
	    res.status(response.status || 500);
	    res.send({message:response.message,error: {}}).end();
		}
  });
});


module.exports = router;
