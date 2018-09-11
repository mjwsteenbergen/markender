export class MdStyle extends HTMLElement {
    
    connectedCallback() {
        var s = document.getElementById("default-styles");
        if (s !== null) {
            s.remove();
        }

        document.querySelectorAll("style").forEach(i => {
            if (i.innerHTML.includes(".vscode")) {
                i.remove();
            }
        });

        var name = this.getAttribute("name");

        document.body.className = "scrollBeyondLastLine wordWrap showEditorSelection " + name;
    }
}