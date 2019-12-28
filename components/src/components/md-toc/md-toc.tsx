import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "md-toc"
})
export class TableOfContents {

  /**
   * Flag to display chapter numbers before chapters
   */
  @Prop() chapters: boolean = true;

  render() {

    if(this.chapters) {
      document.body.classList.add("chapters");
    }

    return <div>
      <h1>Table of Contents</h1>
      {
        Array.from(document
          .querySelectorAll("h1, h2, h3, h4, h5, h6"))
          .map((item: Element) => {
            let ref = item.id;
            let chapterNumber = item.childNodes[0]?.textContent;
            let chapterName = item.childNodes[2]?.textContent;
            return <md-toc-item href={ref} chapter={chapterNumber} name={chapterName} indent={(item.localName || "").replace("h", "")}></md-toc-item>;
        })}
    </div>;
  }
}

function setChapters() {
  var level1 = 0;
  var level2 = 0;
  var level3 = 0;
  var level4 = 0;
  var level5 = 0;
  var level6 = 0;

  let names = [''];

  Array.from(document
    .querySelectorAll("h1, h2, h3, h4, h5, h6"))
    .map((item: Element) => {
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
          addedText =
            level1 +
            "." +
            level2 +
            "." +
            level3 +
            "." +
            level4 +
            "." +
            level5;
          level6 = 0;
          break;
        case "h6":
          level6++;
          addedText =
            level1 +
            "." +
            level2 +
            "." +
            level3 +
            "." +
            level4 +
            "." +
            level5 +
            "." +
            level6;
          break;
      }
      var chaptername = item.textContent;
      let basename = chaptername.replace(new RegExp("\\W"), "-").replace("--", "-").toLowerCase();
      let name = basename;
      let count = 0;
      while(names.includes(name)) {
        count++;
        name = basename + "-" + count;
      }

      item.innerHTML =
        '<span class="md-toc-chapter-number">' +
        addedText +
        "</span>" +
        '<span class="md-toc-extra-space"> </span>' +
        '<span class="md-toc-chapter-name">' + item.innerHTML + '</span>' +
        '<md-link-button link="' + name + '"></md-link-button>';


      item.id = name;
      names.push(name);
    });
}

setChapters();


