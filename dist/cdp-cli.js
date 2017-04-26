/*!
 * cdp-cli.js 0.0.1
 *
 * Date: 2017-04-26T05:55:20.905Z
 */

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/     // The module cache
/******/     var installedModules = {};
/******/
/******/     // The require function
/******/     function __webpack_require__(moduleId) {
/******/
/******/         // Check if module is in cache
/******/         if(installedModules[moduleId]) {
/******/             return installedModules[moduleId].exports;
/******/         }
/******/         // Create a new module (and put it into the cache)
/******/         var module = installedModules[moduleId] = {
/******/             i: moduleId,
/******/             l: false,
/******/             exports: {}
/******/         };
/******/
/******/         // Execute the module function
/******/         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/         // Flag the module as loaded
/******/         module.l = true;
/******/
/******/         // Return the exports of the module
/******/         return module.exports;
/******/     }
/******/
/******/
/******/     // expose the modules object (__webpack_modules__)
/******/     __webpack_require__.m = modules;
/******/
/******/     // expose the module cache
/******/     __webpack_require__.c = installedModules;
/******/
/******/     // identity function for calling harmony imports with the correct context
/******/     __webpack_require__.i = function(value) { return value; };
/******/
/******/     // define getter function for harmony exports
/******/     __webpack_require__.d = function(exports, name, getter) {
/******/         if(!__webpack_require__.o(exports, name)) {
/******/             Object.defineProperty(exports, name, {
/******/                 configurable: false,
/******/                 enumerable: true,
/******/                 get: getter
/******/             });
/******/         }
/******/     };
/******/
/******/     // getDefaultExport function for compatibility with non-harmony modules
/******/     __webpack_require__.n = function(module) {
/******/         var getter = module && module.__esModule ?
/******/             function getDefault() { return module['default']; } :
/******/             function getModuleExports() { return module; };
/******/         __webpack_require__.d(getter, 'a', getter);
/******/         return getter;
/******/     };
/******/
/******/     // Object.prototype.hasOwnProperty.call
/******/     __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/     // __webpack_public_path__
/******/     __webpack_require__.p = "";
/******/
/******/     // Load entry module and return exports
/******/     return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(3)
var polyfills = __webpack_require__(42)
var legacy = __webpack_require__(41)
var queue = []

var util = __webpack_require__(54)

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    __webpack_require__(15).equal(queue.length, 0)
  })
}

module.exports = patch(__webpack_require__(14))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  module.exports = patch(fs)
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close =
fs.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync =
fs.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
  ReadStream.prototype.open = ReadStream$open

  var fs$WriteStream = fs.WriteStream
  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
  WriteStream.prototype.open = WriteStream$open

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  mkdirs: __webpack_require__(7),
  mkdirsSync: __webpack_require__(6),
  // alias
  mkdirp: __webpack_require__(7),
  mkdirpSync: __webpack_require__(6),
  ensureDir: __webpack_require__(7),
  ensureDirSync: __webpack_require__(6)
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const rimraf = __webpack_require__(38)

function removeSync (dir) {
  return rimraf.sync(dir, {disableGlob: true})
}

function remove (dir, callback) {
  const options = {disableGlob: true}
  return callback ? rimraf(dir, options, callback) : rimraf(dir, options, function () {})
}

module.exports = {
  remove,
  removeSync
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const jsonFile = __webpack_require__(45)

module.exports = {
  // jsonfile exports
  readJson: jsonFile.readFile,
  readJSON: jsonFile.readFile,
  readJsonSync: jsonFile.readFileSync,
  readJSONSync: jsonFile.readFileSync,
  writeJson: jsonFile.writeFile,
  writeJSON: jsonFile.writeFile,
  writeJsonSync: jsonFile.writeFileSync,
  writeJSONSync: jsonFile.writeFileSync,
  spaces: 2 // default in fs-extra
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const invalidWin32Path = __webpack_require__(13).invalidWin32Path

const o777 = parseInt('0777', 8)

function mkdirsSync (p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  let mode = opts.mode
  const xfs = opts.fs || fs

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    throw errInval
  }

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  p = path.resolve(p)

  try {
    xfs.mkdirSync(p, mode)
    made = made || p
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) throw err0
        made = mkdirsSync(path.dirname(p), opts, made)
        mkdirsSync(p, opts, made)
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        let stat
        try {
          stat = xfs.statSync(p)
        } catch (err1) {
          throw err0
        }
        if (!stat.isDirectory()) throw err0
        break
    }
  }

  return made
}

module.exports = mkdirsSync


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const invalidWin32Path = __webpack_require__(13).invalidWin32Path

const o777 = parseInt('0777', 8)

function mkdirs (p, opts, callback, made) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  } else if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    return callback(errInval)
  }

  let mode = opts.mode
  const xfs = opts.fs || fs

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  callback = callback || function () {}
  p = path.resolve(p)

  xfs.mkdir(p, mode, er => {
    if (!er) {
      made = made || p
      return callback(null, made)
    }
    switch (er.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) return callback(er)
        mkdirs(path.dirname(p), opts, (er, made) => {
          if (er) callback(er, made)
          else mkdirs(p, opts, callback, made)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        xfs.stat(p, (er2, stat) => {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (er2 || !stat.isDirectory()) callback(er, made)
          else callback(null, made)
        })
        break
    }
  })
}

module.exports = mkdirs


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
    return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copySync: __webpack_require__(23)
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// imported from ncp (this is temporary, will rewrite)

var fs = __webpack_require__(0)
var path = __webpack_require__(1)
var utimes = __webpack_require__(40)

function ncp (source, dest, options, callback) {
  if (!callback) {
    callback = options
    options = {}
  }

  var basePath = process.cwd()
  var currentPath = path.resolve(basePath, source)
  var targetPath = path.resolve(basePath, dest)

  var filter = options.filter
  var transform = options.transform
  var overwrite = options.overwrite
  // If overwrite is undefined, use clobber, otherwise default to true:
  if (overwrite === undefined) overwrite = options.clobber
  if (overwrite === undefined) overwrite = true
  var errorOnExist = options.errorOnExist
  var dereference = options.dereference
  var preserveTimestamps = options.preserveTimestamps === true

  var started = 0
  var finished = 0
  var running = 0

  var errored = false

  startCopy(currentPath)

  function startCopy (source) {
    started++
    if (filter) {
      if (filter instanceof RegExp) {
        console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
        if (!filter.test(source)) {
          return doneOne(true)
        }
      } else if (typeof filter === 'function') {
        if (!filter(source, dest)) {
          return doneOne(true)
        }
      }
    }
    return getStats(source)
  }

  function getStats (source) {
    var stat = dereference ? fs.stat : fs.lstat
    running++
    stat(source, function (err, stats) {
      if (err) return onError(err)

      // We need to get the mode from the stats object and preserve it.
      var item = {
        name: source,
        mode: stats.mode,
        mtime: stats.mtime, // modified time
        atime: stats.atime, // access time
        stats: stats // temporary
      }

      if (stats.isDirectory()) {
        return onDir(item)
      } else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
        return onFile(item)
      } else if (stats.isSymbolicLink()) {
        // Symlinks don't really need to know about the mode.
        return onLink(source)
      }
    })
  }

  function onFile (file) {
    var target = file.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
    isWritable(target, function (writable) {
      if (writable) {
        copyFile(file, target)
      } else {
        if (overwrite) {
          rmFile(target, function () {
            copyFile(file, target)
          })
        } else if (errorOnExist) {
          onError(new Error(target + ' already exists'))
        } else {
          doneOne()
        }
      }
    })
  }

  function copyFile (file, target) {
    var readStream = fs.createReadStream(file.name)
    var writeStream = fs.createWriteStream(target, { mode: file.mode })

    readStream.on('error', onError)
    writeStream.on('error', onError)

    if (transform) {
      transform(readStream, writeStream, file)
    } else {
      writeStream.on('open', function () {
        readStream.pipe(writeStream)
      })
    }

    writeStream.once('close', function () {
      fs.chmod(target, file.mode, function (err) {
        if (err) return onError(err)
        if (preserveTimestamps) {
          utimes.utimesMillis(target, file.atime, file.mtime, function (err) {
            if (err) return onError(err)
            return doneOne()
          })
        } else {
          doneOne()
        }
      })
    })
  }

  function rmFile (file, done) {
    fs.unlink(file, function (err) {
      if (err) return onError(err)
      return done()
    })
  }

  function onDir (dir) {
    var target = dir.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
    isWritable(target, function (writable) {
      if (writable) {
        return mkDir(dir, target)
      }
      copyDir(dir.name)
    })
  }

  function mkDir (dir, target) {
    fs.mkdir(target, dir.mode, function (err) {
      if (err) return onError(err)
      // despite setting mode in fs.mkdir, doesn't seem to work
      // so we set it here.
      fs.chmod(target, dir.mode, function (err) {
        if (err) return onError(err)
        copyDir(dir.name)
      })
    })
  }

  function copyDir (dir) {
    fs.readdir(dir, function (err, items) {
      if (err) return onError(err)
      items.forEach(function (item) {
        startCopy(path.join(dir, item))
      })
      return doneOne()
    })
  }

  function onLink (link) {
    var target = link.replace(currentPath, targetPath)
    fs.readlink(link, function (err, resolvedPath) {
      if (err) return onError(err)
      checkLink(resolvedPath, target)
    })
  }

  function checkLink (resolvedPath, target) {
    if (dereference) {
      resolvedPath = path.resolve(basePath, resolvedPath)
    }
    isWritable(target, function (writable) {
      if (writable) {
        return makeLink(resolvedPath, target)
      }
      fs.readlink(target, function (err, targetDest) {
        if (err) return onError(err)

        if (dereference) {
          targetDest = path.resolve(basePath, targetDest)
        }
        if (targetDest === resolvedPath) {
          return doneOne()
        }
        return rmFile(target, function () {
          makeLink(resolvedPath, target)
        })
      })
    })
  }

  function makeLink (linkPath, target) {
    fs.symlink(linkPath, target, function (err) {
      if (err) return onError(err)
      return doneOne()
    })
  }

  function isWritable (path, done) {
    fs.lstat(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') return done(true)
        return done(false)
      }
      return done(false)
    })
  }

  function onError (err) {
    // ensure callback is defined & called only once:
    if (!errored && callback !== undefined) {
      errored = true
      return callback(err)
    }
  }

  function doneOne (skipped) {
    if (!skipped) running--
    finished++
    if ((started === finished) && (running === 0)) {
      if (callback !== undefined) {
        return callback(null)
      }
    }
  }
}

module.exports = ncp


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const mkdir = __webpack_require__(2)
const jsonFile = __webpack_require__(5)

function outputJsonSync (file, data, options) {
  const dir = path.dirname(file)

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  jsonFile.writeJsonSync(file, data, options)
}

module.exports = outputJsonSync


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const mkdir = __webpack_require__(2)
const jsonFile = __webpack_require__(5)

function outputJson (file, data, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const dir = path.dirname(file)

  fs.exists(dir, itDoes => {
    if (itDoes) return jsonFile.writeJson(file, data, options, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)
      jsonFile.writeJson(file, data, options, callback)
    })
  })
}

module.exports = outputJson


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(1)

// get drive on windows
function getRootPath (p) {
  p = path.normalize(path.resolve(p)).split(path.sep)
  if (p.length > 0) return p[0]
  return null
}

// http://stackoverflow.com/a/62888/10333 contains more accurate
// TODO: expand to include the rest
const INVALID_PATH_CHARS = /[<>:"|?*]/

function invalidWin32Path (p) {
  const rp = getRootPath(p)
  p = p.replace(rp, '')
  return INVALID_PATH_CHARS.test(p)
}

module.exports = {
  getRootPath,
  invalidWin32Path
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(3)

module.exports = clone(fs)

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const command_parser_1 = __webpack_require__(17);
function main() {
    process.title = "cdp";
    const cmdlineInfo = command_parser_1.CommandParser.parse(process.argv);
    console.log("action: " + cmdlineInfo.action);
    console.log("target: " + cmdlineInfo.target);
}
exports.main = main;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(33);
const path = __webpack_require__(1);
const commander = __webpack_require__(20);
const chalk = __webpack_require__(19);
//___________________________________________________________________________________________________________________//
/**
 * @class CommandParser
 * @brief コマンドラインパーサー
 */
class CommandParser {
    ///////////////////////////////////////////////////////////////////////
    // public static methods
    /**
     * コマンドラインのパース
     *
     * @param  {String} argv       引数を指定
     * @param  {Object} [options]  オプションを指定
     * @returns {ICommandLineInfo}
     */
    static parse(argv, options) {
        const cmdline = {
            pkgDir: this.getPackageDirectory(argv),
        };
        const pkg = JSON.parse(fs.readFileSync(path.join(cmdline.pkgDir, "package.json"), "utf8").toString());
        commander
            .version(pkg.version)
            .option("-f, --force", "Continue execution even if in error situation")
            .option("-t, --targetdir <path>", "Specify project target directory")
            .option("-c, --config <path>", "Specify config file path")
            .option("-v, --verbose", "Show debug messages.")
            .option("-s, --silent", "Run as silent mode.");
        commander
            .command("init")
            .description("init project")
            .action(() => {
            cmdline.action = "init";
        })
            .on("--help", () => {
            console.log(chalk.green("  Examples:"));
            console.log("");
            console.log(chalk.green("    $ cdp init"));
            console.log("");
        });
        commander
            .command("create <target>")
            .description("create boilerplate for 'app' | 'module'")
            .action((target) => {
            if (/^(app|module)$/i.test(target)) {
                cmdline.action = "create";
                cmdline.target = target;
            }
            else {
                console.log(chalk.red.underline("  unsupported target: " + target));
                this.showHelp();
            }
        })
            .on("--help", () => {
            console.log(chalk.green("  Examples:"));
            console.log("");
            console.log(chalk.green("    $ cdp create app"));
            console.log(chalk.green("    $ cdp create module"));
            console.log(chalk.green("    $ cdp create app -c setting.json"));
            console.log("");
        });
        commander
            .command("*", null, { noHelp: true })
            .action((cmd) => {
            console.log(chalk.red.underline("  unsupported command: " + cmd));
            this.showHelp();
        });
        commander.parse(argv);
        if (argv.length <= 2) {
            this.showHelp();
        }
        cmdline.cliOptions = this.toCommandLineOptions(commander);
        return cmdline;
    }
    ///////////////////////////////////////////////////////////////////////
    // private static methods
    /**
     * CLI のインストールディレクトリを取得
     *
     * @param  {String[]} argv 引数
     * @return {String} インストールディレクトリ
     */
    static getPackageDirectory(argv) {
        const execDir = path.dirname(argv[1]);
        return path.join(execDir, "..");
    }
    /**
     * CLI option を ICommandLineOptions に変換
     *
     * @param  {Object} commander parse 済み comannder インスタンス
     * @return {ICommandLineOptions} option オブジェクト
     */
    static toCommandLineOptions(commander) {
        return {
            force: !!commander.force,
            targetdir: commander.targetdir,
            config: commander.config,
            verbose: !!commander.verbose,
            silent: !!commander.silent,
        };
    }
    /**
     * ヘルプ表示して終了
     */
    static showHelp() {
        const inform = (text) => {
            return chalk.green(text);
        };
        commander.outputHelp(inform);
        process.exit(1);
    }
}
exports.CommandParser = CommandParser;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

function assembleStyles () {
    var styles = {
        modifiers: {
            reset: [0, 0],
            bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
        },
        colors: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            gray: [90, 39]
        },
        bgColors: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49]
        }
    };

    // fix humans
    styles.colors.grey = styles.colors.gray;

    Object.keys(styles).forEach(function (groupName) {
        var group = styles[groupName];

        Object.keys(group).forEach(function (styleName) {
            var style = group[styleName];

            styles[styleName] = group[styleName] = {
                open: '\u001b[' + style[0] + 'm',
                close: '\u001b[' + style[1] + 'm'
            };
        });

        Object.defineProperty(styles, groupName, {
            value: group,
            enumerable: false
        });
    });

    return styles;
}

Object.defineProperty(module, 'exports', {
    enumerable: true,
    get: assembleStyles
});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(48)(module)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var escapeStringRegexp = __webpack_require__(21);
var ansiStyles = __webpack_require__(18);
var stripAnsi = __webpack_require__(46);
var hasAnsi = __webpack_require__(44);
var supportsColor = __webpack_require__(47);
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
    // detect mode if not set manually
    this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
    ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
    var ret = {};

    Object.keys(ansiStyles).forEach(function (key) {
        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

        ret[key] = {
            get: function () {
                return build.call(this, this._styles.concat(key));
            }
        };
    });

    return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
    var builder = function () {
        return applyStyle.apply(builder, arguments);
    };

    builder._styles = _styles;
    builder.enabled = this.enabled;
    // __proto__ is used because we must return a function, but there is
    // no way to create a function with a different prototype.
    /* eslint-disable no-proto */
    builder.__proto__ = proto;

    return builder;
}

function applyStyle() {
    // support varags, but simply cast to string in case there's only one arg
    var args = arguments;
    var argsLen = args.length;
    var str = argsLen !== 0 && String(arguments[0]);

    if (argsLen > 1) {
        // don't slice `arguments`, it prevents v8 optimizations
        for (var a = 1; a < argsLen; a++) {
            str += ' ' + args[a];
        }
    }

    if (!this.enabled || !str) {
        return str;
    }

    var nestedStyles = this._styles;
    var i = nestedStyles.length;

    // Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
    // see https://github.com/chalk/chalk/issues/58
    // If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
    var originalDim = ansiStyles.dim.open;
    if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
        ansiStyles.dim.open = '';
    }

    while (i--) {
        var code = ansiStyles[nestedStyles[i]];

        // Replace any instances already present with a re-opening code
        // otherwise only the part of the string until said closing code
        // will be colored, and the rest will simply be 'plain'.
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
    }

    // Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
    ansiStyles.dim.open = originalDim;

    return str;
}

