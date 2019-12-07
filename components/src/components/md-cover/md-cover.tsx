import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "md-cover"
})
export class CoverPage {

  @Prop() title: string;
  @Prop() author: string;
  @Prop() date: string;

  render() {
    return <div>
      <md-cover-title>{this.title}</md-cover-title>
      <md-cover-author>{this.author}</md-cover-author>
      <md-cover-date>{this.date || new Date(Date.now()).toDateString()}</md-cover-date>
    </div>
      ;
  }
}
