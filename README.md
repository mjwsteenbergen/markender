# Markender

Do you love using markdown? Do you wish you could use it for reports? With Markender you can!

It includes everything you need to create an amazing report:
 - Cover-pages
 - Table of contents
 - Formulas
 - Checklists
 - Image-referencing
 - Bibliography

Style it just the way you want with the following built in styles:
 - Latex
 - Dropbox
 - Github
 - ACM (work in progress)

![the features](./example/animation.gif)

# All Components
By using [web-components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) we make additions easy and simple. The following web components are defined and can be used within vscode:

## Cover Page
`<md-cover></md-cover>` will create a cover page at the place you put it.

The following properties are available to customize the component:

| Property | Description          |
|----------|----------------------|
| title    | Title of the report  |
| author   | Author of the report |

## Table of contents
`<md-toc></md-toc>` will create a new chapter and the bibliography.

| Property | Description                                                     |
|----------|-----------------------------------------------------------------|
| chapters | Flag to display chapter numbers before chapters (true or false) |

## Bibliography
`<md-bib></md-bib>` will create the bibliography.

| Property | Description                                           |
|----------|-------------------------------------------------------|
| src      | Source of the bibliography (this should be in [bibtex](http://www.bibtex.org/Format/) format) |
| format   | How to format the references (default: \[{refnumber}\]) |

For the loading of the bibliography and doi-references you need to disable security with `Markdown: Change Preview Security Settings`

### Reference from doi
`<md-bib-doi>${doi}</md-bib-doi>` will tell the bibliography to get a reference from the given doi.

Example:

```
<md-bib>
    <md-bib-doi>10.1109/5.771073</md-bib-doi>
</md-bib>
```

### Reference from url
`<md-bib-url>${doi}</md-bib-url>` will tell the bibliography to get a reference from the given url.

Example:

```
<md-bib>
    <md-bib-url>https://github.com/mjwsteenbergen/markender</md-bib-url>
</md-bib>
```

## Style
`<md-style></md-style>` will add css styling to the page to make it look amazing.

| Property | Description                |
|----------|----------------------------|
| name     | The style it should assume |

The property name can have the values shown when using the snippet `style` within markdown.


## Convert your document to PDF

You can use [Markdown Converter](https://marketplace.visualstudio.com/items?itemName=manuth.markdown-converter) to convert your document to pdf!

Make sure to use the following settings to make it very pretty:

```
    "markdownConverter.Document.HeaderFooterEnabled": false,
    "markdownConverter.Document.Paper.Margin": { "Top": "0", "Bottom": "0", "Left": "0", "Right": "0"}
```

## Release Notes
### 1.0.1
Improve documentation

### 1.0.0
Initial Release!
