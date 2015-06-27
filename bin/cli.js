#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var name = process.argv[2];

var projDir = path.join(process.cwd(), name);

var scaffold = path.join(path.dirname(__dirname), 'scaffold');

var cpCmd = 'cp -rf ' + scaffold + ' ' + projDir;
exec(cpCmd, function (err, stdout, stderr) {
    if (err) throw err;

    exec('git config --get user.name', function(err, stdout, stderr) {
        if(err) throw err;
        var author = stdout.replace(/[\n\r]/g, '');
        var content = fs.readFileSync(projDir + '/package.json', 'utf8');
        content = content.replace(/__NAME__/g, name);
        content = content.replace(/__AUTHOR__/, author);
        fs.writeFileSync(projDir + '/package.json', content);

        fs.mkdirSync(path.join(projDir, 'src'));
        fs.mkdirSync(path.join(projDir, 'src/assets'));
        fs.mkdirSync(path.join(projDir, 'src/views'));
    });
});
