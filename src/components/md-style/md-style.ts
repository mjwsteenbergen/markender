export class MdStyle extends HTMLElement {
    
    connectedCallback() {
        var name = this.getAttribute("name");
        document.body.className = name;
    }
}