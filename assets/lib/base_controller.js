var fireEvent = require('lib/fire_event');

module.exports = document.registerElement(
  'base-controller',
  {
    prototype: Object.create(
      HTMLElement.prototype, {
      childComponents: {value: []},
      componentType: {value: "controller"},
      createdCallback: {value: function() {
        console.log('base controller createdCallback');
        this.create && this.create();
      }},
      attachedCallback: {value: function() {
        console.log('base controller attachedCallback');
        var self = this;
        this.attach && this.attach();
        fireEvent('component-attached', this);
        this.addEventListener('component-attached', function(event){
          self.childComponents.push(event.target);
        });
      }},
      detachedCallback: {value: function() {
        console.log('base controller detachedCallback');
        this.detach && this.detach();
      }},
      attributeChangedCallback: {value: function(
        name, previousValue, value
      ) {
        console.log('base controller attributeChangedCallback');
        if (previousValue == null) {
          console.log(
            'got a new attribute ', name,
            ' with value ', value
          );
        } else if (value == null) {
          console.log(
            'somebody removed ', name,
            ' its value was ', previousValue
          );
        } else {
          console.log(
            name,
            ' changed from ', previousValue,
            ' to ', value
          );
        }
        this.attributeChange && this.attributeChange();
      }}
    })
  }
);
