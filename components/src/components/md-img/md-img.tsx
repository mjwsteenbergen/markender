

import { Component, Prop, h } from '@stencil/core';
import { MdLinkStorage } from '../md-link/md-link-storage';
import { ReferenceType } from '../md-link/md-link-files';

@Component({
    tag: 'md-img',
    shadow: false,
    styleUrl: 'md-img.scss'
})
export class MdImg {

    // Indicate that name should be a public property on the component
    @Prop() name: string;
    @Prop({ mutable: true}) id_2: string;
    @Prop() src: string;
    @Prop() align: string;
    @Prop() rank: number;
    @Prop() alt: string;

    render() {
        var alt_text = this.alt ? ": " + this.alt : "";

        this.id_2 = this.id_2 || "fig:" + this.rank;

        document.querySelectorAll("md-link-storage").forEach((item) => {
          const storage = item as unknown as MdLinkStorage;
          storage.update(this.id_2, {
            displayValue: "Figure " + this.rank,
            type: ReferenceType.figure,
            href: "#" + this.id_2,
            isUsed: false,
            index: -1
          });
        });

        return (
            <div id={this.id_2} class="wrapper">
                <img class={this.align || "center"} src={this.src || ""} />
                <span class="md-img-desc">{"Figure " + this.rank + alt_text}</span>
            </div>
        );
    }
}

let mdImg_nr = 1;
document.querySelectorAll("md-img").forEach((item) => {
  // item.setAttribute("rank", mdImg_nr.toString());
  item.rank = mdImg_nr;
  mdImg_nr++;
});



