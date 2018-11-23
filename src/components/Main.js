import List from './List';

export default {
  state () {
    return {
      count: 8
    }
  },
  init () {
    setInterval(_ => {
      this.count += 2;
    }, 1000) 
  },
  render (h) {
    const header = h('h1.text-muted', {}, ['Ahoj svet !'])
    const list = h(List, {
      props: {
        count: this.count
      }
    }, [])
    const container = h('div.container', {}, [ 
      header, 
      String(this.count), 
      list 
    ])

    return container;
  }
}