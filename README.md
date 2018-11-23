
# Epoxy

Write some about information here placeholder.

## Installation

``` bash
npm install --save pancisin/epoxy
```

## Getting started

``` js
import { Epoxy } from 'epoxyjs/dist/epoxy';

new Epoxy({
  state () {
    return {
      count: 1
    }
  },
  init () {
    setInterval(_ => {
      this.count += 1;
    }, 1000) 
  },
  render (h) {
    return h('span.counter', {}, [ String(this.count) ])
  }
});

```
