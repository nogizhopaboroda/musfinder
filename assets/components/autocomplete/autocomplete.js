const BaseComponent = require('ascesis').BaseComponent;
const _ = require('lodash');
const horsey = require('horsey');

const horsey_styles = require('style!css!horsey/dist/horsey.css');

const template = require('babel?presets[]=es2015&plugins[]=transform-runtime!template-string!./autocomplete.html');
const item_template = require('babel?presets[]=es2015&plugins[]=transform-runtime!template-string!./autocomplete_item.html');
const styles = require('./autocomplete.styl');


class Autocomplete extends BaseComponent {
  render(data){
  }
  attach(){
    console.log('autocomplete created');
    this.html(template());
    var input = this.querySelector('input');
    horsey(input, {
      suggestions: _.debounce((value, done) => {
        if(value.length < 3){
          done([]);
          return;
        }
        (this.preloader || (
          this.preloader = this.childComponents.querySelector('mighty-preloader')
        )).show();
        fetch(`/api/search/autocomplete?q=${value}`)
        .then((response) => response.json())
        .then((response) => {
          return [].concat(
            response.tags_count
            ? {
              type: 'tags_suggestion',
              count: response.tags_count,
              title: value
            }
            : []
          ).concat(response.items)
        })
        .then(done)
        .then(() => this.preloader.hide())
      }, 300),
      render(li, suggestion) {
        li.classList.add('mg-autocomplete-item');
        li.innerHTML = item_template(suggestion);
      },
      set(suggestion){
        input.value = suggestion.title;
      },
      limit: 20
    });
    input.addEventListener('horsey-selected', (event) => {
      this.trigger('mg-autocomplete-item-selected', event.detail);
    });
  }
}

module.exports = document.registerElement('mg-autocomplete', Autocomplete);
