# static-scaffold
a scaffold for develop and build static website fast.

## Features

* fast bootstrap a static website project
* local preview(no need to config nginx or apache)
* support template engine like `jade`, `swig`
* supoort live-reload
* build static files(compile jade or swig templates)
* build with both gulp and grunt  (*in dev*)
* fast deploy with ftp or other ways (*in plan*)
* support less, sass
* still planning...


## Install
```
$ npm i -g static-scaffold
```

## Bootstrap
```
$ scaffold demo
```

## Usage

### Preview && develop

change to your 'demo' dir

```sh
$ cd demo
```

install node deps
```
$ npm i
```

start local server
```
$ node --harmony app.js
```

or, when you're developing, you can start a live-reload server:
```
$ node --harmony gulp live
```

visit `http://localhost:8300`

### Build

```
$ gulp  build
```

This command will build static website into `./dist` dir.

*Currently in dev now. :)*