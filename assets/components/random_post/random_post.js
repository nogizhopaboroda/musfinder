const BaseController = require('ascesis').BaseController;
const Delegate = require('dom-delegate');
const template = require('babel?presets[]=es2015&plugins[]=transform-runtime!template-string!./random_post.html');
const styles = require('./random_post.styl');


class RandomPostController extends BaseController {
  get current_post_id(){
    var [...keys] = this.state.queue.keys();
    return keys[this.state.queue.size - 1];
  }
  get prev_post_id(){
    var [...keys] = this.state.queue.keys();
    return keys[this.state.queue.size - 2];
  }

  load_by_id(post_id = "random"){
    return new Promise((resolve, reject) => {
      if(this.getAttribute('prerendered') === 'true'){
        this.setAttribute('prerendered', 'false');
        resolve(false);
      } else {
        this.html(template({}));
      }
      if(post_id === this.current_post_id){
        reject();
        return;
      }
      if(this.state.queue.has(post_id)){
        console.log('item from cache');
        resolve(this.state.queue.get(post_id));
        return;
      }
      fetch(`/api/post/${post_id}`)
      .then(response => response.json())
      .then((posts) => resolve(posts))
    }).then((posts) => {
      if(posts){
        var current_post_id = posts[0].id;
        this.state.queue.set(current_post_id, posts);
        this.querySelector('posts-controller').render(posts);
      }

      this.style = '';
      this.classList.add('with-post');
      this.trigger('post-rendered');
      return;
    });
  }

  prev(){
    this.load_by_id(this.prev_post_id || this.current_post_id)
      .then(() => {
        this.state.queue.delete(this.current_post_id);
        this.trigger('post-rendered');
      })
      .catch(() => {
        console.log('unable to load prev post');
      });
  }
  next(){
    this.load_by_id();
  }

  connectedCallback(){
    super.connectedCallback();
    console.log('random post ctrl');
    this.state = {
      queue: new Map(),
    };
    var delegate = new Delegate(this);

    delegate.on(
      "component-attached", "posts-controller", ({target}) => this.$posts_controller = target
    );
    delegate.on(
      "component-attached", "mighty-preloader", ({target}) => this.$preloader = target
    );
    delegate.on("click", ".random_post_button", (event) => {
      event.preventDefault();
      this.$preloader.show();
      this.next();
    });

    delegate.on("click", ".prev-button", () => this.prev());

    delegate.on("swipeleft", ".post-row", () => this.next());
    delegate.on("swiperight", ".post-row", () => this.prev());
    //document.addEventListener("keydown", ({keyCode}) => {
      //(keyCode === 37) && this.prev();
      //(keyCode === 39) && this.next();
    //});

  }
  attributeChangedCallback(name, prev, value){
    super.attributeChangedCallback();

    switch(name){
      case 'post_id':
        this.load_by_id(+value);
        break;
    }
  }
  static get observedAttributes() {
    return ['post_id'];
  }
  get routes(){
    let self = this;
    return {
      '/': {
        on(){
        }
      },
      '/:post_id/?((\w|.)*)'(post_id){
        self.setAttribute('post_id', post_id);
      },
    }
  }
}

module.exports = customElements.define('random-post-controller', RandomPostController);
