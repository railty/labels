'use strict'
const bwipjs = require('bwip-js');
const drawsvg = require('./drawing-svg');

class Code {
    static create(opts) {
        bwipjs.fixupOptions(opts);
        let svg = bwipjs.render(opts, drawsvg(opts, bwipjs.FontLib));
        return svg;
    }    
}

module.exports = Code
