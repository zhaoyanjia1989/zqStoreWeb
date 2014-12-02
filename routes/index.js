var express = require('express');
var superagent = require('superagent');
var storeUtil = require('../util/storeUtil');

var router = express.Router();

/* 首页跳转*/
router.get('/',function(req, res){
	res.redirect("/android/index");
});

module.exports = router;