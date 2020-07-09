/***
 * Resource Manager Backend v1.0
 *
 * This is the REST API for the Resource Manager Application
 * Dependencies:
 * Node version > 8.x
 * EXPRESS
 * mongoose - a mongo DB client in node js
 * cors - cross origin request helper
 * multer - a node js library for supporting multiple file handling
 */
"use strict";

// Import dependencies
const express = require("express");
const http = require("http");
const path = require("path");
var fs = require("fs");
var mongo = require("mongoose");
var cors = require("cors");
var multer = require("multer");
var app = express();

// Handle CORS requests by setting response headers and forward the requests to corresponding REST paths
cors();
app.use(function (req, res, next) {
  if (req.method === "OPTIONS") {
    console.log("OPTIONS!! Setting headers now ...");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, response-type"
    );
  } else if (
    req.method === "GET" ||
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "DELETE"
  ) {
    setResponse(req, res);
  }
  next();
});

/***
 * Storage Handler for writing files on the disk
 * This handles image uploads by writing the uploaded blob file to the disk in the specified destination
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, req.params.name + ".jpg");
  },
});
var upload = multer({
  storage: storage,
}).single("file");

/***
 * REST handler for downloading requested image
 * The image will be identified using the itemName passed in the request
 */
function download(req, res) {
  var filename = req.params.name + ".jpg";
  var filePath = path.join(__dirname, "uploads", filename);
  var stat = fs.statSync(filePath);
  try {
    var fileToSend = fs.readFileSync(filePath);
    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", stat.size);
    res.set("Content-Disposition", filename);
    res.send(fileToSend);
  } catch (e) {
    res.writeHead(404);
    res.end("File not Found!!");
  }
}

//connect to mongoDB and create ItemDB
mongo.connect("mongodb://localhost/ItemDB");
//create a schema
var ItemSchema = new mongo.Schema({
  ItemId: String,
  ItemName: String,
  ItemKey: String,
  ItemType: String,
});
//Create a model based on the schema
var Item = mongo.model("Item", ItemSchema);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
("use strict");

/***
 * REST handler for updating entities
 */
function update(req, res) {
  Item.findOneAndUpdate(
    { ItemId: req.params.id },
    {
      ItemId: req.body.ItemId,
      ItemName: req.body.ItemName,
      ItemKey: req.body.ItemKey,
      ItemType: req.body.ItemType,
    },
    function (err) {
      if (err) {
        res.end(JSON.stringify("Something went wrong!! Please try later"));
      } else {
        res.end(JSON.stringify("Item Updated Successfully"));
      }
    }
  );
}

/***
 * REST handler for returning all entities
 */
function getAll(req, res) {
  Item.find({}, function (err, data) {
    if (err || data == null) {
      //res.setHeader("Access-Control-Allow-Origin", "*");
      //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.end(JSON.stringify("Something went wrong!! Please try later"));
    } else {
      //res.setHeader("Access-Control-Allow-Origin", "*");
      //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.end(JSON.stringify(data));
    }
  });
}

/***
 * REST handler for returning matching entity by id
 */
function getItem(req, res) {
  Item.findOne({ ItemId: req.params.id }, function (err, data) {
    if (err || data == null) {
      res.end(JSON.stringify("Requested Item does not exist"));
    } else {
      res.end(JSON.stringify(data));
    }
  });
}

/***
 * REST handler for creating new entities
 */
function postItem(req, res) {
  console.log(req.body);
  var devId = 101;
  var itemList;
  Item.find({}, function (err, data) {
    if (err) {
      console.log(err);
      res.end(JSON.stringify("Something went wrong!! Please try later"));
    } else {
      console.log(data.length);
      if (data.length != 0) {
        devId = parseInt(data[data.length - 1].ItemId) + 1;
        console.log(data[data.length - 1]);
      }
      Item.create(
        {
          ItemId: devId,
          ItemName: req.body.ItemName,
          ItemKey: req.body.ItemKey,
          ItemType: req.body.ItemType,
        },
        function (err, data) {
          if (err || data == null) {
            res.end(JSON.stringify("Something went wrong!! Please try later"));
          } else {
            res.end(JSON.stringify("Item Added Successfully"));
          }
        }
      );
    }
  });
}

/***
 * REST handler for deleting entities by id
 */
function deleteItem(req, res) {
  Item.findOneAndRemove({ ItemId: req.params.id }, function (err) {
    if (err) {
      res.end(JSON.stringify("No such Item Found!!"));
    } else {
      res.end(JSON.stringify("Item Deleted Successfully"));
    }
  });
}

// all environments
app.set("port", process.env.PORT || 3050);
// Use this to add front-end for testing
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
const stylus = require("stylus");
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

/***
 * Adds response headers to handle cross origin requests
 */
function setResponse(req, res) {
  console.log("setting headers");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
}

// Routing with REST paths
app.get("/", (req, res) => getAll(req, res));
app.get("/:id", (req, res) => getItem(req, res));
app.post("/", (req, res) => postItem(req, res));
app.post("/:id", (req, res) => update(req, res));
app.post("/del/:id", (req, res) => deleteItem(req, res));
app.post("/api/upload/:name", function (req, res) {
  console.log("setting headers");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.json({ error_code: 0, err_desc: null });
  });
});
app.get("/api/download/:name", (req, res) => download(req, res));

/***
 * Creates a server for the application on port specified by app.set("port")
 */
http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
