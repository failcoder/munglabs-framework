module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceMap: true,
        },
        files: {
          'css/munglabs.css': 'scss/munglabs.scss'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      basic: {
        src: [
          'js/vendor/foundation/foundation.js',
          'js/vendor/foundation/foundation.abide.js',
          'js/vendor/foundation/foundation.accordion.js',
          'js/vendor/foundation/foundation.alert.js',
          'js/vendor/foundation/foundation.clearing.js',
          'js/vendor/foundation/foundation.dropdown.js',
          'js/vendor/foundation/foundation.equalizer.js',
          'js/vendor/foundation/foundation.interchange.js',
          'js/vendor/foundation/foundation.joyride.js',
          'js/vendor/foundation/foundation.magellan.js',
          'js/vendor/foundation/foundation.offcanvas.js',
          'js/vendor/foundation/foundation.orbit.js',
          'js/vendor/foundation/foundation.reveal.js',
          'js/vendor/foundation/foundation.slider.js',
          'js/vendor/foundation/foundation.tab.js',
          'js/vendor/foundation/foundation.tooltip.js',
          'js/vendor/foundation/foundation.topbar.js'
        ],
        dest: 'js/<%= pkg.name %>.js'
      },
      // extras: {
      //   src: [
      //     'src/plugin-<%= pkg.name %>-formulated.js'
      //   ],
      //   dest: 'js/<%= pkg.name %>-plugins.js'
      // }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'js/<%= pkg.name %>.min.js': ['<%= concat.basic.dest %>'],
          //'js/<%= pkg.name %>-plugins.min.js': ['<%= concat.extras.dest %>']
        }
      }
    },
    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
  // grunt.registerTask('test', ['jshint', 'qunit']);
  // grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

  grunt.registerTask('default', ['concat', 'uglify']);
};
