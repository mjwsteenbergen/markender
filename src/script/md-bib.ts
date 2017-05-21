import { BibtexParser, AbstractBibtexEntry, BibtexEntry, BibtexEntryComment,BibtexEntryPreamble } from "./bibtexParse";

class Bibliography extends HTMLElement{
    bibtex: AbstractBibtexEntry[];
    src: string;
    format: string;
    searchElements: string[];
    template: HTMLTemplateElement = document.createElement('template');

        constructor() {
            super();
            this.searchElements = ["P", "H2"];
            this.format = null;
            this.bibtex = null;
        }

        connectedCallback() {
            var bib = this;
            this.format = this.getAttribute("format") || "[{refnumber}]";
            this.src = this.getAttribute("src");

            let header = document.createElement("h1");
            header.innerHTML = "Bibliography";
            this.appendChild(header);

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
                    bib.replaceText(bib.parentNode.parentNode,  new Map<string, number>());
                }
                else {
                    console.error(httpRequest.status);  
                }
            };
            httpRequest.open('GET', this.src, true);
            httpRequest.send();            
        }

        replaceText(node: Node, refs: Map<string, number>) {
            var bib = this;
            node.childNodes.forEach(function(element) {
                //Replace if text
                if (element.nodeName == "#text")
                {
                    refs = this.replaceTextNode(element, refs);
                }

                //Continue down searchtree if not
                if (this.searchElements.includes(element.nodeName)) {
                    refs = this.replaceText(element, refs);    
                }
            }, this);  
            return refs;      
        }

        replaceTextNode(element: Node, refs: Map<string,number>): Map<string, number>
        {
            var regex = /\[([^[]+)\]/g;
            var output = regex.exec(element.textContent);
            let bib = this;
            if(output != null)
            {
                let refelement: Node = document.createTextNode(output[0]);
                this.bibtex.forEach(function(bibitem){
                    if(bibitem instanceof BibtexEntry && bibitem.citationKey == output[1]){
                        var ref = refs.get(bibitem.citationKey); 

                        //If it is new
                        if (ref === undefined) {
                            refs.set(bibitem.citationKey, refs.size + 1);
                            bib.addBibItem(bibitem, refs.size);                                 
                        }

                        let actualRef = document.createElement("a");
                        actualRef.innerHTML =  bib.formatBib(bibitem, refs.get(bibitem.citationKey));
                        refelement = actualRef;                        
                    }
                });
                let parent = element.parentNode;
                let textArray:string[] = element.textContent.split(output[0]);
                let textNode2 = document.createTextNode(textArray[1]);
                parent.replaceChild(textNode2,element);
                parent.insertBefore(refelement, textNode2);
                parent.insertBefore(document.createTextNode(textArray[0]), refelement);
                bib.replaceTextNode(textNode2, refs);   
            }
            return refs;
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