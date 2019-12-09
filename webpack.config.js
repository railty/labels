const path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const isDev = true;

module.exports = {
    entry : './editor/index.js',
    output : {
        path : path.resolve(__dirname , 'public'),
        filename: 'js/editor_bundle.js'
    },
    module : {
        rules : [
                    {
                        test: /\.module\.s(a|c)ss$/,
                        loader: [
                            isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true,
                                    sourceMap: isDev
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: isDev
                                }
                            }
                        ]
                    },
                    {
                        test: /\.s(a|c)ss$/,
                        exclude: /\.module.(s(a|c)ss)$/,
                        loader: [
                            isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: isDev
                                }
                            }
                        ]
                    },
                    {
                        test : /\.(js)$/, 
                        use: [{
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    "@babel/preset-env",
                                    "@babel/preset-react"
                                ],
                                plugins: [
                                    "@babel/plugin-syntax-dynamic-import",
                                    "@babel/plugin-proposal-class-properties",
                                    [require.resolve('babel-plugin-named-asset-import'),
                                    {
                                    loaderMap: {
                                        svg: {
                                        ReactComponent:
                                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                        },
                                    },
                                    }],
                
                                ]
                            }
                        }]},
                        {
                test : /\.css$/, 
                use:['style-loader', 'css-loader']
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 100000,
                    name: 'static/media/[name].[hash:8].[ext]',
                    esModule: false,
                },
            },
        ]
    },
    mode: isDev ? 'development' : 'production', 
    devtool: isDev ? 'source-map' : 'none',
    plugins : [
        new MiniCSSExtractPlugin({
            filename: isDev ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
        })        
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    }
}