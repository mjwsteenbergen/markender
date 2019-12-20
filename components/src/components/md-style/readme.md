# md-style
The property name can have the values shown when using the snippet `style` within markdown. Append the `name` property with `disable_style` to disable the style used by vscode and show the text as it will be printed.

margin can have one value (top, bottom, left, right), two ((top, bottom), (left, right)) or four (top, right, bottom, left)

url will get the contents of the stylesheet and set add it to the document. This will also disable the margin property, so if wanted needs to be set in the stylesheet.
car

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                    | Type     | Default        |
| -------- | --------- | ------------------------------ | -------- | -------------- |
| `margin` | `margin`  | Margin of the printed page     | `string` | `"80px 120px"` |
| `name`   | `name`    | The style it should assume     | `string` | `undefined`    |
| `url`    | `url`     | The url of your personal sheet | `string` | `undefined`    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
