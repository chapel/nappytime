;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

var RoomModal = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
  },
  render: function () {
    return (
      React.DOM.div( {className:"row"}, 
        " Modal Pane "
      )
    );
  }
});
},{}],2:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPaneRestaurant = require('./room-pane-restaurant.jsx');

var RoomPaneCategory = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  doesCatHaveChosen: function () {
    var restaurants = this.props.data.value;
    var hasChosen = false;
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.value;
    var catClass = "list-group-item room-cat";
    if (this.doesCatHaveChosen()) {
      catClass += " chosen";
    }
    var rendered = restaurants
    .filter(function (eat) {
      if (this.props.mode === 'edit') {
        return true;
      } else {
        return this.doesCatHaveChosen();
      }
    }, this)
    .map(function (eat, index) {
      return RoomPaneRestaurant( {data:eat, index:index, parentIndex:this.props.index, mode:this.props.mode} );
    }, this);
    return (
      React.DOM.li( {className:catClass}, 
        React.DOM.h4(null, name),
        React.DOM.ul( {className:"list-group"}, 
          rendered
        )
      )
    );
  }
});
},{"./room-pane-restaurant.jsx":3}],3:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
  },
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    }
    return (
      React.DOM.li( {className:eatClass}, 
        eat.name
      )
    );
  }
});
},{}],4:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPaneCategory = require('./room-pane-category.jsx');

