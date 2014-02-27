module.exports = function(grunt){
    //Project config
    grunt.initConfig({
        // Read in the "package.json" file so we can access the name and version.
        pkg: grunt.file.readJSON('package.json'),
        env: grunt.file.readJSON('environment.json'),


        /*
            Directory to which we through our compiled project files during development.
            This is so we can view the site without needing a server. All we have to do
            is double click or drag index.html into the browser and we can see our changes.
        */
        devDir: 'dev',
        prodDir: 'prod',


        /*
            The banner is the comment that is placed at the top of our compiled source
            files. It is first processed as a Grunt template, where the '<%=' pairs
            are evaluating objects from the 'package.json' file.
        */
        meta:{
            banner:
                '/*\n' +
                '   Project: <%= pkg.title || pkg.name %>\n' +
                '   Version: <%= pkg.version %>\n' +
                '   Created by: <%= pkg.author %>, <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '   Website: <%= pkg.homepage %>\n' +
                '\n' +
                '   Copyright (c) <%= grunt.template.today("yyyy") %> <%=  pkg.author %>\n' +
                '*/\n'
        },


        /*
            This is a collection of file definitions we use in the configuration of
            build tasks.

            "js": All project javascript files.
            "appHtmlTpl": All app html template files.
            "cmnHtmlTpl": All common app template files.
            "html": Our main html file.
            "sass": Our main scss file.
        */
        src:{
            js: ['src/**/*.js', '!src/**/*.spec.js'],
            appHtmlTpl: ['src/app/**/*.tpl.html'],
            cmnHtmlTpl: ['src/common/**/*.tpl.html'],
            html2js: ['<%= devDir %>/tpl/*.js'],
            html: 'src/index.html',
            sass: 'src/sass/main.scss'
        },


        /*
            This is also a collection of file definitions we use in the
            configuration of build tasks, but it differs from the `src` property in
            that these values are entirely user-defined. While the `src` property
            ensures all standardized files are collected for compilation, it is the
            user's job to ensure non-standardized (i.e. vendor-related) files are
            handled appropriately.

            The `vendor.js` property holds files to be automatically concatenated
            and minified with our project source files and appended to the '<body>'
            as to let the page load before running any js.

            The 'vendor.jsHead property holds files to be automatically concatenated
            and minified but will be placed in the '<head>' of the html doc.
        */
        vendor:{
            js: [
                'vendor/angular/angular.js',
                'vendor/angular-ui-router/release/angular-ui-router.js'
            ],
            jsHead: [
                'vendor/modernizr/modernizr.js'
            ]
        },


        // The directory to delete when `grunt clean` is executed.
        clean: {
            dev: ['<%= devDir %>'],
            prod: ['<%= prodDir %>']
        },


        /*
            The 'app' target is the concatenation of our application source code
            into a single file. All files matching what's in the 'src.js' configuration
            property above will included in the final build.

            In addition, the source is surrounded in the blocks specified in the
            `module.prefix` and `module.suffix` files, which are just run blocks
            to ensure nothing pollutes the global scope.

            The `options` array allows us to specify some customization for this
            operation. In this case, we are adding a banner to the top of the file,
            based on the above definition of `meta.banner`. This is simply a
            comment with copyright information.
        */
        concat:{
            dev:{
                options: {
                    banner: '<%= meta.banner %>'
                },

                files:{
                    '<%= devDir %>/js/<%= pkg.name %>.js': ['module.prefix', '<%= src.js %>', '<%= src.html2js %>', 'module.suffix'],
                    '<%= devDir %>/js/libs.js': ['<%= vendor.js %>'],
                    '<%= devDir %>/js/jsHead.js': ['vendor.jsHead']
                }
            },

            prod:{
                options: {
                    banner: '<%= meta.banner %>'
                },

                files:{
                    '<%= prodDir %>/js/<%= pkg.name %>.js': ['module.prefix', '<%= src.js %>', '<%= src.html2js %>', 'module.suffix'],
                    '<%= prodDir %>/js/libs.js': ['<%= vendor.js %>'],
                    '<%= prodDir %>/js/jsHead.js': ['vendor.jsHead']
                }
            }
        },


        // Minification
        uglify:{
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },

            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },


        /*
            "jshint" defines the rules of our linter as well as which files we
            should check. This file, all javascript sources, and all our unit
            tests are linted based on the policies listed in "options". We can
            also specify exclusionary patterns by prefixing them with an exclamation
            point (!). This is useful when code comes from a third party but is
            nonetheless inside "src/".
        */
        jshint:{
            src:[
                'Gruntfile.js',
                '<%= src.js %>',
                '!src/components/placeholders/**/*'
            ],
            gruntfile:[
                'Gruntfile.js'
            ],
            test:[
                '<%= src.unit %>'
            ],
            options:{
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            },
            globals: {}
        },


        /*
            HTML2JS takes all of your template files places them into JavaScript files as
            strings that are added to AngularJS's template cache. This means that the templates
            too become part of the initial payload as one JavaScript file. Neat!
        */
        html2js:{
            dev:{
                files: [
                    {
                        src:['<%= src.appHtmlTpl %>'],
                        base: 'src/app',
                        dest: 'dev/tpl/app.js',
                        module: 'app-html-templates'
                    },
                    {
                        src:['<%= src.cmnHtmlTpl %>'],
                        base: 'src/app',
                        dest: 'dev/tpl/common.js',
                        module: 'common-html-templates'
                    }
                ]
            },

            prod:{
                files: [
                    {
                        src:['<%= src.appHtmlTpl %>'],
                        base: 'src/app',
                        dest: 'prod/tpl/app.js',
                        module: 'app-html-templates'
                    },
                    {
                        src:['<%= src.cmnHtmlTpl %>'],
                        base: 'src',
                        dest: 'prod/tpl/common.js',
                        module: 'common-html-templates'
                    }
                ]
            }
        },


        /*
            Compiles our scss files into css files used in our html doc. This is based on
            the environment set in "environment.json".
        */
        sass:{
            dev:{
                files:{
                    'src/assets/css/main.css': 'src/sass/main.scss'
                },
                options:{
                    style: 'expanded'
                }
            },
            prod:{
                files:{
                    'src/assets/css/main.css': 'src/sass/main.scss'
                },
                options:{
                    style: 'compressed'
                }
            }
        },



        /*
            `grunt copy` just copies files from A to B. We use it here to copy our
            project assets (images, fonts, etc.) into our distribution directory.
        */
        copy: {
            dev: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= devDir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            },

            prod:{
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= prodDir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            }
        },


        /*
            For rapid development we have a watch set up to check if any of the files
            listed below have changed. If so then execute the listed task. This saves
            us from having to type "grunt" into the command-line every time we make a
            change in our app. All we have to do is type "grunt watch" once in the
            command-line and it will run in the background.
        */
        delta: {
            /*
                By default, we want the Live Reload to work for all tasks. This is overridden
                in some tasks (like this file) where browser resources are unaffected. It runs
                by default on port 35729, which your browser plugin should auto-detect.
            */
            options: {
                livereload: true
            },


            /*
                When the Gruntfile changes, we just want to lint it. That said, the watch will have
                to be restarted if you want it to take advantage of the changes.
            */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },


            // Compiles the css from scss files.
            sassBuild: {
                files: 'src/sass/*.scss',
                tasks: ['sassCompile:dev']
            },


            /*
                When the 'index.html' file changes, run the 'index' task to copy and
                compile it to the 'dev' dir.
            */
            html:{
                files: ['<%= src.html %>'],
                tasks: ['index:dev']
            },


            tpls:{
                files:[
                    '<%= src.appHtmlTpl %>',
                    '<%= src.cmnHtmlTpl %>'
                ],
                tasks:[
                    'html2js:dev',
                    'concat:dev'
                ]
            },


            /*
                When assets are changed, copy them. Not that this will 'not' copy new files
                added.

                Note: Probably not very usefull. will have to look into something different.
            */
            assets:{
                files: [
                    'src/assets/**/*'
                ],
                tasks: ['copy:dev']
            },


            /*
                When our source files change we want to run most of our build tasks
            */
            src:{
                files:[
                    '<%= src.js %>'
                ],
                tasks: [
                    'jshint:src',
                    'concat:dev:app'
                ]
            }
        }
    });


    /*
        Loads in the necessary Grunt tasks. These should be installed based on the
        versions listed in "package.json" when you do "npm install" in this
        directory.
    */
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');


    /*
        In order to make it safe to just compile or copy *only* what was changed,
        we need to ensure we are starting from a clean, fresh build. So we rename
        the `watch` task to `delta` (that's why the configuration var above is
        `delta`) and then add a new task called `watch` that does a clean build
        before watching for changes.
    */
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', [ 'default', 'delta' ] );


    //Default task(s). These tasks are run when you type 'grunt watch' in your console.
    grunt.registerTask('default', ['buildDev']);
    grunt.registerTask('buildDev', ['clean:dev', 'html2js:dev', 'concat:dev', 'index:dev', 'copy:dev']);


    //Production build task
    grunt.registerTask('buildProd', ['clean:prod', 'html2js:prod', 'concat:prod', 'index:prod', 'copy:prod']);


    // Task for building sass files based on environment setting in "environment.json".
    grunt.registerTask('sassCompile', 'Compiling Sass files', function(env){
        grunt.log.writeln('Current environment: ' + env);

        if(env === 'dev'){
            grunt.task.run('sass:dev');
        }else{
            grunt.task.run('sass:prod');
        }
    });


    /*
        The index.html template includes the stylesheet and hjavascript sources
        based on dynamic names clalculated in this Gruntfile. This task compiles is.
    */
    grunt.registerTask('index', 'Process index.html template', function(env){
        grunt.log.writeln('Environment: ' + env);

        if(env === 'dev'){
            grunt.file.copy('src/index.html', 'dev/index.html', {
                process: grunt.template.process
            });
        }else{
            grunt.file.copy('src/index.html', 'prod/index.html', {
                process: grunt.template.process
            });
        }

    });
};