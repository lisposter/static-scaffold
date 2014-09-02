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

## Init Proj
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

### How it works
First, we defined two mode:

* `live`: which is useful when developing, it will auto reload page if any source file changed.
* `build`: which is for building the final static website files.

with the default gulpfile, here are the workflows:

#### local server:
We use [koa](https://github.com/koajs/koa) and some middlewares to build our http server, so we perfectly don't need nginx or apache.

#### html:
__`live`__: with `jade` or `swig` will be rendered instant by koa middlewares. It doesn't write file in `live`.

__`build`__: we use [gulp](http://gulpjs.com/) plugins to build html files. It will generate .html files into `dist` with the same dir structure in `src`

#### js:
__`live`__: it will be loaded just right in `src` dir by `koa-static`.

__`build`__: we just copy .js files from `src` to `dist`(may be changed in the future)

#### css:
__`live`__: `less`, `sass` files will be compiled into `dist` dir, and then servered by `koa-static`. The vanilla css files will be servered as the other  `assets` files.

__`build`__: `less`, `sass` files will be compiled into `dist/css` dir.

#### others: 
others files in `src/assets` will serverd by `koa-static` in __`live`__ , and copied into `dist/assets` when __`builc`__


#### compress:
everything in `dist/css` and `dist/js` will be compressed into a combined js or css files and be renamed with hash to fight with browser's cache.


