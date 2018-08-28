export interface State {
    src: string;
    env: any;
    md: any;
    tokens: any;

    pos: number;
    posMax: number;
    level: number;
    pending: string;
    pendingLevel: number;
    cache: any;        // Stores { start: end } pairs. Useful for backtrack
    // optimization of pairs parse (emphasis, strikes).
    delimiters: string[]; // Emphasis-like delimiters

    push(a: string, b: string, c: number): Token;
}

export interface Token {
    attrs: string[][];
    block: boolean;
    children: Token[];
    content: string;
    hidden: boolean;
    info: string;
    level: number;
    map: number[];
    markup: string;
    meta: any;
    nesting: number;
    tag: string;
    type: string;

    attrIndex(attrName: string): number;
    attrJoin(name: string, value: string): void;
    attrPush(attr: string[]): void;
    attrSet(name: string, value: string): void;
}

export interface MarkdownIt {
    renderer: {
        rules: {
            linker: (state: State, silent: boolean) => boolean;
            mdimage: (state: State, silent: boolean) => boolean;
        };
    };
    inline: {
        ruler: {
            after: (arg0: string, arg1: string, arg2: (state: State, silent: boolean) => boolean) => void;
        };
    };
}