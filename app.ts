import express = require('express');
import routes = require('./routes/index');
import user = require('./routes/user');
import http = require('http');
import https = require('https');
import path = require('path');
var fs = require('fs');
var mongo = require('mongoose');
var cors = require('cors');
var multer = require('multer');

var app = express();
app.use(function (req, res, next) {   
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS!! Setting headers now ...');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    else if(req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'){
        setResponse(req,res);
    }
    next();
});

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, req.params.name + ".jpg")
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

function download(req, res) {
    var filename = req.params.name + ".jpg";
    var filePath = path.join(__dirname, 'uploads', filename);
    var stat = fs.statSync(filePath);
    try {
        var fileToSend = fs.readFileSync(filePath);
        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Length', stat.size);
        res.set('Content-Disposition', filename);
        res.send(fileToSend);
    }
    catch (e) {
        res.writeHead(404);
        res.end("File not Found!!");
    }
};

//connect to mongoDB and create DeviceDB
mongo.connect('mongodb://localhost/DeviceDB');
//create a schema
var DeviceSchema = new mongo.Schema({
    DeviceId: String,
    DeviceName: String,
    DeviceKey: String,
    DeviceType: String,
});

//Create a model basedc on the schema
var Device = mongo.model('Device', DeviceSchema);

////create a device in memory
//var device = new Device({
//     id: '101', DeviceId: '101', DeviceName: 'iPhone', DeviceKey: 'APPLE123', DeviceType: 'Mobile', Result: ''
//});
////save it to memory
//device.save(function (err) {
//    if (err)
//        console.log(err);
//    else
//        console.log(device);
//});

//Device.find({}, function (err, data) {
//    if (err) {
//        return console.log(err);
//    }
//    else {
//        console.log(data);
//    }
//});

//Device.update({ DeviceId: '102' }, { DeviceType: 'PalmTop' }, function (err) {
//    if (err) {
//        console.log(err);
//    }
//    else {
//        console.log('Update Successful');
//    }
//});

//Device.remove({}, function (err) {
//    if (err) {
//        console.log(err);
//    }
//    else {
//        console.log('delete successful');
//    }
//});


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

"use strict";

function update(req, res) {
    
    Device.findOneAndUpdate({ DeviceId: req.params.id }, { DeviceId: req.body.DeviceId, DeviceName: req.body.DeviceName, DeviceKey: req.body.DeviceKey, DeviceType: req.body.DeviceType }, function (err) {
        if (err) {
            res.end(JSON.stringify('Something went wrong!! Please try later'));
        }
        else {
            res.end(JSON.stringify('Device Updated Successfully'));
        }
    });
}

function getAll(req, res) {   
    Device.find({}, function (err,data) {
        if (err || data == null) {
            //res.setHeader("Access-Control-Allow-Origin", "*");
            //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(JSON.stringify('Something went wrong!! Please try later'));
        }
        else {
            //res.setHeader("Access-Control-Allow-Origin", "*");
            //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(JSON.stringify(data));
        }
    });
}

function getDevice(req, res) {
   
    Device.findOne({ DeviceId: req.params.id }, function (err,data) {
        if (err || data == null) {
            res.end(JSON.stringify('Requested Device does not exist'));
        }
        else {
            res.end(JSON.stringify(data));
        }
    });
}

function postDevice(req, res) {

    console.log(req.body);
    var devId = 101;
    var deviceList;
    Device.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.end(JSON.stringify('Something went wrong!! Please try later'));
        }
        else {
           console.log(data.length);

           if (data.length != 0) {
               devId = parseInt(data[data.length - 1].DeviceId) + 1;

                console.log(data[data.length - 1]);
            }
            Device.create({ DeviceId: devId, DeviceName: req.body.DeviceName, DeviceKey: req.body.DeviceKey, DeviceType: req.body.DeviceType }, function (err, data) {
                if (err || data == null) {
                    res.end(JSON.stringify('Something went wrong!! Please try later'));
                }
                else {
                    res.end(JSON.stringify('Device Added Successfully'));
                }
            }); 
        }
    }); 
}

function deleteDevice(req, res) {
   
    Device.findOneAndRemove({ DeviceId: req.params.id }, function (err) {
        if (err) {
            res.end(JSON.stringify('No such Device Found!!'));
        }
        else {
            res.end(JSON.stringify('Device Deleted Successfully'));
        }
    });
}


//app.use(express.static('./'));

// all environments
app.set('port', process.env.PORT || 3050);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

function setResponse(req, res) {
    console.log('setting headers');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
};

app.get('/', (req, res) => getAll(req, res));
app.get('/:id', (req, res) => getDevice(req, res));
app.post('/', (req, res) => postDevice(req, res));
app.post('/:id', (req, res) => update(req, res));
app.post('/del/:id', (req, res) => deleteDevice(req, res));

app.post('/api/upload/:name', function (req, res) {
    console.log('setting headers');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    })
});

app.get('/api/download/:name', (req, res) => download(req, res));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
