export default {
  name: 'list-item',
  props: {
    content: ''
  },
  render (h) {
    return h('li.list-item', [ this.content ])
  }
}