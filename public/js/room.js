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
    var restaurants = this.props.data.restaurants;
    var hasChosen = false;
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.doesCatHaveChosen(), this.props.index);
    return false;
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.restaurants;
    console.log(restaurants)
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
      return RoomPaneRestaurant( 
                {data:eat, 
                index:index, 
                parentIndex:this.props.index, 
                mode:this.props.mode,
                choose:this.props.choose} );
    }, this);
    return (
      React.DOM.li( {className:catClass, onClick:this.onToggle}, 
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
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.props.data.chosen, this.props.parentIndex, this.props.index);
    return false;
  },
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    }
    return (
      React.DOM.li( {className:eatClass, onClick:this.onToggle}, 
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
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? 'frozen' : 'edit')
    });
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.state.restaurants[categoryIndex];
        toggleCat.value.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.state.restaurants[categoryIndex].value[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    }
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.restaurants.length; i++) {
      if (cat.restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    return this.props.categories
    .filter(function (cat) {
      if (self.state.mode === 'edit') {
        return true;
      } else {
        return self.doesCatHaveChosen(cat);
      }
    })
    .map(function (cat, index) {
      return RoomPaneCategory( 
                {data:cat, 
                index:index, 
                mode:this.state.mode, 
                choose:this.clickChosen} );
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
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {location: {}, categories: []};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    var self = this;
    room.createRoom({location: roomLocation || 'mountain view'}, function (err, res) {
      self.setState({location: res.location, categories: res.categories});
    });
  },
  render: function () {
    return (
      React.DOM.div( {id:"room"}, 
        RoomPeople(null ),
        RoomPane( {categories:this.state.categories}),
        RoomModal(null )
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);
},{"./room-modal.jsx":1,"./room-pane.jsx":4,"./room-people.jsx":5}]},{},[1,2,3,4,5,6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1tb2RhbC5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLXBlb3BsZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm93XCJ9LCBcbiAgICAgICAgXCIgTW9kYWwgUGFuZSBcIlxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS5yZXN0YXVyYW50cztcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIG5hbWUgPSBjYXQubmFtZVxuICAgICAgLCByZXN0YXVyYW50cyA9IGNhdC5yZXN0YXVyYW50cztcbiAgICBjb25zb2xlLmxvZyhyZXN0YXVyYW50cylcbiAgICB2YXIgY2F0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLWNhdFwiO1xuICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCkpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH1cbiAgICB2YXIgcmVuZGVyZWQgPSByZXN0YXVyYW50c1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGVhdCkge1xuICAgICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKGVhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZVJlc3RhdXJhbnQoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmVhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGV4OnRoaXMucHJvcHMuaW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5wcm9wcy5tb2RlLFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLnByb3BzLmNob29zZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIG5hbWUpLFxuICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICByZW5kZXJlZFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIG9uVG9nZ2xlOiBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMuY2hvb3NlKCF0aGlzLnByb3BzLmRhdGEuY2hvc2VuLCB0aGlzLnByb3BzLnBhcmVudEluZGV4LCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlYXQgPSB0aGlzLnByb3BzLmRhdGFcbiAgICAgICwgZWF0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLXJlc3RcIjtcbiAgICBpZiAoZWF0LmNob3Nlbikge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgY2hvc2VuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6ZWF0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBlYXQubmFtZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCcpO1xuXG52YXIgUm9vbVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdmcm96ZW4nXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcgPyAnZnJvemVuJyA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tDaG9zZW46IGZ1bmN0aW9uIChpc0Nob3NlbiwgY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBpZiAodHlwZW9mKHJlc3RhdXJhbnRJbmRleCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHdob2xlIGNhdGVnb3J5XG4gICAgICAgIHZhciB0b2dnbGVDYXQgPSB0aGlzLnN0YXRlLnJlc3RhdXJhbnRzW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQudmFsdWUuZm9yRWFjaChmdW5jdGlvbiAoZWF0KSB7XG4gICAgICAgICAgZWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHNpbmdsZSByZXN0YXVyYW50XG4gICAgICAgIHZhciB0b2dnbGVFYXQgPSB0aGlzLnN0YXRlLnJlc3RhdXJhbnRzW2NhdGVnb3J5SW5kZXhdLnZhbHVlW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5jaG9zZW4gPSBpc0Nob3NlbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoKTtcbiAgICB9XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoY2F0KSB7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0LnJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2F0LnJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgcmVuZGVyQ2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jYXRlZ29yaWVzXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoY2F0KSB7XG4gICAgICBpZiAoc2VsZi5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5kb2VzQ2F0SGF2ZUNob3NlbihjYXQpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLm1hcChmdW5jdGlvbiAoY2F0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lQ2F0ZWdvcnkoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmNhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5zdGF0ZS5tb2RlLCBcbiAgICAgICAgICAgICAgICBjaG9vc2U6dGhpcy5jbGlja0Nob3Nlbn0gKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICAgIFwiIMOXIFwiXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKCB7Y2xhc3NOYW1lOlwidGFibGVcIiwgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yaWVzKClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2NsYXNzTmFtZTpcImJ1dHRvblJvd1wifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJ1dHRvbigpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnLFxuICAgICAgcGVvcGxlOiBbXVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBlb3BsZTogW1xuICAgICAgICB7IG5hbWU6ICdBbGljZScsIGlkOiAnMTIzJywgc3RhdGU6ICd3YWl0aW5nJyB9LFxuICAgICAgICB7IG5hbWU6ICdCb2InLCBpZDogJzQ1NicsIHN0YXRlOiAnZmluaXNoZWQnIH0sXG4gICAgICAgIHsgbmFtZTogJ0NoYXJsaWUnLCBpZDogJzc4OScsIHN0YXRlOiAnZmluaXNoZWQnIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGxNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1zZyA9IFwiXCJcbiAgICAgICwgaGFzUGlja2VkID0gMDtcbiAgICBpZiAoIXRoaXMuc3RhdGUucGVvcGxlLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJZb3UncmUgYWxsIGFsb25lLi4uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucGVvcGxlW2ldLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoICsgXCIgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIG1zZztcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/ICdsYXJnZScgOiAnc21hbGwnKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJTbWFsbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlclNtYWxsTWVzc2FnZSgpO1xuICB9LFxuICByZW5kZXJQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wZW9wbGUubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6XCJwZXJzb24ge3BlcnNvbi5zdGF0ZX1cIn0sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udWwobnVsbCwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvdyBidG4tbGlua1wiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGUsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/IHRoaXMucmVuZGVyU21hbGwoKSA6IHRoaXMucmVuZGVyTGFyZ2UoKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBlb3BsZSA9IHJlcXVpcmUoJy4vcm9vbS1wZW9wbGUuanN4JylcbiAgLCBSb29tUGFuZSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLmpzeCcpXG4gICwgUm9vbU1vZGFsID0gcmVxdWlyZSgnLi9yb29tLW1vZGFsLmpzeCcpXG4gICwgcm9vbSA9IHJlcXVpcmUoJ3JlYWx0aW1lL3Jvb20nKTtcblxudmFyIFJvb20gPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtsb2NhdGlvbjoge30sIGNhdGVnb3JpZXM6IFtdfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByb29tLmNyZWF0ZVJvb20oe2xvY2F0aW9uOiByb29tTG9jYXRpb24gfHwgJ21vdW50YWluIHZpZXcnfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtsb2NhdGlvbjogcmVzLmxvY2F0aW9uLCBjYXRlZ29yaWVzOiByZXMuY2F0ZWdvcmllc30pO1xuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwifSwgXG4gICAgICAgIFJvb21QZW9wbGUobnVsbCApLFxuICAgICAgICBSb29tUGFuZSgge2NhdGVnb3JpZXM6dGhpcy5zdGF0ZS5jYXRlZ29yaWVzfSksXG4gICAgICAgIFJvb21Nb2RhbChudWxsIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pOyJdfQ==
;