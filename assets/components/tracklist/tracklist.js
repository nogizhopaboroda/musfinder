const BaseComponent = require('ascesis').BaseComponent;
const _ = require('lodash');
const template = require('babel?presets[]=es2015&plugins[]=transform-runtime!template-string!./tracklist.html');
const styles = require('./tracklist.styl');

class TrackList extends BaseComponent {
  render(data, additional){
    this.html(template({
      each_track(tpl){
        return _.reduce(data, (accum, track) => accum.concat(tpl(track)), "");
      },
      format: this.getAttribute('format'),
      additional
    }));
  }
  connectedCallback(){
    super.connectedCallback();

    console.log('tracklist created');
  }
}

module.exports = customElements.define('track-list', TrackList);