function init() {
    var ret = {};

    Object.keys(styles).forEach(function (name) {
        ret[name] = {
            get: function () {
                return build.call(this, [name]);
            }
        };
    });

    return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(51).EventEmitter;
var spawn = __webpack_require__(49).spawn;
var readlink = __webpack_require__(43).readlinkSync;
var path = __webpack_require__(1);
var dirname = path.dirname;
var basename = path.basename;
var fs = __webpack_require__(3);

/**
 * Expose the root command.
 */

exports = module.exports = new Command();

/**
 * Expose `Command`.
 */

exports.Command = Command;

/**
 * Expose `Option`.
 */

exports.Option = Option;

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

function Option(flags, description) {
  this.flags = flags;
  this.required = ~flags.indexOf('<');
  this.optional = ~flags.indexOf('[');
  this.bool = !~flags.indexOf('-no-');
  flags = flags.split(/[ ,|]+/);
  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || '';
}

/**
 * Return option name.
 *
 * @return {String}
 * @api private
 */

Option.prototype.name = function() {
  return this.long
    .replace('--', '')
    .replace('no-', '');
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {String} arg
 * @return {Boolean}
 * @api private
 */

Option.prototype.is = function(arg) {
  return arg == this.short || arg == this.long;
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = {};
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name || '';
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Command.prototype.__proto__ = EventEmitter.prototype;

/**
 * Add command `name`.
 *
 * The `.action()` callback is invoked when the
 * command `name` is specified via __ARGV__,
 * and the remaining arguments are applied to the
 * function for access.
 *
 * When the `name` is "*" an un-matched command
 * will be passed as the first arg, followed by
 * the rest of __ARGV__ remaining.
 *
 * Examples:
 *
 *      program
 *        .version('0.0.1')
 *        .option('-C, --chdir <path>', 'change the working directory')
 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
 *        .option('-T, --no-tests', 'ignore test hook')
 *
 *      program
 *        .command('setup')
 *        .description('run remote setup commands')
 *        .action(function() {
 *          console.log('setup');
 *        });
 *
 *      program
 *        .command('exec <cmd>')
 *        .description('run the given remote command')
 *        .action(function(cmd) {
 *          console.log('exec "%s"', cmd);
 *        });
 *
 *      program
 *        .command('teardown <dir> [otherDirs...]')
 *        .description('run teardown commands')
 *        .action(function(dir, otherDirs) {
 *          console.log('dir "%s"', dir);
 *          if (otherDirs) {
 *            otherDirs.forEach(function (oDir) {
 *              console.log('dir "%s"', oDir);
 *            });
 *          }
 *        });
 *
 *      program
 *        .command('*')
 *        .description('deploy the given env')
 *        .action(function(env) {
 *          console.log('deploying "%s"', env);
 *        });
 *
 *      program.parse(process.argv);
  *
 * @param {String} name
 * @param {String} [desc] for git-style sub-commands
 * @return {Command} the new command
 * @api public
 */

Command.prototype.command = function(name, desc, opts) {
  opts = opts || {};
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());

  if (desc) {
    cmd.description(desc);
    this.executables = true;
    this._execs[cmd._name] = true;
    if (opts.isDefault) this.defaultExecutable = cmd._name;
  }

  cmd._noHelp = !!opts.noHelp;
  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;

  if (desc) return this;
  return cmd;
};

/**
 * Define argument syntax for the top-level command.
 *
 * @api public
 */

Command.prototype.arguments = function (desc) {
  return this.parseExpectedArgs(desc.split(/ +/));
};

/**
 * Add an implicit `help [cmd]` subcommand
 * which invokes `--help` for the given command.
 *
 * @api private
 */

Command.prototype.addImplicitHelpCommand = function() {
  this.command('help [cmd]', 'display help for [cmd]');
};

/**
 * Parse expected `args`.
 *
 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parseExpectedArgs = function(args) {
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg) {
    var argDetails = {
      required: false,
      name: '',
      variadic: false
    };

    switch (arg[0]) {
      case '<':
        argDetails.required = true;
        argDetails.name = arg.slice(1, -1);
        break;
      case '[':
        argDetails.name = arg.slice(1, -1);
        break;
    }

    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
      argDetails.variadic = true;
      argDetails.name = argDetails.name.slice(0, -3);
    }
    if (argDetails.name) {
      self._args.push(argDetails);
    }
  });
  return this;
};

/**
 * Register callback `fn` for the command.
 *
 * Examples:
 *
 *      program
 *        .command('help')
 *        .description('display verbose help')
 *        .action(function() {
 *           // output help here
 *        });
 *
 * @param {Function} fn
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.action = function(fn) {
  var self = this;
  var listener = function(args, unknown) {
    // Parse any so-far unknown options
    args = args || [];
    unknown = unknown || [];

    var parsed = self.parseOptions(unknown);

    // Output help if necessary
    outputHelpIfNecessary(self, parsed.unknown);

    // If there are still any unknown options, then we simply
    // die, unless someone asked for help, in which case we give it
    // to them, and then we die.
    if (parsed.unknown.length > 0) {
      self.unknownOption(parsed.unknown[0]);
    }

    // Leftover arguments need to be pushed back. Fixes issue #56
    if (parsed.args.length) args = parsed.args.concat(args);

    self._args.forEach(function(arg, i) {
      if (arg.required && null == args[i]) {
        self.missingArgument(arg.name);
      } else if (arg.variadic) {
        if (i !== self._args.length - 1) {
          self.variadicArgNotLast(arg.name);
        }

        args[i] = args.splice(i);
      }
    });

    // Always append ourselves to the end of the arguments,
    // to make sure we match the number of arguments the user
    // expects
    if (self._args.length) {
      args[self._args.length] = self;
    } else {
      args.push(self);
    }

    fn.apply(self, args);
  };
  var parent = this.parent || this;
  var name = parent === this ? '*' : this._name;
  parent.on(name, listener);
  if (this._alias) parent.on(this._alias, listener);
  return this;
};

/**
 * Define option with `flags`, `description` and optional
 * coercion `fn`.
 *
 * The `flags` string should contain both the short and long flags,
 * separated by comma, a pipe or space. The following are all valid
 * all will output this way when `--help` is used.
 *
 *    "-p, --pepper"
 *    "-p|--pepper"
 *    "-p --pepper"
 *
 * Examples:
 *
 *     // simple boolean defaulting to false
 *     program.option('-p, --pepper', 'add pepper');
 *
 *     --pepper
 *     program.pepper
 *     // => Boolean
 *
 *     // simple boolean defaulting to true
 *     program.option('-C, --no-cheese', 'remove cheese');
 *
 *     program.cheese
 *     // => true
 *
 *     --no-cheese
 *     program.cheese
 *     // => false
 *
 *     // required argument
 *     program.option('-C, --chdir <path>', 'change the working directory');
 *
 *     --chdir /tmp
 *     program.chdir
 *     // => "/tmp"
 *
 *     // optional argument
 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
 *
 * @param {String} flags
 * @param {String} description
 * @param {Function|Mixed} fn or default
 * @param {Mixed} defaultValue
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.option = function(flags, description, fn, defaultValue) {
  var self = this
    , option = new Option(flags, description)
    , oname = option.name()
    , name = camelcase(oname);

  // default as 3rd arg
  if (typeof fn != 'function') {
    if (fn instanceof RegExp) {
      var regex = fn;
      fn = function(val, def) {
        var m = regex.exec(val);
        return m ? m[0] : def;
      }
    }
    else {
      defaultValue = fn;
      fn = null;
    }
  }

  // preassign default value only for --no-*, [optional], or <required>
  if (false == option.bool || option.optional || option.required) {
    // when --no-* we make sure default is true
    if (false == option.bool) defaultValue = true;
    // preassign only if we have a default
    if (undefined !== defaultValue) self[name] = defaultValue;
  }

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on(oname, function(val) {
    // coercion
    if (null !== val && fn) val = fn(val, undefined === self[name]
      ? defaultValue
      : self[name]);

    // unassigned or bool
    if ('boolean' == typeof self[name] || 'undefined' == typeof self[name]) {
      // if no value, bool true, and we have a default, then use it!
      if (null == val) {
        self[name] = option.bool
          ? defaultValue || true
          : false;
      } else {
        self[name] = val;
      }
    } else if (null !== val) {
      // reassign
      self[name] = val;
    }
  });

  return this;
};

/**
 * Allow unknown options on the command line.
 *
 * @param {Boolean} arg if `true` or omitted, no error will be thrown
 * for unknown options.
 * @api public
 */
Command.prototype.allowUnknownOption = function(arg) {
    this._allowUnknownOption = arguments.length === 0 || arg;
    return this;
};

/**
 * Parse `argv`, settings options and invoking commands when defined.
 *
 * @param {Array} argv
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parse = function(argv) {
  // implicit help
  if (this.executables) this.addImplicitHelpCommand();

  // store raw args
  this.rawArgs = argv;

  // guess name
  this._name = this._name || basename(argv[1], '.js');

  // github-style sub-commands with no sub-command
  if (this.executables && argv.length < 3 && !this.defaultExecutable) {
    // this user needs help
    argv.push('--help');
  }

  // process argv
  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
  var args = this.args = parsed.args;

  var result = this.parseArgs(this.args, parsed.unknown);

  // executable sub-commands
  var name = result.args[0];
  if (this._execs[name] && typeof this._execs[name] != "function") {
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (this.defaultExecutable) {
    // use the default subcommand
    args.unshift(name = this.defaultExecutable);
    return this.executeSubCommand(argv, args, parsed.unknown);
  }

  return result;
};

/**
 * Execute a sub-command executable.
 *
 * @param {Array} argv
 * @param {Array} args
 * @param {Array} unknown
 * @api private
 */

Command.prototype.executeSubCommand = function(argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) this.help();
  if ('help' == args[0] && 1 == args.length) this.help();

  // <cmd> --help
  if ('help' == args[0]) {
    args[0] = args[1];
    args[1] = '--help';
  }

  // executable
  var f = argv[1];
  // name of the subcommand, link `pm-install`
  var bin = basename(f, '.js') + '-' + args[0];


  // In case of globally installed, get the base dir where executable
  //  subcommand file should be located at
  var baseDir
    , link = readlink(f);

  // when symbolink is relative path
  if (link !== f && link.charAt(0) !== '/') {
    link = path.join(dirname(f), link)
  }
  baseDir = dirname(link);

  // prefer local `./<bin>` to bin in the $PATH
  var localBin = path.join(baseDir, bin);

  // whether bin file is a js script with explicit `.js` extension
  var isExplicitJS = false;
  if (exists(localBin + '.js')) {
    bin = localBin + '.js';
    isExplicitJS = true;
  } else if (exists(localBin)) {
    bin = localBin;
  }

  args = args.slice(1);

  var proc;
  if (process.platform !== 'win32') {
    if (isExplicitJS) {
      args.unshift(localBin);
      // add executable arguments to spawn
      args = (process.execArgv || []).concat(args);

      proc = spawn('node', args, { stdio: 'inherit', customFds: [0, 1, 2] });
    } else {
      proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
    }
  } else {
    args.unshift(localBin);
    proc = spawn(process.execPath, args, { stdio: 'inherit'});
  }

  proc.on('close', process.exit.bind(process));
  proc.on('error', function(err) {
    if (err.code == "ENOENT") {
      console.error('\n  %s(1) does not exist, try --help\n', bin);
    } else if (err.code == "EACCES") {
      console.error('\n  %s(1) not executable. try chmod or run with root\n', bin);
    }
    process.exit(1);
  });

  // Store the reference to the child process
  this.runningCommand = proc;
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @param {Array} args
 * @return {Array}
 * @api private
 */

Command.prototype.normalize = function(args) {
  var ret = []
    , arg
    , lastOpt
    , index;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (i > 0) {
      lastOpt = this.optionFor(args[i-1]);
    }

    if (arg === '--') {
      // Honor option terminator
      ret = ret.concat(args.slice(i));
      break;
    } else if (lastOpt && lastOpt.required) {
      ret.push(arg);
    } else if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
      arg.slice(1).split('').forEach(function(c) {
        ret.push('-' + c);
      });
    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
      ret.push(arg.slice(0, index), arg.slice(index + 1));
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

/**
 * Parse command `args`.
 *
 * When listener(s) are available those
 * callbacks are invoked, otherwise the "*"
 * event is emitted and those actions are invoked.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api private
 */

Command.prototype.parseArgs = function(args, unknown) {
  var name;

  if (args.length) {
    name = args[0];
    if (this.listeners(name).length) {
      this.emit(args.shift(), args, unknown);
    } else {
      this.emit('*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);

    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {
      this.unknownOption(unknown[0]);
    }
  }

  return this;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Command.prototype.optionFor = function(arg) {
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

/**
 * Parse options from `argv` returning `argv`
 * void of these options.
 *
 * @param {Array} argv
 * @return {Array}
 * @api public
 */

Command.prototype.parseOptions = function(argv) {
  var args = []
    , len = argv.length
    , literal
    , option
    , arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if ('--' == arg) {
      literal = true;
      continue;
    }

    if (literal) {
      args.push(arg);
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        this.emit(option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || ('-' == arg[0] && '-' != arg)) {
          arg = null;
        } else {
          ++i;
        }
        this.emit(option.name(), arg);
      // bool
      } else {
        this.emit(option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      // If it isn't, then it'll simply be ignored
      if (argv[i+1] && '-' != argv[i+1][0]) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

/**
 * Return an object containing options as key-value pairs
 *
 * @return {Object}
 * @api public
 */
Command.prototype.opts = function() {
  var result = {}
    , len = this.options.length;

  for (var i = 0 ; i < len; i++) {
    var key = camelcase(this.options[i].name());
    result[key] = key === 'version' ? this._version : this[key];
  }
  return result;
};

/**
 * Argument `name` is missing.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.missingArgument = function(name) {
  console.error();
  console.error("  error: missing required argument `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * `Option` is missing an argument, but received `flag` or nothing.
 *
 * @param {String} option
 * @param {String} flag
 * @api private
 */

Command.prototype.optionMissingArgument = function(option, flag) {
  console.error();
  if (flag) {
    console.error("  error: option `%s' argument missing, got `%s'", option.flags, flag);
  } else {
    console.error("  error: option `%s' argument missing", option.flags);
  }
  console.error();
  process.exit(1);
};

/**
 * Unknown option `flag`.
 *
 * @param {String} flag
 * @api private
 */

Command.prototype.unknownOption = function(flag) {
  if (this._allowUnknownOption) return;
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();
  process.exit(1);
};

/**
 * Variadic argument with `name` is not the last argument as required.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.variadicArgNotLast = function(name) {
  console.error();
  console.error("  error: variadic arguments must be last `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * Set the program version to `str`.
 *
 * This method auto-registers the "-V, --version" flag
 * which will print the version number when passed.
 *
 * @param {String} str
 * @param {String} flags
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.version = function(str, flags) {
  if (0 == arguments.length) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  this.option(flags, 'output the version number');
  this.on('version', function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};

/**
 * Set the description to `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.description = function(str) {
  if (0 === arguments.length) return this._description;
  this._description = str;
  return this;
};

/**
 * Set an alias for the command
 *
 * @param {String} alias
 * @return {String|Command}
 * @api public
 */

Command.prototype.alias = function(alias) {
  if (0 == arguments.length) return this._alias;
  this._alias = alias;
  return this;
};

/**
 * Set / get the command usage `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.usage = function(str) {
  var args = this._args.map(function(arg) {
    return humanReadableArgName(arg);
  });

  var usage = '[options]'
    + (this.commands.length ? ' [command]' : '')
    + (this._args.length ? ' ' + args.join(' ') : '');

  if (0 == arguments.length) return this._usage || usage;
  this._usage = str;

  return this;
};

/**
 * Get the name of the command
 *
 * @param {String} name
 * @return {String|Command}
 * @api public
 */

Command.prototype.name = function() {
  return this._name;
};

/**
 * Return the largest option length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestOptionLength = function() {
  return this.options.reduce(function(max, option) {
    return Math.max(max, option.flags.length);
  }, 0);
};

/**
 * Return help for options.
 *
 * @return {String}
 * @api private
 */

Command.prototype.optionHelp = function() {
  var width = this.largestOptionLength();

  // Prepend the help information
  return [pad('-h, --help', width) + '  ' + 'output usage information']
      .concat(this.options.map(function(option) {
        return pad(option.flags, width) + '  ' + option.description;
      }))
      .join('\n');
};

/**
 * Return command help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.commands.filter(function(cmd) {
    return !cmd._noHelp;
  }).map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name
        + (cmd._alias ? '|' + cmd._alias : '')
        + (cmd.options.length ? ' [options]' : '')
        + ' ' + args
      , cmd.description()
    ];
  });

  var width = commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);

  return [
    ''
    , '  Commands:'
    , ''
    , commands.map(function(cmd) {
      var desc = cmd[1] ? '  ' + cmd[1] : '';
      return pad(cmd[0], width) + desc;
    }).join('\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};

/**
 * Return program help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      '  ' + this._description
      , ''
    ];
  }

  var cmdName = this._name;
  if (this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    ''
    ,'  Usage: ' + cmdName + ' ' + this.usage()
    , ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    '  Options:'
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
    , ''
  ];

  return usage
    .concat(cmds)
    .concat(desc)
    .concat(options)
    .join('\n');
};

/**
 * Output help information for this command
 *
 * @api public
 */

Command.prototype.outputHelp = function(cb) {
  if (!cb) {
    cb = function(passthru) {
      return passthru;
    }
  }
  process.stdout.write(cb(this.helpInformation()));
  this.emit('--help');
};

/**
 * Output help information and exit.
 *
 * @api public
 */

Command.prototype.help = function(cb) {
  this.outputHelp(cb);
  process.exit();
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} command to output help for
 * @param {Array} array of options to search for -h or --help
 * @api private
 */

function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for (var i = 0; i < options.length; i++) {
    if (options[i] == '--help' || options[i] == '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']'
}

// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}



/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }

    return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)

const BUF_LENGTH = 64 * 1024
const _buff = new Buffer(BUF_LENGTH)

function copyFileSync (srcFile, destFile, options) {
  const overwrite = options.overwrite
  const errorOnExist = options.errorOnExist
  const preserveTimestamps = options.preserveTimestamps

  if (fs.existsSync(destFile)) {
    if (overwrite) {
      fs.unlinkSync(destFile)
    } else if (errorOnExist) {
      throw new Error(`${destFile} already exists`)
    } else return
  }

  const fdr = fs.openSync(srcFile, 'r')
  const stat = fs.fstatSync(fdr)
  const fdw = fs.openSync(destFile, 'w', stat.mode)
  let bytesRead = 1
  let pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  if (preserveTimestamps) {
    fs.futimesSync(fdw, stat.atime, stat.mtime)
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
}

module.exports = copyFileSync


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const copyFileSync = __webpack_require__(22)
const mkdir = __webpack_require__(2)

function copySync (src, dest, options) {
  if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }

  options = options || {}
  options.recursive = !!options.recursive

  // default to true for now
  options.clobber = 'clobber' in options ? !!options.clobber : true
  // overwrite falls back to clobber
  options.overwrite = 'overwrite' in options ? !!options.overwrite : options.clobber
  options.dereference = 'dereference' in options ? !!options.dereference : false
  options.preserveTimestamps = 'preserveTimestamps' in options ? !!options.preserveTimestamps : false

  options.filter = options.filter || function () { return true }

  // Warn about using preserveTimestamps on 32-bit node:
  if (options.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  const stats = (options.recursive && !options.dereference) ? fs.lstatSync(src) : fs.statSync(src)
  const destFolder = path.dirname(dest)
  const destFolderExists = fs.existsSync(destFolder)
  let performCopy = false

  if (options.filter instanceof RegExp) {
    console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
    performCopy = options.filter.test(src)
  } else if (typeof options.filter === 'function') performCopy = options.filter(src, dest)

  if (stats.isFile() && performCopy) {
    if (!destFolderExists) mkdir.mkdirsSync(destFolder)
    copyFileSync(src, dest, {
      overwrite: options.overwrite,
      errorOnExist: options.errorOnExist,
      preserveTimestamps: options.preserveTimestamps
    })
  } else if (stats.isDirectory() && performCopy) {
    if (!fs.existsSync(dest)) mkdir.mkdirsSync(dest)
    const contents = fs.readdirSync(src)
    contents.forEach(content => {
      const opts = options
      opts.recursive = true
      copySync(path.join(src, content), path.join(dest, content), opts)
    })
  } else if (options.recursive && stats.isSymbolicLink() && performCopy) {
    const srcPath = fs.readlinkSync(src)
    fs.symlinkSync(srcPath, dest)
  }
}

module.exports = copySync


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const ncp = __webpack_require__(10)
const mkdir = __webpack_require__(2)

function copy (src, dest, options, callback) {
  if (typeof options === 'function' && !callback) {
    callback = options
    options = {}
  } else if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }
  callback = callback || function () {}
  options = options || {}

  // Warn about using preserveTimestamps on 32-bit node:
  if (options.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  // don't allow src and dest to be the same
  const basePath = process.cwd()
  const currentPath = path.resolve(basePath, src)
  const targetPath = path.resolve(basePath, dest)
  if (currentPath === targetPath) return callback(new Error('Source and destination must not be the same.'))

  fs.lstat(src, (err, stats) => {
    if (err) return callback(err)

    let dir = null
    if (stats.isDirectory()) {
      const parts = dest.split(path.sep)
      parts.pop()
      dir = parts.join(path.sep)
    } else {
      dir = path.dirname(dest)
    }

    fs.exists(dir, dirExists => {
      if (dirExists) return ncp(src, dest, options, callback)
      mkdir.mkdirs(dir, err => {
        if (err) return callback(err)
        ncp(src, dest, options, callback)
      })
    })
  })
}

module.exports = copy


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copy: __webpack_require__(24)
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(3)
const path = __webpack_require__(1)
const mkdir = __webpack_require__(2)
const remove = __webpack_require__(4)

function emptyDir (dir, callback) {
  callback = callback || function () {}
  fs.readdir(dir, (err, items) => {
    if (err) return mkdir.mkdirs(dir, callback)

    items = items.map(item => path.join(dir, item))

    deleteItem()

    function deleteItem () {
      const item = items.pop()
      if (!item) return callback()
      remove.remove(item, err => {
        if (err) return callback(err)
        deleteItem()
      })
    }
  })
}

function emptyDirSync (dir) {
  let items
  try {
    items = fs.readdirSync(dir)
  } catch (err) {
    return mkdir.mkdirsSync(dir)
  }

  items.forEach(item => {
    item = path.join(dir, item)
    remove.removeSync(item)
  })
}

module.exports = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(1)
const fs = __webpack_require__(0)
const mkdir = __webpack_require__(2)

function createFile (file, callback) {
  function makeFile () {
    fs.writeFile(file, '', err => {
      if (err) return callback(err)
      callback()
    })
  }

  fs.exists(file, fileExists => {
    if (fileExists) return callback()
    const dir = path.dirname(file)
    fs.exists(dir, dirExists => {
      if (dirExists) return makeFile()
      mkdir.mkdirs(dir, err => {
        if (err) return callback(err)
        makeFile()
      })
    })
  })
}

function createFileSync (file) {
  if (fs.existsSync(file)) return

  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  fs.writeFileSync(file, '')
}

module.exports = {
  createFile,
  createFileSync,
  // alias
  ensureFile: createFile,
  ensureFileSync: createFileSync
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const file = __webpack_require__(27)
const link = __webpack_require__(29)
const symlink = __webpack_require__(32)

module.exports = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(1)
const fs = __webpack_require__(0)
const mkdir = __webpack_require__(2)

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    fs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null)
    })
  }

  fs.exists(dstpath, destinationExists => {
    if (destinationExists) return callback(null)
    fs.lstat(srcpath, (err, stat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink')
        return callback(err)
      }

      const dir = path.dirname(dstpath)
      fs.exists(dir, dirExists => {
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdir.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath)
        })
      })
    })
  })
}

function createLinkSync (srcpath, dstpath, callback) {
  const destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  try {
    fs.lstatSync(srcpath)
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink')
    throw err
  }

  const dir = path.dirname(dstpath)
  const dirExists = fs.existsSync(dir)
  if (dirExists) return fs.linkSync(srcpath, dstpath)
  mkdir.mkdirsSync(dir)

  return fs.linkSync(srcpath, dstpath)
}

module.exports = {
  createLink,
  createLinkSync,
  // alias
  ensureLink: createLink,
  ensureLinkSync: createLinkSync
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(1)
const fs = __webpack_require__(0)

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths (srcpath, dstpath, callback) {
  if (path.isAbsolute(srcpath)) {
    return fs.lstat(srcpath, (err, stat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink')
        return callback(err)
      }
      return callback(null, {
        'toCwd': srcpath,
        'toDst': srcpath
      })
    })
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    return fs.exists(relativeToDst, exists => {
      if (exists) {
        return callback(null, {
          'toCwd': relativeToDst,
          'toDst': srcpath
        })
      } else {
        return fs.lstat(srcpath, (err, stat) => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink')
            return callback(err)
          }
          return callback(null, {
            'toCwd': srcpath,
            'toDst': path.relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync (srcpath, dstpath) {
  let exists
  if (path.isAbsolute(srcpath)) {
    exists = fs.existsSync(srcpath)
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      'toCwd': srcpath,
      'toDst': srcpath
    }
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    exists = fs.existsSync(relativeToDst)
    if (exists) {
      return {
        'toCwd': relativeToDst,
        'toDst': srcpath
      }
    } else {
      exists = fs.existsSync(srcpath)
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        'toCwd': srcpath,
        'toDst': path.relative(dstdir, srcpath)
      }
    }
  }
}

module.exports = {
  symlinkPaths,
  symlinkPathsSync
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)

function symlinkType (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type
  if (type) return callback(null, type)
  fs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file'
    callback(null, type)
  })
}

function symlinkTypeSync (srcpath, type) {
  let stats

  if (type) return type
  try {
    stats = fs.lstatSync(srcpath)
  } catch (e) {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

module.exports = {
  symlinkType,
  symlinkTypeSync
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(1)
const fs = __webpack_require__(0)
const _mkdirs = __webpack_require__(2)
const mkdirs = _mkdirs.mkdirs
const mkdirsSync = _mkdirs.mkdirsSync

const _symlinkPaths = __webpack_require__(30)
const symlinkPaths = _symlinkPaths.symlinkPaths
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync

const _symlinkType = __webpack_require__(31)
const symlinkType = _symlinkType.symlinkType
const symlinkTypeSync = _symlinkType.symlinkTypeSync

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  fs.exists(dstpath, destinationExists => {
    if (destinationExists) return callback(null)
    symlinkPaths(srcpath, dstpath, (err, relative) => {
      if (err) return callback(err)
      srcpath = relative.toDst
      symlinkType(relative.toCwd, type, (err, type) => {
        if (err) return callback(err)
        const dir = path.dirname(dstpath)
        fs.exists(dir, dirExists => {
          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)
          mkdirs(dir, err => {
            if (err) return callback(err)
            fs.symlink(srcpath, dstpath, type, callback)
          })
        })
      })
    })
  })
}

function createSymlinkSync (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  const destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  const relative = symlinkPathsSync(srcpath, dstpath)
  srcpath = relative.toDst
  type = symlinkTypeSync(relative.toCwd, type)
  const dir = path.dirname(dstpath)
  const exists = fs.existsSync(dir)
  if (exists) return fs.symlinkSync(srcpath, dstpath, type)
  mkdirsSync(dir)
  return fs.symlinkSync(srcpath, dstpath, type)
}

module.exports = {
  createSymlink,
  createSymlinkSync,
  // alias
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const assign = __webpack_require__(39)

const fse = {}
const gfs = __webpack_require__(0)

// attach fs methods to fse
Object.keys(gfs).forEach(key => {
  fse[key] = gfs[key]
})

const fs = fse

assign(fs, __webpack_require__(25))
assign(fs, __webpack_require__(9))
assign(fs, __webpack_require__(2))
assign(fs, __webpack_require__(4))
assign(fs, __webpack_require__(34))
assign(fs, __webpack_require__(36))
assign(fs, __webpack_require__(35))
assign(fs, __webpack_require__(26))
assign(fs, __webpack_require__(28))
assign(fs, __webpack_require__(37))

module.exports = fs

// maintain backwards compatibility for awhile
const jsonfile = {}
Object.defineProperty(jsonfile, 'spaces', {
  get: () => fs.spaces, // found in ./json
  set: val => {
    fs.spaces = val
  }
})

module.exports.jsonfile = jsonfile // so users of fs-extra can modify jsonFile.spaces


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const jsonFile = __webpack_require__(5)

jsonFile.outputJsonSync = __webpack_require__(11)
jsonFile.outputJson = __webpack_require__(12)
// aliases
jsonFile.outputJSONSync = __webpack_require__(11)
jsonFile.outputJSON = __webpack_require__(12)

module.exports = jsonFile


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const copySync = __webpack_require__(9).copySync
const removeSync = __webpack_require__(4).removeSync
const mkdirpSync = __webpack_require__(2).mkdirsSync

function moveSync (src, dest, options) {
  options = options || {}
  const overwrite = options.overwrite || options.clobber || false

  src = path.resolve(src)
  dest = path.resolve(dest)

  if (src === dest) return

  if (isSrcSubdir(src, dest)) throw new Error(`Cannot move '${src}' into itself '${dest}'.`)

  mkdirpSync(path.dirname(dest))
  tryRenameSync()

  function tryRenameSync () {
    if (overwrite) {
      try {
        return fs.renameSync(src, dest)
      } catch (err) {
        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
          removeSync(dest)
          options.overwrite = false // just overwriteed it, no need to do it again
          return moveSync(src, dest, options)
        }

        if (err.code !== 'EXDEV') throw err
        return moveSyncAcrossDevice(src, dest, overwrite)
      }
    } else {
      try {
        fs.linkSync(src, dest)
        return fs.unlinkSync(src)
      } catch (err) {
        if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') {
          return moveSyncAcrossDevice(src, dest, overwrite)
        }
        throw err
      }
    }
  }
}

function moveSyncAcrossDevice (src, dest, overwrite) {
  const stat = fs.statSync(src)

  if (stat.isDirectory()) {
    return moveDirSyncAcrossDevice(src, dest, overwrite)
  } else {
    return moveFileSyncAcrossDevice(src, dest, overwrite)
  }
}

function moveFileSyncAcrossDevice (src, dest, overwrite) {
  const BUF_LENGTH = 64 * 1024
  const _buff = new Buffer(BUF_LENGTH)

  const flags = overwrite ? 'w' : 'wx'

  const fdr = fs.openSync(src, 'r')
  const stat = fs.fstatSync(fdr)
  const fdw = fs.openSync(dest, flags, stat.mode)
  let bytesRead = 1
  let pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
  return fs.unlinkSync(src)
}

function moveDirSyncAcrossDevice (src, dest, overwrite) {
  const options = {
    overwrite: false
  }

  if (overwrite) {
    removeSync(dest)
    tryCopySync()
  } else {
    tryCopySync()
  }

  function tryCopySync () {
    copySync(src, dest, options)
    return removeSync(src)
  }
}

// return true if dest is a subdir of src, otherwise false.
// extract dest base dir and check if that is the same as src basename
function isSrcSubdir (src, dest) {
  try {
    return fs.statSync(src).isDirectory() &&
           src !== dest &&
           dest.indexOf(src) > -1 &&
           dest.split(path.dirname(src) + path.sep)[1].split(path.sep)[0] === path.basename(src)
  } catch (e) {
    return false
  }
}

module.exports = {
  moveSync
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// most of this code was written by Andrew Kelley
// licensed under the BSD license: see
// https://github.com/andrewrk/node-mv/blob/master/package.json

// this needs a cleanup

const fs = __webpack_require__(0)
const ncp = __webpack_require__(10)
const path = __webpack_require__(1)
const remove = __webpack_require__(4).remove
const mkdirp = __webpack_require__(2).mkdirs

function move (source, dest, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const shouldMkdirp = ('mkdirp' in options) ? options.mkdirp : true
  const overwrite = options.overwrite || options.clobber || false

  if (shouldMkdirp) {
    mkdirs()
  } else {
    doRename()
  }

  function mkdirs () {
    mkdirp(path.dirname(dest), err => {
      if (err) return callback(err)
      doRename()
    })
  }

  function doRename () {
    if (path.resolve(source) === path.resolve(dest)) {
      setImmediate(callback)
    } else if (overwrite) {
      fs.rename(source, dest, err => {
        if (!err) return callback()

        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
          remove(dest, err => {
            if (err) return callback(err)
            options.overwrite = false // just overwriteed it, no need to do it again
            move(source, dest, options, callback)
          })
          return
        }

        // weird Windows shit
        if (err.code === 'EPERM') {
          setTimeout(() => {
            remove(dest, err => {
              if (err) return callback(err)
              options.overwrite = false
              move(source, dest, options, callback)
            })
          }, 200)
          return
        }

        if (err.code !== 'EXDEV') return callback(err)
        moveAcrossDevice(source, dest, overwrite, callback)
      })
    } else {
      fs.link(source, dest, err => {
        if (err) {
          if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') {
            moveAcrossDevice(source, dest, overwrite, callback)
            return
          }
          callback(err)
          return
        }
        fs.unlink(source, callback)
      })
    }
  }
}

function moveAcrossDevice (source, dest, overwrite, callback) {
  fs.stat(source, (err, stat) => {
    if (err) {
      callback(err)
      return
    }

    if (stat.isDirectory()) {
      moveDirAcrossDevice(source, dest, overwrite, callback)
    } else {
      moveFileAcrossDevice(source, dest, overwrite, callback)
    }
  })
}

function moveFileAcrossDevice (source, dest, overwrite, callback) {
  const flags = overwrite ? 'w' : 'wx'
  const ins = fs.createReadStream(source)
  const outs = fs.createWriteStream(dest, { flags })

  ins.on('error', err => {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)

    // may want to create a directory but `out` line above
    // creates an empty file for us: See #108
    // don't care about error here
    fs.unlink(dest, () => {
      // note: `err` here is from the input stream errror
      if (err.code === 'EISDIR' || err.code === 'EPERM') {
        moveDirAcrossDevice(source, dest, overwrite, callback)
      } else {
        callback(err)
      }
    })
  })

  outs.on('error', err => {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)
    callback(err)
  })

  outs.once('close', onClose)
  ins.pipe(outs)

  function onClose () {
    fs.unlink(source, callback)
  }
}

function moveDirAcrossDevice (source, dest, overwrite, callback) {
  const options = {
    overwrite: false
  }

  if (overwrite) {
    remove(dest, err => {
      if (err) return callback(err)
      startNcp()
    })
  } else {
    startNcp()
  }

  function startNcp () {
    ncp(source, dest, options, err => {
      if (err) return callback(err)
      remove(source, callback)
    })
  }
}

module.exports = {
  move
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const mkdir = __webpack_require__(2)

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  const dir = path.dirname(file)
  fs.exists(dir, itDoes => {
    if (itDoes) return fs.writeFile(file, data, encoding, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)

      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, data, encoding) {
  const dir = path.dirname(file)
  if (fs.existsSync(dir)) {
    return fs.writeFileSync.apply(fs, arguments)
  }
  mkdir.mkdirsSync(dir)
  fs.writeFileSync.apply(fs, arguments)
}

module.exports = {
  outputFile,
  outputFileSync
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const path = __webpack_require__(1)
const assert = __webpack_require__(15)

const isWindows = (process.platform === 'win32')

function defaults (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(m => {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
}

function rimraf (p, options, cb) {
  let busyTries = 0

  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  rimraf_(p, options, function CB (er) {
    if (er) {
      if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++
        let time = busyTries * 100
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null
    }

    cb(er)
  })
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    })
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')
  if (er) {
    assert(er instanceof Error)
  }

  options.chmod(p, 666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er)
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er)
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb)
        } else {
          options.unlink(p, cb)
        }
      })
    }
  })
}

function fixWinEPERMSync (p, options, er) {
  let stats

  assert(p)
  assert(options)
  if (er) {
    assert(er instanceof Error)
  }

  try {
    options.chmodSync(p, 666)
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er)
  } else {
    options.unlinkSync(p)
  }
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  if (originalEr) {
    assert(originalEr instanceof Error)
  }
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb)
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr)
    } else {
      cb(er)
    }
  })
}

function rmkids (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length
    let errState

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb)
        }
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st

  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  try {
    st = options.lstatSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er)
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null)
    } else {
      options.unlinkSync(p)
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er)
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)
  if (originalEr) {
    assert(originalEr instanceof Error)
  }

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options)
    }
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))
  options.rmdirSync(p, options)
}

module.exports = rimraf
rimraf.sync = rimrafSync


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// simple mutable assign
function assign () {
  const args = [].slice.call(arguments).filter(i => i)
  const dest = args.shift()
  args.forEach(src => {
    Object.keys(src).forEach(key => {
      dest[key] = src[key]
    })
  })

  return dest
}

module.exports = assign


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(0)
const os = __webpack_require__(52)
const path = __webpack_require__(1)

// HFS, ext{2,3}, FAT do not, Node.js v0.10 does not
function hasMillisResSync () {
  let tmpfile = path.join('millis-test-sync' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  const d = new Date(1435410243862)
  fs.writeFileSync(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141')
  const fd = fs.openSync(tmpfile, 'r+')
  fs.futimesSync(fd, d, d)
  fs.closeSync(fd)
  return fs.statSync(tmpfile).mtime > 1435410243000
}

function hasMillisRes (callback) {
  let tmpfile = path.join('millis-test' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  const d = new Date(1435410243862)
  fs.writeFile(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141', err => {
    if (err) return callback(err)
    fs.open(tmpfile, 'r+', (err, fd) => {
      if (err) return callback(err)
      fs.futimes(fd, d, d, err => {
        if (err) return callback(err)
        fs.close(fd, err => {
          if (err) return callback(err)
          fs.stat(tmpfile, (err, stats) => {
            if (err) return callback(err)
            callback(null, stats.mtime > 1435410243000)
          })
        })
      })
    })
  })
}

function timeRemoveMillis (timestamp) {
  if (typeof timestamp === 'number') {
    return Math.floor(timestamp / 1000) * 1000
  } else if (timestamp instanceof Date) {
    return new Date(Math.floor(timestamp.getTime() / 1000) * 1000)
  } else {
    throw new Error('fs-extra: timeRemoveMillis() unknown parameter type')
  }
}

function utimesMillis (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  fs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err)
    fs.futimes(fd, atime, mtime, futimesErr => {
      fs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr)
      })
    })
  })
}

module.exports = {
  hasMillisRes,
  hasMillisResSync,
  timeRemoveMillis,
  utimesMillis
}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(53).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(14)
var constants = __webpack_require__(50)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)
}

function patchLchmod (fs) {
  fs.lchmod = function (path, mode, callback) {
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        if (callback) callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          if (callback) callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var threw = true
    var ret
    try {
      ret = fs.fchmodSync(fd, mode)
      threw = false
    } finally {
      if (threw) {
        try {
          fs.closeSync(fd)
        } catch (er) {}
      } else {
        fs.closeSync(fd)
      }
    }
    return ret
  }
}

function patchLutimes (fs) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        if (er) {
          if (cb) cb(er)
          return
        }
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            if (cb) cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
      var ret
      var threw = true
      try {
        ret = fs.futimesSync(fd, at, mt)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}

function chmodFix (orig) {
  if (!orig) return orig
  return function (target, mode, cb) {
    return orig.call(fs, target, mode, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chmodFixSync (orig) {
  if (!orig) return orig
  return function (target, mode) {
    try {
      return orig.call(fs, target, mode)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function statFix (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target, cb) {
    return orig.call(fs, target, function (er, stats) {
      if (!stats) return cb.apply(this, arguments)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      if (cb) cb.apply(this, arguments)
    })
  }
}

function statFixSync (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target) {
    var stats = orig.call(fs, target)
    if (stats.uid < 0) stats.uid += 0x100000000
    if (stats.gid < 0) stats.gid += 0x100000000
    return stats;
  }
}

// ENOSYS means that the fs doesn't support the op. Just ignore
// that, because it doesn't matter.
//
// if there's no getuid, or if getuid() is something other
// than 0, and the error is EINVAL or EPERM, then just ignore
// it.
//
// This specific case is a silent failure in cp, install, tar,
// and most other unix tools that manage permissions.
//
// When running as root, or if other types of errors are
// encountered, then it's strict.
function chownErOk (er) {
  if (!er)
    return true

  if (er.code === "ENOSYS")
    return true

  var nonroot = !process.getuid || process.getuid() !== 0
  if (nonroot) {
    if (er.code === "EINVAL" || er.code === "EPERM")
      return true
  }

  return false
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(3)
  , lstat = fs.lstatSync;

exports.readlinkSync = function (p) {
  if (lstat(p).isSymbolicLink()) {
    return fs.readlinkSync(p);
  } else {
    return p;
  }
};




/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(8);
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var _fs
try {
  _fs = __webpack_require__(0)
} catch (_) {
  _fs = __webpack_require__(3)
}

function readFile (file, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }

  if (typeof options === 'string') {
    options = {encoding: options}
  }

  options = options || {}
  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err)

    data = stripBom(data)

    var obj
    try {
      obj = JSON.parse(data, options ? options.reviver : null)
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message
        return callback(err2)
      } else {
        return callback(null, null)
      }
    }

    callback(null, obj)
  })
}

function readFileSync (file, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {encoding: options}
  }

  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  var content = fs.readFileSync(file, options)
  content = stripBom(content)

  try {
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message
      throw err
    } else {
      return null
    }
  }
}

function writeFile (file, obj, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = ''
  try {
    str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
  } catch (err) {
    if (callback) return callback(err, null)
  }

  fs.writeFile(file, str, options, callback)
}

function writeFileSync (file, obj, options) {
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = JSON.stringify(obj, options.replacer, spaces) + '\n'
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  content = content.replace(/^\uFEFF/, '')
  return content
}

var jsonfile = {
  spaces: null,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
}

module.exports = jsonfile


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(8)();

