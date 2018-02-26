const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = !process.env.production;
const assetsPath = path.join(__dirname, '/public');
const SpritesmithPlugin = require('webpack-spritesmith');
const autoprefixer = require('autoprefixer');
const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: isDevelopment
});


const config = {
    entry: {
        main: './src/js/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }]
        }, {
            test: /\.scss$/,
            exclude: [/node_modules/],
            use: extractSass.extract({
                fallback: 'style-loader',
                //resolve-url-loader may be chained before sass-loader if necessary
                use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: !isDevelopment
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 8', 'last 4 version']
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    'resolve-url-loader',
                    'sass-loader'
                ]
            })
        }, {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name][hash].[ext]'
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 70
                        }
                    }
                },
            ],
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name][hash].[ext]'
                }
            },
        }]
    },
    plugins: [
        require('autoprefixer'),
	new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/ico'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'src/images/sprite.png'),
                css: path.resolve(__dirname, 'src/sass/sprite.scss')
            },
            apiOptions: {
                cssImageRef: "../images/sprite.png"
            }
        }),
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        extractSass
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 9000
    }
};

if (isDevelopment) {
    fs.readdirSync(assetsPath)
        .map((fileName) => {
            if (['.css', '.js'].includes(path.extname(fileName))) {
                return fs.unlinkSync(`${assetsPath}/${fileName}`);
            }

            return '';
        });
} else {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

module.exports = config;