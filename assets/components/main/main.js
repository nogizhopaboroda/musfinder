var base_controller = require('lib/base_controller');

var Delegate = require('dom-delegate');
var Router = require('director').Router;
var _ = require('lodash');

var templates = {
  "short_stat": function(){/*
    <%= count %>
  */},
  "stat": function(){/*
    <div class="panel row">
       <%= count %>
       posts total
    </div>
    <div class="row">
      <form id="search_form">
        <input type="checkbox" checked="true" id="toggle_tags"/>
        <ul class="inline-list" id="taglist">
          <% _.forEach(tags, function(tags_count, tag_label){ %>
              <li>
                <label>
                  <%= tag_label %> (<%= tags_count %>)
                  <input type="checkbox" value="<%= tag_label %>" name="tags"/>
                </label>
              </li>
          <% }); %>
        </ul>
        <label class="button expand" id="search_button">Search</label>
        <label class="button expand show-tags" for="toggle_tags">Show tags</label>
        <label class="button expand hide-tags" for="toggle_tags">Hide tags</label>
      </form>
    </div>
  */},
  "posts": function(){/*
    <% _.forEach(posts, function(post){ %>
      <div class="panel row">
          <div class="button-bar" data-evaluate-post data-post-id="">
            <ul class="button-group radius">
              <li><a data-mark="good" href="#" class="disabled round button success">Good</a></li>
            </ul>
            <ul class="button-group radius">
              <li><a data-mark="non_music" href="#" class="disabled small button alert">Non-music</a></li>
              <li><a data-mark="without_link" href="#" class="disabled small button alert">Without link</a></li>
              <li><a data-mark="broken_link" href="#" class="disabled small button alert">Link broken</a></li>
              <li><a data-mark="comments_broken" href="#" class="disabled small button alert">Comments broken</a></li>
              <li><a data-mark="link_in_comments" href="#" class="disabled small button alert">Link in comments</a></li>
            </ul>
          </div>
          <div class="large-4 columns">
            <% _.forEach(post.images, function(image){ %>
              <img src="<%= image %>">
            <% }); %>
          </div>
          <div class="large-8 columns">
            <p>
              <a href="<%= post.url %>"><%= post.title %></a>
            </p>
            <ul class="inline-list">
              <% _.forEach(post.tags, function(link, tagname){ %>
                <li><a target="_blank" href="<%= link %>"><%= tagname %></a></li>
              <% }); %>
            </ul>
            <div class="panel callout radius">
              <h5>content</h5>
              <%= post.content %>
            </div>
            <% if(post.comments.length){ %>
              <div class="panel callout radius">
                <h5>comments</h5>
                <%= post.comments %>
              </div>
            <% } %>
          </div>
      </div>
    <% }); %>
  */}
}

function template(name, params){
  return _.template(
    templates[name]
    .toString()
    .replace(/function.*\{\/\*([\s\S]+)\*\/\}$/ig, "$1"))
  (params)
}



module.exports = document.registerElement(
  'main-controller',
  {
    extends: 'body',
    prototype: Object.create(
      base_controller.prototype, {
      create: {value: function() {


        console.log("application ready");
          var delegate = new Delegate(document.body);

          var random = function () { console.log("random"); };
          var search = function () { console.log("search"); };
          var statistic = function () { console.log("statistic"); };
          var get_post = function (post_id) { console.log("post id", post_id); };

          var routes = {
            '/random': random,
            '/post/?((\w|.)*)': get_post,
            '/search': search,
            '/statistic': statistic
          };

          var router = Router(routes);

          var $stat_container = document.querySelector("#stat_container");
          var $posts_container = document.querySelector("#posts_container");
          var $random_post_spinner = document.querySelector("#random_post_spinner");

          //delegate.on("click", "#search_button", function(event){
            //event.preventDefault();
            //var $search_form = document.querySelector("#search_form");
            //var post_data = JSON.stringify(_.map(
              //$search_form.querySelectorAll("input[name='tags']:checked"),
              //function(node){ return node.value; }
            //));
            //microAjax("/api/posts", function(data){
              //$posts_container.innerHTML = template("posts", {"posts": JSON.parse(data)});
            //}, post_data);
          //});

          delegate.on("click", "#random_post_button", function(event){
            event.preventDefault();
            $random_post_spinner.classList.remove('hidden');
            fetch("/api/post/random")
            .then(function(response){
              return response.json();
            })
            .then(function(posts){
              $posts_container.innerHTML = template("posts", {"posts": posts});
              $random_post_spinner.classList.add('hidden');
              router.setRoute('/post/' + posts[0]._key);
            });
          });

          router.init('random');


      }},
      attach: {value: function() {
      }},
      detach: {value: function() {
      }},
      attributeChange: {value: function(
        name, previousValue, value
      ) {
      }}
    })
  }
);
