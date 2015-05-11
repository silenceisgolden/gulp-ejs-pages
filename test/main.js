var ejsBuilder = require('../');
var should = require('should');
var assert = require('stream-assert');
var gulp = require('gulp');
var debug = require('gulp-debug');

var src = {
  stream: ['./test/helpers/check.html'],
  single: ['./test/helpers/single/index.ejs'],
  error: ['./test/helpers/error/index.ejs']
};

describe('gulp-ejs-page-builder', function() {
  describe('meta', function() {

    it('should emit error on streamed file', function(done) {
      gulp.src( src.stream, { buffer: false })
        .pipe(ejsBuilder())
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });

  });
  describe('core', function() {

    it('should emit error on no JSON', function(done) {
      gulp.src( src.single )
        .pipe(ejsBuilder())
        .on('error', function(err) {
          err.message.should.startWith('Error reading JSON');
          done();
        })
    });

    it('should emit error on EJS error', function(done) {
      gulp.src( src.error )
        .pipe(ejsBuilder())
        .on('error', function(err) {
          done();
        });
    });

  });
});