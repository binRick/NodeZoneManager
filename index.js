#!/usr/bin/env node

var zonefile = require('dns-zonefile'),
    express = require('express'),
    Config = {
        HTTP_API: 'http://208.77.103.188:8082/',
        ZONES_LIST_FILE: '/etc/Zones.yml',
    },
    yaml = require('js-yaml'),
    fs = require('fs'),
    app = new express(),
    request = require('request'),
    _ = require('underscore');
var getZone = function(req, res) {
    if (!validZone(req.params.ZONE))
        res.end('Invalid zone request');
    else
        request.get(Config.HTTP_API + req.params.ZONE).pipe(res);
};
var validZone = function(zone) {
    return _.contains(readZones(), zone);
};
var readZones = function() {
    return yaml.safeLoad(fs.readFileSync(Config.ZONES_LIST_FILE, 'utf8')).Zones.map(function(s) {
        return s.replace(/in-addr.arpa/g, 'rev');
    });
};
app.get('/Zones', function(req, res) {
    res.json(readZones());
});
app.get('/Zone/reverse/:ZONE', function(req, res) {
    req.params.ZONE = 'reverse/' + req.params.ZONE;
    getZone(req, res);
});
app.get('/Zone/:ZONE', function(req, res) {
    getZone(req, res);
});
app.get('/', function(req, res) {
    res.end('something');
});


app.listen(process.env.PORT || 80, process.env.HOST || '0.0.0.0');
