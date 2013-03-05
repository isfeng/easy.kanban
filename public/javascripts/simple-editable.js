/*
---

script: SimpleEditable.js

name: SimpleEditable

description: A simple way to create in place editing fields with Mootools.

license: MIT-style license

authors:
  - isfeng

requires:
  - core/
  - more/Fx.Reveal


provides: [SimpleEditable]
...



*/

var SimpleEditable = new Class({
  
  Implements: [Events, Options],

  element: null,
  editable: null,

  options: {
    type:'text' //text || textarea
  },

  initialize: function(element, options){
    this.element = document.id(element);
    element = this.element;
    this.setOptions(options);

    element.addEvent('dblclick',function(){
      if(this.options.type=='textarea')
      {
        this.editable = new Element('textarea', {
          value: element.get('text'),
          styles: {height: element.getStyle('height'), width: element.getStyle('width')},
          events: {
            blur: this._onBlur.bind(this)
          }
        });  
      }
      else
      {
        this.editable = new Element('input', {
          value: element.get('text'),
          type: 'text',
          size: element.get('text').length,
          events: {
            blur: this._onBlur.bind(this)
          }        
        });   
      }     
      
      this.editable.inject(element, 'after');
      element.toggle();
      this.editable.focus();
      this.fireEvent('beforeStart');

    }.bind(this));
  },

  _onBlur: function(){
    this.editable.destroy();
    this.element.set('text', this.editable.get('value'));
    this.element.reveal();
    this.fireEvent('complete', this.editable.get('value'));
  }

});

Element.implement({

  makeEditable: function(options){
    var editable = new SimpleEditable(this, options);
    return editable;
  }

});