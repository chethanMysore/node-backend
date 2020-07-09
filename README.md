# Resource Manager Service
This is a REST service for Resource Manager application at the Illinois Tech University. The APIs are written in **node js** and **EXPRESS** framework. The service consists of 5 different endpoints: <br/>
 - getAll - Returns all items
 - getItem - Returns matching item by itemId
 - postItem - Creates new item
 - updateItem - Updates existing item by itemId
 - deleteItem - Deletes existing item by itemId
 - upload - Uploads an image with filename as itemName
 - download - Retrieves specified image
 
## System Requirements
 - *nodejs* version > 8.x [download here](https://nodejs.org/en/)
 - *npm version* > 6.x (Usually included with nodejs)
 - *mongoDBCommunityEdition* [download here](https://docs.mongodb.com/manual/administration/install-community/)
 
## Build Instructions
Run mongo daemon service to open connection to local data server
```cmd
mongod --dbpath <Path to data storage directory here>
```
Install Dependencies
```cmd
npm install
```
Build and run the service
```cmd
node app
```
The application will be running at http://localhost:3050. <br/>
Port number can be set using app.use("port") in the app.js.
