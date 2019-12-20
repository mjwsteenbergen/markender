import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "md-cover"
})
export class CoverPage {

  /**
   * Title of the report
   */
  @Prop() title: string;

  /**
   * Author of the report
   */
  @Prop() author: string;
  @Prop() date: string = new Date(Date.now()).toDateString();

  render() {
    return <div>
      <md-cover-title>{this.title}</md-cover-title>
      <md-cover-author>{this.author}</md-cover-author>
      <md-cover-date>{this.date}</md-cover-date>
    </div>
      ;
  }
}
