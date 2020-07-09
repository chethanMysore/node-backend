var Service = require('node-windows').Service;
var myService = new Service({
    name: 'super-hero-server',
    description: 'This server loads Node app for Super Hero as a windows service ',
    script: 'app.js'
});
myService.on('install', function () {
    myService.start();
});
myService.install();