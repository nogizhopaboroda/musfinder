var base_component = require('lib/base_component');

class ShortStat extends base_component {
  create() {
    var $total_posts_count = this.querySelector("#total_posts_count");
    fetch("/api/stat")
    .then(function(response){
      return response.json();
    }).then(function(json) {
      $total_posts_count.innerHTML = json.count;
    });
  }
  attach(){}
  detach(){}
  attributeChange(name, previousValue, value){}
}
ShortStat.extends = 'div';

module.exports = document.registerElement('short-stat', ShortStat);