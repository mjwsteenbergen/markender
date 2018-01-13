var thisDoc = document.currentScript.ownerDocument;

    // Gets content from <template>.

var template = thisDoc.querySelector("template").content;

class StyleChooser extends HTMLElement{
    template: HTMLTemplateElement = document.createElement('template');

    constructor() {
        super();
    }

    connectedCallback() {
        var clone = document.importNode(template, true );
        let selector = clone.querySelector('select')
        let doc = document;
        selector.addEventListener('change', i => {
            let done = false;
            Array.from(document.querySelectorAll('link')).forEach(i => {
                if(!i.getAttribute('href').endsWith("/basic.css") && i.getAttribute('href').startsWith("./"))
                {
                    i.setAttribute("href", "./static/css/" + (selector.selectedOptions[0] as HTMLOptionElement).value + ".css");
                    done = true;
                }
            });
            console.log((selector.selectedOptions[0] as HTMLOptionElement).value);
        }); 
        this.appendChild(clone);
    }
}

window.customElements.define('stl-chooser', StyleChooser);