import { patch, create, diff } from "virtual-dom";
import { h } from 'virtual-dom';

import Observable from './Observable'

export default class Component {

  get isRootComponent () {
    return this._parent == null;
  }

  traverseChildren = tree => {
    return tree.children.map(c => {
      const idx = this._components.map(x => x.name.toUpperCase()).indexOf(c.tagName);

      if (idx !== -1) {
        return this._components[idx].nodeTree;
        // return this._components[idx].renderFnc(h);
      }

      return c;
    })
  }

  initializeChildComponent = (name, comp) => new Component({
    ...comp,
    name
  }, patches => {
    this.updateDom();
  }, this)
  

  updateDom = state => {
    let tree = this.renderFnc((a, b, c) => {
      if (typeof a === 'string') {
        return h(a, b, c)
      } else if (typeof a === 'object') {
        const cmp = this._components.find(c => c.name === a.name)

        if (cmp) {
          return cmp.nodeTree
        }

        return h('span', {}, [])
      }
    });

    tree.children = this.traverseChildren(tree);

    const patches = diff(this.nodeTree, tree);
  
    this.nodeTree = tree;
    // this.rootNode = patch(this.rootNode, patches);
    this.renderCallback(patches)
  }

  constructor (component, renderCallback, parent) {
    this.name = component.name;
    this.renderCallback = renderCallback;
    this.state = Observable({
      target: component.state(),
      listener: this.updateDom,
      freeze: false
    });

    this._parent = parent;

    for (let key in this.state) {
      Object.defineProperty(this, key, {
        get () {
          return this.state[key]
        },
        set (newVal) {
          this.state[key] = newVal
        },
        configurable: true
      })
    }

    if (component.init) {
      component.init.apply(this)
    }

    this._components = [];
    this.renderFnc = component.render;
    this.nodeTree = this.renderFnc((a, b, c) => {
      if (typeof a === 'string') {
        return h(a, b,c )
      } else if (typeof a === 'object') {
        const c = this.initializeChildComponent(a.name || String(this._components.length), a);
        this._components.push(c);
        return c.renderFnc(h)
      }
    });

    if (this.isRootComponent) {
      this.renderCallback(this.nodeTree)
      this.updateDom()
    }
    
    // for (let key in component.components) {
    //   this._components.push(this.initializeChildComponent(key, component.components[key]))
    // }

    
    // this.rootNode = create(this.nodeTree);
    // document.body.appendChild(this.rootNode);
  }
}