var express = require('express');
var router = express.Router();
var eachDate = require('../libs/eachDateLib');
var TaskModel = require('../libs/mongoose').TaskModel;

/* GET home page. */
router.get('/', function(req, res, next) {

   TaskModel.find().sort({ sort : -1}).exec(function(err, task){

      if (!err) {

         res.render('index', {title: 'TamTwo — task manager', task:task, eachDate:eachDate()});
      } else {
         
         res.statusCode = 500;
         console.log('Internal error(%d): %s',res.statusCode,err.message);
         res.send({ error: 'Server error' });
      }
   });
});

module.exports = router;
