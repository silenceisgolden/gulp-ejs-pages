## Information

<table>
<tr>
  <td>Package</td><td>gulp-ejs-pages</td>
</tr>
<tr>
  <td>Node Version</td><td>>= 0.10</td>
</tr>
</table>

## Description

This gulp plugin aims to take a tree of folders with EJS and JSON files and turn it into the same folder structure with HTML files.

## Usage

```js
// ... other requires
var ejsPages = require('gulp-ejs-pages');

gulp.task('html', function() {
  return gulp.src('./pages/**/*.ejs')
    .pipe(ejsPages())
    .pipe(gulp.dest('./www/'));
});
```
