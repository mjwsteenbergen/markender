export class TableOfContents extends HTMLElement {
    template: string = /* html */ `
    <h1>Table of Contents</h1>
    `;


    constructor() {
        super();
    }

    execute() {

    }

    connectedCallback() {
        var toc = this;
        var chapters = this.getAttribute('chapters') || "true";
        var chapter = chapters === "true";

        var level1 = 0;
        var level2 = 0;
        var level3 = 0;
        var level4 = 0;
        var level5 = 0;
        var level6 = 0;

        toc.insertAdjacentHTML("afterbegin", toc.template);

        document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((item: Element) => {
            var addedText = "";
            switch (item.localName) {
                case "h1":
                    level1++;
                    addedText = level1.toString();
                    level2 = 0;
                    level3 = 0;
                    level4 = 0;
                    level5 = 0;
                    level6 = 0;
                    break;
                case "h2":
                    level2++;
                    addedText = level1 + "." + level2;
                    level3 = 0;
                    level4 = 0;
                    level5 = 0;
                    level6 = 0;
                    break;
                case "h3":
                    level3++;
                    addedText = level1 + "." + level2 + "." + level3;
                    level4 = 0;
                    level5 = 0;
                    level6 = 0;
                    break;
                case "h4":
                    level4++;
                    addedText = level1 + "." + level2 + "." + level3 + "." + level4;
                    level5 = 0;
                    level6 = 0;
                    break;
                case "h5":
                    level5++;
                    addedText = level1 + "." + level2 + "." + level3 + "." + level4 + "." + level5;
                    level6 = 0;
                    break;
                case "h6":
                    level6++;
                    addedText = level1 + "." + level2 + "." + level3 + "." + level4 + "." + level5 + "." + level6;
                    level6 = 0;
                    break;
            }

            var tocItem = document.createElement('md-toc-item');

            if (chapter) {
                tocItem.setAttribute("chapter", addedText);
            }

            tocItem.setAttribute("name", item.innerHTML);
            tocItem.setAttribute("indent", (item.localName || "").replace("h", ""));
            toc.appendChild(tocItem);


            if (chapter) {
                item.innerHTML = '<span class="md-toc-chapter-number">' + addedText + '</span>' + '<span class="md-toc-chapter-extra-space"> </span>' + item.innerHTML;
            }
        });
    }
}