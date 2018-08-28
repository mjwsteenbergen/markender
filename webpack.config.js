const path = require('path');

module.exports = {
    entry: './out/components/base.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
