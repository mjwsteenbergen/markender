export class CoverPage extends HTMLElement {

    constructor() {
        super();
    }

    template() {
        return /* html */`
     <div>
        <md-cover-title></md-cover-title>
        <md-cover-author></md-cover-author>
        <md-cover-date></md-cover-date>
    </div>
    `;
    }

    connectedCallback() {
        this.insertAdjacentHTML("afterbegin", this.template());
        var title = this.getAttribute("title") || "";
        this.querySelectorAll('md-cover-title')[0].innerHTML = title;
        document.title = title;


        var author = this.getAttribute("author") || "";
        this.querySelectorAll('md-cover-author')[0].innerHTML = author;

        this.querySelectorAll('md-cover-date')[0].innerHTML = new Date(Date.now()).toDateString();
    }
}