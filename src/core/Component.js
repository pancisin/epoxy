import { patch, create, diff } from "virtual-dom";
import { h } from 'virtual-dom';
import { stringHash } from './utils';

import Observable from './Observable';

export default class Component {

  get isRootComponent () {
    return this._parent == null;
  }

  _initializeChildComponent = comp => new Component(comp, patches => {
    this._updateDom(true);
  }, this)
  
  _updateDom = partial => {
    let tree = this._nodeTree;

    tree = this._renderFnc((a, b, c) => {
      if (typeof a === 'string') {
        return h(a, b, c)
      } else if (typeof a === 'object') {
        const hash = stringHash(JSON.stringify(a))
        const cmp = this._components.find(c => c._hash === hash)
        
        if (cmp) {
          if (!partial) {
            for (let key in b.props) {
              cmp._props[key] = b.props[key]
            }
          }

          return cmp._nodeTree
        }
      }
    });
    
    const patches = diff(this._nodeTree, tree);
    this._nodeTree = tree;
    this.$el = create(this._nodeTree);
    this._renderCallback(patches);
  }

  constructor (component, renderCallback, parent) {
    this.name = component.name;
    this._renderCallback = renderCallback;
    this._parent = parent;
    
    this._hash = stringHash(JSON.stringify(component))
   
    if (component.state) {
      this._state = this._introduceMembers(component.state())
    }

    if (component.init) {
      component.init.apply(this)
    }

    this._renderFnc = component.render;

    const componentsToInit = []

    this._nodeTree = this._renderFnc((a, options, c) => {
      if (typeof a === 'string') {
        return h(a, options, c )
      } else if (typeof a === 'object') {
        componentsToInit.push({ component: a, props: options.props })
      }
    });

    this._renderCallback(this._nodeTree)
    
    this._components = [];
    this._components = componentsToInit.map(data => {
      const comp = this._initializeChildComponent(data.component);
      comp._setProps(data.props)
      return comp;
    })
    
    this._updateDom()
  }

  _introduceMembers = members => {
    const observable = Observable({
      target: members,
      listener: _ => {
        this._updateDom()
      },
      freeze: false
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

  _setProps = props => {
    this._props = this._introduceMembers(props);
  }
}