module.exports = function (str) {
    return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
    flag = '--' + flag;
    var pos = argv.indexOf(flag);
    return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
    if ('FORCE_COLOR' in process.env) {
        return true;
    }

    if (hasFlag('no-color') ||
        hasFlag('no-colors') ||
        hasFlag('color=false')) {
        return false;
    }

    if (hasFlag('color') ||
        hasFlag('colors') ||
        hasFlag('color=true') ||
        hasFlag('color=always')) {
        return true;
    }

    if (process.stdout && !process.stdout.isTTY) {
        return false;
    }

    if (process.platform === 'win32') {
        return true;
    }

    if ('COLORTERM' in process.env) {
        return true;
    }

    if (process.env.TERM === 'dumb') {
        return false;
    }

    if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
        return true;
    }

    return false;
})();


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = function(module) {
    if(!module.webpackPolyfill) {
        module.deprecate = function() {};
        module.paths = [];
        // module.parent = undefined by default
        if(!module.children) module.children = [];
        Object.defineProperty(module, "loaded", {
            enumerable: true,
            get: function() {
                return module.l;
            }
        });
        Object.defineProperty(module, "id", {
            enumerable: true,
            get: function() {
                return module.i;
            }
        });
        module.webpackPolyfill = 1;
    }
    return module;
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWFkMWJjZWMwYjI4MDgwYTcyMGYiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9ncmFjZWZ1bC1mcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIFwicGF0aFwiIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21rZGlycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIFwiZnNcIiIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9yZW1vdmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9qc29uZmlsZS5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvbWtkaXJzLXN5bmMuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbWtkaXJzL21rZGlycy5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2Fuc2ktcmVnZXgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvY29weS1zeW5jL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2NvcHkvbmNwLmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2pzb24vb3V0cHV0LWpzb24tc3luYy5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9qc29uL291dHB1dC1qc29uLmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21rZGlycy93aW4zMi5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL2ZzLmpzIiwid2VicGFjazovLy9leHRlcm5hbC8gXCJhc3NlcnRcIiIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2Fuc2ktc3R5bGVzL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvY2hhbGsvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9jb21tYW5kZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9lc2NhcGUtc3RyaW5nLXJlZ2V4cC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5LXN5bmMvY29weS1maWxlLXN5bmMuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvY29weS1zeW5jL2NvcHktc3luYy5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5L2NvcHkuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvY29weS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbXB0eS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvZmlsZS5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL2xpbmsuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmstcGF0aHMuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmstdHlwZS5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvc3ltbGluay5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9qc29uL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21vdmUtc3luYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9tb3ZlL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL291dHB1dC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9yZW1vdmUvcmltcmFmLmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvYXNzaWduLmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvdXRpbWVzLmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvbGVnYWN5LXN0cmVhbXMuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9wb2x5ZmlsbHMuanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1yZWFkbGluay9pbmRleC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2hhcy1hbnNpL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvanNvbmZpbGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9zdHJpcC1hbnNpL2luZGV4LmpzIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvc3VwcG9ydHMtY29sb3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIFwiY2hpbGRfcHJvY2Vzc1wiIiwid2VicGFjazovLy9leHRlcm5hbC8gXCJjb25zdGFudHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIFwiZXZlbnRzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcIm9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInN0cmVhbVwiIiwid2VicGFjazovLy9leHRlcm5hbC8gXCJ1dGlsXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFOztBQUVGO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyUUEsaUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1JBLCtCOzs7Ozs7O0FDQUE7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMkIsa0JBQWtCO0FBQzdDOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CLHdGQUF3RjtBQUN4Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNoQkE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2ZBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7OztBQzFEQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWSxJQUFJLElBQUksTUFBTSxJQUFJO0FBQzNEOzs7Ozs7O0FDSEE7QUFDQTtBQUNBOzs7Ozs7O0FDRkE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0Esb0RBQW9ELGtCQUFrQjs7QUFFdEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxlQUFlO0FBQzFCLFdBQVcsTUFBTTtBQUNqQixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFD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QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzlDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzVDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN0QkE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzNEQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNoR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUM5QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Ozs7OztBQ3BDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUN2U0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBOzs7Ozs7OztBQ2ZBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLElBQUk7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdkVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLGdCQUFnQjtBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkMsZ0JBQWdCO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNySEE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE1BQU07QUFDTjs7QUFFQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNILDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3pVQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNwSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDTEE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7QUNqREQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckJBLDBDOzs7Ozs7QUNBQSxzQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBLCtCOzs7Ozs7QUNBQSxtQzs7Ozs7O0FDQUEsaUMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDU1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5YWQxYmNlYzBiMjgwODBhNzIwZiIsInZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBwb2x5ZmlsbHMgPSByZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpXG52YXIgbGVnYWN5ID0gcmVxdWlyZSgnLi9sZWdhY3ktc3RyZWFtcy5qcycpXG52YXIgcXVldWUgPSBbXVxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuXG5mdW5jdGlvbiBub29wICgpIHt9XG5cbnZhciBkZWJ1ZyA9IG5vb3BcbmlmICh1dGlsLmRlYnVnbG9nKVxuICBkZWJ1ZyA9IHV0aWwuZGVidWdsb2coJ2dmczQnKVxuZWxzZSBpZiAoL1xcYmdmczRcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJycpKVxuICBkZWJ1ZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtID0gdXRpbC5mb3JtYXQuYXBwbHkodXRpbCwgYXJndW1lbnRzKVxuICAgIG0gPSAnR0ZTNDogJyArIG0uc3BsaXQoL1xcbi8pLmpvaW4oJ1xcbkdGUzQ6ICcpXG4gICAgY29uc29sZS5lcnJvcihtKVxuICB9XG5cbmlmICgvXFxiZ2ZzNFxcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJykpIHtcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKHF1ZXVlKVxuICAgIHJlcXVpcmUoJ2Fzc2VydCcpLmVxdWFsKHF1ZXVlLmxlbmd0aCwgMClcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaChyZXF1aXJlKCcuL2ZzLmpzJykpXG5pZiAocHJvY2Vzcy5lbnYuVEVTVF9HUkFDRUZVTF9GU19HTE9CQUxfUEFUQ0gpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBwYXRjaChmcylcbn1cblxuLy8gQWx3YXlzIHBhdGNoIGZzLmNsb3NlL2Nsb3NlU3luYywgYmVjYXVzZSB3ZSB3YW50IHRvXG4vLyByZXRyeSgpIHdoZW5ldmVyIGEgY2xvc2UgaGFwcGVucyAqYW55d2hlcmUqIGluIHRoZSBwcm9ncmFtLlxuLy8gVGhpcyBpcyBlc3NlbnRpYWwgd2hlbiBtdWx0aXBsZSBncmFjZWZ1bC1mcyBpbnN0YW5jZXMgYXJlXG4vLyBpbiBwbGF5IGF0IHRoZSBzYW1lIHRpbWUuXG5tb2R1bGUuZXhwb3J0cy5jbG9zZSA9XG5mcy5jbG9zZSA9IChmdW5jdGlvbiAoZnMkY2xvc2UpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZCwgY2IpIHtcbiAgcmV0dXJuIGZzJGNsb3NlLmNhbGwoZnMsIGZkLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKCFlcnIpXG4gICAgICByZXRyeSgpXG5cbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9KVxufX0pKGZzLmNsb3NlKVxuXG5tb2R1bGUuZXhwb3J0cy5jbG9zZVN5bmMgPVxuZnMuY2xvc2VTeW5jID0gKGZ1bmN0aW9uIChmcyRjbG9zZVN5bmMpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZCkge1xuICAvLyBOb3RlIHRoYXQgZ3JhY2VmdWwtZnMgYWxzbyByZXRyaWVzIHdoZW4gZnMuY2xvc2VTeW5jKCkgZmFpbHMuXG4gIC8vIExvb2tzIGxpa2UgYSBidWcgdG8gbWUsIGFsdGhvdWdoIGl0J3MgcHJvYmFibHkgYSBoYXJtbGVzcyBvbmUuXG4gIHZhciBydmFsID0gZnMkY2xvc2VTeW5jLmFwcGx5KGZzLCBhcmd1bWVudHMpXG4gIHJldHJ5KClcbiAgcmV0dXJuIHJ2YWxcbn19KShmcy5jbG9zZVN5bmMpXG5cbmZ1bmN0aW9uIHBhdGNoIChmcykge1xuICAvLyBFdmVyeXRoaW5nIHRoYXQgcmVmZXJlbmNlcyB0aGUgb3BlbigpIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIGluIGhlcmVcbiAgcG9seWZpbGxzKGZzKVxuICBmcy5ncmFjZWZ1bGlmeSA9IHBhdGNoXG4gIGZzLkZpbGVSZWFkU3RyZWFtID0gUmVhZFN0cmVhbTsgIC8vIExlZ2FjeSBuYW1lLlxuICBmcy5GaWxlV3JpdGVTdHJlYW0gPSBXcml0ZVN0cmVhbTsgIC8vIExlZ2FjeSBuYW1lLlxuICBmcy5jcmVhdGVSZWFkU3RyZWFtID0gY3JlYXRlUmVhZFN0cmVhbVxuICBmcy5jcmVhdGVXcml0ZVN0cmVhbSA9IGNyZWF0ZVdyaXRlU3RyZWFtXG4gIHZhciBmcyRyZWFkRmlsZSA9IGZzLnJlYWRGaWxlXG4gIGZzLnJlYWRGaWxlID0gcmVhZEZpbGVcbiAgZnVuY3Rpb24gcmVhZEZpbGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJHJlYWRGaWxlKHBhdGgsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kcmVhZEZpbGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gZnMkcmVhZEZpbGUocGF0aCwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyRyZWFkRmlsZSwgW3BhdGgsIG9wdGlvbnMsIGNiXV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcmV0cnkoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyR3cml0ZUZpbGUgPSBmcy53cml0ZUZpbGVcbiAgZnMud3JpdGVGaWxlID0gd3JpdGVGaWxlXG4gIGZ1bmN0aW9uIHdyaXRlRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG9wdGlvbnMsIG9wdGlvbnMgPSBudWxsXG5cbiAgICByZXR1cm4gZ28kd3JpdGVGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kd3JpdGVGaWxlIChwYXRoLCBkYXRhLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIGZzJHdyaXRlRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJHdyaXRlRmlsZSwgW3BhdGgsIGRhdGEsIG9wdGlvbnMsIGNiXV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcmV0cnkoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyRhcHBlbmRGaWxlID0gZnMuYXBwZW5kRmlsZVxuICBpZiAoZnMkYXBwZW5kRmlsZSlcbiAgICBmcy5hcHBlbmRGaWxlID0gYXBwZW5kRmlsZVxuICBmdW5jdGlvbiBhcHBlbmRGaWxlIChwYXRoLCBkYXRhLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyRhcHBlbmRGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kYXBwZW5kRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiBmcyRhcHBlbmRGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgICAgZW5xdWV1ZShbZ28kYXBwZW5kRmlsZSwgW3BhdGgsIGRhdGEsIG9wdGlvbnMsIGNiXV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcmV0cnkoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyRyZWFkZGlyID0gZnMucmVhZGRpclxuICBmcy5yZWFkZGlyID0gcmVhZGRpclxuICBmdW5jdGlvbiByZWFkZGlyIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgIHZhciBhcmdzID0gW3BhdGhdXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhcmdzLnB1c2gob3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgY2IgPSBvcHRpb25zXG4gICAgfVxuICAgIGFyZ3MucHVzaChnbyRyZWFkZGlyJGNiKVxuXG4gICAgcmV0dXJuIGdvJHJlYWRkaXIoYXJncylcblxuICAgIGZ1bmN0aW9uIGdvJHJlYWRkaXIkY2IgKGVyciwgZmlsZXMpIHtcbiAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5zb3J0KVxuICAgICAgICBmaWxlcy5zb3J0KClcblxuICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgIGVucXVldWUoW2dvJHJlYWRkaXIsIFthcmdzXV0pXG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHJldHJ5KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyRyZWFkZGlyIChhcmdzKSB7XG4gICAgcmV0dXJuIGZzJHJlYWRkaXIuYXBwbHkoZnMsIGFyZ3MpXG4gIH1cblxuICBpZiAocHJvY2Vzcy52ZXJzaW9uLnN1YnN0cigwLCA0KSA9PT0gJ3YwLjgnKSB7XG4gICAgdmFyIGxlZ1N0cmVhbXMgPSBsZWdhY3koZnMpXG4gICAgUmVhZFN0cmVhbSA9IGxlZ1N0cmVhbXMuUmVhZFN0cmVhbVxuICAgIFdyaXRlU3RyZWFtID0gbGVnU3RyZWFtcy5Xcml0ZVN0cmVhbVxuICB9XG5cbiAgdmFyIGZzJFJlYWRTdHJlYW0gPSBmcy5SZWFkU3RyZWFtXG4gIFJlYWRTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShmcyRSZWFkU3RyZWFtLnByb3RvdHlwZSlcbiAgUmVhZFN0cmVhbS5wcm90b3R5cGUub3BlbiA9IFJlYWRTdHJlYW0kb3BlblxuXG4gIHZhciBmcyRXcml0ZVN0cmVhbSA9IGZzLldyaXRlU3RyZWFtXG4gIFdyaXRlU3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoZnMkV3JpdGVTdHJlYW0ucHJvdG90eXBlKVxuICBXcml0ZVN0cmVhbS5wcm90b3R5cGUub3BlbiA9IFdyaXRlU3RyZWFtJG9wZW5cblxuICBmcy5SZWFkU3RyZWFtID0gUmVhZFN0cmVhbVxuICBmcy5Xcml0ZVN0cmVhbSA9IFdyaXRlU3RyZWFtXG5cbiAgZnVuY3Rpb24gUmVhZFN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgUmVhZFN0cmVhbSlcbiAgICAgIHJldHVybiBmcyRSZWFkU3RyZWFtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRoaXNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gUmVhZFN0cmVhbS5hcHBseShPYmplY3QuY3JlYXRlKFJlYWRTdHJlYW0ucHJvdG90eXBlKSwgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gUmVhZFN0cmVhbSRvcGVuICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBvcGVuKHRoYXQucGF0aCwgdGhhdC5mbGFncywgdGhhdC5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAodGhhdC5hdXRvQ2xvc2UpXG4gICAgICAgICAgdGhhdC5kZXN0cm95KClcblxuICAgICAgICB0aGF0LmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5mZCA9IGZkXG4gICAgICAgIHRoYXQuZW1pdCgnb3BlbicsIGZkKVxuICAgICAgICB0aGF0LnJlYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgV3JpdGVTdHJlYW0pXG4gICAgICByZXR1cm4gZnMkV3JpdGVTdHJlYW0uYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdGhpc1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBXcml0ZVN0cmVhbS5hcHBseShPYmplY3QuY3JlYXRlKFdyaXRlU3RyZWFtLnByb3RvdHlwZSksIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIFdyaXRlU3RyZWFtJG9wZW4gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIG9wZW4odGhhdC5wYXRoLCB0aGF0LmZsYWdzLCB0aGF0Lm1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoYXQuZGVzdHJveSgpXG4gICAgICAgIHRoYXQuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0LmZkID0gZmRcbiAgICAgICAgdGhhdC5lbWl0KCdvcGVuJywgZmQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucylcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVdyaXRlU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBXcml0ZVN0cmVhbShwYXRoLCBvcHRpb25zKVxuICB9XG5cbiAgdmFyIGZzJG9wZW4gPSBmcy5vcGVuXG4gIGZzLm9wZW4gPSBvcGVuXG4gIGZ1bmN0aW9uIG9wZW4gKHBhdGgsIGZsYWdzLCBtb2RlLCBjYikge1xuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gbW9kZSwgbW9kZSA9IG51bGxcblxuICAgIHJldHVybiBnbyRvcGVuKHBhdGgsIGZsYWdzLCBtb2RlLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJG9wZW4gKHBhdGgsIGZsYWdzLCBtb2RlLCBjYikge1xuICAgICAgcmV0dXJuIGZzJG9wZW4ocGF0aCwgZmxhZ3MsIG1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJG9wZW4sIFtwYXRoLCBmbGFncywgbW9kZSwgY2JdXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICByZXRyeSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZzXG59XG5cbmZ1bmN0aW9uIGVucXVldWUgKGVsZW0pIHtcbiAgZGVidWcoJ0VOUVVFVUUnLCBlbGVtWzBdLm5hbWUsIGVsZW1bMV0pXG4gIHF1ZXVlLnB1c2goZWxlbSlcbn1cblxuZnVuY3Rpb24gcmV0cnkgKCkge1xuICB2YXIgZWxlbSA9IHF1ZXVlLnNoaWZ0KClcbiAgaWYgKGVsZW0pIHtcbiAgICBkZWJ1ZygnUkVUUlknLCBlbGVtWzBdLm5hbWUsIGVsZW1bMV0pXG4gICAgZWxlbVswXS5hcHBseShudWxsLCBlbGVtWzFdKVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZ3JhY2VmdWwtZnMvZ3JhY2VmdWwtZnMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWtkaXJzOiByZXF1aXJlKCcuL21rZGlycycpLFxuICBta2RpcnNTeW5jOiByZXF1aXJlKCcuL21rZGlycy1zeW5jJyksXG4gIC8vIGFsaWFzXG4gIG1rZGlycDogcmVxdWlyZSgnLi9ta2RpcnMnKSxcbiAgbWtkaXJwU3luYzogcmVxdWlyZSgnLi9ta2RpcnMtc3luYycpLFxuICBlbnN1cmVEaXI6IHJlcXVpcmUoJy4vbWtkaXJzJyksXG4gIGVuc3VyZURpclN5bmM6IHJlcXVpcmUoJy4vbWtkaXJzLXN5bmMnKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9ta2RpcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJmc1wiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCByaW1yYWYgPSByZXF1aXJlKCcuL3JpbXJhZicpXG5cbmZ1bmN0aW9uIHJlbW92ZVN5bmMgKGRpcikge1xuICByZXR1cm4gcmltcmFmLnN5bmMoZGlyLCB7ZGlzYWJsZUdsb2I6IHRydWV9KVxufVxuXG5mdW5jdGlvbiByZW1vdmUgKGRpciwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHtkaXNhYmxlR2xvYjogdHJ1ZX1cbiAgcmV0dXJuIGNhbGxiYWNrID8gcmltcmFmKGRpciwgb3B0aW9ucywgY2FsbGJhY2spIDogcmltcmFmKGRpciwgb3B0aW9ucywgZnVuY3Rpb24gKCkge30pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZW1vdmUsXG4gIHJlbW92ZVN5bmNcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvcmVtb3ZlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBqc29uRmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGpzb25maWxlIGV4cG9ydHNcbiAgcmVhZEpzb246IGpzb25GaWxlLnJlYWRGaWxlLFxuICByZWFkSlNPTjoganNvbkZpbGUucmVhZEZpbGUsXG4gIHJlYWRKc29uU3luYzoganNvbkZpbGUucmVhZEZpbGVTeW5jLFxuICByZWFkSlNPTlN5bmM6IGpzb25GaWxlLnJlYWRGaWxlU3luYyxcbiAgd3JpdGVKc29uOiBqc29uRmlsZS53cml0ZUZpbGUsXG4gIHdyaXRlSlNPTjoganNvbkZpbGUud3JpdGVGaWxlLFxuICB3cml0ZUpzb25TeW5jOiBqc29uRmlsZS53cml0ZUZpbGVTeW5jLFxuICB3cml0ZUpTT05TeW5jOiBqc29uRmlsZS53cml0ZUZpbGVTeW5jLFxuICBzcGFjZXM6IDIgLy8gZGVmYXVsdCBpbiBmcy1leHRyYVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9qc29uL2pzb25maWxlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGludmFsaWRXaW4zMlBhdGggPSByZXF1aXJlKCcuL3dpbjMyJykuaW52YWxpZFdpbjMyUGF0aFxuXG5jb25zdCBvNzc3ID0gcGFyc2VJbnQoJzA3NzcnLCA4KVxuXG5mdW5jdGlvbiBta2RpcnNTeW5jIChwLCBvcHRzLCBtYWRlKSB7XG4gIGlmICghb3B0cyB8fCB0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRzID0geyBtb2RlOiBvcHRzIH1cbiAgfVxuXG4gIGxldCBtb2RlID0gb3B0cy5tb2RlXG4gIGNvbnN0IHhmcyA9IG9wdHMuZnMgfHwgZnNcblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBpbnZhbGlkV2luMzJQYXRoKHApKSB7XG4gICAgY29uc3QgZXJySW52YWwgPSBuZXcgRXJyb3IocCArICcgY29udGFpbnMgaW52YWxpZCBXSU4zMiBwYXRoIGNoYXJhY3RlcnMuJylcbiAgICBlcnJJbnZhbC5jb2RlID0gJ0VJTlZBTCdcbiAgICB0aHJvdyBlcnJJbnZhbFxuICB9XG5cbiAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vZGUgPSBvNzc3ICYgKH5wcm9jZXNzLnVtYXNrKCkpXG4gIH1cbiAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbFxuXG4gIHAgPSBwYXRoLnJlc29sdmUocClcblxuICB0cnkge1xuICAgIHhmcy5ta2RpclN5bmMocCwgbW9kZSlcbiAgICBtYWRlID0gbWFkZSB8fCBwXG4gIH0gY2F0Y2ggKGVycjApIHtcbiAgICBzd2l0Y2ggKGVycjAuY29kZSkge1xuICAgICAgY2FzZSAnRU5PRU5UJzpcbiAgICAgICAgaWYgKHBhdGguZGlybmFtZShwKSA9PT0gcCkgdGhyb3cgZXJyMFxuICAgICAgICBtYWRlID0gbWtkaXJzU3luYyhwYXRoLmRpcm5hbWUocCksIG9wdHMsIG1hZGUpXG4gICAgICAgIG1rZGlyc1N5bmMocCwgb3B0cywgbWFkZSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW55IG90aGVyIGVycm9yLCBqdXN0IHNlZSBpZiB0aGVyZSdzIGEgZGlyXG4gICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xuICAgICAgLy8gaXMgYm9ya2VkLlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHN0YXRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzdGF0ID0geGZzLnN0YXRTeW5jKHApXG4gICAgICAgIH0gY2F0Y2ggKGVycjEpIHtcbiAgICAgICAgICB0aHJvdyBlcnIwXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkpIHRocm93IGVycjBcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFkZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyc1N5bmNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvbWtkaXJzL21rZGlycy1zeW5jLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGludmFsaWRXaW4zMlBhdGggPSByZXF1aXJlKCcuL3dpbjMyJykuaW52YWxpZFdpbjMyUGF0aFxuXG5jb25zdCBvNzc3ID0gcGFyc2VJbnQoJzA3NzcnLCA4KVxuXG5mdW5jdGlvbiBta2RpcnMgKHAsIG9wdHMsIGNhbGxiYWNrLCBtYWRlKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0c1xuICAgIG9wdHMgPSB7fVxuICB9IGVsc2UgaWYgKCFvcHRzIHx8IHR5cGVvZiBvcHRzICE9PSAnb2JqZWN0Jykge1xuICAgIG9wdHMgPSB7IG1vZGU6IG9wdHMgfVxuICB9XG5cbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgJiYgaW52YWxpZFdpbjMyUGF0aChwKSkge1xuICAgIGNvbnN0IGVyckludmFsID0gbmV3IEVycm9yKHAgKyAnIGNvbnRhaW5zIGludmFsaWQgV0lOMzIgcGF0aCBjaGFyYWN0ZXJzLicpXG4gICAgZXJySW52YWwuY29kZSA9ICdFSU5WQUwnXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVyckludmFsKVxuICB9XG5cbiAgbGV0IG1vZGUgPSBvcHRzLm1vZGVcbiAgY29uc3QgeGZzID0gb3B0cy5mcyB8fCBmc1xuXG4gIGlmIChtb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICBtb2RlID0gbzc3NyAmICh+cHJvY2Vzcy51bWFzaygpKVxuICB9XG4gIGlmICghbWFkZSkgbWFkZSA9IG51bGxcblxuICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9XG4gIHAgPSBwYXRoLnJlc29sdmUocClcblxuICB4ZnMubWtkaXIocCwgbW9kZSwgZXIgPT4ge1xuICAgIGlmICghZXIpIHtcbiAgICAgIG1hZGUgPSBtYWRlIHx8IHBcbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBtYWRlKVxuICAgIH1cbiAgICBzd2l0Y2ggKGVyLmNvZGUpIHtcbiAgICAgIGNhc2UgJ0VOT0VOVCc6XG4gICAgICAgIGlmIChwYXRoLmRpcm5hbWUocCkgPT09IHApIHJldHVybiBjYWxsYmFjayhlcilcbiAgICAgICAgbWtkaXJzKHBhdGguZGlybmFtZShwKSwgb3B0cywgKGVyLCBtYWRlKSA9PiB7XG4gICAgICAgICAgaWYgKGVyKSBjYWxsYmFjayhlciwgbWFkZSlcbiAgICAgICAgICBlbHNlIG1rZGlycyhwLCBvcHRzLCBjYWxsYmFjaywgbWFkZSlcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW55IG90aGVyIGVycm9yLCBqdXN0IHNlZSBpZiB0aGVyZSdzIGEgZGlyXG4gICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xuICAgICAgLy8gaXMgYm9ya2VkLlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeGZzLnN0YXQocCwgKGVyMiwgc3RhdCkgPT4ge1xuICAgICAgICAgIC8vIGlmIHRoZSBzdGF0IGZhaWxzLCB0aGVuIHRoYXQncyBzdXBlciB3ZWlyZC5cbiAgICAgICAgICAvLyBsZXQgdGhlIG9yaWdpbmFsIGVycm9yIGJlIHRoZSBmYWlsdXJlIHJlYXNvbi5cbiAgICAgICAgICBpZiAoZXIyIHx8ICFzdGF0LmlzRGlyZWN0b3J5KCkpIGNhbGxiYWNrKGVyLCBtYWRlKVxuICAgICAgICAgIGVsc2UgY2FsbGJhY2sobnVsbCwgbWFkZSlcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWtkaXJzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL21rZGlycy9ta2RpcnMuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAvW1xcdTAwMWJcXHUwMDliXVtbKCkjOz9dKig/OlswLTldezEsNH0oPzo7WzAtOV17MCw0fSkqKT9bMC05QS1QUlpjZi1ucXJ5PT48XS9nO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnNpLXJlZ2V4L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjb3B5U3luYzogcmVxdWlyZSgnLi9jb3B5LXN5bmMnKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9jb3B5LXN5bmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gaW1wb3J0ZWQgZnJvbSBuY3AgKHRoaXMgaXMgdGVtcG9yYXJ5LCB3aWxsIHJld3JpdGUpXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgdXRpbWVzID0gcmVxdWlyZSgnLi4vdXRpbC91dGltZXMnKVxuXG5mdW5jdGlvbiBuY3AgKHNvdXJjZSwgZGVzdCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdmFyIGJhc2VQYXRoID0gcHJvY2Vzcy5jd2QoKVxuICB2YXIgY3VycmVudFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsIHNvdXJjZSlcbiAgdmFyIHRhcmdldFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsIGRlc3QpXG5cbiAgdmFyIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyXG4gIHZhciB0cmFuc2Zvcm0gPSBvcHRpb25zLnRyYW5zZm9ybVxuICB2YXIgb3ZlcndyaXRlID0gb3B0aW9ucy5vdmVyd3JpdGVcbiAgLy8gSWYgb3ZlcndyaXRlIGlzIHVuZGVmaW5lZCwgdXNlIGNsb2JiZXIsIG90aGVyd2lzZSBkZWZhdWx0IHRvIHRydWU6XG4gIGlmIChvdmVyd3JpdGUgPT09IHVuZGVmaW5lZCkgb3ZlcndyaXRlID0gb3B0aW9ucy5jbG9iYmVyXG4gIGlmIChvdmVyd3JpdGUgPT09IHVuZGVmaW5lZCkgb3ZlcndyaXRlID0gdHJ1ZVxuICB2YXIgZXJyb3JPbkV4aXN0ID0gb3B0aW9ucy5lcnJvck9uRXhpc3RcbiAgdmFyIGRlcmVmZXJlbmNlID0gb3B0aW9ucy5kZXJlZmVyZW5jZVxuICB2YXIgcHJlc2VydmVUaW1lc3RhbXBzID0gb3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMgPT09IHRydWVcblxuICB2YXIgc3RhcnRlZCA9IDBcbiAgdmFyIGZpbmlzaGVkID0gMFxuICB2YXIgcnVubmluZyA9IDBcblxuICB2YXIgZXJyb3JlZCA9IGZhbHNlXG5cbiAgc3RhcnRDb3B5KGN1cnJlbnRQYXRoKVxuXG4gIGZ1bmN0aW9uIHN0YXJ0Q29weSAoc291cmNlKSB7XG4gICAgc3RhcnRlZCsrXG4gICAgaWYgKGZpbHRlcikge1xuICAgICAgaWYgKGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IGZzLWV4dHJhOiBQYXNzaW5nIGEgUmVnRXhwIGZpbHRlciBpcyBkZXByZWNhdGVkLCB1c2UgYSBmdW5jdGlvbicpXG4gICAgICAgIGlmICghZmlsdGVyLnRlc3Qoc291cmNlKSkge1xuICAgICAgICAgIHJldHVybiBkb25lT25lKHRydWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoIWZpbHRlcihzb3VyY2UsIGRlc3QpKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmVPbmUodHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2V0U3RhdHMoc291cmNlKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3RhdHMgKHNvdXJjZSkge1xuICAgIHZhciBzdGF0ID0gZGVyZWZlcmVuY2UgPyBmcy5zdGF0IDogZnMubHN0YXRcbiAgICBydW5uaW5nKytcbiAgICBzdGF0KHNvdXJjZSwgZnVuY3Rpb24gKGVyciwgc3RhdHMpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBvbkVycm9yKGVycilcblxuICAgICAgLy8gV2UgbmVlZCB0byBnZXQgdGhlIG1vZGUgZnJvbSB0aGUgc3RhdHMgb2JqZWN0IGFuZCBwcmVzZXJ2ZSBpdC5cbiAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICBuYW1lOiBzb3VyY2UsXG4gICAgICAgIG1vZGU6IHN0YXRzLm1vZGUsXG4gICAgICAgIG10aW1lOiBzdGF0cy5tdGltZSwgLy8gbW9kaWZpZWQgdGltZVxuICAgICAgICBhdGltZTogc3RhdHMuYXRpbWUsIC8vIGFjY2VzcyB0aW1lXG4gICAgICAgIHN0YXRzOiBzdGF0cyAvLyB0ZW1wb3JhcnlcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcmV0dXJuIG9uRGlyKGl0ZW0pXG4gICAgICB9IGVsc2UgaWYgKHN0YXRzLmlzRmlsZSgpIHx8IHN0YXRzLmlzQ2hhcmFjdGVyRGV2aWNlKCkgfHwgc3RhdHMuaXNCbG9ja0RldmljZSgpKSB7XG4gICAgICAgIHJldHVybiBvbkZpbGUoaXRlbSlcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICAvLyBTeW1saW5rcyBkb24ndCByZWFsbHkgbmVlZCB0byBrbm93IGFib3V0IHRoZSBtb2RlLlxuICAgICAgICByZXR1cm4gb25MaW5rKHNvdXJjZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25GaWxlIChmaWxlKSB7XG4gICAgdmFyIHRhcmdldCA9IGZpbGUubmFtZS5yZXBsYWNlKGN1cnJlbnRQYXRoLCB0YXJnZXRQYXRoLnJlcGxhY2UoJyQnLCAnJCQkJCcpKSAvLyBlc2NhcGVzICckJyB3aXRoICckJCdcbiAgICBpc1dyaXRhYmxlKHRhcmdldCwgZnVuY3Rpb24gKHdyaXRhYmxlKSB7XG4gICAgICBpZiAod3JpdGFibGUpIHtcbiAgICAgICAgY29weUZpbGUoZmlsZSwgdGFyZ2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG92ZXJ3cml0ZSkge1xuICAgICAgICAgIHJtRmlsZSh0YXJnZXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvcHlGaWxlKGZpbGUsIHRhcmdldClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGVycm9yT25FeGlzdCkge1xuICAgICAgICAgIG9uRXJyb3IobmV3IEVycm9yKHRhcmdldCArICcgYWxyZWFkeSBleGlzdHMnKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lT25lKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjb3B5RmlsZSAoZmlsZSwgdGFyZ2V0KSB7XG4gICAgdmFyIHJlYWRTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGUubmFtZSlcbiAgICB2YXIgd3JpdGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0YXJnZXQsIHsgbW9kZTogZmlsZS5tb2RlIH0pXG5cbiAgICByZWFkU3RyZWFtLm9uKCdlcnJvcicsIG9uRXJyb3IpXG4gICAgd3JpdGVTdHJlYW0ub24oJ2Vycm9yJywgb25FcnJvcilcblxuICAgIGlmICh0cmFuc2Zvcm0pIHtcbiAgICAgIHRyYW5zZm9ybShyZWFkU3RyZWFtLCB3cml0ZVN0cmVhbSwgZmlsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd3JpdGVTdHJlYW0ub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlYWRTdHJlYW0ucGlwZSh3cml0ZVN0cmVhbSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgd3JpdGVTdHJlYW0ub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmcy5jaG1vZCh0YXJnZXQsIGZpbGUubW9kZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gb25FcnJvcihlcnIpXG4gICAgICAgIGlmIChwcmVzZXJ2ZVRpbWVzdGFtcHMpIHtcbiAgICAgICAgICB1dGltZXMudXRpbWVzTWlsbGlzKHRhcmdldCwgZmlsZS5hdGltZSwgZmlsZS5tdGltZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIG9uRXJyb3IoZXJyKVxuICAgICAgICAgICAgcmV0dXJuIGRvbmVPbmUoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZU9uZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJtRmlsZSAoZmlsZSwgZG9uZSkge1xuICAgIGZzLnVubGluayhmaWxlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gb25FcnJvcihlcnIpXG4gICAgICByZXR1cm4gZG9uZSgpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRGlyIChkaXIpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZGlyLm5hbWUucmVwbGFjZShjdXJyZW50UGF0aCwgdGFyZ2V0UGF0aC5yZXBsYWNlKCckJywgJyQkJCQnKSkgLy8gZXNjYXBlcyAnJCcgd2l0aCAnJCQnXG4gICAgaXNXcml0YWJsZSh0YXJnZXQsIGZ1bmN0aW9uICh3cml0YWJsZSkge1xuICAgICAgaWYgKHdyaXRhYmxlKSB7XG4gICAgICAgIHJldHVybiBta0RpcihkaXIsIHRhcmdldClcbiAgICAgIH1cbiAgICAgIGNvcHlEaXIoZGlyLm5hbWUpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1rRGlyIChkaXIsIHRhcmdldCkge1xuICAgIGZzLm1rZGlyKHRhcmdldCwgZGlyLm1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBvbkVycm9yKGVycilcbiAgICAgIC8vIGRlc3BpdGUgc2V0dGluZyBtb2RlIGluIGZzLm1rZGlyLCBkb2Vzbid0IHNlZW0gdG8gd29ya1xuICAgICAgLy8gc28gd2Ugc2V0IGl0IGhlcmUuXG4gICAgICBmcy5jaG1vZCh0YXJnZXQsIGRpci5tb2RlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBvbkVycm9yKGVycilcbiAgICAgICAgY29weURpcihkaXIubmFtZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcHlEaXIgKGRpcikge1xuICAgIGZzLnJlYWRkaXIoZGlyLCBmdW5jdGlvbiAoZXJyLCBpdGVtcykge1xuICAgICAgaWYgKGVycikgcmV0dXJuIG9uRXJyb3IoZXJyKVxuICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBzdGFydENvcHkocGF0aC5qb2luKGRpciwgaXRlbSkpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGRvbmVPbmUoKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBvbkxpbmsgKGxpbmspIHtcbiAgICB2YXIgdGFyZ2V0ID0gbGluay5yZXBsYWNlKGN1cnJlbnRQYXRoLCB0YXJnZXRQYXRoKVxuICAgIGZzLnJlYWRsaW5rKGxpbmssIGZ1bmN0aW9uIChlcnIsIHJlc29sdmVkUGF0aCkge1xuICAgICAgaWYgKGVycikgcmV0dXJuIG9uRXJyb3IoZXJyKVxuICAgICAgY2hlY2tMaW5rKHJlc29sdmVkUGF0aCwgdGFyZ2V0KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0xpbmsgKHJlc29sdmVkUGF0aCwgdGFyZ2V0KSB7XG4gICAgaWYgKGRlcmVmZXJlbmNlKSB7XG4gICAgICByZXNvbHZlZFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsIHJlc29sdmVkUGF0aClcbiAgICB9XG4gICAgaXNXcml0YWJsZSh0YXJnZXQsIGZ1bmN0aW9uICh3cml0YWJsZSkge1xuICAgICAgaWYgKHdyaXRhYmxlKSB7XG4gICAgICAgIHJldHVybiBtYWtlTGluayhyZXNvbHZlZFBhdGgsIHRhcmdldClcbiAgICAgIH1cbiAgICAgIGZzLnJlYWRsaW5rKHRhcmdldCwgZnVuY3Rpb24gKGVyciwgdGFyZ2V0RGVzdCkge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gb25FcnJvcihlcnIpXG5cbiAgICAgICAgaWYgKGRlcmVmZXJlbmNlKSB7XG4gICAgICAgICAgdGFyZ2V0RGVzdCA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgdGFyZ2V0RGVzdClcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0RGVzdCA9PT0gcmVzb2x2ZWRQYXRoKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmVPbmUoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBybUZpbGUodGFyZ2V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbWFrZUxpbmsocmVzb2x2ZWRQYXRoLCB0YXJnZXQpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTGluayAobGlua1BhdGgsIHRhcmdldCkge1xuICAgIGZzLnN5bWxpbmsobGlua1BhdGgsIHRhcmdldCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikgcmV0dXJuIG9uRXJyb3IoZXJyKVxuICAgICAgcmV0dXJuIGRvbmVPbmUoKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpc1dyaXRhYmxlIChwYXRoLCBkb25lKSB7XG4gICAgZnMubHN0YXQocGF0aCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSByZXR1cm4gZG9uZSh0cnVlKVxuICAgICAgICByZXR1cm4gZG9uZShmYWxzZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBkb25lKGZhbHNlKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBvbkVycm9yIChlcnIpIHtcbiAgICAvLyBlbnN1cmUgY2FsbGJhY2sgaXMgZGVmaW5lZCAmIGNhbGxlZCBvbmx5IG9uY2U6XG4gICAgaWYgKCFlcnJvcmVkICYmIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yZWQgPSB0cnVlXG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRvbmVPbmUgKHNraXBwZWQpIHtcbiAgICBpZiAoIXNraXBwZWQpIHJ1bm5pbmctLVxuICAgIGZpbmlzaGVkKytcbiAgICBpZiAoKHN0YXJ0ZWQgPT09IGZpbmlzaGVkKSAmJiAocnVubmluZyA9PT0gMCkpIHtcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5jcFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9jb3B5L25jcC5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXIgPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QganNvbkZpbGUgPSByZXF1aXJlKCcuL2pzb25maWxlJylcblxuZnVuY3Rpb24gb3V0cHV0SnNvblN5bmMgKGZpbGUsIGRhdGEsIG9wdGlvbnMpIHtcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHtcbiAgICBta2Rpci5ta2RpcnNTeW5jKGRpcilcbiAgfVxuXG4gIGpzb25GaWxlLndyaXRlSnNvblN5bmMoZmlsZSwgZGF0YSwgb3B0aW9ucylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uU3luY1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9qc29uL291dHB1dC1qc29uLXN5bmMuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnLi9qc29uZmlsZScpXG5cbmZ1bmN0aW9uIG91dHB1dEpzb24gKGZpbGUsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG5cbiAgZnMuZXhpc3RzKGRpciwgaXREb2VzID0+IHtcbiAgICBpZiAoaXREb2VzKSByZXR1cm4ganNvbkZpbGUud3JpdGVKc29uKGZpbGUsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBqc29uRmlsZS53cml0ZUpzb24oZmlsZSwgZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgfSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2pzb24vb3V0cHV0LWpzb24uanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbi8vIGdldCBkcml2ZSBvbiB3aW5kb3dzXG5mdW5jdGlvbiBnZXRSb290UGF0aCAocCkge1xuICBwID0gcGF0aC5ub3JtYWxpemUocGF0aC5yZXNvbHZlKHApKS5zcGxpdChwYXRoLnNlcClcbiAgaWYgKHAubGVuZ3RoID4gMCkgcmV0dXJuIHBbMF1cbiAgcmV0dXJuIG51bGxcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjI4ODgvMTAzMzMgY29udGFpbnMgbW9yZSBhY2N1cmF0ZVxuLy8gVE9ETzogZXhwYW5kIHRvIGluY2x1ZGUgdGhlIHJlc3RcbmNvbnN0IElOVkFMSURfUEFUSF9DSEFSUyA9IC9bPD46XCJ8PypdL1xuXG5mdW5jdGlvbiBpbnZhbGlkV2luMzJQYXRoIChwKSB7XG4gIGNvbnN0IHJwID0gZ2V0Um9vdFBhdGgocClcbiAgcCA9IHAucmVwbGFjZShycCwgJycpXG4gIHJldHVybiBJTlZBTElEX1BBVEhfQ0hBUlMudGVzdChwKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Um9vdFBhdGgsXG4gIGludmFsaWRXaW4zMlBhdGhcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvbWtkaXJzL3dpbjMyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lKGZzKVxuXG5mdW5jdGlvbiBjbG9uZSAob2JqKSB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIG9ialxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgdmFyIGNvcHkgPSB7IF9fcHJvdG9fXzogb2JqLl9fcHJvdG9fXyB9XG4gIGVsc2VcbiAgICB2YXIgY29weSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb3B5LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpKVxuICB9KVxuXG4gIHJldHVybiBjb3B5XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZ3JhY2VmdWwtZnMvZnMuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImFzc2VydFwiXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tIFwiLi9jb21tYW5kLXBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBwcm9jZXNzLnRpdGxlID0gXCJjZHBcIjtcclxuICAgIGNvbnN0IGNtZGxpbmVJbmZvID0gQ29tbWFuZFBhcnNlci5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiArIGNtZGxpbmVJbmZvLmFjdGlvbik7XHJcbiAgICBjb25zb2xlLmxvZyhcInRhcmdldDogXCIgKyBjbWRsaW5lSW5mby50YXJnZXQpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2RwLWNsaS50cyIsImltcG9ydCAqIGFzIGZzIGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCAqIGFzIGNvbW1hbmRlciBmcm9tIFwiY29tbWFuZGVyXCI7XHJcbmltcG9ydCAqIGFzIGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgeyBJQm9pbGVycGxhdGVPcHRpb25zIH0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnNcclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7PnlKjjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICBmb3JjZTogYm9vbGVhbjsgICAgIC8vIOOCqOODqeODvOe2mee2mueUqFxyXG4gICAgdGFyZ2V0ZGlyOiBzdHJpbmc7ICAvLyDkvZzmpa3jg4fjgqPjg6zjgq/jg4jjg6rmjIflrppcclxuICAgIGNvbmZpZzogc3RyaW5nOyAgICAgLy8g44Kz44Oz44OV44Kj44Kw44OV44Kh44Kk44Or5oyH5a6aXHJcbiAgICB2ZXJib3NlOiBib29sZWFuOyAgIC8vIOips+e0sOODreOCsFxyXG4gICAgc2lsZW50OiBib29sZWFuOyAgICAvLyBzaWxlbnQgbW9kZVxyXG59XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvXHJcbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz5oOF5aCx5qC857SN44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm8gZXh0ZW5kcyBJQm9pbGVycGxhdGVPcHRpb25zIHtcclxuICAgIHBrZ0Rpcjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxyXG4gICAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oe44Oz44OJ44K/44O844Ky44OD44OIXHJcbiAgICBpbnN0YWxsZWREaXI6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844OrXHJcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7NcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxyXG4gKiBAYnJpZWYg44Kz44Oe44Oz44OJ44Op44Kk44Oz44OR44O844K144O8XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhcmd2ICAgICAgIOW8leaVsOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMge0lDb21tYW5kTGluZUluZm99XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgICAgICBjb25zdCBjbWRsaW5lID0gPElDb21tYW5kTGluZUluZm8+e1xyXG4gICAgICAgICAgICBwa2dEaXI6IHRoaXMuZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2KSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjbWRsaW5lLnBrZ0RpciwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC52ZXJzaW9uKHBrZy52ZXJzaW9uKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWYsIC0tZm9yY2VcIiwgXCJDb250aW51ZSBleGVjdXRpb24gZXZlbiBpZiBpbiBlcnJvciBzaXR1YXRpb25cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi10LCAtLXRhcmdldGRpciA8cGF0aD5cIiwgXCJTcGVjaWZ5IHByb2plY3QgdGFyZ2V0IGRpcmVjdG9yeVwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWMsIC0tY29uZmlnIDxwYXRoPlwiLCBcIlNwZWNpZnkgY29uZmlnIGZpbGUgcGF0aFwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXYsIC0tdmVyYm9zZVwiLCBcIlNob3cgZGVidWcgbWVzc2FnZXMuXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItcywgLS1zaWxlbnRcIiwgXCJSdW4gYXMgc2lsZW50IG1vZGUuXCIpXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJpbml0XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImluaXQgcHJvamVjdFwiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJpbml0XCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgaW5pdFwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImNyZWF0ZSA8dGFyZ2V0PlwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJjcmVhdGUgYm9pbGVycGxhdGUgZm9yICdhcHAnIHwgJ21vZHVsZSdcIilcclxuICAgICAgICAgICAgLmFjdGlvbigodGFyZ2V0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgvXihhcHB8bW9kdWxlKSQvaS50ZXN0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyB0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGFwcFwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbW9kdWxlXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBhcHAgLWMgc2V0dGluZy5qc29uXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiKlwiLCBudWxsLCB7IG5vSGVscDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAuYWN0aW9uKChjbWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIGNvbW1hbmQ6IFwiICsgY21kKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXIucGFyc2UoYXJndik7XHJcblxyXG4gICAgICAgIGlmIChhcmd2Lmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNtZGxpbmUuY2xpT3B0aW9ucyA9IHRoaXMudG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNtZGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSDjga7jgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6rjgpLlj5blvpdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gYXJndiDlvJXmlbBcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30g44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFBhY2thZ2VEaXJlY3RvcnkoYXJndjogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGV4ZWNEaXIgPSBwYXRoLmRpcm5hbWUoYXJndlsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihleGVjRGlyLCBcIi4uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xJIG9wdGlvbiDjgpIgSUNvbW1hbmRMaW5lT3B0aW9ucyDjgavlpInmj5tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbW1hbmRlciBwYXJzZSDmuIjjgb8gY29tYW5uZGVyIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICogQHJldHVybiB7SUNvbW1hbmRMaW5lT3B0aW9uc30gb3B0aW9uIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyB0b0NvbW1hbmRMaW5lT3B0aW9ucyhjb21tYW5kZXI6IGFueSk6IElDb21tYW5kTGluZU9wdGlvbnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZvcmNlOiAhIWNvbW1hbmRlci5mb3JjZSxcclxuICAgICAgICAgICAgdGFyZ2V0ZGlyOiBjb21tYW5kZXIudGFyZ2V0ZGlyLFxyXG4gICAgICAgICAgICBjb25maWc6IGNvbW1hbmRlci5jb25maWcsXHJcbiAgICAgICAgICAgIHZlcmJvc2U6ICEhY29tbWFuZGVyLnZlcmJvc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogISFjb21tYW5kZXIuc2lsZW50LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5jjg6vjg5fooajnpLrjgZfjgabntYLkuoZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd0hlbHAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5mb3JtID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JlZW4odGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb21tYW5kZXIub3V0cHV0SGVscCg8YW55PmluZm9ybSk7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY29tbWFuZC1wYXJzZXIudHMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlU3R5bGVzICgpIHtcblx0dmFyIHN0eWxlcyA9IHtcblx0XHRtb2RpZmllcnM6IHtcblx0XHRcdHJlc2V0OiBbMCwgMF0sXG5cdFx0XHRib2xkOiBbMSwgMjJdLCAvLyAyMSBpc24ndCB3aWRlbHkgc3VwcG9ydGVkIGFuZCAyMiBkb2VzIHRoZSBzYW1lIHRoaW5nXG5cdFx0XHRkaW06IFsyLCAyMl0sXG5cdFx0XHRpdGFsaWM6IFszLCAyM10sXG5cdFx0XHR1bmRlcmxpbmU6IFs0LCAyNF0sXG5cdFx0XHRpbnZlcnNlOiBbNywgMjddLFxuXHRcdFx0aGlkZGVuOiBbOCwgMjhdLFxuXHRcdFx0c3RyaWtldGhyb3VnaDogWzksIDI5XVxuXHRcdH0sXG5cdFx0Y29sb3JzOiB7XG5cdFx0XHRibGFjazogWzMwLCAzOV0sXG5cdFx0XHRyZWQ6IFszMSwgMzldLFxuXHRcdFx0Z3JlZW46IFszMiwgMzldLFxuXHRcdFx0eWVsbG93OiBbMzMsIDM5XSxcblx0XHRcdGJsdWU6IFszNCwgMzldLFxuXHRcdFx0bWFnZW50YTogWzM1LCAzOV0sXG5cdFx0XHRjeWFuOiBbMzYsIDM5XSxcblx0XHRcdHdoaXRlOiBbMzcsIDM5XSxcblx0XHRcdGdyYXk6IFs5MCwgMzldXG5cdFx0fSxcblx0XHRiZ0NvbG9yczoge1xuXHRcdFx0YmdCbGFjazogWzQwLCA0OV0sXG5cdFx0XHRiZ1JlZDogWzQxLCA0OV0sXG5cdFx0XHRiZ0dyZWVuOiBbNDIsIDQ5XSxcblx0XHRcdGJnWWVsbG93OiBbNDMsIDQ5XSxcblx0XHRcdGJnQmx1ZTogWzQ0LCA0OV0sXG5cdFx0XHRiZ01hZ2VudGE6IFs0NSwgNDldLFxuXHRcdFx0YmdDeWFuOiBbNDYsIDQ5XSxcblx0XHRcdGJnV2hpdGU6IFs0NywgNDldXG5cdFx0fVxuXHR9O1xuXG5cdC8vIGZpeCBodW1hbnNcblx0c3R5bGVzLmNvbG9ycy5ncmV5ID0gc3R5bGVzLmNvbG9ycy5ncmF5O1xuXG5cdE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXBOYW1lKSB7XG5cdFx0dmFyIGdyb3VwID0gc3R5bGVzW2dyb3VwTmFtZV07XG5cblx0XHRPYmplY3Qua2V5cyhncm91cCkuZm9yRWFjaChmdW5jdGlvbiAoc3R5bGVOYW1lKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSBncm91cFtzdHlsZU5hbWVdO1xuXG5cdFx0XHRzdHlsZXNbc3R5bGVOYW1lXSA9IGdyb3VwW3N0eWxlTmFtZV0gPSB7XG5cdFx0XHRcdG9wZW46ICdcXHUwMDFiWycgKyBzdHlsZVswXSArICdtJyxcblx0XHRcdFx0Y2xvc2U6ICdcXHUwMDFiWycgKyBzdHlsZVsxXSArICdtJ1xuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHlsZXMsIGdyb3VwTmFtZSwge1xuXHRcdFx0dmFsdWU6IGdyb3VwLFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0XHR9KTtcblx0fSk7XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdGVudW1lcmFibGU6IHRydWUsXG5cdGdldDogYXNzZW1ibGVTdHlsZXNcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Fuc2ktc3R5bGVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgZXNjYXBlU3RyaW5nUmVnZXhwID0gcmVxdWlyZSgnZXNjYXBlLXN0cmluZy1yZWdleHAnKTtcbnZhciBhbnNpU3R5bGVzID0gcmVxdWlyZSgnYW5zaS1zdHlsZXMnKTtcbnZhciBzdHJpcEFuc2kgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG52YXIgaGFzQW5zaSA9IHJlcXVpcmUoJ2hhcy1hbnNpJyk7XG52YXIgc3VwcG9ydHNDb2xvciA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG52YXIgZGVmaW5lUHJvcHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbnZhciBpc1NpbXBsZVdpbmRvd3NUZXJtID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiAhL154dGVybS9pLnRlc3QocHJvY2Vzcy5lbnYuVEVSTSk7XG5cbmZ1bmN0aW9uIENoYWxrKG9wdGlvbnMpIHtcblx0Ly8gZGV0ZWN0IG1vZGUgaWYgbm90IHNldCBtYW51YWxseVxuXHR0aGlzLmVuYWJsZWQgPSAhb3B0aW9ucyB8fCBvcHRpb25zLmVuYWJsZWQgPT09IHVuZGVmaW5lZCA/IHN1cHBvcnRzQ29sb3IgOiBvcHRpb25zLmVuYWJsZWQ7XG59XG5cbi8vIHVzZSBicmlnaHQgYmx1ZSBvbiBXaW5kb3dzIGFzIHRoZSBub3JtYWwgYmx1ZSBjb2xvciBpcyBpbGxlZ2libGVcbmlmIChpc1NpbXBsZVdpbmRvd3NUZXJtKSB7XG5cdGFuc2lTdHlsZXMuYmx1ZS5vcGVuID0gJ1xcdTAwMWJbOTRtJztcbn1cblxudmFyIHN0eWxlcyA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciByZXQgPSB7fTtcblxuXHRPYmplY3Qua2V5cyhhbnNpU3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRhbnNpU3R5bGVzW2tleV0uY2xvc2VSZSA9IG5ldyBSZWdFeHAoZXNjYXBlU3RyaW5nUmVnZXhwKGFuc2lTdHlsZXNba2V5XS5jbG9zZSksICdnJyk7XG5cblx0XHRyZXRba2V5XSA9IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYnVpbGQuY2FsbCh0aGlzLCB0aGlzLl9zdHlsZXMuY29uY2F0KGtleSkpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG5cdHJldHVybiByZXQ7XG59KSgpO1xuXG52YXIgcHJvdG8gPSBkZWZpbmVQcm9wcyhmdW5jdGlvbiBjaGFsaygpIHt9LCBzdHlsZXMpO1xuXG5mdW5jdGlvbiBidWlsZChfc3R5bGVzKSB7XG5cdHZhciBidWlsZGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBhcHBseVN0eWxlLmFwcGx5KGJ1aWxkZXIsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0YnVpbGRlci5fc3R5bGVzID0gX3N0eWxlcztcblx0YnVpbGRlci5lbmFibGVkID0gdGhpcy5lbmFibGVkO1xuXHQvLyBfX3Byb3RvX18gaXMgdXNlZCBiZWNhdXNlIHdlIG11c3QgcmV0dXJuIGEgZnVuY3Rpb24sIGJ1dCB0aGVyZSBpc1xuXHQvLyBubyB3YXkgdG8gY3JlYXRlIGEgZnVuY3Rpb24gd2l0aCBhIGRpZmZlcmVudCBwcm90b3R5cGUuXG5cdC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cdGJ1aWxkZXIuX19wcm90b19fID0gcHJvdG87XG5cblx0cmV0dXJuIGJ1aWxkZXI7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3R5bGUoKSB7XG5cdC8vIHN1cHBvcnQgdmFyYWdzLCBidXQgc2ltcGx5IGNhc3QgdG8gc3RyaW5nIGluIGNhc2UgdGhlcmUncyBvbmx5IG9uZSBhcmdcblx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdHZhciBhcmdzTGVuID0gYXJncy5sZW5ndGg7XG5cdHZhciBzdHIgPSBhcmdzTGVuICE9PSAwICYmIFN0cmluZyhhcmd1bWVudHNbMF0pO1xuXG5cdGlmIChhcmdzTGVuID4gMSkge1xuXHRcdC8vIGRvbid0IHNsaWNlIGBhcmd1bWVudHNgLCBpdCBwcmV2ZW50cyB2OCBvcHRpbWl6YXRpb25zXG5cdFx0Zm9yICh2YXIgYSA9IDE7IGEgPCBhcmdzTGVuOyBhKyspIHtcblx0XHRcdHN0ciArPSAnICcgKyBhcmdzW2FdO1xuXHRcdH1cblx0fVxuXG5cdGlmICghdGhpcy5lbmFibGVkIHx8ICFzdHIpIHtcblx0XHRyZXR1cm4gc3RyO1xuXHR9XG5cblx0dmFyIG5lc3RlZFN0eWxlcyA9IHRoaXMuX3N0eWxlcztcblx0dmFyIGkgPSBuZXN0ZWRTdHlsZXMubGVuZ3RoO1xuXG5cdC8vIFR1cm5zIG91dCB0aGF0IG9uIFdpbmRvd3MgZGltbWVkIGdyYXkgdGV4dCBiZWNvbWVzIGludmlzaWJsZSBpbiBjbWQuZXhlLFxuXHQvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2NoYWxrL2lzc3Vlcy81OFxuXHQvLyBJZiB3ZSdyZSBvbiBXaW5kb3dzIGFuZCB3ZSdyZSBkZWFsaW5nIHdpdGggYSBncmF5IGNvbG9yLCB0ZW1wb3JhcmlseSBtYWtlICdkaW0nIGEgbm9vcC5cblx0dmFyIG9yaWdpbmFsRGltID0gYW5zaVN0eWxlcy5kaW0ub3Blbjtcblx0aWYgKGlzU2ltcGxlV2luZG93c1Rlcm0gJiYgKG5lc3RlZFN0eWxlcy5pbmRleE9mKCdncmF5JykgIT09IC0xIHx8IG5lc3RlZFN0eWxlcy5pbmRleE9mKCdncmV5JykgIT09IC0xKSkge1xuXHRcdGFuc2lTdHlsZXMuZGltLm9wZW4gPSAnJztcblx0fVxuXG5cdHdoaWxlIChpLS0pIHtcblx0XHR2YXIgY29kZSA9IGFuc2lTdHlsZXNbbmVzdGVkU3R5bGVzW2ldXTtcblxuXHRcdC8vIFJlcGxhY2UgYW55IGluc3RhbmNlcyBhbHJlYWR5IHByZXNlbnQgd2l0aCBhIHJlLW9wZW5pbmcgY29kZVxuXHRcdC8vIG90aGVyd2lzZSBvbmx5IHRoZSBwYXJ0IG9mIHRoZSBzdHJpbmcgdW50aWwgc2FpZCBjbG9zaW5nIGNvZGVcblx0XHQvLyB3aWxsIGJlIGNvbG9yZWQsIGFuZCB0aGUgcmVzdCB3aWxsIHNpbXBseSBiZSAncGxhaW4nLlxuXHRcdHN0ciA9IGNvZGUub3BlbiArIHN0ci5yZXBsYWNlKGNvZGUuY2xvc2VSZSwgY29kZS5vcGVuKSArIGNvZGUuY2xvc2U7XG5cdH1cblxuXHQvLyBSZXNldCB0aGUgb3JpZ2luYWwgJ2RpbScgaWYgd2UgY2hhbmdlZCBpdCB0byB3b3JrIGFyb3VuZCB0aGUgV2luZG93cyBkaW1tZWQgZ3JheSBpc3N1ZS5cblx0YW5zaVN0eWxlcy5kaW0ub3BlbiA9IG9yaWdpbmFsRGltO1xuXG5cdHJldHVybiBzdHI7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdHZhciByZXQgPSB7fTtcblxuXHRPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRyZXRbbmFtZV0gPSB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIGJ1aWxkLmNhbGwodGhpcywgW25hbWVdKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxuXHRyZXR1cm4gcmV0O1xufVxuXG5kZWZpbmVQcm9wcyhDaGFsay5wcm90b3R5cGUsIGluaXQoKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENoYWxrKCk7XG5tb2R1bGUuZXhwb3J0cy5zdHlsZXMgPSBhbnNpU3R5bGVzO1xubW9kdWxlLmV4cG9ydHMuaGFzQ29sb3IgPSBoYXNBbnNpO1xubW9kdWxlLmV4cG9ydHMuc3RyaXBDb2xvciA9IHN0cmlwQW5zaTtcbm1vZHVsZS5leHBvcnRzLnN1cHBvcnRzQ29sb3IgPSBzdXBwb3J0c0NvbG9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NoYWxrL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcbnZhciByZWFkbGluayA9IHJlcXVpcmUoJ2dyYWNlZnVsLXJlYWRsaW5rJykucmVhZGxpbmtTeW5jO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZGlybmFtZSA9IHBhdGguZGlybmFtZTtcbnZhciBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWU7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgcm9vdCBjb21tYW5kLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG5ldyBDb21tYW5kKCk7XG5cbi8qKlxuICogRXhwb3NlIGBDb21tYW5kYC5cbiAqL1xuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kO1xuXG4vKipcbiAqIEV4cG9zZSBgT3B0aW9uYC5cbiAqL1xuXG5leHBvcnRzLk9wdGlvbiA9IE9wdGlvbjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBPcHRpb25gIHdpdGggdGhlIGdpdmVuIGBmbGFnc2AgYW5kIGBkZXNjcmlwdGlvbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdzXG4gKiBAcGFyYW0ge1N0cmluZ30gZGVzY3JpcHRpb25cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbikge1xuICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gIHRoaXMucmVxdWlyZWQgPSB+ZmxhZ3MuaW5kZXhPZignPCcpO1xuICB0aGlzLm9wdGlvbmFsID0gfmZsYWdzLmluZGV4T2YoJ1snKTtcbiAgdGhpcy5ib29sID0gIX5mbGFncy5pbmRleE9mKCctbm8tJyk7XG4gIGZsYWdzID0gZmxhZ3Muc3BsaXQoL1sgLHxdKy8pO1xuICBpZiAoZmxhZ3MubGVuZ3RoID4gMSAmJiAhL15bWzxdLy50ZXN0KGZsYWdzWzFdKSkgdGhpcy5zaG9ydCA9IGZsYWdzLnNoaWZ0KCk7XG4gIHRoaXMubG9uZyA9IGZsYWdzLnNoaWZ0KCk7XG4gIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiB8fCAnJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gb3B0aW9uIG5hbWUuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuT3B0aW9uLnByb3RvdHlwZS5uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxvbmdcbiAgICAucmVwbGFjZSgnLS0nLCAnJylcbiAgICAucmVwbGFjZSgnbm8tJywgJycpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgYXJnYCBtYXRjaGVzIHRoZSBzaG9ydCBvciBsb25nIGZsYWcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyZ1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk9wdGlvbi5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSB0aGlzLnNob3J0IHx8IGFyZyA9PSB0aGlzLmxvbmc7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYENvbW1hbmRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIENvbW1hbmQobmFtZSkge1xuICB0aGlzLmNvbW1hbmRzID0gW107XG4gIHRoaXMub3B0aW9ucyA9IFtdO1xuICB0aGlzLl9leGVjcyA9IHt9O1xuICB0aGlzLl9hbGxvd1Vua25vd25PcHRpb24gPSBmYWxzZTtcbiAgdGhpcy5fYXJncyA9IFtdO1xuICB0aGlzLl9uYW1lID0gbmFtZSB8fCAnJztcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEV2ZW50RW1pdHRlci5wcm90b3R5cGVgLlxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLl9fcHJvdG9fXyA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG5cbi8qKlxuICogQWRkIGNvbW1hbmQgYG5hbWVgLlxuICpcbiAqIFRoZSBgLmFjdGlvbigpYCBjYWxsYmFjayBpcyBpbnZva2VkIHdoZW4gdGhlXG4gKiBjb21tYW5kIGBuYW1lYCBpcyBzcGVjaWZpZWQgdmlhIF9fQVJHVl9fLFxuICogYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIGFyZSBhcHBsaWVkIHRvIHRoZVxuICogZnVuY3Rpb24gZm9yIGFjY2Vzcy5cbiAqXG4gKiBXaGVuIHRoZSBgbmFtZWAgaXMgXCIqXCIgYW4gdW4tbWF0Y2hlZCBjb21tYW5kXG4gKiB3aWxsIGJlIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJnLCBmb2xsb3dlZCBieVxuICogdGhlIHJlc3Qgb2YgX19BUkdWX18gcmVtYWluaW5nLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC52ZXJzaW9uKCcwLjAuMScpXG4gKiAgICAgICAgLm9wdGlvbignLUMsIC0tY2hkaXIgPHBhdGg+JywgJ2NoYW5nZSB0aGUgd29ya2luZyBkaXJlY3RvcnknKVxuICogICAgICAgIC5vcHRpb24oJy1jLCAtLWNvbmZpZyA8cGF0aD4nLCAnc2V0IGNvbmZpZyBwYXRoLiBkZWZhdWx0cyB0byAuL2RlcGxveS5jb25mJylcbiAqICAgICAgICAub3B0aW9uKCctVCwgLS1uby10ZXN0cycsICdpZ25vcmUgdGVzdCBob29rJylcbiAqXG4gKiAgICAgIHByb2dyYW1cbiAqICAgICAgICAuY29tbWFuZCgnc2V0dXAnKVxuICogICAgICAgIC5kZXNjcmlwdGlvbigncnVuIHJlbW90ZSBzZXR1cCBjb21tYW5kcycpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbigpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXR1cCcpO1xuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCdleGVjIDxjbWQ+JylcbiAqICAgICAgICAuZGVzY3JpcHRpb24oJ3J1biB0aGUgZ2l2ZW4gcmVtb3RlIGNvbW1hbmQnKVxuICogICAgICAgIC5hY3Rpb24oZnVuY3Rpb24oY21kKSB7XG4gKiAgICAgICAgICBjb25zb2xlLmxvZygnZXhlYyBcIiVzXCInLCBjbWQpO1xuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCd0ZWFyZG93biA8ZGlyPiBbb3RoZXJEaXJzLi4uXScpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdydW4gdGVhcmRvd24gY29tbWFuZHMnKVxuICogICAgICAgIC5hY3Rpb24oZnVuY3Rpb24oZGlyLCBvdGhlckRpcnMpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXIgXCIlc1wiJywgZGlyKTtcbiAqICAgICAgICAgIGlmIChvdGhlckRpcnMpIHtcbiAqICAgICAgICAgICAgb3RoZXJEaXJzLmZvckVhY2goZnVuY3Rpb24gKG9EaXIpIHtcbiAqICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGlyIFwiJXNcIicsIG9EaXIpO1xuICogICAgICAgICAgICB9KTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICB9KTtcbiAqXG4gKiAgICAgIHByb2dyYW1cbiAqICAgICAgICAuY29tbWFuZCgnKicpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdkZXBsb3kgdGhlIGdpdmVuIGVudicpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbihlbnYpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXBsb3lpbmcgXCIlc1wiJywgZW52KTtcbiAqICAgICAgICB9KTtcbiAqXG4gKiAgICAgIHByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KTtcbiAgKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzY10gZm9yIGdpdC1zdHlsZSBzdWItY29tbWFuZHNcbiAqIEByZXR1cm4ge0NvbW1hbmR9IHRoZSBuZXcgY29tbWFuZFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5jb21tYW5kID0gZnVuY3Rpb24obmFtZSwgZGVzYywgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBuYW1lLnNwbGl0KC8gKy8pO1xuICB2YXIgY21kID0gbmV3IENvbW1hbmQoYXJncy5zaGlmdCgpKTtcblxuICBpZiAoZGVzYykge1xuICAgIGNtZC5kZXNjcmlwdGlvbihkZXNjKTtcbiAgICB0aGlzLmV4ZWN1dGFibGVzID0gdHJ1ZTtcbiAgICB0aGlzLl9leGVjc1tjbWQuX25hbWVdID0gdHJ1ZTtcbiAgICBpZiAob3B0cy5pc0RlZmF1bHQpIHRoaXMuZGVmYXVsdEV4ZWN1dGFibGUgPSBjbWQuX25hbWU7XG4gIH1cblxuICBjbWQuX25vSGVscCA9ICEhb3B0cy5ub0hlbHA7XG4gIHRoaXMuY29tbWFuZHMucHVzaChjbWQpO1xuICBjbWQucGFyc2VFeHBlY3RlZEFyZ3MoYXJncyk7XG4gIGNtZC5wYXJlbnQgPSB0aGlzO1xuXG4gIGlmIChkZXNjKSByZXR1cm4gdGhpcztcbiAgcmV0dXJuIGNtZDtcbn07XG5cbi8qKlxuICogRGVmaW5lIGFyZ3VtZW50IHN5bnRheCBmb3IgdGhlIHRvcC1sZXZlbCBjb21tYW5kLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuYXJndW1lbnRzID0gZnVuY3Rpb24gKGRlc2MpIHtcbiAgcmV0dXJuIHRoaXMucGFyc2VFeHBlY3RlZEFyZ3MoZGVzYy5zcGxpdCgvICsvKSk7XG59O1xuXG4vKipcbiAqIEFkZCBhbiBpbXBsaWNpdCBgaGVscCBbY21kXWAgc3ViY29tbWFuZFxuICogd2hpY2ggaW52b2tlcyBgLS1oZWxwYCBmb3IgdGhlIGdpdmVuIGNvbW1hbmQuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuYWRkSW1wbGljaXRIZWxwQ29tbWFuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNvbW1hbmQoJ2hlbHAgW2NtZF0nLCAnZGlzcGxheSBoZWxwIGZvciBbY21kXScpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBleHBlY3RlZCBgYXJnc2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYFtcIlt0eXBlXVwiXWAgYmVjb21lcyBgW3sgcmVxdWlyZWQ6IGZhbHNlLCBuYW1lOiAndHlwZScgfV1gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5wYXJzZUV4cGVjdGVkQXJncyA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgaWYgKCFhcmdzLmxlbmd0aCkgcmV0dXJuO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcpIHtcbiAgICB2YXIgYXJnRGV0YWlscyA9IHtcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgdmFyaWFkaWM6IGZhbHNlXG4gICAgfTtcblxuICAgIHN3aXRjaCAoYXJnWzBdKSB7XG4gICAgICBjYXNlICc8JzpcbiAgICAgICAgYXJnRGV0YWlscy5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgIGFyZ0RldGFpbHMubmFtZSA9IGFyZy5zbGljZSgxLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICAgIGFyZ0RldGFpbHMubmFtZSA9IGFyZy5zbGljZSgxLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChhcmdEZXRhaWxzLm5hbWUubGVuZ3RoID4gMyAmJiBhcmdEZXRhaWxzLm5hbWUuc2xpY2UoLTMpID09PSAnLi4uJykge1xuICAgICAgYXJnRGV0YWlscy52YXJpYWRpYyA9IHRydWU7XG4gICAgICBhcmdEZXRhaWxzLm5hbWUgPSBhcmdEZXRhaWxzLm5hbWUuc2xpY2UoMCwgLTMpO1xuICAgIH1cbiAgICBpZiAoYXJnRGV0YWlscy5uYW1lKSB7XG4gICAgICBzZWxmLl9hcmdzLnB1c2goYXJnRGV0YWlscyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGNhbGxiYWNrIGBmbmAgZm9yIHRoZSBjb21tYW5kLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCdoZWxwJylcbiAqICAgICAgICAuZGVzY3JpcHRpb24oJ2Rpc3BsYXkgdmVyYm9zZSBoZWxwJylcbiAqICAgICAgICAuYWN0aW9uKGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgIC8vIG91dHB1dCBoZWxwIGhlcmVcbiAqICAgICAgICB9KTtcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7Q29tbWFuZH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmFjdGlvbiA9IGZ1bmN0aW9uKGZuKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oYXJncywgdW5rbm93bikge1xuICAgIC8vIFBhcnNlIGFueSBzby1mYXIgdW5rbm93biBvcHRpb25zXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XG4gICAgdW5rbm93biA9IHVua25vd24gfHwgW107XG5cbiAgICB2YXIgcGFyc2VkID0gc2VsZi5wYXJzZU9wdGlvbnModW5rbm93bik7XG5cbiAgICAvLyBPdXRwdXQgaGVscCBpZiBuZWNlc3NhcnlcbiAgICBvdXRwdXRIZWxwSWZOZWNlc3Nhcnkoc2VsZiwgcGFyc2VkLnVua25vd24pO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIHN0aWxsIGFueSB1bmtub3duIG9wdGlvbnMsIHRoZW4gd2Ugc2ltcGx5XG4gICAgLy8gZGllLCB1bmxlc3Mgc29tZW9uZSBhc2tlZCBmb3IgaGVscCwgaW4gd2hpY2ggY2FzZSB3ZSBnaXZlIGl0XG4gICAgLy8gdG8gdGhlbSwgYW5kIHRoZW4gd2UgZGllLlxuICAgIGlmIChwYXJzZWQudW5rbm93bi5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxmLnVua25vd25PcHRpb24ocGFyc2VkLnVua25vd25bMF0pO1xuICAgIH1cblxuICAgIC8vIExlZnRvdmVyIGFyZ3VtZW50cyBuZWVkIHRvIGJlIHB1c2hlZCBiYWNrLiBGaXhlcyBpc3N1ZSAjNTZcbiAgICBpZiAocGFyc2VkLmFyZ3MubGVuZ3RoKSBhcmdzID0gcGFyc2VkLmFyZ3MuY29uY2F0KGFyZ3MpO1xuXG4gICAgc2VsZi5fYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGFyZywgaSkge1xuICAgICAgaWYgKGFyZy5yZXF1aXJlZCAmJiBudWxsID09IGFyZ3NbaV0pIHtcbiAgICAgICAgc2VsZi5taXNzaW5nQXJndW1lbnQoYXJnLm5hbWUpO1xuICAgICAgfSBlbHNlIGlmIChhcmcudmFyaWFkaWMpIHtcbiAgICAgICAgaWYgKGkgIT09IHNlbGYuX2FyZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHNlbGYudmFyaWFkaWNBcmdOb3RMYXN0KGFyZy5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3NbaV0gPSBhcmdzLnNwbGljZShpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFsd2F5cyBhcHBlbmQgb3Vyc2VsdmVzIHRvIHRoZSBlbmQgb2YgdGhlIGFyZ3VtZW50cyxcbiAgICAvLyB0byBtYWtlIHN1cmUgd2UgbWF0Y2ggdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdGhlIHVzZXJcbiAgICAvLyBleHBlY3RzXG4gICAgaWYgKHNlbGYuX2FyZ3MubGVuZ3RoKSB7XG4gICAgICBhcmdzW3NlbGYuX2FyZ3MubGVuZ3RoXSA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MucHVzaChzZWxmKTtcbiAgICB9XG5cbiAgICBmbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgfTtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXM7XG4gIHZhciBuYW1lID0gcGFyZW50ID09PSB0aGlzID8gJyonIDogdGhpcy5fbmFtZTtcbiAgcGFyZW50Lm9uKG5hbWUsIGxpc3RlbmVyKTtcbiAgaWYgKHRoaXMuX2FsaWFzKSBwYXJlbnQub24odGhpcy5fYWxpYXMsIGxpc3RlbmVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIERlZmluZSBvcHRpb24gd2l0aCBgZmxhZ3NgLCBgZGVzY3JpcHRpb25gIGFuZCBvcHRpb25hbFxuICogY29lcmNpb24gYGZuYC5cbiAqXG4gKiBUaGUgYGZsYWdzYCBzdHJpbmcgc2hvdWxkIGNvbnRhaW4gYm90aCB0aGUgc2hvcnQgYW5kIGxvbmcgZmxhZ3MsXG4gKiBzZXBhcmF0ZWQgYnkgY29tbWEsIGEgcGlwZSBvciBzcGFjZS4gVGhlIGZvbGxvd2luZyBhcmUgYWxsIHZhbGlkXG4gKiBhbGwgd2lsbCBvdXRwdXQgdGhpcyB3YXkgd2hlbiBgLS1oZWxwYCBpcyB1c2VkLlxuICpcbiAqICAgIFwiLXAsIC0tcGVwcGVyXCJcbiAqICAgIFwiLXB8LS1wZXBwZXJcIlxuICogICAgXCItcCAtLXBlcHBlclwiXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgIC8vIHNpbXBsZSBib29sZWFuIGRlZmF1bHRpbmcgdG8gZmFsc2VcbiAqICAgICBwcm9ncmFtLm9wdGlvbignLXAsIC0tcGVwcGVyJywgJ2FkZCBwZXBwZXInKTtcbiAqXG4gKiAgICAgLS1wZXBwZXJcbiAqICAgICBwcm9ncmFtLnBlcHBlclxuICogICAgIC8vID0+IEJvb2xlYW5cbiAqXG4gKiAgICAgLy8gc2ltcGxlIGJvb2xlYW4gZGVmYXVsdGluZyB0byB0cnVlXG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1DLCAtLW5vLWNoZWVzZScsICdyZW1vdmUgY2hlZXNlJyk7XG4gKlxuICogICAgIHByb2dyYW0uY2hlZXNlXG4gKiAgICAgLy8gPT4gdHJ1ZVxuICpcbiAqICAgICAtLW5vLWNoZWVzZVxuICogICAgIHByb2dyYW0uY2hlZXNlXG4gKiAgICAgLy8gPT4gZmFsc2VcbiAqXG4gKiAgICAgLy8gcmVxdWlyZWQgYXJndW1lbnRcbiAqICAgICBwcm9ncmFtLm9wdGlvbignLUMsIC0tY2hkaXIgPHBhdGg+JywgJ2NoYW5nZSB0aGUgd29ya2luZyBkaXJlY3RvcnknKTtcbiAqXG4gKiAgICAgLS1jaGRpciAvdG1wXG4gKiAgICAgcHJvZ3JhbS5jaGRpclxuICogICAgIC8vID0+IFwiL3RtcFwiXG4gKlxuICogICAgIC8vIG9wdGlvbmFsIGFyZ3VtZW50XG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1jLCAtLWNoZWVzZSBbdHlwZV0nLCAnYWRkIGNoZWVzZSBbbWFyYmxlXScpO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmbGFnc1xuICogQHBhcmFtIHtTdHJpbmd9IGRlc2NyaXB0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE1peGVkfSBmbiBvciBkZWZhdWx0XG4gKiBAcGFyYW0ge01peGVkfSBkZWZhdWx0VmFsdWVcbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbihmbGFncywgZGVzY3JpcHRpb24sIGZuLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBvcHRpb24gPSBuZXcgT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbilcbiAgICAsIG9uYW1lID0gb3B0aW9uLm5hbWUoKVxuICAgICwgbmFtZSA9IGNhbWVsY2FzZShvbmFtZSk7XG5cbiAgLy8gZGVmYXVsdCBhcyAzcmQgYXJnXG4gIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChmbiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgdmFyIHJlZ2V4ID0gZm47XG4gICAgICBmbiA9IGZ1bmN0aW9uKHZhbCwgZGVmKSB7XG4gICAgICAgIHZhciBtID0gcmVnZXguZXhlYyh2YWwpO1xuICAgICAgICByZXR1cm4gbSA/IG1bMF0gOiBkZWY7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZm47XG4gICAgICBmbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gcHJlYXNzaWduIGRlZmF1bHQgdmFsdWUgb25seSBmb3IgLS1uby0qLCBbb3B0aW9uYWxdLCBvciA8cmVxdWlyZWQ+XG4gIGlmIChmYWxzZSA9PSBvcHRpb24uYm9vbCB8fCBvcHRpb24ub3B0aW9uYWwgfHwgb3B0aW9uLnJlcXVpcmVkKSB7XG4gICAgLy8gd2hlbiAtLW5vLSogd2UgbWFrZSBzdXJlIGRlZmF1bHQgaXMgdHJ1ZVxuICAgIGlmIChmYWxzZSA9PSBvcHRpb24uYm9vbCkgZGVmYXVsdFZhbHVlID0gdHJ1ZTtcbiAgICAvLyBwcmVhc3NpZ24gb25seSBpZiB3ZSBoYXZlIGEgZGVmYXVsdFxuICAgIGlmICh1bmRlZmluZWQgIT09IGRlZmF1bHRWYWx1ZSkgc2VsZltuYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8vIHJlZ2lzdGVyIHRoZSBvcHRpb25cbiAgdGhpcy5vcHRpb25zLnB1c2gob3B0aW9uKTtcblxuICAvLyB3aGVuIGl0J3MgcGFzc2VkIGFzc2lnbiB0aGUgdmFsdWVcbiAgLy8gYW5kIGNvbmRpdGlvbmFsbHkgaW52b2tlIHRoZSBjYWxsYmFja1xuICB0aGlzLm9uKG9uYW1lLCBmdW5jdGlvbih2YWwpIHtcbiAgICAvLyBjb2VyY2lvblxuICAgIGlmIChudWxsICE9PSB2YWwgJiYgZm4pIHZhbCA9IGZuKHZhbCwgdW5kZWZpbmVkID09PSBzZWxmW25hbWVdXG4gICAgICA/IGRlZmF1bHRWYWx1ZVxuICAgICAgOiBzZWxmW25hbWVdKTtcblxuICAgIC8vIHVuYXNzaWduZWQgb3IgYm9vbFxuICAgIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHNlbGZbbmFtZV0gfHwgJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHNlbGZbbmFtZV0pIHtcbiAgICAgIC8vIGlmIG5vIHZhbHVlLCBib29sIHRydWUsIGFuZCB3ZSBoYXZlIGEgZGVmYXVsdCwgdGhlbiB1c2UgaXQhXG4gICAgICBpZiAobnVsbCA9PSB2YWwpIHtcbiAgICAgICAgc2VsZltuYW1lXSA9IG9wdGlvbi5ib29sXG4gICAgICAgICAgPyBkZWZhdWx0VmFsdWUgfHwgdHJ1ZVxuICAgICAgICAgIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmW25hbWVdID0gdmFsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobnVsbCAhPT0gdmFsKSB7XG4gICAgICAvLyByZWFzc2lnblxuICAgICAgc2VsZltuYW1lXSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBbGxvdyB1bmtub3duIG9wdGlvbnMgb24gdGhlIGNvbW1hbmQgbGluZS5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFyZyBpZiBgdHJ1ZWAgb3Igb21pdHRlZCwgbm8gZXJyb3Igd2lsbCBiZSB0aHJvd25cbiAqIGZvciB1bmtub3duIG9wdGlvbnMuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5Db21tYW5kLnByb3RvdHlwZS5hbGxvd1Vua25vd25PcHRpb24gPSBmdW5jdGlvbihhcmcpIHtcbiAgICB0aGlzLl9hbGxvd1Vua25vd25PcHRpb24gPSBhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IGFyZztcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUGFyc2UgYGFyZ3ZgLCBzZXR0aW5ncyBvcHRpb25zIGFuZCBpbnZva2luZyBjb21tYW5kcyB3aGVuIGRlZmluZWQuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJndlxuICogQHJldHVybiB7Q29tbWFuZH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oYXJndikge1xuICAvLyBpbXBsaWNpdCBoZWxwXG4gIGlmICh0aGlzLmV4ZWN1dGFibGVzKSB0aGlzLmFkZEltcGxpY2l0SGVscENvbW1hbmQoKTtcblxuICAvLyBzdG9yZSByYXcgYXJnc1xuICB0aGlzLnJhd0FyZ3MgPSBhcmd2O1xuXG4gIC8vIGd1ZXNzIG5hbWVcbiAgdGhpcy5fbmFtZSA9IHRoaXMuX25hbWUgfHwgYmFzZW5hbWUoYXJndlsxXSwgJy5qcycpO1xuXG4gIC8vIGdpdGh1Yi1zdHlsZSBzdWItY29tbWFuZHMgd2l0aCBubyBzdWItY29tbWFuZFxuICBpZiAodGhpcy5leGVjdXRhYmxlcyAmJiBhcmd2Lmxlbmd0aCA8IDMgJiYgIXRoaXMuZGVmYXVsdEV4ZWN1dGFibGUpIHtcbiAgICAvLyB0aGlzIHVzZXIgbmVlZHMgaGVscFxuICAgIGFyZ3YucHVzaCgnLS1oZWxwJyk7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFyZ3ZcbiAgdmFyIHBhcnNlZCA9IHRoaXMucGFyc2VPcHRpb25zKHRoaXMubm9ybWFsaXplKGFyZ3Yuc2xpY2UoMikpKTtcbiAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3MgPSBwYXJzZWQuYXJncztcblxuICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZUFyZ3ModGhpcy5hcmdzLCBwYXJzZWQudW5rbm93bik7XG5cbiAgLy8gZXhlY3V0YWJsZSBzdWItY29tbWFuZHNcbiAgdmFyIG5hbWUgPSByZXN1bHQuYXJnc1swXTtcbiAgaWYgKHRoaXMuX2V4ZWNzW25hbWVdICYmIHR5cGVvZiB0aGlzLl9leGVjc1tuYW1lXSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlU3ViQ29tbWFuZChhcmd2LCBhcmdzLCBwYXJzZWQudW5rbm93bik7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0RXhlY3V0YWJsZSkge1xuICAgIC8vIHVzZSB0aGUgZGVmYXVsdCBzdWJjb21tYW5kXG4gICAgYXJncy51bnNoaWZ0KG5hbWUgPSB0aGlzLmRlZmF1bHRFeGVjdXRhYmxlKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlU3ViQ29tbWFuZChhcmd2LCBhcmdzLCBwYXJzZWQudW5rbm93bik7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBFeGVjdXRlIGEgc3ViLWNvbW1hbmQgZXhlY3V0YWJsZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmd2XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcGFyYW0ge0FycmF5fSB1bmtub3duXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5leGVjdXRlU3ViQ29tbWFuZCA9IGZ1bmN0aW9uKGFyZ3YsIGFyZ3MsIHVua25vd24pIHtcbiAgYXJncyA9IGFyZ3MuY29uY2F0KHVua25vd24pO1xuXG4gIGlmICghYXJncy5sZW5ndGgpIHRoaXMuaGVscCgpO1xuICBpZiAoJ2hlbHAnID09IGFyZ3NbMF0gJiYgMSA9PSBhcmdzLmxlbmd0aCkgdGhpcy5oZWxwKCk7XG5cbiAgLy8gPGNtZD4gLS1oZWxwXG4gIGlmICgnaGVscCcgPT0gYXJnc1swXSkge1xuICAgIGFyZ3NbMF0gPSBhcmdzWzFdO1xuICAgIGFyZ3NbMV0gPSAnLS1oZWxwJztcbiAgfVxuXG4gIC8vIGV4ZWN1dGFibGVcbiAgdmFyIGYgPSBhcmd2WzFdO1xuICAvLyBuYW1lIG9mIHRoZSBzdWJjb21tYW5kLCBsaW5rIGBwbS1pbnN0YWxsYFxuICB2YXIgYmluID0gYmFzZW5hbWUoZiwgJy5qcycpICsgJy0nICsgYXJnc1swXTtcblxuXG4gIC8vIEluIGNhc2Ugb2YgZ2xvYmFsbHkgaW5zdGFsbGVkLCBnZXQgdGhlIGJhc2UgZGlyIHdoZXJlIGV4ZWN1dGFibGVcbiAgLy8gIHN1YmNvbW1hbmQgZmlsZSBzaG91bGQgYmUgbG9jYXRlZCBhdFxuICB2YXIgYmFzZURpclxuICAgICwgbGluayA9IHJlYWRsaW5rKGYpO1xuXG4gIC8vIHdoZW4gc3ltYm9saW5rIGlzIHJlbGF0aXZlIHBhdGhcbiAgaWYgKGxpbmsgIT09IGYgJiYgbGluay5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgIGxpbmsgPSBwYXRoLmpvaW4oZGlybmFtZShmKSwgbGluaylcbiAgfVxuICBiYXNlRGlyID0gZGlybmFtZShsaW5rKTtcblxuICAvLyBwcmVmZXIgbG9jYWwgYC4vPGJpbj5gIHRvIGJpbiBpbiB0aGUgJFBBVEhcbiAgdmFyIGxvY2FsQmluID0gcGF0aC5qb2luKGJhc2VEaXIsIGJpbik7XG5cbiAgLy8gd2hldGhlciBiaW4gZmlsZSBpcyBhIGpzIHNjcmlwdCB3aXRoIGV4cGxpY2l0IGAuanNgIGV4dGVuc2lvblxuICB2YXIgaXNFeHBsaWNpdEpTID0gZmFsc2U7XG4gIGlmIChleGlzdHMobG9jYWxCaW4gKyAnLmpzJykpIHtcbiAgICBiaW4gPSBsb2NhbEJpbiArICcuanMnO1xuICAgIGlzRXhwbGljaXRKUyA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXhpc3RzKGxvY2FsQmluKSkge1xuICAgIGJpbiA9IGxvY2FsQmluO1xuICB9XG5cbiAgYXJncyA9IGFyZ3Muc2xpY2UoMSk7XG5cbiAgdmFyIHByb2M7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgaWYgKGlzRXhwbGljaXRKUykge1xuICAgICAgYXJncy51bnNoaWZ0KGxvY2FsQmluKTtcbiAgICAgIC8vIGFkZCBleGVjdXRhYmxlIGFyZ3VtZW50cyB0byBzcGF3blxuICAgICAgYXJncyA9IChwcm9jZXNzLmV4ZWNBcmd2IHx8IFtdKS5jb25jYXQoYXJncyk7XG5cbiAgICAgIHByb2MgPSBzcGF3bignbm9kZScsIGFyZ3MsIHsgc3RkaW86ICdpbmhlcml0JywgY3VzdG9tRmRzOiBbMCwgMSwgMl0gfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2MgPSBzcGF3bihiaW4sIGFyZ3MsIHsgc3RkaW86ICdpbmhlcml0JywgY3VzdG9tRmRzOiBbMCwgMSwgMl0gfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFyZ3MudW5zaGlmdChsb2NhbEJpbik7XG4gICAgcHJvYyA9IHNwYXduKHByb2Nlc3MuZXhlY1BhdGgsIGFyZ3MsIHsgc3RkaW86ICdpbmhlcml0J30pO1xuICB9XG5cbiAgcHJvYy5vbignY2xvc2UnLCBwcm9jZXNzLmV4aXQuYmluZChwcm9jZXNzKSk7XG4gIHByb2Mub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09IFwiRU5PRU5UXCIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1xcbiAgJXMoMSkgZG9lcyBub3QgZXhpc3QsIHRyeSAtLWhlbHBcXG4nLCBiaW4pO1xuICAgIH0gZWxzZSBpZiAoZXJyLmNvZGUgPT0gXCJFQUNDRVNcIikge1xuICAgICAgY29uc29sZS5lcnJvcignXFxuICAlcygxKSBub3QgZXhlY3V0YWJsZS4gdHJ5IGNobW9kIG9yIHJ1biB3aXRoIHJvb3RcXG4nLCBiaW4pO1xuICAgIH1cbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH0pO1xuXG4gIC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgdG8gdGhlIGNoaWxkIHByb2Nlc3NcbiAgdGhpcy5ydW5uaW5nQ29tbWFuZCA9IHByb2M7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBgYXJnc2AsIHNwbGl0dGluZyBqb2luZWQgc2hvcnQgZmxhZ3MuIEZvciBleGFtcGxlXG4gKiB0aGUgYXJnIFwiLWFiY1wiIGlzIGVxdWl2YWxlbnQgdG8gXCItYSAtYiAtY1wiLlxuICogVGhpcyBhbHNvIG5vcm1hbGl6ZXMgZXF1YWwgc2lnbiBhbmQgc3BsaXRzIFwiLS1hYmM9ZGVmXCIgaW50byBcIi0tYWJjIGRlZlwiLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oYXJncykge1xuICB2YXIgcmV0ID0gW11cbiAgICAsIGFyZ1xuICAgICwgbGFzdE9wdFxuICAgICwgaW5kZXg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIGlmIChpID4gMCkge1xuICAgICAgbGFzdE9wdCA9IHRoaXMub3B0aW9uRm9yKGFyZ3NbaS0xXSk7XG4gICAgfVxuXG4gICAgaWYgKGFyZyA9PT0gJy0tJykge1xuICAgICAgLy8gSG9ub3Igb3B0aW9uIHRlcm1pbmF0b3JcbiAgICAgIHJldCA9IHJldC5jb25jYXQoYXJncy5zbGljZShpKSk7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKGxhc3RPcHQgJiYgbGFzdE9wdC5yZXF1aXJlZCkge1xuICAgICAgcmV0LnB1c2goYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGggPiAxICYmICctJyA9PSBhcmdbMF0gJiYgJy0nICE9IGFyZ1sxXSkge1xuICAgICAgYXJnLnNsaWNlKDEpLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0LnB1c2goJy0nICsgYyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKC9eLS0vLnRlc3QoYXJnKSAmJiB+KGluZGV4ID0gYXJnLmluZGV4T2YoJz0nKSkpIHtcbiAgICAgIHJldC5wdXNoKGFyZy5zbGljZSgwLCBpbmRleCksIGFyZy5zbGljZShpbmRleCArIDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuLyoqXG4gKiBQYXJzZSBjb21tYW5kIGBhcmdzYC5cbiAqXG4gKiBXaGVuIGxpc3RlbmVyKHMpIGFyZSBhdmFpbGFibGUgdGhvc2VcbiAqIGNhbGxiYWNrcyBhcmUgaW52b2tlZCwgb3RoZXJ3aXNlIHRoZSBcIipcIlxuICogZXZlbnQgaXMgZW1pdHRlZCBhbmQgdGhvc2UgYWN0aW9ucyBhcmUgaW52b2tlZC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnBhcnNlQXJncyA9IGZ1bmN0aW9uKGFyZ3MsIHVua25vd24pIHtcbiAgdmFyIG5hbWU7XG5cbiAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgbmFtZSA9IGFyZ3NbMF07XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzKG5hbWUpLmxlbmd0aCkge1xuICAgICAgdGhpcy5lbWl0KGFyZ3Muc2hpZnQoKSwgYXJncywgdW5rbm93bik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgnKicsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXRIZWxwSWZOZWNlc3NhcnkodGhpcywgdW5rbm93bik7XG5cbiAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIGFyZ3MgYW5kIHdlIGhhdmUgdW5rbm93biBvcHRpb25zLFxuICAgIC8vIHRoZW4gdGhleSBhcmUgZXh0cmFuZW91cyBhbmQgd2UgbmVlZCB0byBlcnJvci5cbiAgICBpZiAodW5rbm93bi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnVua25vd25PcHRpb24odW5rbm93blswXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBvcHRpb24gbWF0Y2hpbmcgYGFyZ2AgaWYgYW55LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmdcbiAqIEByZXR1cm4ge09wdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm9wdGlvbkZvciA9IGZ1bmN0aW9uKGFyZykge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5vcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXMub3B0aW9uc1tpXS5pcyhhcmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zW2ldO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBQYXJzZSBvcHRpb25zIGZyb20gYGFyZ3ZgIHJldHVybmluZyBgYXJndmBcbiAqIHZvaWQgb2YgdGhlc2Ugb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmd2XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUucGFyc2VPcHRpb25zID0gZnVuY3Rpb24oYXJndikge1xuICB2YXIgYXJncyA9IFtdXG4gICAgLCBsZW4gPSBhcmd2Lmxlbmd0aFxuICAgICwgbGl0ZXJhbFxuICAgICwgb3B0aW9uXG4gICAgLCBhcmc7XG5cbiAgdmFyIHVua25vd25PcHRpb25zID0gW107XG5cbiAgLy8gcGFyc2Ugb3B0aW9uc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJndltpXTtcblxuICAgIC8vIGxpdGVyYWwgYXJncyBhZnRlciAtLVxuICAgIGlmICgnLS0nID09IGFyZykge1xuICAgICAgbGl0ZXJhbCA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAobGl0ZXJhbCkge1xuICAgICAgYXJncy5wdXNoKGFyZyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIG1hdGNoaW5nIE9wdGlvblxuICAgIG9wdGlvbiA9IHRoaXMub3B0aW9uRm9yKGFyZyk7XG5cbiAgICAvLyBvcHRpb24gaXMgZGVmaW5lZFxuICAgIGlmIChvcHRpb24pIHtcbiAgICAgIC8vIHJlcXVpcmVzIGFyZ1xuICAgICAgaWYgKG9wdGlvbi5yZXF1aXJlZCkge1xuICAgICAgICBhcmcgPSBhcmd2WysraV07XG4gICAgICAgIGlmIChudWxsID09IGFyZykgcmV0dXJuIHRoaXMub3B0aW9uTWlzc2luZ0FyZ3VtZW50KG9wdGlvbik7XG4gICAgICAgIHRoaXMuZW1pdChvcHRpb24ubmFtZSgpLCBhcmcpO1xuICAgICAgLy8gb3B0aW9uYWwgYXJnXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbi5vcHRpb25hbCkge1xuICAgICAgICBhcmcgPSBhcmd2W2krMV07XG4gICAgICAgIGlmIChudWxsID09IGFyZyB8fCAoJy0nID09IGFyZ1swXSAmJiAnLScgIT0gYXJnKSkge1xuICAgICAgICAgIGFyZyA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKytpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChvcHRpb24ubmFtZSgpLCBhcmcpO1xuICAgICAgLy8gYm9vbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0KG9wdGlvbi5uYW1lKCkpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbG9va3MgbGlrZSBhbiBvcHRpb25cbiAgICBpZiAoYXJnLmxlbmd0aCA+IDEgJiYgJy0nID09IGFyZ1swXSkge1xuICAgICAgdW5rbm93bk9wdGlvbnMucHVzaChhcmcpO1xuXG4gICAgICAvLyBJZiB0aGUgbmV4dCBhcmd1bWVudCBsb29rcyBsaWtlIGl0IG1pZ2h0IGJlXG4gICAgICAvLyBhbiBhcmd1bWVudCBmb3IgdGhpcyBvcHRpb24sIHdlIHBhc3MgaXQgb24uXG4gICAgICAvLyBJZiBpdCBpc24ndCwgdGhlbiBpdCdsbCBzaW1wbHkgYmUgaWdub3JlZFxuICAgICAgaWYgKGFyZ3ZbaSsxXSAmJiAnLScgIT0gYXJndltpKzFdWzBdKSB7XG4gICAgICAgIHVua25vd25PcHRpb25zLnB1c2goYXJndlsrK2ldKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGFyZ1xuICAgIGFyZ3MucHVzaChhcmcpO1xuICB9XG5cbiAgcmV0dXJuIHsgYXJnczogYXJncywgdW5rbm93bjogdW5rbm93bk9wdGlvbnMgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIG9wdGlvbnMgYXMga2V5LXZhbHVlIHBhaXJzXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuQ29tbWFuZC5wcm90b3R5cGUub3B0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0ge31cbiAgICAsIGxlbiA9IHRoaXMub3B0aW9ucy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAgOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIga2V5ID0gY2FtZWxjYXNlKHRoaXMub3B0aW9uc1tpXS5uYW1lKCkpO1xuICAgIHJlc3VsdFtrZXldID0ga2V5ID09PSAndmVyc2lvbicgPyB0aGlzLl92ZXJzaW9uIDogdGhpc1trZXldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFyZ3VtZW50IGBuYW1lYCBpcyBtaXNzaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5taXNzaW5nQXJndW1lbnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgY29uc29sZS5lcnJvcihcIiAgZXJyb3I6IG1pc3NpbmcgcmVxdWlyZWQgYXJndW1lbnQgYCVzJ1wiLCBuYW1lKTtcbiAgY29uc29sZS5lcnJvcigpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59O1xuXG4vKipcbiAqIGBPcHRpb25gIGlzIG1pc3NpbmcgYW4gYXJndW1lbnQsIGJ1dCByZWNlaXZlZCBgZmxhZ2Agb3Igbm90aGluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxhZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUub3B0aW9uTWlzc2luZ0FyZ3VtZW50ID0gZnVuY3Rpb24ob3B0aW9uLCBmbGFnKSB7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgaWYgKGZsYWcpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogb3B0aW9uIGAlcycgYXJndW1lbnQgbWlzc2luZywgZ290IGAlcydcIiwgb3B0aW9uLmZsYWdzLCBmbGFnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogb3B0aW9uIGAlcycgYXJndW1lbnQgbWlzc2luZ1wiLCBvcHRpb24uZmxhZ3MpO1xuICB9XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBVbmtub3duIG9wdGlvbiBgZmxhZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnVua25vd25PcHRpb24gPSBmdW5jdGlvbihmbGFnKSB7XG4gIGlmICh0aGlzLl9hbGxvd1Vua25vd25PcHRpb24pIHJldHVybjtcbiAgY29uc29sZS5lcnJvcigpO1xuICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogdW5rbm93biBvcHRpb24gYCVzJ1wiLCBmbGFnKTtcbiAgY29uc29sZS5lcnJvcigpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59O1xuXG4vKipcbiAqIFZhcmlhZGljIGFyZ3VtZW50IHdpdGggYG5hbWVgIGlzIG5vdCB0aGUgbGFzdCBhcmd1bWVudCBhcyByZXF1aXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUudmFyaWFkaWNBcmdOb3RMYXN0ID0gZnVuY3Rpb24obmFtZSkge1xuICBjb25zb2xlLmVycm9yKCk7XG4gIGNvbnNvbGUuZXJyb3IoXCIgIGVycm9yOiB2YXJpYWRpYyBhcmd1bWVudHMgbXVzdCBiZSBsYXN0IGAlcydcIiwgbmFtZSk7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHByb2dyYW0gdmVyc2lvbiB0byBgc3RyYC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBhdXRvLXJlZ2lzdGVycyB0aGUgXCItViwgLS12ZXJzaW9uXCIgZmxhZ1xuICogd2hpY2ggd2lsbCBwcmludCB0aGUgdmVyc2lvbiBudW1iZXIgd2hlbiBwYXNzZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdzXG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUudmVyc2lvbiA9IGZ1bmN0aW9uKHN0ciwgZmxhZ3MpIHtcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX3ZlcnNpb247XG4gIHRoaXMuX3ZlcnNpb24gPSBzdHI7XG4gIGZsYWdzID0gZmxhZ3MgfHwgJy1WLCAtLXZlcnNpb24nO1xuICB0aGlzLm9wdGlvbihmbGFncywgJ291dHB1dCB0aGUgdmVyc2lvbiBudW1iZXInKTtcbiAgdGhpcy5vbigndmVyc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHN0ciArICdcXG4nKTtcbiAgICBwcm9jZXNzLmV4aXQoMCk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBkZXNjcmlwdGlvbiB0byBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKDAgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgdGhpcy5fZGVzY3JpcHRpb24gPSBzdHI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgYW4gYWxpYXMgZm9yIHRoZSBjb21tYW5kXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFsaWFzXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuYWxpYXMgPSBmdW5jdGlvbihhbGlhcykge1xuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fYWxpYXM7XG4gIHRoaXMuX2FsaWFzID0gYWxpYXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgLyBnZXQgdGhlIGNvbW1hbmQgdXNhZ2UgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfENvbW1hbmR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnVzYWdlID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBhcmdzID0gdGhpcy5fYXJncy5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGh1bWFuUmVhZGFibGVBcmdOYW1lKGFyZyk7XG4gIH0pO1xuXG4gIHZhciB1c2FnZSA9ICdbb3B0aW9uc10nXG4gICAgKyAodGhpcy5jb21tYW5kcy5sZW5ndGggPyAnIFtjb21tYW5kXScgOiAnJylcbiAgICArICh0aGlzLl9hcmdzLmxlbmd0aCA/ICcgJyArIGFyZ3Muam9pbignICcpIDogJycpO1xuXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl91c2FnZSB8fCB1c2FnZTtcbiAgdGhpcy5fdXNhZ2UgPSBzdHI7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbmFtZSBvZiB0aGUgY29tbWFuZFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUubmFtZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbmFtZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsYXJnZXN0IG9wdGlvbiBsZW5ndGguXG4gKlxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUubGFyZ2VzdE9wdGlvbkxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLnJlZHVjZShmdW5jdGlvbihtYXgsIG9wdGlvbikge1xuICAgIHJldHVybiBNYXRoLm1heChtYXgsIG9wdGlvbi5mbGFncy5sZW5ndGgpO1xuICB9LCAwKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlbHAgZm9yIG9wdGlvbnMuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUub3B0aW9uSGVscCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgd2lkdGggPSB0aGlzLmxhcmdlc3RPcHRpb25MZW5ndGgoKTtcblxuICAvLyBQcmVwZW5kIHRoZSBoZWxwIGluZm9ybWF0aW9uXG4gIHJldHVybiBbcGFkKCctaCwgLS1oZWxwJywgd2lkdGgpICsgJyAgJyArICdvdXRwdXQgdXNhZ2UgaW5mb3JtYXRpb24nXVxuICAgICAgLmNvbmNhdCh0aGlzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gcGFkKG9wdGlvbi5mbGFncywgd2lkdGgpICsgJyAgJyArIG9wdGlvbi5kZXNjcmlwdGlvbjtcbiAgICAgIH0pKVxuICAgICAgLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gY29tbWFuZCBoZWxwIGRvY3VtZW50YXRpb24uXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuY29tbWFuZEhlbHAgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmNvbW1hbmRzLmxlbmd0aCkgcmV0dXJuICcnO1xuXG4gIHZhciBjb21tYW5kcyA9IHRoaXMuY29tbWFuZHMuZmlsdGVyKGZ1bmN0aW9uKGNtZCkge1xuICAgIHJldHVybiAhY21kLl9ub0hlbHA7XG4gIH0pLm1hcChmdW5jdGlvbihjbWQpIHtcbiAgICB2YXIgYXJncyA9IGNtZC5fYXJncy5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgICByZXR1cm4gaHVtYW5SZWFkYWJsZUFyZ05hbWUoYXJnKTtcbiAgICB9KS5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgY21kLl9uYW1lXG4gICAgICAgICsgKGNtZC5fYWxpYXMgPyAnfCcgKyBjbWQuX2FsaWFzIDogJycpXG4gICAgICAgICsgKGNtZC5vcHRpb25zLmxlbmd0aCA/ICcgW29wdGlvbnNdJyA6ICcnKVxuICAgICAgICArICcgJyArIGFyZ3NcbiAgICAgICwgY21kLmRlc2NyaXB0aW9uKClcbiAgICBdO1xuICB9KTtcblxuICB2YXIgd2lkdGggPSBjb21tYW5kcy5yZWR1Y2UoZnVuY3Rpb24obWF4LCBjb21tYW5kKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1heCwgY29tbWFuZFswXS5sZW5ndGgpO1xuICB9LCAwKTtcblxuICByZXR1cm4gW1xuICAgICcnXG4gICAgLCAnICBDb21tYW5kczonXG4gICAgLCAnJ1xuICAgICwgY29tbWFuZHMubWFwKGZ1bmN0aW9uKGNtZCkge1xuICAgICAgdmFyIGRlc2MgPSBjbWRbMV0gPyAnICAnICsgY21kWzFdIDogJyc7XG4gICAgICByZXR1cm4gcGFkKGNtZFswXSwgd2lkdGgpICsgZGVzYztcbiAgICB9KS5qb2luKCdcXG4nKS5yZXBsYWNlKC9eL2dtLCAnICAgICcpXG4gICAgLCAnJ1xuICBdLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gcHJvZ3JhbSBoZWxwIGRvY3VtZW50YXRpb24uXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuaGVscEluZm9ybWF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZXNjID0gW107XG4gIGlmICh0aGlzLl9kZXNjcmlwdGlvbikge1xuICAgIGRlc2MgPSBbXG4gICAgICAnICAnICsgdGhpcy5fZGVzY3JpcHRpb25cbiAgICAgICwgJydcbiAgICBdO1xuICB9XG5cbiAgdmFyIGNtZE5hbWUgPSB0aGlzLl9uYW1lO1xuICBpZiAodGhpcy5fYWxpYXMpIHtcbiAgICBjbWROYW1lID0gY21kTmFtZSArICd8JyArIHRoaXMuX2FsaWFzO1xuICB9XG4gIHZhciB1c2FnZSA9IFtcbiAgICAnJ1xuICAgICwnICBVc2FnZTogJyArIGNtZE5hbWUgKyAnICcgKyB0aGlzLnVzYWdlKClcbiAgICAsICcnXG4gIF07XG5cbiAgdmFyIGNtZHMgPSBbXTtcbiAgdmFyIGNvbW1hbmRIZWxwID0gdGhpcy5jb21tYW5kSGVscCgpO1xuICBpZiAoY29tbWFuZEhlbHApIGNtZHMgPSBbY29tbWFuZEhlbHBdO1xuXG4gIHZhciBvcHRpb25zID0gW1xuICAgICcgIE9wdGlvbnM6J1xuICAgICwgJydcbiAgICAsICcnICsgdGhpcy5vcHRpb25IZWxwKCkucmVwbGFjZSgvXi9nbSwgJyAgICAnKVxuICAgICwgJydcbiAgICAsICcnXG4gIF07XG5cbiAgcmV0dXJuIHVzYWdlXG4gICAgLmNvbmNhdChjbWRzKVxuICAgIC5jb25jYXQoZGVzYylcbiAgICAuY29uY2F0KG9wdGlvbnMpXG4gICAgLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBPdXRwdXQgaGVscCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBjb21tYW5kXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5vdXRwdXRIZWxwID0gZnVuY3Rpb24oY2IpIHtcbiAgaWYgKCFjYikge1xuICAgIGNiID0gZnVuY3Rpb24ocGFzc3RocnUpIHtcbiAgICAgIHJldHVybiBwYXNzdGhydTtcbiAgICB9XG4gIH1cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2IodGhpcy5oZWxwSW5mb3JtYXRpb24oKSkpO1xuICB0aGlzLmVtaXQoJy0taGVscCcpO1xufTtcblxuLyoqXG4gKiBPdXRwdXQgaGVscCBpbmZvcm1hdGlvbiBhbmQgZXhpdC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmhlbHAgPSBmdW5jdGlvbihjYikge1xuICB0aGlzLm91dHB1dEhlbHAoY2IpO1xuICBwcm9jZXNzLmV4aXQoKTtcbn07XG5cbi8qKlxuICogQ2FtZWwtY2FzZSB0aGUgZ2l2ZW4gYGZsYWdgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNhbWVsY2FzZShmbGFnKSB7XG4gIHJldHVybiBmbGFnLnNwbGl0KCctJykucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgIHJldHVybiBzdHIgKyB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBQYWQgYHN0cmAgdG8gYHdpZHRoYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIHdpZHRoKSB7XG4gIHZhciBsZW4gPSBNYXRoLm1heCgwLCB3aWR0aCAtIHN0ci5sZW5ndGgpO1xuICByZXR1cm4gc3RyICsgQXJyYXkobGVuICsgMSkuam9pbignICcpO1xufVxuXG4vKipcbiAqIE91dHB1dCBoZWxwIGluZm9ybWF0aW9uIGlmIG5lY2Vzc2FyeVxuICpcbiAqIEBwYXJhbSB7Q29tbWFuZH0gY29tbWFuZCB0byBvdXRwdXQgaGVscCBmb3JcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IG9mIG9wdGlvbnMgdG8gc2VhcmNoIGZvciAtaCBvciAtLWhlbHBcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG91dHB1dEhlbHBJZk5lY2Vzc2FyeShjbWQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW2ldID09ICctLWhlbHAnIHx8IG9wdGlvbnNbaV0gPT0gJy1oJykge1xuICAgICAgY21kLm91dHB1dEhlbHAoKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBhcmd1bWVudCBhbiByZXR1cm5zIGl0cyBodW1hbiByZWFkYWJsZSBlcXVpdmFsZW50IGZvciBoZWxwIHVzYWdlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGh1bWFuUmVhZGFibGVBcmdOYW1lKGFyZykge1xuICB2YXIgbmFtZU91dHB1dCA9IGFyZy5uYW1lICsgKGFyZy52YXJpYWRpYyA9PT0gdHJ1ZSA/ICcuLi4nIDogJycpO1xuXG4gIHJldHVybiBhcmcucmVxdWlyZWRcbiAgICA/ICc8JyArIG5hbWVPdXRwdXQgKyAnPidcbiAgICA6ICdbJyArIG5hbWVPdXRwdXQgKyAnXSdcbn1cblxuLy8gZm9yIHZlcnNpb25zIGJlZm9yZSBub2RlIHYwLjggd2hlbiB0aGVyZSB3ZXJlbid0IGBmcy5leGlzdHNTeW5jYFxuZnVuY3Rpb24gZXhpc3RzKGZpbGUpIHtcbiAgdHJ5IHtcbiAgICBpZiAoZnMuc3RhdFN5bmMoZmlsZSkuaXNGaWxlKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29tbWFuZGVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtYXRjaE9wZXJhdG9yc1JlID0gL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHJldHVybiBzdHIucmVwbGFjZShtYXRjaE9wZXJhdG9yc1JlLCAnXFxcXCQmJyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5cbmNvbnN0IEJVRl9MRU5HVEggPSA2NCAqIDEwMjRcbmNvbnN0IF9idWZmID0gbmV3IEJ1ZmZlcihCVUZfTEVOR1RIKVxuXG5mdW5jdGlvbiBjb3B5RmlsZVN5bmMgKHNyY0ZpbGUsIGRlc3RGaWxlLCBvcHRpb25zKSB7XG4gIGNvbnN0IG92ZXJ3cml0ZSA9IG9wdGlvbnMub3ZlcndyaXRlXG4gIGNvbnN0IGVycm9yT25FeGlzdCA9IG9wdGlvbnMuZXJyb3JPbkV4aXN0XG4gIGNvbnN0IHByZXNlcnZlVGltZXN0YW1wcyA9IG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzXG5cbiAgaWYgKGZzLmV4aXN0c1N5bmMoZGVzdEZpbGUpKSB7XG4gICAgaWYgKG92ZXJ3cml0ZSkge1xuICAgICAgZnMudW5saW5rU3luYyhkZXN0RmlsZSlcbiAgICB9IGVsc2UgaWYgKGVycm9yT25FeGlzdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Rlc3RGaWxlfSBhbHJlYWR5IGV4aXN0c2ApXG4gICAgfSBlbHNlIHJldHVyblxuICB9XG5cbiAgY29uc3QgZmRyID0gZnMub3BlblN5bmMoc3JjRmlsZSwgJ3InKVxuICBjb25zdCBzdGF0ID0gZnMuZnN0YXRTeW5jKGZkcilcbiAgY29uc3QgZmR3ID0gZnMub3BlblN5bmMoZGVzdEZpbGUsICd3Jywgc3RhdC5tb2RlKVxuICBsZXQgYnl0ZXNSZWFkID0gMVxuICBsZXQgcG9zID0gMFxuXG4gIHdoaWxlIChieXRlc1JlYWQgPiAwKSB7XG4gICAgYnl0ZXNSZWFkID0gZnMucmVhZFN5bmMoZmRyLCBfYnVmZiwgMCwgQlVGX0xFTkdUSCwgcG9zKVxuICAgIGZzLndyaXRlU3luYyhmZHcsIF9idWZmLCAwLCBieXRlc1JlYWQpXG4gICAgcG9zICs9IGJ5dGVzUmVhZFxuICB9XG5cbiAgaWYgKHByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIGZzLmZ1dGltZXNTeW5jKGZkdywgc3RhdC5hdGltZSwgc3RhdC5tdGltZSlcbiAgfVxuXG4gIGZzLmNsb3NlU3luYyhmZHIpXG4gIGZzLmNsb3NlU3luYyhmZHcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUZpbGVTeW5jXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2NvcHktc3luYy9jb3B5LWZpbGUtc3luYy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgY29weUZpbGVTeW5jID0gcmVxdWlyZSgnLi9jb3B5LWZpbGUtc3luYycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5cbmZ1bmN0aW9uIGNvcHlTeW5jIChzcmMsIGRlc3QsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nIHx8IG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICBvcHRpb25zID0ge2ZpbHRlcjogb3B0aW9uc31cbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIG9wdGlvbnMucmVjdXJzaXZlID0gISFvcHRpb25zLnJlY3Vyc2l2ZVxuXG4gIC8vIGRlZmF1bHQgdG8gdHJ1ZSBmb3Igbm93XG4gIG9wdGlvbnMuY2xvYmJlciA9ICdjbG9iYmVyJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmNsb2JiZXIgOiB0cnVlXG4gIC8vIG92ZXJ3cml0ZSBmYWxscyBiYWNrIHRvIGNsb2JiZXJcbiAgb3B0aW9ucy5vdmVyd3JpdGUgPSAnb3ZlcndyaXRlJyBpbiBvcHRpb25zID8gISFvcHRpb25zLm92ZXJ3cml0ZSA6IG9wdGlvbnMuY2xvYmJlclxuICBvcHRpb25zLmRlcmVmZXJlbmNlID0gJ2RlcmVmZXJlbmNlJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmRlcmVmZXJlbmNlIDogZmFsc2VcbiAgb3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMgPSAncHJlc2VydmVUaW1lc3RhbXBzJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnByZXNlcnZlVGltZXN0YW1wcyA6IGZhbHNlXG5cbiAgb3B0aW9ucy5maWx0ZXIgPSBvcHRpb25zLmZpbHRlciB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlIH1cblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZTpcbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzICYmIHByb2Nlc3MuYXJjaCA9PT0gJ2lhMzInKSB7XG4gICAgY29uc29sZS53YXJuKGBmcy1leHRyYTogVXNpbmcgdGhlIHByZXNlcnZlVGltZXN0YW1wcyBvcHRpb24gaW4gMzItYml0IG5vZGUgaXMgbm90IHJlY29tbWVuZGVkO1xcblxuICAgIHNlZSBodHRwczovL2dpdGh1Yi5jb20vanByaWNoYXJkc29uL25vZGUtZnMtZXh0cmEvaXNzdWVzLzI2OWApXG4gIH1cblxuICBjb25zdCBzdGF0cyA9IChvcHRpb25zLnJlY3Vyc2l2ZSAmJiAhb3B0aW9ucy5kZXJlZmVyZW5jZSkgPyBmcy5sc3RhdFN5bmMoc3JjKSA6IGZzLnN0YXRTeW5jKHNyYylcbiAgY29uc3QgZGVzdEZvbGRlciA9IHBhdGguZGlybmFtZShkZXN0KVxuICBjb25zdCBkZXN0Rm9sZGVyRXhpc3RzID0gZnMuZXhpc3RzU3luYyhkZXN0Rm9sZGVyKVxuICBsZXQgcGVyZm9ybUNvcHkgPSBmYWxzZVxuXG4gIGlmIChvcHRpb25zLmZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIGNvbnNvbGUud2FybignV2FybmluZzogZnMtZXh0cmE6IFBhc3NpbmcgYSBSZWdFeHAgZmlsdGVyIGlzIGRlcHJlY2F0ZWQsIHVzZSBhIGZ1bmN0aW9uJylcbiAgICBwZXJmb3JtQ29weSA9IG9wdGlvbnMuZmlsdGVyLnRlc3Qoc3JjKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmZpbHRlciA9PT0gJ2Z1bmN0aW9uJykgcGVyZm9ybUNvcHkgPSBvcHRpb25zLmZpbHRlcihzcmMsIGRlc3QpXG5cbiAgaWYgKHN0YXRzLmlzRmlsZSgpICYmIHBlcmZvcm1Db3B5KSB7XG4gICAgaWYgKCFkZXN0Rm9sZGVyRXhpc3RzKSBta2Rpci5ta2RpcnNTeW5jKGRlc3RGb2xkZXIpXG4gICAgY29weUZpbGVTeW5jKHNyYywgZGVzdCwge1xuICAgICAgb3ZlcndyaXRlOiBvcHRpb25zLm92ZXJ3cml0ZSxcbiAgICAgIGVycm9yT25FeGlzdDogb3B0aW9ucy5lcnJvck9uRXhpc3QsXG4gICAgICBwcmVzZXJ2ZVRpbWVzdGFtcHM6IG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzXG4gICAgfSlcbiAgfSBlbHNlIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpICYmIHBlcmZvcm1Db3B5KSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGRlc3QpKSBta2Rpci5ta2RpcnNTeW5jKGRlc3QpXG4gICAgY29uc3QgY29udGVudHMgPSBmcy5yZWFkZGlyU3luYyhzcmMpXG4gICAgY29udGVudHMuZm9yRWFjaChjb250ZW50ID0+IHtcbiAgICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zXG4gICAgICBvcHRzLnJlY3Vyc2l2ZSA9IHRydWVcbiAgICAgIGNvcHlTeW5jKHBhdGguam9pbihzcmMsIGNvbnRlbnQpLCBwYXRoLmpvaW4oZGVzdCwgY29udGVudCksIG9wdHMpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChvcHRpb25zLnJlY3Vyc2l2ZSAmJiBzdGF0cy5pc1N5bWJvbGljTGluaygpICYmIHBlcmZvcm1Db3B5KSB7XG4gICAgY29uc3Qgc3JjUGF0aCA9IGZzLnJlYWRsaW5rU3luYyhzcmMpXG4gICAgZnMuc3ltbGlua1N5bmMoc3JjUGF0aCwgZGVzdClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW5jXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2NvcHktc3luYy9jb3B5LXN5bmMuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG5jcCA9IHJlcXVpcmUoJy4vbmNwJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcblxuZnVuY3Rpb24gY29weSAoc3JjLCBkZXN0LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicgJiYgIWNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zXG4gICAgb3B0aW9ucyA9IHt9XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicgfHwgb3B0aW9ucyBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIG9wdGlvbnMgPSB7ZmlsdGVyOiBvcHRpb25zfVxuICB9XG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge31cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZTpcbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzICYmIHByb2Nlc3MuYXJjaCA9PT0gJ2lhMzInKSB7XG4gICAgY29uc29sZS53YXJuKGBmcy1leHRyYTogVXNpbmcgdGhlIHByZXNlcnZlVGltZXN0YW1wcyBvcHRpb24gaW4gMzItYml0IG5vZGUgaXMgbm90IHJlY29tbWVuZGVkO1xcblxuICAgIHNlZSBodHRwczovL2dpdGh1Yi5jb20vanByaWNoYXJkc29uL25vZGUtZnMtZXh0cmEvaXNzdWVzLzI2OWApXG4gIH1cblxuICAvLyBkb24ndCBhbGxvdyBzcmMgYW5kIGRlc3QgdG8gYmUgdGhlIHNhbWVcbiAgY29uc3QgYmFzZVBhdGggPSBwcm9jZXNzLmN3ZCgpXG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCBzcmMpXG4gIGNvbnN0IHRhcmdldFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsIGRlc3QpXG4gIGlmIChjdXJyZW50UGF0aCA9PT0gdGFyZ2V0UGF0aCkgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKSlcblxuICBmcy5sc3RhdChzcmMsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICAgIGxldCBkaXIgPSBudWxsXG4gICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gZGVzdC5zcGxpdChwYXRoLnNlcClcbiAgICAgIHBhcnRzLnBvcCgpXG4gICAgICBkaXIgPSBwYXJ0cy5qb2luKHBhdGguc2VwKVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZGVzdClcbiAgICB9XG5cbiAgICBmcy5leGlzdHMoZGlyLCBkaXJFeGlzdHMgPT4ge1xuICAgICAgaWYgKGRpckV4aXN0cykgcmV0dXJuIG5jcChzcmMsIGRlc3QsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgbmNwKHNyYywgZGVzdCwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9jb3B5L2NvcHkuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjb3B5OiByZXF1aXJlKCcuL2NvcHknKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9jb3B5L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCByZW1vdmUgPSByZXF1aXJlKCcuLi9yZW1vdmUnKVxuXG5mdW5jdGlvbiBlbXB0eURpciAoZGlyLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9XG4gIGZzLnJlYWRkaXIoZGlyLCAoZXJyLCBpdGVtcykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBta2Rpci5ta2RpcnMoZGlyLCBjYWxsYmFjaylcblxuICAgIGl0ZW1zID0gaXRlbXMubWFwKGl0ZW0gPT4gcGF0aC5qb2luKGRpciwgaXRlbSkpXG5cbiAgICBkZWxldGVJdGVtKClcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUl0ZW0gKCkge1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zLnBvcCgpXG4gICAgICBpZiAoIWl0ZW0pIHJldHVybiBjYWxsYmFjaygpXG4gICAgICByZW1vdmUucmVtb3ZlKGl0ZW0sIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICAgIGRlbGV0ZUl0ZW0oKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGVtcHR5RGlyU3luYyAoZGlyKSB7XG4gIGxldCBpdGVtc1xuICB0cnkge1xuICAgIGl0ZW1zID0gZnMucmVhZGRpclN5bmMoZGlyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIH1cblxuICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0gPSBwYXRoLmpvaW4oZGlyLCBpdGVtKVxuICAgIHJlbW92ZS5yZW1vdmVTeW5jKGl0ZW0pXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbXB0eURpclN5bmMsXG4gIGVtcHR5ZGlyU3luYzogZW1wdHlEaXJTeW5jLFxuICBlbXB0eURpcixcbiAgZW1wdHlkaXI6IGVtcHR5RGlyXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2VtcHR5L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbGUgKGZpbGUsIGNhbGxiYWNrKSB7XG4gIGZ1bmN0aW9uIG1ha2VGaWxlICgpIHtcbiAgICBmcy53cml0ZUZpbGUoZmlsZSwgJycsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH0pXG4gIH1cblxuICBmcy5leGlzdHMoZmlsZSwgZmlsZUV4aXN0cyA9PiB7XG4gICAgaWYgKGZpbGVFeGlzdHMpIHJldHVybiBjYWxsYmFjaygpXG4gICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG4gICAgZnMuZXhpc3RzKGRpciwgZGlyRXhpc3RzID0+IHtcbiAgICAgIGlmIChkaXJFeGlzdHMpIHJldHVybiBtYWtlRmlsZSgpXG4gICAgICBta2Rpci5ta2RpcnMoZGlyLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICBtYWtlRmlsZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbGVTeW5jIChmaWxlKSB7XG4gIGlmIChmcy5leGlzdHNTeW5jKGZpbGUpKSByZXR1cm5cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHtcbiAgICBta2Rpci5ta2RpcnNTeW5jKGRpcilcbiAgfVxuXG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgJycpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVGaWxlLFxuICBjcmVhdGVGaWxlU3luYyxcbiAgLy8gYWxpYXNcbiAgZW5zdXJlRmlsZTogY3JlYXRlRmlsZSxcbiAgZW5zdXJlRmlsZVN5bmM6IGNyZWF0ZUZpbGVTeW5jXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2Vuc3VyZS9maWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZmlsZSA9IHJlcXVpcmUoJy4vZmlsZScpXG5jb25zdCBsaW5rID0gcmVxdWlyZSgnLi9saW5rJylcbmNvbnN0IHN5bWxpbmsgPSByZXF1aXJlKCcuL3N5bWxpbmsnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gZmlsZVxuICBjcmVhdGVGaWxlOiBmaWxlLmNyZWF0ZUZpbGUsXG4gIGNyZWF0ZUZpbGVTeW5jOiBmaWxlLmNyZWF0ZUZpbGVTeW5jLFxuICBlbnN1cmVGaWxlOiBmaWxlLmNyZWF0ZUZpbGUsXG4gIGVuc3VyZUZpbGVTeW5jOiBmaWxlLmNyZWF0ZUZpbGVTeW5jLFxuICAvLyBsaW5rXG4gIGNyZWF0ZUxpbms6IGxpbmsuY3JlYXRlTGluayxcbiAgY3JlYXRlTGlua1N5bmM6IGxpbmsuY3JlYXRlTGlua1N5bmMsXG4gIGVuc3VyZUxpbms6IGxpbmsuY3JlYXRlTGluayxcbiAgZW5zdXJlTGlua1N5bmM6IGxpbmsuY3JlYXRlTGlua1N5bmMsXG4gIC8vIHN5bWxpbmtcbiAgY3JlYXRlU3ltbGluazogc3ltbGluay5jcmVhdGVTeW1saW5rLFxuICBjcmVhdGVTeW1saW5rU3luYzogc3ltbGluay5jcmVhdGVTeW1saW5rU3luYyxcbiAgZW5zdXJlU3ltbGluazogc3ltbGluay5jcmVhdGVTeW1saW5rLFxuICBlbnN1cmVTeW1saW5rU3luYzogc3ltbGluay5jcmVhdGVTeW1saW5rU3luY1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9lbnN1cmUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcblxuZnVuY3Rpb24gY3JlYXRlTGluayAoc3JjcGF0aCwgZHN0cGF0aCwgY2FsbGJhY2spIHtcbiAgZnVuY3Rpb24gbWFrZUxpbmsgKHNyY3BhdGgsIGRzdHBhdGgpIHtcbiAgICBmcy5saW5rKHNyY3BhdGgsIGRzdHBhdGgsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgY2FsbGJhY2sobnVsbClcbiAgICB9KVxuICB9XG5cbiAgZnMuZXhpc3RzKGRzdHBhdGgsIGRlc3RpbmF0aW9uRXhpc3RzID0+IHtcbiAgICBpZiAoZGVzdGluYXRpb25FeGlzdHMpIHJldHVybiBjYWxsYmFjayhudWxsKVxuICAgIGZzLmxzdGF0KHNyY3BhdGgsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVMaW5rJylcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gICAgICBmcy5leGlzdHMoZGlyLCBkaXJFeGlzdHMgPT4ge1xuICAgICAgICBpZiAoZGlyRXhpc3RzKSByZXR1cm4gbWFrZUxpbmsoc3JjcGF0aCwgZHN0cGF0aClcbiAgICAgICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgIG1ha2VMaW5rKHNyY3BhdGgsIGRzdHBhdGgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtTeW5jIChzcmNwYXRoLCBkc3RwYXRoLCBjYWxsYmFjaykge1xuICBjb25zdCBkZXN0aW5hdGlvbkV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZHN0cGF0aClcbiAgaWYgKGRlc3RpbmF0aW9uRXhpc3RzKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgdHJ5IHtcbiAgICBmcy5sc3RhdFN5bmMoc3JjcGF0aClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVMaW5rJylcbiAgICB0aHJvdyBlcnJcbiAgfVxuXG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICBjb25zdCBkaXJFeGlzdHMgPSBmcy5leGlzdHNTeW5jKGRpcilcbiAgaWYgKGRpckV4aXN0cykgcmV0dXJuIGZzLmxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG4gIG1rZGlyLm1rZGlyc1N5bmMoZGlyKVxuXG4gIHJldHVybiBmcy5saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTGluayxcbiAgY3JlYXRlTGlua1N5bmMsXG4gIC8vIGFsaWFzXG4gIGVuc3VyZUxpbms6IGNyZWF0ZUxpbmssXG4gIGVuc3VyZUxpbmtTeW5jOiBjcmVhdGVMaW5rU3luY1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9lbnN1cmUvbGluay5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0d28gdHlwZXMgb2YgcGF0aHMsIG9uZSByZWxhdGl2ZSB0byBzeW1saW5rLCBhbmQgb25lXG4gKiByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gQ2hlY2tzIGlmIHBhdGggaXMgYWJzb2x1dGUgb3JcbiAqIHJlbGF0aXZlLiBJZiB0aGUgcGF0aCBpcyByZWxhdGl2ZSwgdGhpcyBmdW5jdGlvbiBjaGVja3MgaWYgdGhlIHBhdGggaXNcbiAqIHJlbGF0aXZlIHRvIHN5bWxpbmsgb3IgcmVsYXRpdmUgdG8gY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gVGhpcyBpcyBhblxuICogaW5pdGlhdGl2ZSB0byBmaW5kIGEgc21hcnRlciBgc3JjcGF0aGAgdG8gc3VwcGx5IHdoZW4gYnVpbGRpbmcgc3ltbGlua3MuXG4gKiBUaGlzIGFsbG93cyB5b3UgdG8gZGV0ZXJtaW5lIHdoaWNoIHBhdGggdG8gdXNlIG91dCBvZiBvbmUgb2YgdGhyZWUgcG9zc2libGVcbiAqIHR5cGVzIG9mIHNvdXJjZSBwYXRocy4gVGhlIGZpcnN0IGlzIGFuIGFic29sdXRlIHBhdGguIFRoaXMgaXMgZGV0ZWN0ZWQgYnlcbiAqIGBwYXRoLmlzQWJzb2x1dGUoKWAuIFdoZW4gYW4gYWJzb2x1dGUgcGF0aCBpcyBwcm92aWRlZCwgaXQgaXMgY2hlY2tlZCB0b1xuICogc2VlIGlmIGl0IGV4aXN0cy4gSWYgaXQgZG9lcyBpdCdzIHVzZWQsIGlmIG5vdCBhbiBlcnJvciBpcyByZXR1cm5lZFxuICogKGNhbGxiYWNrKS8gdGhyb3duIChzeW5jKS4gVGhlIG90aGVyIHR3byBvcHRpb25zIGZvciBgc3JjcGF0aGAgYXJlIGFcbiAqIHJlbGF0aXZlIHVybC4gQnkgZGVmYXVsdCBOb2RlJ3MgYGZzLnN5bWxpbmtgIHdvcmtzIGJ5IGNyZWF0aW5nIGEgc3ltbGlua1xuICogdXNpbmcgYGRzdHBhdGhgIGFuZCBleHBlY3RzIHRoZSBgc3JjcGF0aGAgdG8gYmUgcmVsYXRpdmUgdG8gdGhlIG5ld2x5XG4gKiBjcmVhdGVkIHN5bWxpbmsuIElmIHlvdSBwcm92aWRlIGEgYHNyY3BhdGhgIHRoYXQgZG9lcyBub3QgZXhpc3Qgb24gdGhlIGZpbGVcbiAqIHN5c3RlbSBpdCByZXN1bHRzIGluIGEgYnJva2VuIHN5bWxpbmsuIFRvIG1pbmltaXplIHRoaXMsIHRoZSBmdW5jdGlvblxuICogY2hlY2tzIHRvIHNlZSBpZiB0aGUgJ3JlbGF0aXZlIHRvIHN5bWxpbmsnIHNvdXJjZSBmaWxlIGV4aXN0cywgYW5kIGlmIGl0XG4gKiBkb2VzIGl0IHdpbGwgdXNlIGl0LiBJZiBpdCBkb2VzIG5vdCwgaXQgY2hlY2tzIGlmIHRoZXJlJ3MgYSBmaWxlIHRoYXRcbiAqIGV4aXN0cyB0aGF0IGlzIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LCBpZiBkb2VzIGl0cyB1c2VkLlxuICogVGhpcyBwcmVzZXJ2ZXMgdGhlIGV4cGVjdGF0aW9ucyBvZiB0aGUgb3JpZ2luYWwgZnMuc3ltbGluayBzcGVjIGFuZCBhZGRzXG4gKiB0aGUgYWJpbGl0eSB0byBwYXNzIGluIGByZWxhdGl2ZSB0byBjdXJyZW50IHdvcmtpbmcgZGlyZWNvdHJ5YCBwYXRocy5cbiAqL1xuXG5mdW5jdGlvbiBzeW1saW5rUGF0aHMgKHNyY3BhdGgsIGRzdHBhdGgsIGNhbGxiYWNrKSB7XG4gIGlmIChwYXRoLmlzQWJzb2x1dGUoc3JjcGF0aCkpIHtcbiAgICByZXR1cm4gZnMubHN0YXQoc3JjcGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZVN5bWxpbmsnKVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgJ3RvQ3dkJzogc3JjcGF0aCxcbiAgICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgICAgfSlcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRzdGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICAgIGNvbnN0IHJlbGF0aXZlVG9Ec3QgPSBwYXRoLmpvaW4oZHN0ZGlyLCBzcmNwYXRoKVxuICAgIHJldHVybiBmcy5leGlzdHMocmVsYXRpdmVUb0RzdCwgZXhpc3RzID0+IHtcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAndG9Dd2QnOiByZWxhdGl2ZVRvRHN0LFxuICAgICAgICAgICd0b0RzdCc6IHNyY3BhdGhcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmcy5sc3RhdChzcmNwYXRoLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVTeW1saW5rJylcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAndG9Dd2QnOiBzcmNwYXRoLFxuICAgICAgICAgICAgJ3RvRHN0JzogcGF0aC5yZWxhdGl2ZShkc3RkaXIsIHNyY3BhdGgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHN5bWxpbmtQYXRoc1N5bmMgKHNyY3BhdGgsIGRzdHBhdGgpIHtcbiAgbGV0IGV4aXN0c1xuICBpZiAocGF0aC5pc0Fic29sdXRlKHNyY3BhdGgpKSB7XG4gICAgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhzcmNwYXRoKVxuICAgIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ2Fic29sdXRlIHNyY3BhdGggZG9lcyBub3QgZXhpc3QnKVxuICAgIHJldHVybiB7XG4gICAgICAndG9Dd2QnOiBzcmNwYXRoLFxuICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBkc3RkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgICBjb25zdCByZWxhdGl2ZVRvRHN0ID0gcGF0aC5qb2luKGRzdGRpciwgc3JjcGF0aClcbiAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHJlbGF0aXZlVG9Ec3QpXG4gICAgaWYgKGV4aXN0cykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3RvQ3dkJzogcmVsYXRpdmVUb0RzdCxcbiAgICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHNyY3BhdGgpXG4gICAgICBpZiAoIWV4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdyZWxhdGl2ZSBzcmNwYXRoIGRvZXMgbm90IGV4aXN0JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd0b0N3ZCc6IHNyY3BhdGgsXG4gICAgICAgICd0b0RzdCc6IHBhdGgucmVsYXRpdmUoZHN0ZGlyLCBzcmNwYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3ltbGlua1BhdGhzLFxuICBzeW1saW5rUGF0aHNTeW5jXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2Vuc3VyZS9zeW1saW5rLXBhdGhzLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5cbmZ1bmN0aW9uIHN5bWxpbmtUeXBlIChzcmNwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcbiAgaWYgKHR5cGUpIHJldHVybiBjYWxsYmFjayhudWxsLCB0eXBlKVxuICBmcy5sc3RhdChzcmNwYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhudWxsLCAnZmlsZScpXG4gICAgdHlwZSA9IChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG4gICAgY2FsbGJhY2sobnVsbCwgdHlwZSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gc3ltbGlua1R5cGVTeW5jIChzcmNwYXRoLCB0eXBlKSB7XG4gIGxldCBzdGF0c1xuXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICB0cnkge1xuICAgIHN0YXRzID0gZnMubHN0YXRTeW5jKHNyY3BhdGgpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ2ZpbGUnXG4gIH1cbiAgcmV0dXJuIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW1saW5rVHlwZSxcbiAgc3ltbGlua1R5cGVTeW5jXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL2Vuc3VyZS9zeW1saW5rLXR5cGUuanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IF9ta2RpcnMgPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QgbWtkaXJzID0gX21rZGlycy5ta2RpcnNcbmNvbnN0IG1rZGlyc1N5bmMgPSBfbWtkaXJzLm1rZGlyc1N5bmNcblxuY29uc3QgX3N5bWxpbmtQYXRocyA9IHJlcXVpcmUoJy4vc3ltbGluay1wYXRocycpXG5jb25zdCBzeW1saW5rUGF0aHMgPSBfc3ltbGlua1BhdGhzLnN5bWxpbmtQYXRoc1xuY29uc3Qgc3ltbGlua1BhdGhzU3luYyA9IF9zeW1saW5rUGF0aHMuc3ltbGlua1BhdGhzU3luY1xuXG5jb25zdCBfc3ltbGlua1R5cGUgPSByZXF1aXJlKCcuL3N5bWxpbmstdHlwZScpXG5jb25zdCBzeW1saW5rVHlwZSA9IF9zeW1saW5rVHlwZS5zeW1saW5rVHlwZVxuY29uc3Qgc3ltbGlua1R5cGVTeW5jID0gX3N5bWxpbmtUeXBlLnN5bWxpbmtUeXBlU3luY1xuXG5mdW5jdGlvbiBjcmVhdGVTeW1saW5rIChzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcblxuICBmcy5leGlzdHMoZHN0cGF0aCwgZGVzdGluYXRpb25FeGlzdHMgPT4ge1xuICAgIGlmIChkZXN0aW5hdGlvbkV4aXN0cykgcmV0dXJuIGNhbGxiYWNrKG51bGwpXG4gICAgc3ltbGlua1BhdGhzKHNyY3BhdGgsIGRzdHBhdGgsIChlcnIsIHJlbGF0aXZlKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgc3JjcGF0aCA9IHJlbGF0aXZlLnRvRHN0XG4gICAgICBzeW1saW5rVHlwZShyZWxhdGl2ZS50b0N3ZCwgdHlwZSwgKGVyciwgdHlwZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgICAgICAgZnMuZXhpc3RzKGRpciwgZGlyRXhpc3RzID0+IHtcbiAgICAgICAgICBpZiAoZGlyRXhpc3RzKSByZXR1cm4gZnMuc3ltbGluayhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaylcbiAgICAgICAgICBta2RpcnMoZGlyLCBlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgIGZzLnN5bWxpbmsoc3JjcGF0aCwgZHN0cGF0aCwgdHlwZSwgY2FsbGJhY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ltbGlua1N5bmMgKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrID0gKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSA/IHR5cGUgOiBjYWxsYmFja1xuICB0eXBlID0gKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSA/IGZhbHNlIDogdHlwZVxuXG4gIGNvbnN0IGRlc3RpbmF0aW9uRXhpc3RzID0gZnMuZXhpc3RzU3luYyhkc3RwYXRoKVxuICBpZiAoZGVzdGluYXRpb25FeGlzdHMpIHJldHVybiB1bmRlZmluZWRcblxuICBjb25zdCByZWxhdGl2ZSA9IHN5bWxpbmtQYXRoc1N5bmMoc3JjcGF0aCwgZHN0cGF0aClcbiAgc3JjcGF0aCA9IHJlbGF0aXZlLnRvRHN0XG4gIHR5cGUgPSBzeW1saW5rVHlwZVN5bmMocmVsYXRpdmUudG9Dd2QsIHR5cGUpXG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICBjb25zdCBleGlzdHMgPSBmcy5leGlzdHNTeW5jKGRpcilcbiAgaWYgKGV4aXN0cykgcmV0dXJuIGZzLnN5bWxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUpXG4gIG1rZGlyc1N5bmMoZGlyKVxuICByZXR1cm4gZnMuc3ltbGlua1N5bmMoc3JjcGF0aCwgZHN0cGF0aCwgdHlwZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZVN5bWxpbmssXG4gIGNyZWF0ZVN5bWxpbmtTeW5jLFxuICAvLyBhbGlhc1xuICBlbnN1cmVTeW1saW5rOiBjcmVhdGVTeW1saW5rLFxuICBlbnN1cmVTeW1saW5rU3luYzogY3JlYXRlU3ltbGlua1N5bmNcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmsuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuL3V0aWwvYXNzaWduJylcblxuY29uc3QgZnNlID0ge31cbmNvbnN0IGdmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcblxuLy8gYXR0YWNoIGZzIG1ldGhvZHMgdG8gZnNlXG5PYmplY3Qua2V5cyhnZnMpLmZvckVhY2goa2V5ID0+IHtcbiAgZnNlW2tleV0gPSBnZnNba2V5XVxufSlcblxuY29uc3QgZnMgPSBmc2VcblxuYXNzaWduKGZzLCByZXF1aXJlKCcuL2NvcHknKSlcbmFzc2lnbihmcywgcmVxdWlyZSgnLi9jb3B5LXN5bmMnKSlcbmFzc2lnbihmcywgcmVxdWlyZSgnLi9ta2RpcnMnKSlcbmFzc2lnbihmcywgcmVxdWlyZSgnLi9yZW1vdmUnKSlcbmFzc2lnbihmcywgcmVxdWlyZSgnLi9qc29uJykpXG5hc3NpZ24oZnMsIHJlcXVpcmUoJy4vbW92ZScpKVxuYXNzaWduKGZzLCByZXF1aXJlKCcuL21vdmUtc3luYycpKVxuYXNzaWduKGZzLCByZXF1aXJlKCcuL2VtcHR5JykpXG5hc3NpZ24oZnMsIHJlcXVpcmUoJy4vZW5zdXJlJykpXG5hc3NpZ24oZnMsIHJlcXVpcmUoJy4vb3V0cHV0JykpXG5cbm1vZHVsZS5leHBvcnRzID0gZnNcblxuLy8gbWFpbnRhaW4gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIGF3aGlsZVxuY29uc3QganNvbmZpbGUgPSB7fVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGpzb25maWxlLCAnc3BhY2VzJywge1xuICBnZXQ6ICgpID0+IGZzLnNwYWNlcywgLy8gZm91bmQgaW4gLi9qc29uXG4gIHNldDogdmFsID0+IHtcbiAgICBmcy5zcGFjZXMgPSB2YWxcbiAgfVxufSlcblxubW9kdWxlLmV4cG9ydHMuanNvbmZpbGUgPSBqc29uZmlsZSAvLyBzbyB1c2VycyBvZiBmcy1leHRyYSBjYW4gbW9kaWZ5IGpzb25GaWxlLnNwYWNlc1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnLi9qc29uZmlsZScpXG5cbmpzb25GaWxlLm91dHB1dEpzb25TeW5jID0gcmVxdWlyZSgnLi9vdXRwdXQtanNvbi1zeW5jJylcbmpzb25GaWxlLm91dHB1dEpzb24gPSByZXF1aXJlKCcuL291dHB1dC1qc29uJylcbi8vIGFsaWFzZXNcbmpzb25GaWxlLm91dHB1dEpTT05TeW5jID0gcmVxdWlyZSgnLi9vdXRwdXQtanNvbi1zeW5jJylcbmpzb25GaWxlLm91dHB1dEpTT04gPSByZXF1aXJlKCcuL291dHB1dC1qc29uJylcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uRmlsZVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi9qc29uL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBjb3B5U3luYyA9IHJlcXVpcmUoJy4uL2NvcHktc3luYycpLmNvcHlTeW5jXG5jb25zdCByZW1vdmVTeW5jID0gcmVxdWlyZSgnLi4vcmVtb3ZlJykucmVtb3ZlU3luY1xuY29uc3QgbWtkaXJwU3luYyA9IHJlcXVpcmUoJy4uL21rZGlycycpLm1rZGlyc1N5bmNcblxuZnVuY3Rpb24gbW92ZVN5bmMgKHNyYywgZGVzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBjb25zdCBvdmVyd3JpdGUgPSBvcHRpb25zLm92ZXJ3cml0ZSB8fCBvcHRpb25zLmNsb2JiZXIgfHwgZmFsc2VcblxuICBzcmMgPSBwYXRoLnJlc29sdmUoc3JjKVxuICBkZXN0ID0gcGF0aC5yZXNvbHZlKGRlc3QpXG5cbiAgaWYgKHNyYyA9PT0gZGVzdCkgcmV0dXJuXG5cbiAgaWYgKGlzU3JjU3ViZGlyKHNyYywgZGVzdCkpIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IG1vdmUgJyR7c3JjfScgaW50byBpdHNlbGYgJyR7ZGVzdH0nLmApXG5cbiAgbWtkaXJwU3luYyhwYXRoLmRpcm5hbWUoZGVzdCkpXG4gIHRyeVJlbmFtZVN5bmMoKVxuXG4gIGZ1bmN0aW9uIHRyeVJlbmFtZVN5bmMgKCkge1xuICAgIGlmIChvdmVyd3JpdGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmcy5yZW5hbWVTeW5jKHNyYywgZGVzdClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9URU1QVFknIHx8IGVyci5jb2RlID09PSAnRUVYSVNUJyB8fCBlcnIuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICAgIHJlbW92ZVN5bmMoZGVzdClcbiAgICAgICAgICBvcHRpb25zLm92ZXJ3cml0ZSA9IGZhbHNlIC8vIGp1c3Qgb3ZlcndyaXRlZWQgaXQsIG5vIG5lZWQgdG8gZG8gaXQgYWdhaW5cbiAgICAgICAgICByZXR1cm4gbW92ZVN5bmMoc3JjLCBkZXN0LCBvcHRpb25zKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRVhERVYnKSB0aHJvdyBlcnJcbiAgICAgICAgcmV0dXJuIG1vdmVTeW5jQWNyb3NzRGV2aWNlKHNyYywgZGVzdCwgb3ZlcndyaXRlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBmcy5saW5rU3luYyhzcmMsIGRlc3QpXG4gICAgICAgIHJldHVybiBmcy51bmxpbmtTeW5jKHNyYylcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFWERFVicgfHwgZXJyLmNvZGUgPT09ICdFSVNESVInIHx8IGVyci5jb2RlID09PSAnRVBFUk0nIHx8IGVyci5jb2RlID09PSAnRU5PVFNVUCcpIHtcbiAgICAgICAgICByZXR1cm4gbW92ZVN5bmNBY3Jvc3NEZXZpY2Uoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVTeW5jQWNyb3NzRGV2aWNlIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSkge1xuICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoc3JjKVxuXG4gIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICByZXR1cm4gbW92ZURpclN5bmNBY3Jvc3NEZXZpY2Uoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1vdmVGaWxlU3luY0Fjcm9zc0RldmljZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlRmlsZVN5bmNBY3Jvc3NEZXZpY2UgKHNyYywgZGVzdCwgb3ZlcndyaXRlKSB7XG4gIGNvbnN0IEJVRl9MRU5HVEggPSA2NCAqIDEwMjRcbiAgY29uc3QgX2J1ZmYgPSBuZXcgQnVmZmVyKEJVRl9MRU5HVEgpXG5cbiAgY29uc3QgZmxhZ3MgPSBvdmVyd3JpdGUgPyAndycgOiAnd3gnXG5cbiAgY29uc3QgZmRyID0gZnMub3BlblN5bmMoc3JjLCAncicpXG4gIGNvbnN0IHN0YXQgPSBmcy5mc3RhdFN5bmMoZmRyKVxuICBjb25zdCBmZHcgPSBmcy5vcGVuU3luYyhkZXN0LCBmbGFncywgc3RhdC5tb2RlKVxuICBsZXQgYnl0ZXNSZWFkID0gMVxuICBsZXQgcG9zID0gMFxuXG4gIHdoaWxlIChieXRlc1JlYWQgPiAwKSB7XG4gICAgYnl0ZXNSZWFkID0gZnMucmVhZFN5bmMoZmRyLCBfYnVmZiwgMCwgQlVGX0xFTkdUSCwgcG9zKVxuICAgIGZzLndyaXRlU3luYyhmZHcsIF9idWZmLCAwLCBieXRlc1JlYWQpXG4gICAgcG9zICs9IGJ5dGVzUmVhZFxuICB9XG5cbiAgZnMuY2xvc2VTeW5jKGZkcilcbiAgZnMuY2xvc2VTeW5jKGZkdylcbiAgcmV0dXJuIGZzLnVubGlua1N5bmMoc3JjKVxufVxuXG5mdW5jdGlvbiBtb3ZlRGlyU3luY0Fjcm9zc0RldmljZSAoc3JjLCBkZXN0LCBvdmVyd3JpdGUpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBvdmVyd3JpdGU6IGZhbHNlXG4gIH1cblxuICBpZiAob3ZlcndyaXRlKSB7XG4gICAgcmVtb3ZlU3luYyhkZXN0KVxuICAgIHRyeUNvcHlTeW5jKClcbiAgfSBlbHNlIHtcbiAgICB0cnlDb3B5U3luYygpXG4gIH1cblxuICBmdW5jdGlvbiB0cnlDb3B5U3luYyAoKSB7XG4gICAgY29weVN5bmMoc3JjLCBkZXN0LCBvcHRpb25zKVxuICAgIHJldHVybiByZW1vdmVTeW5jKHNyYylcbiAgfVxufVxuXG4vLyByZXR1cm4gdHJ1ZSBpZiBkZXN0IGlzIGEgc3ViZGlyIG9mIHNyYywgb3RoZXJ3aXNlIGZhbHNlLlxuLy8gZXh0cmFjdCBkZXN0IGJhc2UgZGlyIGFuZCBjaGVjayBpZiB0aGF0IGlzIHRoZSBzYW1lIGFzIHNyYyBiYXNlbmFtZVxuZnVuY3Rpb24gaXNTcmNTdWJkaXIgKHNyYywgZGVzdCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcy5zdGF0U3luYyhzcmMpLmlzRGlyZWN0b3J5KCkgJiZcbiAgICAgICAgICAgc3JjICE9PSBkZXN0ICYmXG4gICAgICAgICAgIGRlc3QuaW5kZXhPZihzcmMpID4gLTEgJiZcbiAgICAgICAgICAgZGVzdC5zcGxpdChwYXRoLmRpcm5hbWUoc3JjKSArIHBhdGguc2VwKVsxXS5zcGxpdChwYXRoLnNlcClbMF0gPT09IHBhdGguYmFzZW5hbWUoc3JjKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1vdmVTeW5jXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL21vdmUtc3luYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbi8vIG1vc3Qgb2YgdGhpcyBjb2RlIHdhcyB3cml0dGVuIGJ5IEFuZHJldyBLZWxsZXlcbi8vIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgbGljZW5zZTogc2VlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5kcmV3cmsvbm9kZS1tdi9ibG9iL21hc3Rlci9wYWNrYWdlLmpzb25cblxuLy8gdGhpcyBuZWVkcyBhIGNsZWFudXBcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBuY3AgPSByZXF1aXJlKCcuLi9jb3B5L25jcCcpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCByZW1vdmUgPSByZXF1aXJlKCcuLi9yZW1vdmUnKS5yZW1vdmVcbmNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJy4uL21rZGlycycpLm1rZGlyc1xuXG5mdW5jdGlvbiBtb3ZlIChzb3VyY2UsIGRlc3QsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgY29uc3Qgc2hvdWxkTWtkaXJwID0gKCdta2RpcnAnIGluIG9wdGlvbnMpID8gb3B0aW9ucy5ta2RpcnAgOiB0cnVlXG4gIGNvbnN0IG92ZXJ3cml0ZSA9IG9wdGlvbnMub3ZlcndyaXRlIHx8IG9wdGlvbnMuY2xvYmJlciB8fCBmYWxzZVxuXG4gIGlmIChzaG91bGRNa2RpcnApIHtcbiAgICBta2RpcnMoKVxuICB9IGVsc2Uge1xuICAgIGRvUmVuYW1lKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG1rZGlycyAoKSB7XG4gICAgbWtkaXJwKHBhdGguZGlybmFtZShkZXN0KSwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBkb1JlbmFtZSgpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvUmVuYW1lICgpIHtcbiAgICBpZiAocGF0aC5yZXNvbHZlKHNvdXJjZSkgPT09IHBhdGgucmVzb2x2ZShkZXN0KSkge1xuICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKVxuICAgIH0gZWxzZSBpZiAob3ZlcndyaXRlKSB7XG4gICAgICBmcy5yZW5hbWUoc291cmNlLCBkZXN0LCBlcnIgPT4ge1xuICAgICAgICBpZiAoIWVycikgcmV0dXJuIGNhbGxiYWNrKClcblxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9URU1QVFknIHx8IGVyci5jb2RlID09PSAnRUVYSVNUJykge1xuICAgICAgICAgIHJlbW92ZShkZXN0LCBlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgIG9wdGlvbnMub3ZlcndyaXRlID0gZmFsc2UgLy8ganVzdCBvdmVyd3JpdGVlZCBpdCwgbm8gbmVlZCB0byBkbyBpdCBhZ2FpblxuICAgICAgICAgICAgbW92ZShzb3VyY2UsIGRlc3QsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZWlyZCBXaW5kb3dzIHNoaXRcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmUoZGVzdCwgZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgICAgb3B0aW9ucy5vdmVyd3JpdGUgPSBmYWxzZVxuICAgICAgICAgICAgICBtb3ZlKHNvdXJjZSwgZGVzdCwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sIDIwMClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIuY29kZSAhPT0gJ0VYREVWJykgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgbW92ZUFjcm9zc0RldmljZShzb3VyY2UsIGRlc3QsIG92ZXJ3cml0ZSwgY2FsbGJhY2spXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBmcy5saW5rKHNvdXJjZSwgZGVzdCwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VYREVWJyB8fCBlcnIuY29kZSA9PT0gJ0VJU0RJUicgfHwgZXJyLmNvZGUgPT09ICdFUEVSTScgfHwgZXJyLmNvZGUgPT09ICdFTk9UU1VQJykge1xuICAgICAgICAgICAgbW92ZUFjcm9zc0RldmljZShzb3VyY2UsIGRlc3QsIG92ZXJ3cml0ZSwgY2FsbGJhY2spXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soZXJyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGZzLnVubGluayhzb3VyY2UsIGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbW92ZUFjcm9zc0RldmljZSAoc291cmNlLCBkZXN0LCBvdmVyd3JpdGUsIGNhbGxiYWNrKSB7XG4gIGZzLnN0YXQoc291cmNlLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgY2FsbGJhY2soZXJyKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgbW92ZURpckFjcm9zc0RldmljZShzb3VyY2UsIGRlc3QsIG92ZXJ3cml0ZSwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdmVGaWxlQWNyb3NzRGV2aWNlKHNvdXJjZSwgZGVzdCwgb3ZlcndyaXRlLCBjYWxsYmFjaylcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIG1vdmVGaWxlQWNyb3NzRGV2aWNlIChzb3VyY2UsIGRlc3QsIG92ZXJ3cml0ZSwgY2FsbGJhY2spIHtcbiAgY29uc3QgZmxhZ3MgPSBvdmVyd3JpdGUgPyAndycgOiAnd3gnXG4gIGNvbnN0IGlucyA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oc291cmNlKVxuICBjb25zdCBvdXRzID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZGVzdCwgeyBmbGFncyB9KVxuXG4gIGlucy5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgIGlucy5kZXN0cm95KClcbiAgICBvdXRzLmRlc3Ryb3koKVxuICAgIG91dHMucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25DbG9zZSlcblxuICAgIC8vIG1heSB3YW50IHRvIGNyZWF0ZSBhIGRpcmVjdG9yeSBidXQgYG91dGAgbGluZSBhYm92ZVxuICAgIC8vIGNyZWF0ZXMgYW4gZW1wdHkgZmlsZSBmb3IgdXM6IFNlZSAjMTA4XG4gICAgLy8gZG9uJ3QgY2FyZSBhYm91dCBlcnJvciBoZXJlXG4gICAgZnMudW5saW5rKGRlc3QsICgpID0+IHtcbiAgICAgIC8vIG5vdGU6IGBlcnJgIGhlcmUgaXMgZnJvbSB0aGUgaW5wdXQgc3RyZWFtIGVycnJvclxuICAgICAgaWYgKGVyci5jb2RlID09PSAnRUlTRElSJyB8fCBlcnIuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICBtb3ZlRGlyQWNyb3NzRGV2aWNlKHNvdXJjZSwgZGVzdCwgb3ZlcndyaXRlLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKGVycilcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIG91dHMub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICBpbnMuZGVzdHJveSgpXG4gICAgb3V0cy5kZXN0cm95KClcbiAgICBvdXRzLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uQ2xvc2UpXG4gICAgY2FsbGJhY2soZXJyKVxuICB9KVxuXG4gIG91dHMub25jZSgnY2xvc2UnLCBvbkNsb3NlKVxuICBpbnMucGlwZShvdXRzKVxuXG4gIGZ1bmN0aW9uIG9uQ2xvc2UgKCkge1xuICAgIGZzLnVubGluayhzb3VyY2UsIGNhbGxiYWNrKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVEaXJBY3Jvc3NEZXZpY2UgKHNvdXJjZSwgZGVzdCwgb3ZlcndyaXRlLCBjYWxsYmFjaykge1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIG92ZXJ3cml0ZTogZmFsc2VcbiAgfVxuXG4gIGlmIChvdmVyd3JpdGUpIHtcbiAgICByZW1vdmUoZGVzdCwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBzdGFydE5jcCgpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBzdGFydE5jcCgpXG4gIH1cblxuICBmdW5jdGlvbiBzdGFydE5jcCAoKSB7XG4gICAgbmNwKHNvdXJjZSwgZGVzdCwgb3B0aW9ucywgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICByZW1vdmUoc291cmNlLCBjYWxsYmFjaylcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtb3ZlXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL21vdmUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcblxuZnVuY3Rpb24gb3V0cHV0RmlsZSAoZmlsZSwgZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKVxuICBmcy5leGlzdHMoZGlyLCBpdERvZXMgPT4ge1xuICAgIGlmIChpdERvZXMpIHJldHVybiBmcy53cml0ZUZpbGUoZmlsZSwgZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKVxuXG4gICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLCBkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gb3V0cHV0RmlsZVN5bmMgKGZpbGUsIGRhdGEsIGVuY29kaW5nKSB7XG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKVxuICBpZiAoZnMuZXhpc3RzU3luYyhkaXIpKSB7XG4gICAgcmV0dXJuIGZzLndyaXRlRmlsZVN5bmMuYXBwbHkoZnMsIGFyZ3VtZW50cylcbiAgfVxuICBta2Rpci5ta2RpcnNTeW5jKGRpcilcbiAgZnMud3JpdGVGaWxlU3luYy5hcHBseShmcywgYXJndW1lbnRzKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3V0cHV0RmlsZSxcbiAgb3V0cHV0RmlsZVN5bmNcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvb3V0cHV0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxuXG5jb25zdCBpc1dpbmRvd3MgPSAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJylcblxuZnVuY3Rpb24gZGVmYXVsdHMgKG9wdGlvbnMpIHtcbiAgY29uc3QgbWV0aG9kcyA9IFtcbiAgICAndW5saW5rJyxcbiAgICAnY2htb2QnLFxuICAgICdzdGF0JyxcbiAgICAnbHN0YXQnLFxuICAgICdybWRpcicsXG4gICAgJ3JlYWRkaXInXG4gIF1cbiAgbWV0aG9kcy5mb3JFYWNoKG0gPT4ge1xuICAgIG9wdGlvbnNbbV0gPSBvcHRpb25zW21dIHx8IGZzW21dXG4gICAgbSA9IG0gKyAnU3luYydcbiAgICBvcHRpb25zW21dID0gb3B0aW9uc1ttXSB8fCBmc1ttXVxuICB9KVxuXG4gIG9wdGlvbnMubWF4QnVzeVRyaWVzID0gb3B0aW9ucy5tYXhCdXN5VHJpZXMgfHwgM1xufVxuXG5mdW5jdGlvbiByaW1yYWYgKHAsIG9wdGlvbnMsIGNiKSB7XG4gIGxldCBidXN5VHJpZXMgPSAwXG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBvcHRpb25zXG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICBhc3NlcnQocCwgJ3JpbXJhZjogbWlzc2luZyBwYXRoJylcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBwLCAnc3RyaW5nJywgJ3JpbXJhZjogcGF0aCBzaG91bGQgYmUgYSBzdHJpbmcnKVxuICBhc3NlcnQuZXF1YWwodHlwZW9mIGNiLCAnZnVuY3Rpb24nLCAncmltcmFmOiBjYWxsYmFjayBmdW5jdGlvbiByZXF1aXJlZCcpXG4gIGFzc2VydChvcHRpb25zLCAncmltcmFmOiBpbnZhbGlkIG9wdGlvbnMgYXJndW1lbnQgcHJvdmlkZWQnKVxuICBhc3NlcnQuZXF1YWwodHlwZW9mIG9wdGlvbnMsICdvYmplY3QnLCAncmltcmFmOiBvcHRpb25zIHNob3VsZCBiZSBvYmplY3QnKVxuXG4gIGRlZmF1bHRzKG9wdGlvbnMpXG5cbiAgcmltcmFmXyhwLCBvcHRpb25zLCBmdW5jdGlvbiBDQiAoZXIpIHtcbiAgICBpZiAoZXIpIHtcbiAgICAgIGlmIChpc1dpbmRvd3MgJiYgKGVyLmNvZGUgPT09ICdFQlVTWScgfHwgZXIuY29kZSA9PT0gJ0VOT1RFTVBUWScgfHwgZXIuY29kZSA9PT0gJ0VQRVJNJykgJiZcbiAgICAgICAgICBidXN5VHJpZXMgPCBvcHRpb25zLm1heEJ1c3lUcmllcykge1xuICAgICAgICBidXN5VHJpZXMrK1xuICAgICAgICBsZXQgdGltZSA9IGJ1c3lUcmllcyAqIDEwMFxuICAgICAgICAvLyB0cnkgYWdhaW4sIHdpdGggdGhlIHNhbWUgZXhhY3QgY2FsbGJhY2sgYXMgdGhpcyBvbmUuXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHJpbXJhZl8ocCwgb3B0aW9ucywgQ0IpLCB0aW1lKVxuICAgICAgfVxuXG4gICAgICAvLyBhbHJlYWR5IGdvbmVcbiAgICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykgZXIgPSBudWxsXG4gICAgfVxuXG4gICAgY2IoZXIpXG4gIH0pXG59XG5cbi8vIFR3byBwb3NzaWJsZSBzdHJhdGVnaWVzLlxuLy8gMS4gQXNzdW1lIGl0J3MgYSBmaWxlLiAgdW5saW5rIGl0LCB0aGVuIGRvIHRoZSBkaXIgc3R1ZmYgb24gRVBFUk0gb3IgRUlTRElSXG4vLyAyLiBBc3N1bWUgaXQncyBhIGRpcmVjdG9yeS4gIHJlYWRkaXIsIHRoZW4gZG8gdGhlIGZpbGUgc3R1ZmYgb24gRU5PVERJUlxuLy9cbi8vIEJvdGggcmVzdWx0IGluIGFuIGV4dHJhIHN5c2NhbGwgd2hlbiB5b3UgZ3Vlc3Mgd3JvbmcuICBIb3dldmVyLCB0aGVyZVxuLy8gYXJlIGxpa2VseSBmYXIgbW9yZSBub3JtYWwgZmlsZXMgaW4gdGhlIHdvcmxkIHRoYW4gZGlyZWN0b3JpZXMuICBUaGlzXG4vLyBpcyBiYXNlZCBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IGEgdGhlIGF2ZXJhZ2UgbnVtYmVyIG9mIGZpbGVzIHBlclxuLy8gZGlyZWN0b3J5IGlzID49IDEuXG4vL1xuLy8gSWYgYW55b25lIGV2ZXIgY29tcGxhaW5zIGFib3V0IHRoaXMsIHRoZW4gSSBndWVzcyB0aGUgc3RyYXRlZ3kgY291bGRcbi8vIGJlIG1hZGUgY29uZmlndXJhYmxlIHNvbWVob3cuICBCdXQgdW50aWwgdGhlbiwgWUFHTkkuXG5mdW5jdGlvbiByaW1yYWZfIChwLCBvcHRpb25zLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgLy8gc3Vub3MgbGV0cyB0aGUgcm9vdCB1c2VyIHVubGluayBkaXJlY3Rvcmllcywgd2hpY2ggaXMuLi4gd2VpcmQuXG4gIC8vIHNvIHdlIGhhdmUgdG8gbHN0YXQgaGVyZSBhbmQgbWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlyLlxuICBvcHRpb25zLmxzdGF0KHAsIChlciwgc3QpID0+IHtcbiAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVybiBjYihudWxsKVxuICAgIH1cblxuICAgIC8vIFdpbmRvd3MgY2FuIEVQRVJNIG9uIHN0YXQuICBMaWZlIGlzIHN1ZmZlcmluZy5cbiAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VQRVJNJyAmJiBpc1dpbmRvd3MpIHtcbiAgICAgIHJldHVybiBmaXhXaW5FUEVSTShwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgfVxuXG4gICAgaWYgKHN0ICYmIHN0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgfVxuXG4gICAgb3B0aW9ucy51bmxpbmsocCwgZXIgPT4ge1xuICAgICAgaWYgKGVyKSB7XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIHJldHVybiBjYihudWxsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICAgICAgcmV0dXJuIChpc1dpbmRvd3MpXG4gICAgICAgICAgICA/IGZpeFdpbkVQRVJNKHAsIG9wdGlvbnMsIGVyLCBjYilcbiAgICAgICAgICAgIDogcm1kaXIocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgICAgICB9XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRUlTRElSJykge1xuICAgICAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjYihlcilcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBmaXhXaW5FUEVSTSAocCwgb3B0aW9ucywgZXIsIGNiKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgYXNzZXJ0KHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgaWYgKGVyKSB7XG4gICAgYXNzZXJ0KGVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIH1cblxuICBvcHRpb25zLmNobW9kKHAsIDY2NiwgZXIyID0+IHtcbiAgICBpZiAoZXIyKSB7XG4gICAgICBjYihlcjIuY29kZSA9PT0gJ0VOT0VOVCcgPyBudWxsIDogZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMuc3RhdChwLCAoZXIzLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXIzKSB7XG4gICAgICAgICAgY2IoZXIzLmNvZGUgPT09ICdFTk9FTlQnID8gbnVsbCA6IGVyKVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy51bmxpbmsocCwgY2IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBmaXhXaW5FUEVSTVN5bmMgKHAsIG9wdGlvbnMsIGVyKSB7XG4gIGxldCBzdGF0c1xuXG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgaWYgKGVyKSB7XG4gICAgYXNzZXJ0KGVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIH1cblxuICB0cnkge1xuICAgIG9wdGlvbnMuY2htb2RTeW5jKHAsIDY2NilcbiAgfSBjYXRjaCAoZXIyKSB7XG4gICAgaWYgKGVyMi5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVyXG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBzdGF0cyA9IG9wdGlvbnMuc3RhdFN5bmMocClcbiAgfSBjYXRjaCAoZXIzKSB7XG4gICAgaWYgKGVyMy5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVyXG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICBybWRpclN5bmMocCwgb3B0aW9ucywgZXIpXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucy51bmxpbmtTeW5jKHApXG4gIH1cbn1cblxuZnVuY3Rpb24gcm1kaXIgKHAsIG9wdGlvbnMsIG9yaWdpbmFsRXIsIGNiKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgaWYgKG9yaWdpbmFsRXIpIHtcbiAgICBhc3NlcnQob3JpZ2luYWxFciBpbnN0YW5jZW9mIEVycm9yKVxuICB9XG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgLy8gdHJ5IHRvIHJtZGlyIGZpcnN0LCBhbmQgb25seSByZWFkZGlyIG9uIEVOT1RFTVBUWSBvciBFRVhJU1QgKFN1bk9TKVxuICAvLyBpZiB3ZSBndWVzc2VkIHdyb25nLCBhbmQgaXQncyBub3QgYSBkaXJlY3RvcnksIHRoZW5cbiAgLy8gcmFpc2UgdGhlIG9yaWdpbmFsIGVycm9yLlxuICBvcHRpb25zLnJtZGlyKHAsIGVyID0+IHtcbiAgICBpZiAoZXIgJiYgKGVyLmNvZGUgPT09ICdFTk9URU1QVFknIHx8IGVyLmNvZGUgPT09ICdFRVhJU1QnIHx8IGVyLmNvZGUgPT09ICdFUEVSTScpKSB7XG4gICAgICBybWtpZHMocCwgb3B0aW9ucywgY2IpXG4gICAgfSBlbHNlIGlmIChlciAmJiBlci5jb2RlID09PSAnRU5PVERJUicpIHtcbiAgICAgIGNiKG9yaWdpbmFsRXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNiKGVyKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcm1raWRzIChwLCBvcHRpb25zLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgb3B0aW9ucy5yZWFkZGlyKHAsIChlciwgZmlsZXMpID0+IHtcbiAgICBpZiAoZXIpIHJldHVybiBjYihlcilcblxuICAgIGxldCBuID0gZmlsZXMubGVuZ3RoXG4gICAgbGV0IGVyclN0YXRlXG5cbiAgICBpZiAobiA9PT0gMCkgcmV0dXJuIG9wdGlvbnMucm1kaXIocCwgY2IpXG5cbiAgICBmaWxlcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgcmltcmFmKHBhdGguam9pbihwLCBmKSwgb3B0aW9ucywgZXIgPT4ge1xuICAgICAgICBpZiAoZXJyU3RhdGUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXIpIHJldHVybiBjYihlcnJTdGF0ZSA9IGVyKVxuICAgICAgICBpZiAoLS1uID09PSAwKSB7XG4gICAgICAgICAgb3B0aW9ucy5ybWRpcihwLCBjYilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG4vLyB0aGlzIGxvb2tzIHNpbXBsZXIsIGFuZCBpcyBzdHJpY3RseSAqZmFzdGVyKiwgYnV0IHdpbGxcbi8vIHRpZSB1cCB0aGUgSmF2YVNjcmlwdCB0aHJlYWQgYW5kIGZhaWwgb24gZXhjZXNzaXZlbHlcbi8vIGRlZXAgZGlyZWN0b3J5IHRyZWVzLlxuZnVuY3Rpb24gcmltcmFmU3luYyAocCwgb3B0aW9ucykge1xuICBsZXQgc3RcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBkZWZhdWx0cyhvcHRpb25zKVxuXG4gIGFzc2VydChwLCAncmltcmFmOiBtaXNzaW5nIHBhdGgnKVxuICBhc3NlcnQuZXF1YWwodHlwZW9mIHAsICdzdHJpbmcnLCAncmltcmFmOiBwYXRoIHNob3VsZCBiZSBhIHN0cmluZycpXG4gIGFzc2VydChvcHRpb25zLCAncmltcmFmOiBtaXNzaW5nIG9wdGlvbnMnKVxuICBhc3NlcnQuZXF1YWwodHlwZW9mIG9wdGlvbnMsICdvYmplY3QnLCAncmltcmFmOiBvcHRpb25zIHNob3VsZCBiZSBvYmplY3QnKVxuXG4gIHRyeSB7XG4gICAgc3QgPSBvcHRpb25zLmxzdGF0U3luYyhwKVxuICB9IGNhdGNoIChlcikge1xuICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gV2luZG93cyBjYW4gRVBFUk0gb24gc3RhdC4gIExpZmUgaXMgc3VmZmVyaW5nLlxuICAgIGlmIChlci5jb2RlID09PSAnRVBFUk0nICYmIGlzV2luZG93cykge1xuICAgICAgZml4V2luRVBFUk1TeW5jKHAsIG9wdGlvbnMsIGVyKVxuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gc3Vub3MgbGV0cyB0aGUgcm9vdCB1c2VyIHVubGluayBkaXJlY3Rvcmllcywgd2hpY2ggaXMuLi4gd2VpcmQuXG4gICAgaWYgKHN0ICYmIHN0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHJtZGlyU3luYyhwLCBvcHRpb25zLCBudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnVubGlua1N5bmMocClcbiAgICB9XG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgaWYgKGVyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYgKGVyLmNvZGUgPT09ICdFUEVSTScpIHtcbiAgICAgIHJldHVybiBpc1dpbmRvd3MgPyBmaXhXaW5FUEVSTVN5bmMocCwgb3B0aW9ucywgZXIpIDogcm1kaXJTeW5jKHAsIG9wdGlvbnMsIGVyKVxuICAgIH0gZWxzZSBpZiAoZXIuY29kZSAhPT0gJ0VJU0RJUicpIHtcbiAgICAgIHRocm93IGVyXG4gICAgfVxuICAgIHJtZGlyU3luYyhwLCBvcHRpb25zLCBlcilcbiAgfVxufVxuXG5mdW5jdGlvbiBybWRpclN5bmMgKHAsIG9wdGlvbnMsIG9yaWdpbmFsRXIpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuICBpZiAob3JpZ2luYWxFcikge1xuICAgIGFzc2VydChvcmlnaW5hbEVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIH1cblxuICB0cnkge1xuICAgIG9wdGlvbnMucm1kaXJTeW5jKHApXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgaWYgKGVyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYgKGVyLmNvZGUgPT09ICdFTk9URElSJykge1xuICAgICAgdGhyb3cgb3JpZ2luYWxFclxuICAgIH0gZWxzZSBpZiAoZXIuY29kZSA9PT0gJ0VOT1RFTVBUWScgfHwgZXIuY29kZSA9PT0gJ0VFWElTVCcgfHwgZXIuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgcm1raWRzU3luYyhwLCBvcHRpb25zKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBybWtpZHNTeW5jIChwLCBvcHRpb25zKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgb3B0aW9ucy5yZWFkZGlyU3luYyhwKS5mb3JFYWNoKGYgPT4gcmltcmFmU3luYyhwYXRoLmpvaW4ocCwgZiksIG9wdGlvbnMpKVxuICBvcHRpb25zLnJtZGlyU3luYyhwLCBvcHRpb25zKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJpbXJhZlxucmltcmFmLnN5bmMgPSByaW1yYWZTeW5jXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtZXh0cmEvbGliL3JlbW92ZS9yaW1yYWYuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG4vLyBzaW1wbGUgbXV0YWJsZSBhc3NpZ25cbmZ1bmN0aW9uIGFzc2lnbiAoKSB7XG4gIGNvbnN0IGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuZmlsdGVyKGkgPT4gaSlcbiAgY29uc3QgZGVzdCA9IGFyZ3Muc2hpZnQoKVxuICBhcmdzLmZvckVhY2goc3JjID0+IHtcbiAgICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldXG4gICAgfSlcbiAgfSlcblxuICByZXR1cm4gZGVzdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWV4dHJhL2xpYi91dGlsL2Fzc2lnbi5qc1xuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbi8vIEhGUywgZXh0ezIsM30sIEZBVCBkbyBub3QsIE5vZGUuanMgdjAuMTAgZG9lcyBub3RcbmZ1bmN0aW9uIGhhc01pbGxpc1Jlc1N5bmMgKCkge1xuICBsZXQgdG1wZmlsZSA9IHBhdGguam9pbignbWlsbGlzLXRlc3Qtc3luYycgKyBEYXRlLm5vdygpLnRvU3RyaW5nKCkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMikpXG4gIHRtcGZpbGUgPSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIHRtcGZpbGUpXG5cbiAgLy8gNTUwIG1pbGxpcyBwYXN0IFVOSVggZXBvY2hcbiAgY29uc3QgZCA9IG5ldyBEYXRlKDE0MzU0MTAyNDM4NjIpXG4gIGZzLndyaXRlRmlsZVN5bmModG1wZmlsZSwgJ2h0dHBzOi8vZ2l0aHViLmNvbS9qcHJpY2hhcmRzb24vbm9kZS1mcy1leHRyYS9wdWxsLzE0MScpXG4gIGNvbnN0IGZkID0gZnMub3BlblN5bmModG1wZmlsZSwgJ3IrJylcbiAgZnMuZnV0aW1lc1N5bmMoZmQsIGQsIGQpXG4gIGZzLmNsb3NlU3luYyhmZClcbiAgcmV0dXJuIGZzLnN0YXRTeW5jKHRtcGZpbGUpLm10aW1lID4gMTQzNTQxMDI0MzAwMFxufVxuXG5mdW5jdGlvbiBoYXNNaWxsaXNSZXMgKGNhbGxiYWNrKSB7XG4gIGxldCB0bXBmaWxlID0gcGF0aC5qb2luKCdtaWxsaXMtdGVzdCcgKyBEYXRlLm5vdygpLnRvU3RyaW5nKCkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMikpXG4gIHRtcGZpbGUgPSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIHRtcGZpbGUpXG5cbiAgLy8gNTUwIG1pbGxpcyBwYXN0IFVOSVggZXBvY2hcbiAgY29uc3QgZCA9IG5ldyBEYXRlKDE0MzU0MTAyNDM4NjIpXG4gIGZzLndyaXRlRmlsZSh0bXBmaWxlLCAnaHR0cHM6Ly9naXRodWIuY29tL2pwcmljaGFyZHNvbi9ub2RlLWZzLWV4dHJhL3B1bGwvMTQxJywgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgIGZzLm9wZW4odG1wZmlsZSwgJ3IrJywgKGVyciwgZmQpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBmcy5mdXRpbWVzKGZkLCBkLCBkLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICBmcy5jbG9zZShmZCwgZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgIGZzLnN0YXQodG1wZmlsZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBzdGF0cy5tdGltZSA+IDE0MzU0MTAyNDMwMDApXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gdGltZVJlbW92ZU1pbGxpcyAodGltZXN0YW1wKSB7XG4gIGlmICh0eXBlb2YgdGltZXN0YW1wID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRpbWVzdGFtcCAvIDEwMDApICogMTAwMFxuICB9IGVsc2UgaWYgKHRpbWVzdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoTWF0aC5mbG9vcih0aW1lc3RhbXAuZ2V0VGltZSgpIC8gMTAwMCkgKiAxMDAwKVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignZnMtZXh0cmE6IHRpbWVSZW1vdmVNaWxsaXMoKSB1bmtub3duIHBhcmFtZXRlciB0eXBlJylcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGltZXNNaWxsaXMgKHBhdGgsIGF0aW1lLCBtdGltZSwgY2FsbGJhY2spIHtcbiAgLy8gaWYgKCFIQVNfTUlMTElTX1JFUykgcmV0dXJuIGZzLnV0aW1lcyhwYXRoLCBhdGltZSwgbXRpbWUsIGNhbGxiYWNrKVxuICBmcy5vcGVuKHBhdGgsICdyKycsIChlcnIsIGZkKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICBmcy5mdXRpbWVzKGZkLCBhdGltZSwgbXRpbWUsIGZ1dGltZXNFcnIgPT4ge1xuICAgICAgZnMuY2xvc2UoZmQsIGNsb3NlRXJyID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhmdXRpbWVzRXJyIHx8IGNsb3NlRXJyKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaGFzTWlsbGlzUmVzLFxuICBoYXNNaWxsaXNSZXNTeW5jLFxuICB0aW1lUmVtb3ZlTWlsbGlzLFxuICB1dGltZXNNaWxsaXNcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1leHRyYS9saWIvdXRpbC91dGltZXMuanNcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW1cblxubW9kdWxlLmV4cG9ydHMgPSBsZWdhY3lcblxuZnVuY3Rpb24gbGVnYWN5IChmcykge1xuICByZXR1cm4ge1xuICAgIFJlYWRTdHJlYW06IFJlYWRTdHJlYW0sXG4gICAgV3JpdGVTdHJlYW06IFdyaXRlU3RyZWFtXG4gIH1cblxuICBmdW5jdGlvbiBSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRTdHJlYW0pKSByZXR1cm4gbmV3IFJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG5cbiAgICBTdHJlYW0uY2FsbCh0aGlzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5mZCA9IG51bGw7XG4gICAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZmxhZ3MgPSAncic7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ1ZmZlclNpemUgPSA2NCAqIDEwMjQ7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuY29kaW5nKSB0aGlzLnNldEVuY29kaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5zdGFydCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3N0YXJ0IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW5kID0gSW5maW5pdHk7XG4gICAgICB9IGVsc2UgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5lbmQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdlbmQgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGFydCA+IHRoaXMuZW5kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgbXVzdCBiZSA8PSBlbmQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZkICE9PSBudWxsKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl9yZWFkKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmcy5vcGVuKHRoaXMucGF0aCwgdGhpcy5mbGFncywgdGhpcy5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgc2VsZi5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZmQgPSBmZDtcbiAgICAgIHNlbGYuZW1pdCgnb3BlbicsIGZkKTtcbiAgICAgIHNlbGYuX3JlYWQoKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgV3JpdGVTdHJlYW0pKSByZXR1cm4gbmV3IFdyaXRlU3RyZWFtKHBhdGgsIG9wdGlvbnMpO1xuXG4gICAgU3RyZWFtLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMuZmQgPSBudWxsO1xuICAgIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgdGhpcy5mbGFncyA9ICd3JztcbiAgICB0aGlzLmVuY29kaW5nID0gJ2JpbmFyeSc7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ5dGVzV3JpdHRlbiA9IDA7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzdGFydCBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGFydCA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBtdXN0IGJlID49IHplcm8nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgIHRoaXMuX3F1ZXVlID0gW107XG5cbiAgICBpZiAodGhpcy5mZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fb3BlbiA9IGZzLm9wZW47XG4gICAgICB0aGlzLl9xdWV1ZS5wdXNoKFt0aGlzLl9vcGVuLCB0aGlzLnBhdGgsIHRoaXMuZmxhZ3MsIHRoaXMubW9kZSwgdW5kZWZpbmVkXSk7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZ3JhY2VmdWwtZnMvbGVnYWN5LXN0cmVhbXMuanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcyA9IHJlcXVpcmUoJy4vZnMuanMnKVxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJ2NvbnN0YW50cycpXG5cbnZhciBvcmlnQ3dkID0gcHJvY2Vzcy5jd2RcbnZhciBjd2QgPSBudWxsXG5cbnZhciBwbGF0Zm9ybSA9IHByb2Nlc3MuZW52LkdSQUNFRlVMX0ZTX1BMQVRGT1JNIHx8IHByb2Nlc3MucGxhdGZvcm1cblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCFjd2QpXG4gICAgY3dkID0gb3JpZ0N3ZC5jYWxsKHByb2Nlc3MpXG4gIHJldHVybiBjd2Rcbn1cbnRyeSB7XG4gIHByb2Nlc3MuY3dkKClcbn0gY2F0Y2ggKGVyKSB7fVxuXG52YXIgY2hkaXIgPSBwcm9jZXNzLmNoZGlyXG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24oZCkge1xuICBjd2QgPSBudWxsXG4gIGNoZGlyLmNhbGwocHJvY2VzcywgZClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaFxuXG5mdW5jdGlvbiBwYXRjaCAoZnMpIHtcbiAgLy8gKHJlLSlpbXBsZW1lbnQgc29tZSB0aGluZ3MgdGhhdCBhcmUga25vd24gYnVzdGVkIG9yIG1pc3NpbmcuXG5cbiAgLy8gbGNobW9kLCBicm9rZW4gcHJpb3IgdG8gMC42LjJcbiAgLy8gYmFjay1wb3J0IHRoZSBmaXggaGVyZS5cbiAgaWYgKGNvbnN0YW50cy5oYXNPd25Qcm9wZXJ0eSgnT19TWU1MSU5LJykgJiZcbiAgICAgIHByb2Nlc3MudmVyc2lvbi5tYXRjaCgvXnYwXFwuNlxcLlswLTJdfF52MFxcLjVcXC4vKSkge1xuICAgIHBhdGNoTGNobW9kKGZzKVxuICB9XG5cbiAgLy8gbHV0aW1lcyBpbXBsZW1lbnRhdGlvbiwgb3Igbm8tb3BcbiAgaWYgKCFmcy5sdXRpbWVzKSB7XG4gICAgcGF0Y2hMdXRpbWVzKGZzKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdyYWNlZnVsLWZzL2lzc3Vlcy80XG4gIC8vIENob3duIHNob3VsZCBub3QgZmFpbCBvbiBlaW52YWwgb3IgZXBlcm0gaWYgbm9uLXJvb3QuXG4gIC8vIEl0IHNob3VsZCBub3QgZmFpbCBvbiBlbm9zeXMgZXZlciwgYXMgdGhpcyBqdXN0IGluZGljYXRlc1xuICAvLyB0aGF0IGEgZnMgZG9lc24ndCBzdXBwb3J0IHRoZSBpbnRlbmRlZCBvcGVyYXRpb24uXG5cbiAgZnMuY2hvd24gPSBjaG93bkZpeChmcy5jaG93bilcbiAgZnMuZmNob3duID0gY2hvd25GaXgoZnMuZmNob3duKVxuICBmcy5sY2hvd24gPSBjaG93bkZpeChmcy5sY2hvd24pXG5cbiAgZnMuY2htb2QgPSBjaG1vZEZpeChmcy5jaG1vZClcbiAgZnMuZmNobW9kID0gY2htb2RGaXgoZnMuZmNobW9kKVxuICBmcy5sY2htb2QgPSBjaG1vZEZpeChmcy5sY2htb2QpXG5cbiAgZnMuY2hvd25TeW5jID0gY2hvd25GaXhTeW5jKGZzLmNob3duU3luYylcbiAgZnMuZmNob3duU3luYyA9IGNob3duRml4U3luYyhmcy5mY2hvd25TeW5jKVxuICBmcy5sY2hvd25TeW5jID0gY2hvd25GaXhTeW5jKGZzLmxjaG93blN5bmMpXG5cbiAgZnMuY2htb2RTeW5jID0gY2htb2RGaXhTeW5jKGZzLmNobW9kU3luYylcbiAgZnMuZmNobW9kU3luYyA9IGNobW9kRml4U3luYyhmcy5mY2htb2RTeW5jKVxuICBmcy5sY2htb2RTeW5jID0gY2htb2RGaXhTeW5jKGZzLmxjaG1vZFN5bmMpXG5cbiAgZnMuc3RhdCA9IHN0YXRGaXgoZnMuc3RhdClcbiAgZnMuZnN0YXQgPSBzdGF0Rml4KGZzLmZzdGF0KVxuICBmcy5sc3RhdCA9IHN0YXRGaXgoZnMubHN0YXQpXG5cbiAgZnMuc3RhdFN5bmMgPSBzdGF0Rml4U3luYyhmcy5zdGF0U3luYylcbiAgZnMuZnN0YXRTeW5jID0gc3RhdEZpeFN5bmMoZnMuZnN0YXRTeW5jKVxuICBmcy5sc3RhdFN5bmMgPSBzdGF0Rml4U3luYyhmcy5sc3RhdFN5bmMpXG5cbiAgLy8gaWYgbGNobW9kL2xjaG93biBkbyBub3QgZXhpc3QsIHRoZW4gbWFrZSB0aGVtIG5vLW9wc1xuICBpZiAoIWZzLmxjaG1vZCkge1xuICAgIGZzLmxjaG1vZCA9IGZ1bmN0aW9uIChwYXRoLCBtb2RlLCBjYikge1xuICAgICAgaWYgKGNiKSBwcm9jZXNzLm5leHRUaWNrKGNiKVxuICAgIH1cbiAgICBmcy5sY2htb2RTeW5jID0gZnVuY3Rpb24gKCkge31cbiAgfVxuICBpZiAoIWZzLmxjaG93bikge1xuICAgIGZzLmxjaG93biA9IGZ1bmN0aW9uIChwYXRoLCB1aWQsIGdpZCwgY2IpIHtcbiAgICAgIGlmIChjYikgcHJvY2Vzcy5uZXh0VGljayhjYilcbiAgICB9XG4gICAgZnMubGNob3duU3luYyA9IGZ1bmN0aW9uICgpIHt9XG4gIH1cblxuICAvLyBvbiBXaW5kb3dzLCBBL1Ygc29mdHdhcmUgY2FuIGxvY2sgdGhlIGRpcmVjdG9yeSwgY2F1c2luZyB0aGlzXG4gIC8vIHRvIGZhaWwgd2l0aCBhbiBFQUNDRVMgb3IgRVBFUk0gaWYgdGhlIGRpcmVjdG9yeSBjb250YWlucyBuZXdseVxuICAvLyBjcmVhdGVkIGZpbGVzLiAgVHJ5IGFnYWluIG9uIGZhaWx1cmUsIGZvciB1cCB0byA2MCBzZWNvbmRzLlxuXG4gIC8vIFNldCB0aGUgdGltZW91dCB0aGlzIGxvbmcgYmVjYXVzZSBzb21lIFdpbmRvd3MgQW50aS1WaXJ1cywgc3VjaCBhcyBQYXJpdHlcbiAgLy8gYml0OSwgbWF5IGxvY2sgZmlsZXMgZm9yIHVwIHRvIGEgbWludXRlLCBjYXVzaW5nIG5wbSBwYWNrYWdlIGluc3RhbGxcbiAgLy8gZmFpbHVyZXMuIEFsc28sIHRha2UgY2FyZSB0byB5aWVsZCB0aGUgc2NoZWR1bGVyLiBXaW5kb3dzIHNjaGVkdWxpbmcgZ2l2ZXNcbiAgLy8gQ1BVIHRvIGEgYnVzeSBsb29waW5nIHByb2Nlc3MsIHdoaWNoIGNhbiBjYXVzZSB0aGUgcHJvZ3JhbSBjYXVzaW5nIHRoZSBsb2NrXG4gIC8vIGNvbnRlbnRpb24gdG8gYmUgc3RhcnZlZCBvZiBDUFUgYnkgbm9kZSwgc28gdGhlIGNvbnRlbnRpb24gZG9lc24ndCByZXNvbHZlLlxuICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgIGZzLnJlbmFtZSA9IChmdW5jdGlvbiAoZnMkcmVuYW1lKSB7IHJldHVybiBmdW5jdGlvbiAoZnJvbSwgdG8sIGNiKSB7XG4gICAgICB2YXIgc3RhcnQgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgYmFja29mZiA9IDA7XG4gICAgICBmcyRyZW5hbWUoZnJvbSwgdG8sIGZ1bmN0aW9uIENCIChlcikge1xuICAgICAgICBpZiAoZXJcbiAgICAgICAgICAgICYmIChlci5jb2RlID09PSBcIkVBQ0NFU1wiIHx8IGVyLmNvZGUgPT09IFwiRVBFUk1cIilcbiAgICAgICAgICAgICYmIERhdGUubm93KCkgLSBzdGFydCA8IDYwMDAwKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZzLnN0YXQodG8sIGZ1bmN0aW9uIChzdGF0ZXIsIHN0KSB7XG4gICAgICAgICAgICAgIGlmIChzdGF0ZXIgJiYgc3RhdGVyLmNvZGUgPT09IFwiRU5PRU5UXCIpXG4gICAgICAgICAgICAgICAgZnMkcmVuYW1lKGZyb20sIHRvLCBDQik7XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYihlcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSwgYmFja29mZilcbiAgICAgICAgICBpZiAoYmFja29mZiA8IDEwMClcbiAgICAgICAgICAgIGJhY2tvZmYgKz0gMTA7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgY2IoZXIpXG4gICAgICB9KVxuICAgIH19KShmcy5yZW5hbWUpXG4gIH1cblxuICAvLyBpZiByZWFkKCkgcmV0dXJucyBFQUdBSU4sIHRoZW4ganVzdCB0cnkgaXQgYWdhaW4uXG4gIGZzLnJlYWQgPSAoZnVuY3Rpb24gKGZzJHJlYWQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrXykge1xuICAgIHZhciBjYWxsYmFja1xuICAgIGlmIChjYWxsYmFja18gJiYgdHlwZW9mIGNhbGxiYWNrXyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGVhZ0NvdW50ZXIgPSAwXG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChlciwgXywgX18pIHtcbiAgICAgICAgaWYgKGVyICYmIGVyLmNvZGUgPT09ICdFQUdBSU4nICYmIGVhZ0NvdW50ZXIgPCAxMCkge1xuICAgICAgICAgIGVhZ0NvdW50ZXIgKytcbiAgICAgICAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrXy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmcyRyZWFkLmNhbGwoZnMsIGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FsbGJhY2spXG4gIH19KShmcy5yZWFkKVxuXG4gIGZzLnJlYWRTeW5jID0gKGZ1bmN0aW9uIChmcyRyZWFkU3luYykgeyByZXR1cm4gZnVuY3Rpb24gKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbikge1xuICAgIHZhciBlYWdDb3VudGVyID0gMFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZnMkcmVhZFN5bmMuY2FsbChmcywgZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uKVxuICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgaWYgKGVyLmNvZGUgPT09ICdFQUdBSU4nICYmIGVhZ0NvdW50ZXIgPCAxMCkge1xuICAgICAgICAgIGVhZ0NvdW50ZXIgKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIHRocm93IGVyXG4gICAgICB9XG4gICAgfVxuICB9fSkoZnMucmVhZFN5bmMpXG59XG5cbmZ1bmN0aW9uIHBhdGNoTGNobW9kIChmcykge1xuICBmcy5sY2htb2QgPSBmdW5jdGlvbiAocGF0aCwgbW9kZSwgY2FsbGJhY2spIHtcbiAgICBmcy5vcGVuKCBwYXRoXG4gICAgICAgICAgICwgY29uc3RhbnRzLk9fV1JPTkxZIHwgY29uc3RhbnRzLk9fU1lNTElOS1xuICAgICAgICAgICAsIG1vZGVcbiAgICAgICAgICAgLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKGVycilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBwcmVmZXIgdG8gcmV0dXJuIHRoZSBjaG1vZCBlcnJvciwgaWYgb25lIG9jY3VycyxcbiAgICAgIC8vIGJ1dCBzdGlsbCB0cnkgdG8gY2xvc2UsIGFuZCByZXBvcnQgY2xvc2luZyBlcnJvcnMgaWYgdGhleSBvY2N1ci5cbiAgICAgIGZzLmZjaG1vZChmZCwgbW9kZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBmcy5jbG9zZShmZCwgZnVuY3Rpb24oZXJyMikge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyIHx8IGVycjIpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmcy5sY2htb2RTeW5jID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUpIHtcbiAgICB2YXIgZmQgPSBmcy5vcGVuU3luYyhwYXRoLCBjb25zdGFudHMuT19XUk9OTFkgfCBjb25zdGFudHMuT19TWU1MSU5LLCBtb2RlKVxuXG4gICAgLy8gcHJlZmVyIHRvIHJldHVybiB0aGUgY2htb2QgZXJyb3IsIGlmIG9uZSBvY2N1cnMsXG4gICAgLy8gYnV0IHN0aWxsIHRyeSB0byBjbG9zZSwgYW5kIHJlcG9ydCBjbG9zaW5nIGVycm9ycyBpZiB0aGV5IG9jY3VyLlxuICAgIHZhciB0aHJldyA9IHRydWVcbiAgICB2YXIgcmV0XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGZzLmZjaG1vZFN5bmMoZmQsIG1vZGUpXG4gICAgICB0aHJldyA9IGZhbHNlXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICh0aHJldykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXRjaEx1dGltZXMgKGZzKSB7XG4gIGlmIChjb25zdGFudHMuaGFzT3duUHJvcGVydHkoXCJPX1NZTUxJTktcIikpIHtcbiAgICBmcy5sdXRpbWVzID0gZnVuY3Rpb24gKHBhdGgsIGF0LCBtdCwgY2IpIHtcbiAgICAgIGZzLm9wZW4ocGF0aCwgY29uc3RhbnRzLk9fU1lNTElOSywgZnVuY3Rpb24gKGVyLCBmZCkge1xuICAgICAgICBpZiAoZXIpIHtcbiAgICAgICAgICBpZiAoY2IpIGNiKGVyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGZzLmZ1dGltZXMoZmQsIGF0LCBtdCwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgICAgZnMuY2xvc2UoZmQsIGZ1bmN0aW9uIChlcjIpIHtcbiAgICAgICAgICAgIGlmIChjYikgY2IoZXIgfHwgZXIyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZzLmx1dGltZXNTeW5jID0gZnVuY3Rpb24gKHBhdGgsIGF0LCBtdCkge1xuICAgICAgdmFyIGZkID0gZnMub3BlblN5bmMocGF0aCwgY29uc3RhbnRzLk9fU1lNTElOSylcbiAgICAgIHZhciByZXRcbiAgICAgIHZhciB0aHJldyA9IHRydWVcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGZzLmZ1dGltZXNTeW5jKGZkLCBhdCwgbXQpXG4gICAgICAgIHRocmV3ID0gZmFsc2VcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmICh0aHJldykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgZnMubHV0aW1lcyA9IGZ1bmN0aW9uIChfYSwgX2IsIF9jLCBjYikgeyBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpIH1cbiAgICBmcy5sdXRpbWVzU3luYyA9IGZ1bmN0aW9uICgpIHt9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2htb2RGaXggKG9yaWcpIHtcbiAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgbW9kZSwgY2IpIHtcbiAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG1vZGUsIGZ1bmN0aW9uIChlcikge1xuICAgICAgaWYgKGNob3duRXJPayhlcikpIGVyID0gbnVsbFxuICAgICAgaWYgKGNiKSBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaG1vZEZpeFN5bmMgKG9yaWcpIHtcbiAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgbW9kZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG1vZGUpXG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIGlmICghY2hvd25Fck9rKGVyKSkgdGhyb3cgZXJcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjaG93bkZpeCAob3JpZykge1xuICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCB1aWQsIGdpZCwgY2IpIHtcbiAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIHVpZCwgZ2lkLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgIGlmIChjaG93bkVyT2soZXIpKSBlciA9IG51bGxcbiAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hvd25GaXhTeW5jIChvcmlnKSB7XG4gIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHVpZCwgZ2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgdWlkLCBnaWQpXG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIGlmICghY2hvd25Fck9rKGVyKSkgdGhyb3cgZXJcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdGF0Rml4IChvcmlnKSB7XG4gIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgTm9kZSBlcnJvbmVvdXNseSByZXR1cm5lZCBzaWduZWQgaW50ZWdlcnMgZm9yXG4gIC8vIHVpZCArIGdpZC5cbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCBmdW5jdGlvbiAoZXIsIHN0YXRzKSB7XG4gICAgICBpZiAoIXN0YXRzKSByZXR1cm4gY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgaWYgKHN0YXRzLnVpZCA8IDApIHN0YXRzLnVpZCArPSAweDEwMDAwMDAwMFxuICAgICAgaWYgKHN0YXRzLmdpZCA8IDApIHN0YXRzLmdpZCArPSAweDEwMDAwMDAwMFxuICAgICAgaWYgKGNiKSBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzdGF0Rml4U3luYyAob3JpZykge1xuICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gIC8vIE9sZGVyIHZlcnNpb25zIG9mIE5vZGUgZXJyb25lb3VzbHkgcmV0dXJuZWQgc2lnbmVkIGludGVnZXJzIGZvclxuICAvLyB1aWQgKyBnaWQuXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIHN0YXRzID0gb3JpZy5jYWxsKGZzLCB0YXJnZXQpXG4gICAgaWYgKHN0YXRzLnVpZCA8IDApIHN0YXRzLnVpZCArPSAweDEwMDAwMDAwMFxuICAgIGlmIChzdGF0cy5naWQgPCAwKSBzdGF0cy5naWQgKz0gMHgxMDAwMDAwMDBcbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cblxuLy8gRU5PU1lTIG1lYW5zIHRoYXQgdGhlIGZzIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgb3AuIEp1c3QgaWdub3JlXG4vLyB0aGF0LCBiZWNhdXNlIGl0IGRvZXNuJ3QgbWF0dGVyLlxuLy9cbi8vIGlmIHRoZXJlJ3Mgbm8gZ2V0dWlkLCBvciBpZiBnZXR1aWQoKSBpcyBzb21ldGhpbmcgb3RoZXJcbi8vIHRoYW4gMCwgYW5kIHRoZSBlcnJvciBpcyBFSU5WQUwgb3IgRVBFUk0sIHRoZW4ganVzdCBpZ25vcmVcbi8vIGl0LlxuLy9cbi8vIFRoaXMgc3BlY2lmaWMgY2FzZSBpcyBhIHNpbGVudCBmYWlsdXJlIGluIGNwLCBpbnN0YWxsLCB0YXIsXG4vLyBhbmQgbW9zdCBvdGhlciB1bml4IHRvb2xzIHRoYXQgbWFuYWdlIHBlcm1pc3Npb25zLlxuLy9cbi8vIFdoZW4gcnVubmluZyBhcyByb290LCBvciBpZiBvdGhlciB0eXBlcyBvZiBlcnJvcnMgYXJlXG4vLyBlbmNvdW50ZXJlZCwgdGhlbiBpdCdzIHN0cmljdC5cbmZ1bmN0aW9uIGNob3duRXJPayAoZXIpIHtcbiAgaWYgKCFlcilcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGlmIChlci5jb2RlID09PSBcIkVOT1NZU1wiKVxuICAgIHJldHVybiB0cnVlXG5cbiAgdmFyIG5vbnJvb3QgPSAhcHJvY2Vzcy5nZXR1aWQgfHwgcHJvY2Vzcy5nZXR1aWQoKSAhPT0gMFxuICBpZiAobm9ucm9vdCkge1xuICAgIGlmIChlci5jb2RlID09PSBcIkVJTlZBTFwiIHx8IGVyLmNvZGUgPT09IFwiRVBFUk1cIilcbiAgICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9ncmFjZWZ1bC1mcy9wb2x5ZmlsbHMuanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgLCBsc3RhdCA9IGZzLmxzdGF0U3luYztcblxuZXhwb3J0cy5yZWFkbGlua1N5bmMgPSBmdW5jdGlvbiAocCkge1xuICBpZiAobHN0YXQocCkuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgIHJldHVybiBmcy5yZWFkbGlua1N5bmMocCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHA7XG4gIH1cbn07XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2dyYWNlZnVsLXJlYWRsaW5rL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgYW5zaVJlZ2V4ID0gcmVxdWlyZSgnYW5zaS1yZWdleCcpO1xudmFyIHJlID0gbmV3IFJlZ0V4cChhbnNpUmVnZXgoKS5zb3VyY2UpOyAvLyByZW1vdmUgdGhlIGBnYCBmbGFnXG5tb2R1bGUuZXhwb3J0cyA9IHJlLnRlc3QuYmluZChyZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaGFzLWFuc2kvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBfZnNcbnRyeSB7XG4gIF9mcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbn0gY2F0Y2ggKF8pIHtcbiAgX2ZzID0gcmVxdWlyZSgnZnMnKVxufVxuXG5mdW5jdGlvbiByZWFkRmlsZSAoZmlsZSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0ge2VuY29kaW5nOiBvcHRpb25zfVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGZzID0gb3B0aW9ucy5mcyB8fCBfZnNcblxuICB2YXIgc2hvdWxkVGhyb3cgPSB0cnVlXG4gIC8vIERPIE5PVCBVU0UgJ3Bhc3NQYXJzaW5nRXJyb3JzJyBUSEUgTkFNRSBXSUxMIENIQU5HRSEhISwgdXNlICd0aHJvd3MnIGluc3RlYWRcbiAgaWYgKCdwYXNzUGFyc2luZ0Vycm9ycycgaW4gb3B0aW9ucykge1xuICAgIHNob3VsZFRocm93ID0gb3B0aW9ucy5wYXNzUGFyc2luZ0Vycm9yc1xuICB9IGVsc2UgaWYgKCd0aHJvd3MnIGluIG9wdGlvbnMpIHtcbiAgICBzaG91bGRUaHJvdyA9IG9wdGlvbnMudGhyb3dzXG4gIH1cblxuICBmcy5yZWFkRmlsZShmaWxlLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICAgIGRhdGEgPSBzdHJpcEJvbShkYXRhKVxuXG4gICAgdmFyIG9ialxuICAgIHRyeSB7XG4gICAgICBvYmogPSBKU09OLnBhcnNlKGRhdGEsIG9wdGlvbnMgPyBvcHRpb25zLnJldml2ZXIgOiBudWxsKVxuICAgIH0gY2F0Y2ggKGVycjIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICBlcnIyLm1lc3NhZ2UgPSBmaWxlICsgJzogJyArIGVycjIubWVzc2FnZVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyMilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBudWxsKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGxiYWNrKG51bGwsIG9iailcbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEZpbGVTeW5jIChmaWxlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0ge2VuY29kaW5nOiBvcHRpb25zfVxuICB9XG5cbiAgdmFyIGZzID0gb3B0aW9ucy5mcyB8fCBfZnNcblxuICB2YXIgc2hvdWxkVGhyb3cgPSB0cnVlXG4gIC8vIERPIE5PVCBVU0UgJ3Bhc3NQYXJzaW5nRXJyb3JzJyBUSEUgTkFNRSBXSUxMIENIQU5HRSEhISwgdXNlICd0aHJvd3MnIGluc3RlYWRcbiAgaWYgKCdwYXNzUGFyc2luZ0Vycm9ycycgaW4gb3B0aW9ucykge1xuICAgIHNob3VsZFRocm93ID0gb3B0aW9ucy5wYXNzUGFyc2luZ0Vycm9yc1xuICB9IGVsc2UgaWYgKCd0aHJvd3MnIGluIG9wdGlvbnMpIHtcbiAgICBzaG91bGRUaHJvdyA9IG9wdGlvbnMudGhyb3dzXG4gIH1cblxuICB2YXIgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlLCBvcHRpb25zKVxuICBjb250ZW50ID0gc3RyaXBCb20oY29udGVudClcblxuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGNvbnRlbnQsIG9wdGlvbnMucmV2aXZlcilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICBlcnIubWVzc2FnZSA9IGZpbGUgKyAnOiAnICsgZXJyLm1lc3NhZ2VcbiAgICAgIHRocm93IGVyclxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZUZpbGUgKGZpbGUsIG9iaiwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIHZhciBzcGFjZXMgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucyAhPT0gbnVsbFxuICAgID8gJ3NwYWNlcycgaW4gb3B0aW9uc1xuICAgID8gb3B0aW9ucy5zcGFjZXMgOiB0aGlzLnNwYWNlc1xuICAgIDogdGhpcy5zcGFjZXNcblxuICB2YXIgc3RyID0gJydcbiAgdHJ5IHtcbiAgICBzdHIgPSBKU09OLnN0cmluZ2lmeShvYmosIG9wdGlvbnMgPyBvcHRpb25zLnJlcGxhY2VyIDogbnVsbCwgc3BhY2VzKSArICdcXG4nXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChjYWxsYmFjaykgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbClcbiAgfVxuXG4gIGZzLndyaXRlRmlsZShmaWxlLCBzdHIsIG9wdGlvbnMsIGNhbGxiYWNrKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZpbGVTeW5jIChmaWxlLCBvYmosIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGZzID0gb3B0aW9ucy5mcyB8fCBfZnNcblxuICB2YXIgc3BhY2VzID0gdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIG9wdGlvbnMgIT09IG51bGxcbiAgICA/ICdzcGFjZXMnIGluIG9wdGlvbnNcbiAgICA/IG9wdGlvbnMuc3BhY2VzIDogdGhpcy5zcGFjZXNcbiAgICA6IHRoaXMuc3BhY2VzXG5cbiAgdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KG9iaiwgb3B0aW9ucy5yZXBsYWNlciwgc3BhY2VzKSArICdcXG4nXG4gIC8vIG5vdCBzdXJlIGlmIGZzLndyaXRlRmlsZVN5bmMgcmV0dXJucyBhbnl0aGluZywgYnV0IGp1c3QgaW4gY2FzZVxuICByZXR1cm4gZnMud3JpdGVGaWxlU3luYyhmaWxlLCBzdHIsIG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIHN0cmlwQm9tIChjb250ZW50KSB7XG4gIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSBKU09OLnBhcnNlIHdvdWxkIGNvbnZlcnQgaXQgdG8gYSB1dGY4IHN0cmluZyBpZiBlbmNvZGluZyB3YXNuJ3Qgc3BlY2lmaWVkXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY29udGVudCkpIGNvbnRlbnQgPSBjb250ZW50LnRvU3RyaW5nKCd1dGY4JylcbiAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvXlxcdUZFRkYvLCAnJylcbiAgcmV0dXJuIGNvbnRlbnRcbn1cblxudmFyIGpzb25maWxlID0ge1xuICBzcGFjZXM6IG51bGwsXG4gIHJlYWRGaWxlOiByZWFkRmlsZSxcbiAgcmVhZEZpbGVTeW5jOiByZWFkRmlsZVN5bmMsXG4gIHdyaXRlRmlsZTogd3JpdGVGaWxlLFxuICB3cml0ZUZpbGVTeW5jOiB3cml0ZUZpbGVTeW5jXG59XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbmZpbGVcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uZmlsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFuc2lSZWdleCA9IHJlcXVpcmUoJ2Fuc2ktcmVnZXgnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnID8gc3RyLnJlcGxhY2UoYW5zaVJlZ2V4LCAnJykgOiBzdHI7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0cmlwLWFuc2kvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQ2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcbnZhciBhcmd2ID0gcHJvY2Vzcy5hcmd2O1xuXG52YXIgdGVybWluYXRvciA9IGFyZ3YuaW5kZXhPZignLS0nKTtcbnZhciBoYXNGbGFnID0gZnVuY3Rpb24gKGZsYWcpIHtcblx0ZmxhZyA9ICctLScgKyBmbGFnO1xuXHR2YXIgcG9zID0gYXJndi5pbmRleE9mKGZsYWcpO1xuXHRyZXR1cm4gcG9zICE9PSAtMSAmJiAodGVybWluYXRvciAhPT0gLTEgPyBwb3MgPCB0ZXJtaW5hdG9yIDogdHJ1ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cdGlmICgnRk9SQ0VfQ09MT1InIGluIHByb2Nlc3MuZW52KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoaGFzRmxhZygnbm8tY29sb3InKSB8fFxuXHRcdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZmFsc2UnKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdFx0aGFzRmxhZygnY29sb3JzJykgfHxcblx0XHRoYXNGbGFnKCdjb2xvcj10cnVlJykgfHxcblx0XHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKHByb2Nlc3Muc3Rkb3V0ICYmICFwcm9jZXNzLnN0ZG91dC5pc1RUWSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoJ0NPTE9SVEVSTScgaW4gcHJvY2Vzcy5lbnYpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmIChwcm9jZXNzLmVudi5URVJNID09PSAnZHVtYicpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoL15zY3JlZW58Xnh0ZXJtfF52dDEwMHxjb2xvcnxhbnNpfGN5Z3dpbnxsaW51eC9pLnRlc3QocHJvY2Vzcy5lbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn0pKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3VwcG9ydHMtY29sb3IvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNoaWxkX3Byb2Nlc3NcIlxuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29uc3RhbnRzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY29uc3RhbnRzXCJcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV2ZW50c1wiXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm9zXCJcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInN0cmVhbVwiXG4vLyBtb2R1bGUgaWQgPSA1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidXRpbFwiXG4vLyBtb2R1bGUgaWQgPSA1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXX0=