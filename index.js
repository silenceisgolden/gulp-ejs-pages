// Copyright (c) 2015 AJ Klein

'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs');
var fs = require('fs');

function quickclone( obj ) {
  return JSON.parse( JSON.stringify( obj ) );
}

function merge( base, second ) {
  var obj = quickclone( base );
  var m = quickclone( second );
  for( var key in m ) {
    obj[key] = m[key];
  }
  return obj;
}

module.exports = function( options, settings ) {

  settings = settings || {};
  options = options || {};
  // set to HTML so we have something at the very least
  settings.ext = typeof settings.ext === 'undefined' ? '.html' : settings.ext;

  return through.obj( function( file, enc, cb ) {

    if( file.isNull() ) {
      cb();
      return;
    }

    if( file.isStream() ) {
      this.emit(
        'error',
        new gutil.PluginError('gulp-ejs-pages', 'Streaming not supported' )
      );
      cb();
      return;
    }

    // create file path for page JSON file
    var s = file.path.split('/');
    s[s.length-1] = 'page.json';
    var config;

    try {
      config = JSON.parse( fs.readFileSync( s.join('/'), 'utf8' ) );
    } catch( err ) {
      // gutil.log( 'Error reading JSON for ' + file.path + ', skipping' );
      this.emit('error', new gutil.PluginError( 'gulp-ejs-pages', 'Error reading JSON for ' + file.path + ', skipping' ));
      config = null;
    }

    // use config to parse EJS
    if( config ) {

      var locals = merge( options, config );
      locals.filename = file.path;

      try {
        file.contents = new Buffer( ejs.render( file.contents.toString(), locals ));
        file.path = gutil.replaceExtension( file.path, settings.ext );
      } catch( err ) {
        this.emit('error', new gutil.PluginError( 'gulp-ejs-pages', err.toString() ));
      }

    } else {

      // no config but we still want to switch files to HTML (experimental)
      file.path = gutil.replaceExtension( file.path, settings.ext );

    }

    // no matter what push the file
    this.push(file);

    cb();
  });

}
