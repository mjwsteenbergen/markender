'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "markender" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    return {
        extendMarkdownIt(md) {
            return md
                .use(require('./md-it-plugins/ImagePlugin'))
                .use(require('./md-it-plugins/MdLinkPlugin'))
                .use(require('./md-it-plugins/FormulaPlugin'))
                .use(require('markdown-it-enml-todo'));
        }
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map