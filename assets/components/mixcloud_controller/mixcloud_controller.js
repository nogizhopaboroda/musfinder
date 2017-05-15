const BaseController = require('ascesis').BaseController;
const Router = require('router').Router;
const template = require('babel?presets[]=es2015&plugins[]=transform-runtime!template-string!./mixcloud_controller.html');
const styles = require('./mixcloud_controller.styl');

const _ = require('lodash');

class MixcloudController extends BaseController {
  load_by_url(value){

    this.$mixcloud_url_form = this.querySelector('#mixcloud_url_form');
    this.$loader = this.querySelector('#mixcloud_tracklist_preloader');

    this.$mixcloud_url_form.classList.remove('invalid');
    this.$mixcloud_url_form.classList.remove('valid');

    var parser = document.createElement('a');
    parser.href = value;

    if(value === ""){
      this.$loader.parentElement && this.$loader.classList.add('hidden');
      return false;
    }
    if(!~parser.hostname.indexOf('mixcloud.com')){
      console.log('invalid link');
      this.$mixcloud_url_form.classList.add('invalid');
      this.$loader.parentElement && this.$loader.classList.add('hidden');
      return false;
    } else {
      this.$mixcloud_url_form.classList.add('valid');
    }
    this.$loader && this.$loader.parentElement && this.$loader.classList.remove('hidden');
    return fetch('/api/mixcloud/get_tracks', {
      method: 'post',
      body: JSON.stringify({
        "url": parser.href
      })
    })
    .then(response => response.json())
    .then((data) => {
      this.querySelector('mixcloud-tracklist').render(data);
    });
  }

  connectedCallback(){
    super.connectedCallback();

    console.log('mixcloud ctrl');

    this.router = new Router({ container: this, routes: this.routes });

    this.trigger('subrouter-connected', {
      router: this.router,
      base: this.attr('router-base')
    });

    this.on(
      'keyup',
      '#mixcloud_url_input',
      _.debounce((e) => this.router.navigate(`?url=${e.target.value}`), 300)
    );
  }

  disconnectedCallback(){
    super.disconnectedCallback();
    this.router.destroy();
  }

  static get observedAttributes() {
    return ['url'];
  }

  attributeChangedCallback(name, prev, value){
    super.attributeChangedCallback();

    switch(name){
      case 'url':
        let input = this.querySelector('#mixcloud_url_input');
        (input.value !== value) && (input.value = value);
        this.load_by_url(value).catch((e) => {
          console.log(`error processing data: ${e}`)
        });
        break;
    }
  }

  get routes(){
    let self = this;
    return {
      '/'(q){
        if(!self.childNodes.length){
          self.html(template({}));
        }
        if(q.url){
          self.setAttribute('url', q.url);
        }
      },
    }
  }
}

module.exports = customElements.define('mixcloud-controller', MixcloudController);
