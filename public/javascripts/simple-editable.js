/*
---

script: SimpleEditable.js

name: SimpleEditable

description: 

license: MIT-style license

authors:
  - isfeng

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [SimpleEditable]
...

Example:
  el.makeEditable();

*/

var SimpleEditable = new Class({
  
  Implements: [Events, Options],

  options: {
    
  },

  initialize: function(element, options){
    this.element = document.id(element);
    element = this.element;
    this.setOptions(options);

    element.addEvent('dblclick',function(){
      console.log('dblclick');
      element.store('oriHTML', element.get('html'));
      var textarea = new Element('textarea', {'text': element.get('html'), 'style':'height:100%'});
      //element.empty();
      console.log(element);
      // element.empty();
      textarea.inject(element, 'after');
      element.toggle();
      textarea.focus();
      var overlay = new Overlay('space');
      overlay.open();
      this.fireEvent('beforeStart');


    }.bind(this));

  }
});

Element.implement({

  makeEditable: function(options){
    var editable = new SimpleEditable(this, options);
    return editable;
  }

});