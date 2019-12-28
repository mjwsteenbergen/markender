import { BibtexEntry, BibtexParser } from "../md-bib/bibtexParse";
import { Component, Prop, h, EventEmitter, Event } from "@stencil/core";
import { ClipboardHelper } from "../clipboard";

@Component({
  tag: "md-bib-export-popup",
  styleUrl: 'mb-bib-export-popup.scss'
})
export class BibliographyExportPopup {
  @Prop() bib: BibtexEntry[];
  @Event() shouldClose: EventEmitter;

  copyToClipboard(ev: Event) {
    ev.stopImmediatePropagation();

    let text = new BibtexParser().toBibtex(this.bib);
    ClipboardHelper.copyTextToClipboard(text);
  }



  render() {
    return <div id="outside" onClick={() => this.shouldClose.emit()}>
      <div id="modal">
        <div id="copy"><a onClick={(ev) => this.copyToClipboard(ev)}>Copy to clipboard</a></div>
        <p>{new BibtexParser().toBibtex(this.bib)}</p>
      </div>
    </div>;
  }
}
