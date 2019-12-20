# md-img
By default any image (`![alt](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/128px-Markdown-mark.svg.png)`) is converted to a `<md-img></md-img>` element.

However, there might be a few cases, where it would be useful to use the element alone.

To change the size of the image add the words: `full,medium,small or super-small` to change the size of the image like so: `<md-img small></md-img>` 

To reference an image, one uses the `[fig:x]` where x is the number of the figure.

### Collages

Markdown does not contain a specification to have images on the same line. This extension adds this functionality


Example:
![collage](./docs/collage.png)
in markdown:

```html
<ul collage>
    <md-img src='https://images.unsplash.com/reserve/91JuTaUSKaMh2yjB1C4A_IMG_9284.jpg' alt='Picture'></md-img>
    <md-img src='https://images.unsplash.com/reserve/91JuTaUSKaMh2yjB1C4A_IMG_9284.jpg' alt='Picture'></md-img>
    <md-img src='https://images.unsplash.com/reserve/91JuTaUSKaMh2yjB1C4A_IMG_9284.jpg' alt='Picture'></md-img>
</ul>
```

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                           | Type     | Default              |
| -------- | --------- | ----------------------------------------------------- | -------- | -------------------- |
| `align`  | `align`   | How to align the image                                | `string` | `"center"`           |
| `alt`    | `alt`     | Description of the image that is displayed below      | `string` | `undefined`          |
| `id`     | `id`      | How to reference the figure using the \[ref\] format  | `string` | `"fig:" + this.rank` |
| `rank`   | `rank`    | The figure number. Do not add. Is added automatically | `number` | `undefined`          |
| `src`    | `src`     | Source of the image                                   | `string` | `undefined`          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
