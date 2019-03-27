const path = require('path');

module.exports = {
    entry: './app/plugins/spreadjs/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './')
    },
    mode: "development",
    optimization: {
        minimize: false
    }
}