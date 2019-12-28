

import { Component, Prop, h } from '@stencil/core';
import { MdLinkStorage } from '../md-link/md-link-storage';
import { ReferenceType } from '../md-link/md-link-files';

@Component({
  tag: 'md-img',
  shadow: false,
  styleUrl: 'md-img.scss'
})
export class MdImg {

  /**
   * Source of the image
   */
  @Prop() src: string;

  /**
   * How to align the image
   */
  @Prop() align: string = "center";

  /**
   * Description of the image that is displayed below
   */
  @Prop() alt: string;

  /**
   * The figure number. Do not add. Is added automatically
   */
  @Prop() rank: number;

  /**
   * How to reference the figure using the \[ref\] format
   */
  @Prop() id: string = "fig:" + this.rank;

  render() {
    var alt_text = this.alt ? ": " + this.alt : "";

    document.querySelectorAll("md-link-storage").forEach((item) => {
      const storage = item as unknown as MdLinkStorage;
      storage.update(this.id, {
        displayValue: "Figure " + this.rank,
        type: ReferenceType.figure,
        href: "#" + this.id,
        isUsed: false,
        index: Number.MAX_VALUE
      });
    });

    return (
      <div id={this.id} class="wrapper">
        <img class={this.align} src={this.src} />
        <span class="md-img-desc">{"Figure " + this.rank + alt_text} <md-link-button link={this.id}></md-link-button> </span>
      </div>
    );
  }
}

let mdImg_nr = 1;
document.querySelectorAll("md-img").forEach((item) => {
  item.rank = mdImg_nr;
  mdImg_nr++;
});



