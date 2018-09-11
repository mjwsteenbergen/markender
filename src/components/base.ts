var linkStorage = document.createElement("md-link-storage");
document.body.appendChild(linkStorage);

var katexcss = document.createElement("link");
katexcss.setAttribute("rel", "stylesheet");
katexcss.setAttribute("type", "text/css");
katexcss.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css");
document.head.appendChild(katexcss);


import { MdBibItem } from "./md-bib-item/md-bib-item";
import { CoverPage } from "./md-cover/md-cover";
import { MdImage } from "./md-img/md-img";
import { TableOfContents } from "./md-toc/md-toc";
import { MdLinkStorage } from "./md-link/md-link-storage";
import { TableOfContentsItem } from "./md-toc-item/md-toc-item";
import { MdLink } from "./md-link/md-link";
import { Bibliography } from "./md-bib/md-bib";
import { MdStyle } from "./md-style/md-style";
import "../../src/css/base.scss";

window.customElements.define('md-bib', Bibliography);
window.customElements.define('md-bib-item', MdBibItem);
window.customElements.define('md-cover', CoverPage);
window.customElements.define('md-img', MdImage);
window.customElements.define('md-toc', TableOfContents);
window.customElements.define('md-link-storage', MdLinkStorage);
window.customElements.define('md-toc-item', TableOfContentsItem);
window.customElements.define('md-link', MdLink);
window.customElements.define('md-style', MdStyle);


