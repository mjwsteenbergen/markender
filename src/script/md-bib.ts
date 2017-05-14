import { BibtexParser, AbstractBibtexEntry, BibtexEntry, BibtexEntryComment,BibtexEntryPreamble } from "./bibtexParse";

class Bibliography extends HTMLElement {
    bibtex: AbstractBibtexEntry[];
    src: string;
    format: string;
    searchElements: string[];
    // template = document.createElement('template')

        constructor() {
            super();
            this.searchElements = ["P", "H2"];
            this.format = null;
            this.bibtex = null;
            // this.template.innerHTML = `
            //     <h1>Bibliography</h1>
            // `
        }

        connectedCallback() {

            var bib = this;
            this.format = this.getAttribute("format") || "[{refnumber}]";
            this.src = this.getAttribute("src");

            document.addEventListener("DOMContentLoaded", function(event) {
                bib.startAlgorithm();
            });

            // this.appendChild(this.template);
            
        }

        startAlgorithm() {
            var httpRequest = new XMLHttpRequest();
            var bib = this;
            var once = false;
            httpRequest.onreadystatechange = function(e){
                if (httpRequest.status === 200 && httpRequest.responseText !== "") {
                    if(once) {
                        return;
                    }
                    once = true;
                    var bibtex = httpRequest.responseText;
                    bib.bibtex = new BibtexParser().toJSON(bibtex);
                    bib.replaceText(bib.parentNode.parentNode,  {}, 0);
                }
                else {
                    console.error(httpRequest.status);  
                }
            };
            httpRequest.open('GET', this.src, true);
            httpRequest.send();            
        }

        replaceText(node: Node, refs, reflength: number) {
            var bib = this;
            node.childNodes.forEach(function(element) {
                //Replace if text
                if (element.nodeName == "#text")
                {
                    this.replaceTextNode(element, refs, reflength);
                }

                //Continue down searchtree if not
                if (this.searchElements.includes(element.nodeName)) {
                    reflength = this.replaceText(element, refs, reflength);    
                }
            }, this);  
            return reflength;      
        }

        replaceTextNode(element: Node, refs, reflength)
        {
            var regex = /\[([^[]+)\]/g;
            var output = regex.exec(element.textContent);
            let bib = this;
            if(output != null)
            {
                this.bibtex.forEach(function(bibitem){
                    if(bibitem instanceof BibtexEntry && bibitem.citationKey == output[1]){
                        var ref = refs[bibitem.citationKey]; 

                        //If it is new
                        if (ref === undefined) {
                            reflength = reflength + 1;
                            refs[bibitem.citationKey] = reflength;
                            bib.addBibItem(bibitem, reflength);                                 
                        }

                        element.parentNode.removeChild(element);
                        element.parentElement.innerHTML = element.parentElement.innerHTML.replace("[" + output[1] + "]", bib.formatBib(bibitem, refs[bibitem.citationKey]));
                    }
                });
            }
        }

        formatBib(bibitem, refnumber)
        {
            var res = this.format.replace("{refnumber}", refnumber);
            return "<a href=\"" + "#bib-item-" + refnumber +"\">" + res + "</a>";
        }

        addBibItem(bibitem, refnumber)
        {
            var item = document.createElement('md-bib-item');
            item.setAttribute("bibitem", JSON.stringify(bibitem));
            item.setAttribute("refnumber", refnumber);

            this.appendChild(item);
        }
    }

    window.customElements.define('md-bib', Bibliography);