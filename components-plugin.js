'use strict'

const _ = require('lodash')

function ComponentsPlugin(md, options) {
  const opts = _.defaults(options, {})
  md.core.ruler.push('html-components', parser(md, opts), {alt: []})
}

function parser(md, options) {
  return function(state) {
    const tokens = state.tokens
    const len = tokens.length
    let i = -1;
    while (++i < len) {
      const token = tokens[i]
      _.each(token.children, child => {
        if (child.type !== 'text') {
          return
        }
        const exp = new RegExp('(<([^>]+-[^>]+)>)','gi')
        if (exp.test(child.content)) {
          child.type = 'htmltag'
        }
      })
    }
  }
}
module.exports = ComponentsPlugin