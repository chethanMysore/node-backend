var Service = require('node-windows').Service;
var myService = new Service({
    name: 'super-hero-mongo',
    description: 'This service starts mongo daemon for Super Hero as a windows service ',
    script: 'mongoDaemon.ps1'
});
myService.on('install', function () {
    myService.start();
});
myService.install();