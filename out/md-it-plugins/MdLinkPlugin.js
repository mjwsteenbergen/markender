"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSpace(code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}
function normalizeReference(str) {
    // use .toUpperCase() instead of .toLowerCase()
    // here to avoid a conflict with Object.prototype
    // members (most notably, `__proto__`)
    return str.trim().replace(/\s+/g, ' ').toUpperCase();
}
module.exports = function linkDing(md, options) {
    md.renderer.rules.linker = linker;
    md.inline.ruler.after('escape', 'linker', linker);
};
function linker(state, silent) {
    var pos, res, token, max = state.posMax;
    var labelEnd = 0;
    var labelStart = 0;
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */) {
        return false;
    }
    labelStart = state.pos + 1;
    res = parseLinkName(state.src, state.pos, state.posMax);
    // parser failed to find ']', so it's not a valid link
    if (!res.ok) {
        return false;
    }
    pos = res.pos;
    // pos = res.pos + 1;
    if (pos < max && (state.src.charCodeAt(pos) === 0x28 /* ( */) || state.src.charCodeAt(pos) === 0x5B /*[*/ || state.src.charCodeAt(pos) === 0x3a) {
        return false;
    }
    if (pos + 1 < max && (state.src.charCodeAt(pos + 1) === 0x28 /* ( */) || state.src.charCodeAt(pos + 1) === 0x5B /*[*/) {
        return false;
    }
    //console.log(res.str + " | in | " + state.src);
    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        state.pos = labelStart;
        state.posMax = labelEnd;
        var links = res.str.split(',');
        links.forEach(element => {
            token = state.push('link_open', 'md-link', 1);
            token.attrs = [['link', element.trimLeft()]];
            var classe = "";
            if (links.indexOf(element) === 0) {
                classe = "first";
            }
            if (links.indexOf(element) === links.length - 1) {
                classe += " last";
            }
            if (classe !== "") {
                token.attrs.push(['class', classe]);
            }
            state.md.inline.tokenize(state);
            token = state.push('link_close', 'md-link', -1);
        });
    }
    state.pos = pos;
    state.posMax = max;
    return true;
}
function parseLinkName(str, pos, max) {
    var code, marker, lines = 0, start = pos, result = new Result();
    if (pos >= max) {
        return result;
    }
    if ((pos - 1 >= 0 && str.charCodeAt(pos - 1) === 0x2d) || ((pos - 2 >= 0 && str.charCodeAt(pos - 2) === 0x2d)) ||
        (pos - 1 >= 0 && str.charCodeAt(pos - 1) === 0x5d) || (pos - 2 >= 0 && str.charCodeAt(pos - 2) === 0x5d)) {
        return result;
    }
    marker = str.charCodeAt(pos);
    if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x5b /* [ */) {
        return result;
    }
    pos++;
    // if opening marker is "[", switch it to closing marker "]"
    if (marker === 0x5b) {
        marker = 0x5d;
    }
    while (pos < max) {
        code = str.charCodeAt(pos);
        if (code === marker) {
            result.pos = pos + 1;
            result.lines = lines;
            result.str = str.slice(start + 1, pos);
            if (result.str === "X" || result.str === "x" || result.str === " ") {
                //We are dealing with a TODO.
                return result;
            }
            result.ok = true;
            return result;
        }
        else if (code === 0x0A) {
            return result;
        }
        else if (code === 0x5C /* \ */ && pos + 1 < max) {
            pos++;
            if (str.charCodeAt(pos) === 0x0A) {
                return result;
            }
        }
        pos++;
    }
    return result;
}
class Result {
    constructor() {
        this.ok = false;
        this.pos = 0;
        this.lines = 0;
        this.str = '';
    }
}
//# sourceMappingURL=MdLinkPlugin.js.map