/* start bibtexParse 0.0.22 */

//Original work by Henrik Muehe (c) 2010
//
//CommonJS port by Mikola Lysenko 2013
//
//Port to Browser lib by ORCID / RCPETERS
//
//Issues:
//no comment handling within strings
//no string concatenation
//no variable values yet
//Grammar implemented here:
//bibtex -> (string | preamble | comment | entry)*;
//string -> '@STRING' '{' key_equals_value '}';
//preamble -> '@PREAMBLE' '{' value '}';
//comment -> '@COMMENT' '{' value '}';
//entry -> '@' key '{' key ',' key_value_list '}';
//key_value_list -> key_equals_value (',' key_equals_value)*;
//key_equals_value -> key '=' value;
//value -> value_quotes | value_braces | key;
//value_quotes -> '"' .*? '"'; // not quite
//value_braces -> '{' .*? '"'; // not quite
export class BibtexParser {

    months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    notKey = [',', '{', '}', ' ', '='];
    pos = 0;
    input = "";
    entries = new Array<AbstractBibtexEntry>();

    currentEntry: BibtexEntry = new BibtexEntry();;

    setInput(t: string) {
        this.input = t;
    }

    getEntries() {
        return this.entries;
    }

    isWhitespace(s: string) {
        return (s === ' ' || s === '\r' || s === '\t' || s === '\n');
    }

    match(s: string, canCommentOut = true) {
        if (canCommentOut === undefined || canCommentOut === null) {
            canCommentOut = true;
        }
        this.skipWhitespace(canCommentOut);
        if (this.input.substring(this.pos, this.pos + s.length) === s) {
            this.pos += s.length;
        } else {
            throw new Error("Token mismatch, expected " + s + ", found " + this.input.substring(this.pos));
        }
        this.skipWhitespace(canCommentOut);
    }

    tryMatch(s: string, canCommentOut = true) {
        if (canCommentOut === undefined || canCommentOut === null) {
            canCommentOut = true;
        }
        this.skipWhitespace(canCommentOut);
        if (this.input.substring(this.pos, this.pos + s.length) === s) {
            return true;
        } else {
            return false;
        }
    }

    /* when search for a match all text can be ignored, not just white space */
    matchAt() {
        while (this.input.length > this.pos && this.input[this.pos] !== '@') {
            this.pos++;
        }

        if (this.input[this.pos] === '@') {
            return true;
        }
        return false;
    }

    skipWhitespace(canCommentOut: boolean) {
        while (this.isWhitespace(this.input[this.pos])) {
            this.pos++;
        }
        if (this.input[this.pos] === "%" && canCommentOut) {
            while (this.input[this.pos] !== "\n") {
                this.pos++;
            }
            this.skipWhitespace(canCommentOut);
        }
    }

    value_braces() {
        var bracecount = 0;
        this.match("{", false);
        var start = this.pos;
        var escaped = false;
        while (true) {
            if (!escaped) {
                if (this.input[this.pos] === '}') {
                    if (bracecount > 0) {
                        bracecount--;
                    } else {
                        var end = this.pos;
                        this.match("}", false);
                        return this.input.substring(start, end);
                    }
                } else if (this.input[this.pos] === '{') {
                    bracecount++;
                } else if (this.pos >= this.input.length - 1) {
                    throw new Error("Unterminated value");
                }
            }
            if (this.input[this.pos] === '\\' && escaped === false) {
                escaped = true;
            }
            else {
                escaped = false;
            }
            this.pos++;
        }
    }

    value_comment() {
        var str = '';
        var brcktCnt = 0;
        while (!(this.tryMatch("}", false) && brcktCnt === 0)) {
            str = str + this.input[this.pos];
            if (this.input[this.pos] === '{') {
                brcktCnt++;
            }
            if (this.input[this.pos] === '}') {
                brcktCnt--;
            }
            if (this.pos >= this.input.length - 1) {
                throw new Error("Unterminated value:" + this.input.substring(0));
            }
            this.pos++;
        }
        return str;
    }

    value_quotes() {
        this.match('"', false);
        var start = this.pos;
        var escaped = false;
        while (true) {
            if (!escaped) {
                if (this.input[this.pos] === '"') {
                    var end = this.pos;
                    this.match('"', false);
                    return this.input.substring(start, end);
                } else if (this.pos >= this.input.length - 1) {
                    throw new Error("Unterminated value:" + this.input.substring(start));
                }
            }
            if (this.input[this.pos] === '\\' && escaped === false) {
                escaped = true;
            }
            else {
                escaped = false;
            }
            this.pos++;
        }
    }

