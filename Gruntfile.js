var path = require('path');

module.exports = function (grunt) {

  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: './public',
          layout: function (type, component) {
            var renamedType = type;
            if (renamedType === 'js') {
              renamedType += '/vendor';
              return renamedType;
            }

            return path.join(renamedType, component);
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
};