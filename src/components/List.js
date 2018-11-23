import ListItem from './ListItem';
export default {
  name: 'list',
  state () {
    return {
      elements: [
        'ahoj',
        'druhz'
      ],
      inputValue: '',
    }
  },
  props: {
    count: 5
  },
  render (h) {
    const input = h('input.form-control', {
      placeholder: 'Insert Todo Here...',
      type:'text',
      value: this.inputValue,
      oninput: e => {
        this.inputValue = e.target.value
      }
    })

    const buttom = h('a.btn.btn-default', {
      onclick: e => {
        const el = this.elements;
        el.push(this.inputValue);
        this.inputValue = ''
      }
    }, ['submit'])

    const list  = h('ul', {
      style: {
        'margin-top': '10px'
      }
    }, this.elements.map(e => h(ListItem, { props: { content: e }})))

    return h('div', {}, [ 
      input,
      buttom,
      list,
      String(this.count),
      String(this.elements.length) + ' items'
    ])
  }
}