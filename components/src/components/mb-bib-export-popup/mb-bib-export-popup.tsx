import { BibtexEntry, BibtexParser } from "../md-bib/bibtexParse";
import { Component, Prop, h, EventEmitter, Event } from "@stencil/core";

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
    this.copyTextToClipboard(text);
  }

  fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    this.fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
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
