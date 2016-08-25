/**
 * Created by Micro on 23.08.2016.
 */
var express = require('express');
var router = express.Router();
var TaskModel = require('../libs/mongoose').TaskModel;


router.post('/', function(req, res) {

    var dataSort = req.body, result = [], revers = dataSort.l;

    delete dataSort.l;

    for(k in dataSort){

        result.push({sort: revers, id:dataSort[k]});

        revers--;
    }

    Promise.all(
        result.map( function (v) {

            return TaskModel.findOneAndUpdate({_id: v.id}, {$set: {sort: v.sort}}, {new: true}, function (err, doc) {});
        })
        ).then(function (data) {
            //console.log("sortItems then:", data);
            return res.status(200).json({
                message: 'Sort success apply!',
                data: data
            });
        }).catch(function (err) {
            if (err) {
                //
            }
            console.log("sortItems catch:", err.message);
            return res.status(500).json({
                error: true,
                messages: errors
            });
        });
});

module.exports = router;