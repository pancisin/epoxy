import { patch, create, diff } from "virtual-dom";
import { h } from 'virtual-dom';
import { stringHash } from './utils';

import Observable from './Observable';

export default class Component {

  get isRootComponent () {
    return this._parent == null;
  }

  initializeChildComponent = comp => new Component(comp, patches => {
    this.updateDom();
  }, this)
  

  updateDom = state => {
    let tree = this._renderFnc((a, b, c) => {
      if (typeof a === 'string') {
        return h(a, b, c)
      } else if (typeof a === 'object') {
        const hash = stringHash(JSON.stringify(a))
        const cmp = this._components.find(c => c._hash === hash)

        if (cmp) {
          return cmp._nodeTree
        }
      }
    });

    const patches = diff(this._nodeTree, tree);
    this._nodeTree = tree;
    this.$el = create(this._nodeTree);
    this.renderCallback(patches);
  }

  constructor (component, renderCallback, parent) {
    this.name = component.name;
    this.renderCallback = renderCallback;
    this._parent = parent;
    
    this._hash = stringHash(JSON.stringify(component))
   
    if (component.state) {
      this._state = Observable({
        target: component.state(),
        listener: this.updateDom,
        freeze: false
      });
    }

    this.stateReq = [];

    for (let key in this._state) {
      Object.defineProperty(this, key, {
        get () {
          this.stateReq.push(key)
          return this._state[key]
        },
        set (newVal) {
          this._state[key] = newVal
        },
        configurable: true
      })
    }
    
    this._props = component.props && this.setProps(component.props)

    if (component.init) {
      component.init.apply(this)
    }

    this._components = [];
    this._renderFnc = component.render;
    this.stateReq = [];

    const componentsToInit = []

    this._nodeTree = this._renderFnc((a, options, c) => {
      if (typeof a === 'string') {
        return h(a, options, c )
      } else if (typeof a === 'object') {
        componentsToInit.push({ component: a, props: options.props })
      }
    });

    this.renderCallback(this._nodeTree)
    
    this._components = componentsToInit.map(data => {
      const comp = this.initializeChildComponent(data.component);

      for (let key in data.props) {
        // console.log(comp._props[key], ' = ', data.props[key])
        // if (comp._props.hasOwnProperty(key)) {
        // comp._props[key] = data.props[key]
        // }
      }

      return comp;
    })
    
    this.updateDom()
  }

  setProps = props => {
    let observable = Observable({
      target: props,
      listener: this.updateDom,
      freeze: true
    })

    for (let key in observable) {
      Object.defineProperty(this, key, {
        get () {
          return observable[key]
        },
        set (newVal) {
          observable[key] = newVal
        },
        configurable: true
      })
    }

    return observable;
  }
}