var RoomPane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'frozen'
    };
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState({
      restaurants: [
        { 
          name: 'Thai', 
          value: [
            {
              name: 'Amarin',
              location: 'Something',
              chosen: true
            }
          ]
        },
        { 
          name: 'Indian',
          value: [
            {
              name: 'Sakoon',
              location: 'Something',
              chosen: true
            },
            {
              name: 'Amber',
              location: 'Something',
              chosen: true
            },
            {
              name: 'Shiva\'s',
              location: 'Something'
            }
          ]
        },
        { 
          name: 'Japanese',
          value: [
            {
              name: 'SUSHITOMI',
              location: 'Something'
            }
          ]
        }
      ]
    });
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? 'frozen' : 'edit')
    });
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.value.length; i++) {
      if (cat.value[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    return this.state.restaurants
    .filter(function (cat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return this.doesCatHaveChosen(cat);
      }
    }, this)
    .map(function (cat, index) {
      return RoomPaneCategory( {data:cat, index:index, mode:this.state.mode} );
    }, this);
  },
  renderButton: function () {
    if (this.state.mode === 'edit') {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.toggleMode}, 
          " × "
        )
      );
    } else {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.toggleMode}, 
          React.DOM.span( {className:"glyphicon glyphicon-edit"})
        )
      );
    }
  },
  render: function () {
    return (
      React.DOM.table( {className:"table", 'data-mode':this.state.mode}, 
        React.DOM.tr(null, 
          React.DOM.td(null, 
            React.DOM.ul( {className:"list-group"}, 
              this.renderCategories()
            )
          ),
          React.DOM.td( {className:"buttonRow"}, 
            this.renderButton()
          )
        )
      )
    );
  }
});
},{"./room-pane-category.jsx":2}],5:[function(require,module,exports){
/** @jsx React.DOM */

var PeoplePane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'small',
      people: []
    };
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState({
      people: [
        { name: 'Alice', id: '123', state: 'waiting' },
        { name: 'Bob', id: '456', state: 'finished' },
        { name: 'Charlie', id: '789', state: 'finished' }
      ]
    });
  },
  renderSmallMessage: function () {
    var msg = ""
      , hasPicked = 0;
    if (!this.state.people.length) {
      msg = "You're all alone...";
    } else {
      for (var i = 0; i < this.state.people.length; i++) {
        if (this.state.people[i].state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.state.people.length + " have chosen";
    }
    return msg;
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'small' ? 'large' : 'small')
    });
  },
  renderSmall: function () {
    return this.renderSmallMessage();
  },
  renderPeople: function () {
    return this.state.people.map(function (person) {
      return React.DOM.li( {className:"person {person.state}"}, person.name)
    });
  },
  renderLarge: function () {
    return (
      React.DOM.ul(null, 
        this.renderPeople()
      )
    );
  },
  render: function () {
    return (
      React.DOM.div( {className:"row btn-link", 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()
      )
    );
  }
});
},{}],6:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
  },
  render: function () {
    return (
      React.DOM.div( {id:"room"}, 
        RoomPeople(null ),
        RoomPane(null ),
        RoomModal(null )
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);
},{"./room-modal.jsx":1,"./room-pane.jsx":4,"./room-people.jsx":5}],7:[function(require,module,exports){
/** @jsx React.DOM */
var Timer = module.exports = React.createClass({
  getInitialState: function () {
    return { time: 'N/A' };
  },
  componentWillMount: function() {
    this.loadFromServer ();
    //setInterval(this.loadFromServer, this.props.pollInterval);
  },
  loadFromServer: function () {
    var self = this;
    $.ajax({
      url: this.props.url,
      dateType: 'json',
      success: function (payload) {
        console.log(payload);
        self.setState({ time: payload.time });
      }
    })
  },
  render: function () {
    return (
      React.DOM.h1(null, this.state.time)
    );
  }
});
},{}]},{},[1,2,3,4,5,6,7])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLW1vZGFsLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvcmVhY3Qvc3JjL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLXBhbmUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9yZWFjdC9zcmMvcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9yZWFjdC9zcmMvcm9vbS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy90aW1lci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm93XCJ9LCBcbiAgICAgICAgXCIgTW9kYWwgUGFuZSBcIlxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS52YWx1ZTtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBuYW1lID0gY2F0Lm5hbWVcbiAgICAgICwgcmVzdGF1cmFudHMgPSBjYXQudmFsdWU7XG4gICAgdmFyIGNhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1jYXRcIjtcbiAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpKSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9XG4gICAgdmFyIHJlbmRlcmVkID0gcmVzdGF1cmFudHNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChlYXQpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdlZGl0Jykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCk7XG4gICAgICB9XG4gICAgfSwgdGhpcylcbiAgICAubWFwKGZ1bmN0aW9uIChlYXQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUm9vbVBhbmVSZXN0YXVyYW50KCB7ZGF0YTplYXQsIGluZGV4OmluZGV4LCBwYXJlbnRJbmRleDp0aGlzLnByb3BzLmluZGV4LCBtb2RlOnRoaXMucHJvcHMubW9kZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzfSwgXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBuYW1lKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgICAgcmVuZGVyZWRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWF0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIGVhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1yZXN0XCI7XG4gICAgaWYgKGVhdC5jaG9zZW4pIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmVhdENsYXNzfSwgXG4gICAgICAgIGVhdC5uYW1lXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtY2F0ZWdvcnkuanN4Jyk7XG5cbnZhciBSb29tUGFuZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2Zyb3plbidcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZCgpO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZXN0YXVyYW50czogW1xuICAgICAgICB7IFxuICAgICAgICAgIG5hbWU6ICdUaGFpJywgXG4gICAgICAgICAgdmFsdWU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ0FtYXJpbicsXG4gICAgICAgICAgICAgIGxvY2F0aW9uOiAnU29tZXRoaW5nJyxcbiAgICAgICAgICAgICAgY2hvc2VuOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IFxuICAgICAgICAgIG5hbWU6ICdJbmRpYW4nLFxuICAgICAgICAgIHZhbHVlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdTYWtvb24nLFxuICAgICAgICAgICAgICBsb2NhdGlvbjogJ1NvbWV0aGluZycsXG4gICAgICAgICAgICAgIGNob3NlbjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ0FtYmVyJyxcbiAgICAgICAgICAgICAgbG9jYXRpb246ICdTb21ldGhpbmcnLFxuICAgICAgICAgICAgICBjaG9zZW46IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdTaGl2YVxcJ3MnLFxuICAgICAgICAgICAgICBsb2NhdGlvbjogJ1NvbWV0aGluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHsgXG4gICAgICAgICAgbmFtZTogJ0phcGFuZXNlJyxcbiAgICAgICAgICB2YWx1ZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnU1VTSElUT01JJyxcbiAgICAgICAgICAgICAgbG9jYXRpb246ICdTb21ldGhpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0JyA/ICdmcm96ZW4nIDogJ2VkaXQnKVxuICAgIH0pO1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKGNhdCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdC52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNhdC52YWx1ZVtpXS5jaG9zZW4pIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIHJlbmRlckNhdGVnb3JpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5yZXN0YXVyYW50c1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNhdCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oY2F0KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZUNhdGVnb3J5KCB7ZGF0YTpjYXQsIGluZGV4OmluZGV4LCBtb2RlOnRoaXMuc3RhdGUubW9kZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICAgIFwiIMOXIFwiXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKCB7Y2xhc3NOYW1lOlwidGFibGVcIiwgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yaWVzKClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2NsYXNzTmFtZTpcImJ1dHRvblJvd1wifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJ1dHRvbigpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnLFxuICAgICAgcGVvcGxlOiBbXVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBlb3BsZTogW1xuICAgICAgICB7IG5hbWU6ICdBbGljZScsIGlkOiAnMTIzJywgc3RhdGU6ICd3YWl0aW5nJyB9LFxuICAgICAgICB7IG5hbWU6ICdCb2InLCBpZDogJzQ1NicsIHN0YXRlOiAnZmluaXNoZWQnIH0sXG4gICAgICAgIHsgbmFtZTogJ0NoYXJsaWUnLCBpZDogJzc4OScsIHN0YXRlOiAnZmluaXNoZWQnIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGxNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1zZyA9IFwiXCJcbiAgICAgICwgaGFzUGlja2VkID0gMDtcbiAgICBpZiAoIXRoaXMuc3RhdGUucGVvcGxlLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJZb3UncmUgYWxsIGFsb25lLi4uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucGVvcGxlW2ldLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoICsgXCIgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIG1zZztcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/ICdsYXJnZScgOiAnc21hbGwnKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJTbWFsbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlclNtYWxsTWVzc2FnZSgpO1xuICB9LFxuICByZW5kZXJQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wZW9wbGUubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6XCJwZXJzb24ge3BlcnNvbi5zdGF0ZX1cIn0sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udWwobnVsbCwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvdyBidG4tbGlua1wiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGUsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/IHRoaXMucmVuZGVyU21hbGwoKSA6IHRoaXMucmVuZGVyTGFyZ2UoKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBlb3BsZSA9IHJlcXVpcmUoJy4vcm9vbS1wZW9wbGUuanN4JylcbiAgLCBSb29tUGFuZSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLmpzeCcpXG4gICwgUm9vbU1vZGFsID0gcmVxdWlyZSgnLi9yb29tLW1vZGFsLmpzeCcpO1xuXG52YXIgUm9vbSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtpZDpcInJvb21cIn0sIFxuICAgICAgICBSb29tUGVvcGxlKG51bGwgKSxcbiAgICAgICAgUm9vbVBhbmUobnVsbCApLFxuICAgICAgICBSb29tTW9kYWwobnVsbCApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlckNvbXBvbmVudChcbiAgUm9vbSgge3VybDpcIi9yZWFsdGltZVwifSApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vbS1jb250YWluZXInKVxuKTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBUaW1lciA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4geyB0aW1lOiAnTi9BJyB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZEZyb21TZXJ2ZXIgKCk7XG4gICAgLy9zZXRJbnRlcnZhbCh0aGlzLmxvYWRGcm9tU2VydmVyLCB0aGlzLnByb3BzLnBvbGxJbnRlcnZhbCk7XG4gIH0sXG4gIGxvYWRGcm9tU2VydmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMucHJvcHMudXJsLFxuICAgICAgZGF0ZVR5cGU6ICdqc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xuICAgICAgICBzZWxmLnNldFN0YXRlKHsgdGltZTogcGF5bG9hZC50aW1lIH0pO1xuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgdGhpcy5zdGF0ZS50aW1lKVxuICAgICk7XG4gIH1cbn0pOyJdfQ==
;