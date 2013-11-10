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
          extension: 'jsx',  // Default,
          ignoreMTime:  false // Default
        },
        files: reactFiles
      }
    },
    browserify: {
      client: {
        options: {
          debug: true
        },
        shim: {
        },
        files: {
          'public/js/main.js': ['client/*.js']
        }
      },
      components: {
        options: {
          debug: true,
          transform: [require('grunt-react').browserify]
        },
        files: {
          'public/js/components.js': ['react/src/*.jsx']
        }
      }
    },
    watch: {
      client: {
        files: ['client/*.js', 'react/**/*.jsx'],
        tasks: ['browserify'],
        options: {
          debounceDelay: 250
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          ignoredFiles: [
            'README.md', 'node_modules/**', 
            'public/**', 'bower_components/**',
            'client/**'
          ],
          watchedExtensions: ['js', 'hbs'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: '8000'
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
            logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['concurrent:dev']);

  grunt.registerTask('build', ['bower', 'browserify']);
};