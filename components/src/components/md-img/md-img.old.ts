// import { ReferenceType, getLinkStorage } from "../md-link/md-link-storage";

// export class MdImage extends HTMLElement {
//     template: string = /* html */ `

//     `;


//         //

//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         this.insertAdjacentHTML("afterbegin", this.template);

//         var index = 1;
//         var usedIndex = -1;
//         document.querySelectorAll("md-img").forEach((item) => {
//             if (item === this) {
//                 usedIndex = index;
//                 return;
//             }
//             index++;
//         });

//         var alignment = this.getAttribute("align") || "center";

//         var img = this.querySelectorAll("img")[0];
//         img.setAttribute("src", this.getAttribute("src") || "");
//         img.className = "center";
//         var alt = this.querySelectorAll(".md-img-desc")[0];
//         var alt_text = this.getAttribute("alt") || "";
//         if (alt_text !== "") {
//             alt_text = ": " + alt_text;
//         }
//         alt.innerHTML = "Figure " + usedIndex + alt_text;
//         this.className = alignment;

//         var id = this.getAttribute("id") || "fig:" + usedIndex;
//         this.setAttribute("id", id);

//         getLinkStorage((storage) => {
//             storage.update(id, {
//                reportValue: "Figure " + usedIndex,
//                type: ReferenceType.figure,
//                href: "#" + id,
//                isUsed: false,
//                index: -1
//             });
//         });
//     }
// }
