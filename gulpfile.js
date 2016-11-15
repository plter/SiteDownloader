/**
 * Created by plter on 2016/11/15.
 */

const gulp = require("gulp");
const webpack = require("gulp-webpack");

gulp.task("copy_html_files", function () {
    gulp.src("src/**/*.html").pipe(gulp.dest("build"));
});

gulp.task("copy_package_json", function () {
    gulp.src("src/package.json").pipe(gulp.dest("build"));
});

gulp.task("compile_index", function () {
    gulp.src("src/index/index.js").pipe(webpack({
        output: {
            filename: "index/index.js"
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel', // 'babel-loader' is also a valid name to reference
                    query: {
                        presets: ['es2017']
                    }
                }
            ],
        },
        externals: {
            electron: "require('electron')",
            path: "require('path')",
            fs: "require('fs')",
            url: "require('url')"
        }
    })).pipe(gulp.dest("build"));
});

gulp.task("copy_main_js", function () {
    gulp.src("src/main.js").pipe(gulp.dest("build"));
});

gulp.task("default", ["copy_package_json", "copy_html_files", "copy_main_js", "compile_index"]);