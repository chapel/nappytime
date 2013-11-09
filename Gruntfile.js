var path = require('path');

module.exports = function (grunt) {

  var reactFiles = {};
  reactFiles[(__dirname + '/public/js/react')] = (__dirname + '/react/src');

  grunt.initConfig({
    bower: {
      install: {
        options: {
          verbose: true,
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
    },
    react: {
      app: {
        options: {
          extension: 'js',  // Default,
          ignoreMTime:  false // Default
        },
        files: reactFiles
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-react');
  //grunt.loadNpmTasks('grunt-browserify');
};