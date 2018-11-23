import Component from './Component';
import { patch, create, diff } from "virtual-dom";

export default class {
  
  constructor (component) {
    
    this.rootComponent = new Component(component, patches => {
      if (this.rootNode) {
        this.rootNode = patch(this.rootNode, patches);
      } else {
        this.rootNode = create(patches);
        document.body.appendChild(this.rootNode);
      }
    })
  }
}