    single_value() {
        var start = this.pos;
        if (this.tryMatch("{")) {
            return this.value_braces();
        } else if (this.tryMatch('"')) {
            return this.value_quotes();
        } else {
            var k = this.key() || "";
            if (k.match("^[0-9]+$")) {
                return k;
            }
            else if (this.months.indexOf(k.toLowerCase()) >= 0) {
                return k.toLowerCase();
            }
            else {
                throw new Error("Value expected:" + this.input.substring(start) + ' for key: ' + k);
            }

        }
    }

    value() {
        var values = [];
        values.push(this.single_value());
        while (this.tryMatch("#")) {
            this.match("#");
            values.push(this.single_value());
        }
        return values.join("");
    }

    key(optional = false) {
        var start = this.pos;
        while (true) {
            if (this.pos >= this.input.length) {
                throw new Error("Runaway key");
            }
            // а-яА-Я is Cyrillic
            //console.log(this.input[this.pos]);
            if (this.notKey.indexOf(this.input[this.pos]) >= 0) {
                if (optional && this.input[this.pos] !== ',') {
                    this.pos = start;
                    return undefined;
                }
                return this.input.substring(start, this.pos);
            } else {
                this.pos++;
            }
        }
    }

    key_equals_value(): [string, string] {
        var key = this.key() || "";
        if (this.tryMatch("=")) {
            this.match("=");
            var val = this.value();
            return [key, val];
        } else {
            throw new Error("... = value expected, equals sign missing:"
                + this.input.substring(this.pos));
        }
    }

    key_value_list() {
        var kv = this.key_equals_value();
        this.currentEntry.entryTags[kv[0]] = kv[1];
        while (this.tryMatch(",")) {
            this.match(",");
            // fixes problems with commas at the end of a list
            if (this.tryMatch("}")) {
                break;
            }

            kv = this.key_equals_value();
            this.currentEntry['entryTags'][kv[0]] = kv[1];
        }
    }

    entry_body(d: string) {
        this.currentEntry = new BibtexEntry();
        this.currentEntry.citationKey = this.key(true) || "";
        this.currentEntry.entryType = d.substring(1);
        if (this.currentEntry.citationKey !== null) {
            this.match(",");
        }
        this.key_value_list();
        this.entries.push(this.currentEntry);
    }

    directive() {
        this.match("@");
        return "@" + this.key();
    }

    preamble() {
        let currentEntry = new BibtexEntryPreamble();
        currentEntry.entryType = 'PREAMBLE';
        currentEntry.entry = this.value_comment();
        this.entries.push(currentEntry);
    }

    comment() {
        let currentEntry = new BibtexEntryComment();
        currentEntry.entryType = 'COMMENT';
        currentEntry.entry = this.value_comment();
        this.entries.push(currentEntry);
    }

    entry(d: string) {
        this.entry_body(d);
    }

    alernativeCitationKey() {
        this.entries.forEach(function (entry) {
            if (entry instanceof BibtexEntry && !entry.citationKey && entry.entryTags) {
                entry.citationKey = '';
                if (entry.entryTags['author']) {
                    entry.citationKey += (entry.entryTags['author'] as string).split(',')[0] += ', ';
                }
                entry.citationKey += entry.entryTags['year'];
            }
        });
    }

    bibtex() {
        while (this.matchAt()) {
            var d = this.directive();
            this.match("{");
            if (d === "@PREAMBLE") {
                this.preamble();
            } else if (d === "@COMMENT") {
                this.comment();
            } else {
                this.entry(d);
            }
            this.match("}");
        }

        this.alernativeCitationKey();
    }

    toJSON(bibtex: string) {
        var b = new BibtexParser();
        b.setInput(bibtex);
        b.bibtex();
        return b.entries;
    }

    /* added during hackathon don't hate on me */
    toBibtex(json: any) {
        var out = '';
        for (var i in json) {
            out += "@" + json[i].entryType;
            out += '{';
            if (json[i].citationKey) {
                out += json[i].citationKey + ', ';
            }
            if (json[i].entry) {
                out += json[i].entry;
            }
            if (json[i].entryTags) {
                var tags = '';
                for (var jdx in json[i].entryTags) {
                    if (tags.length !== 0) {
                        tags += ', ';
                    }
                    tags += jdx + '= {' + json[i].entryTags[jdx] + '}';
                }
                out += tags;
            }
            out += '}\n\n';
        }
        return out;
    }
}

export class AbstractBibtexEntry {
    entryType!: string;
}

export class BibtexEntryComment extends AbstractBibtexEntry {
    entry!: string;

    constructor() {
        super();
        this.entryType = 'COMMENT';
    }
}

export class BibtexEntryPreamble extends AbstractBibtexEntry {
    entry!: string;

    constructor() {
        super();
        this.entryType = 'PREAMBLE';
    }
}

export class BibtexEntry extends AbstractBibtexEntry {
    citationKey!: string;
    entryTags: { [x: string]: string; } = {};
}