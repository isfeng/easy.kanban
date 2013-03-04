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
      var textarea = new Element('textarea', {
        value: element.get('text'),
        styles: {'height': '100%', 'z-index': '99999'},
        events: {
          blur: function(){
            textarea.destroy();
            element.set('text', textarea.get('value'));
            element.reveal();
            this.fireEvent('complete');
          }.bind(this)
        }        
      });
      
      textarea.inject(element, 'after');
      element.toggle();
      textarea.focus();
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