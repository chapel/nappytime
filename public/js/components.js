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
<<<<<<< HEAD
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.doesCatHaveChosen(), this.props.index);
    return false;
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.value;
=======
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.restaurants;
>>>>>>> Move files around and stuff
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
<<<<<<< HEAD
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
=======
      return RoomPaneRestaurant( {data:eat, index:index, parentIndex:this.props.index, mode:this.props.mode} );
    }, this);
    return (
      React.DOM.li( {className:catClass},
        React.DOM.h4(null, name),
        React.DOM.ul( {className:"list-group"},
>>>>>>> Move files around and stuff
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
<<<<<<< HEAD
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.props.data.chosen, this.props.parentIndex, this.props.index);
    return false;
  },
=======
>>>>>>> Move files around and stuff
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    }
    return (
<<<<<<< HEAD
      React.DOM.li( {className:eatClass, onClick:this.onToggle}, 
=======
      React.DOM.li( {className:eatClass},
>>>>>>> Move files around and stuff
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
    console.log(arguments);
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
    for (var i = 0; i < cat.value.length; i++) {
      if (cat.value[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    return this.props.categories
    .filter(function (cat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return this.doesCatHaveChosen(cat);
      }
    }, this)
    .map(function (cat, index) {
<<<<<<< HEAD
      return RoomPaneCategory( 
                {data:cat, 
                index:index, 
                mode:this.state.mode, 
                choose:this.clickChosen} );
=======
      return RoomPaneCategory( {data:cat, index:index, mode:this.state.mode} );
>>>>>>> Move files around and stuff
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
console.log(room);

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    var self = this;
    room.createRoom({location: 'mountain view'}, function (err, res) {
      console.log(res);
      self.setState(res);
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
<<<<<<< HEAD
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLW1vZGFsLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvcmVhY3Qvc3JjL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy9yb29tLXBhbmUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9yZWFjdC9zcmMvcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9yZWFjdC9zcmMvcm9vbS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL3JlYWN0L3NyYy90aW1lci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm93XCJ9LCBcbiAgICAgICAgXCIgTW9kYWwgUGFuZSBcIlxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS52YWx1ZTtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIG5hbWUgPSBjYXQubmFtZVxuICAgICAgLCByZXN0YXVyYW50cyA9IGNhdC52YWx1ZTtcbiAgICB2YXIgY2F0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLWNhdFwiO1xuICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCkpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH1cbiAgICB2YXIgcmVuZGVyZWQgPSByZXN0YXVyYW50c1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGVhdCkge1xuICAgICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKGVhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZVJlc3RhdXJhbnQoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmVhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGV4OnRoaXMucHJvcHMuaW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5wcm9wcy5tb2RlLFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLnByb3BzLmNob29zZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIG5hbWUpLFxuICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICByZW5kZXJlZFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIG9uVG9nZ2xlOiBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMuY2hvb3NlKCF0aGlzLnByb3BzLmRhdGEuY2hvc2VuLCB0aGlzLnByb3BzLnBhcmVudEluZGV4LCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlYXQgPSB0aGlzLnByb3BzLmRhdGFcbiAgICAgICwgZWF0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLXJlc3RcIjtcbiAgICBpZiAoZWF0LmNob3Nlbikge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgY2hvc2VuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6ZWF0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBlYXQubmFtZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCcpO1xuXG52YXIgUm9vbVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdmcm96ZW4nXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzdGF1cmFudHM6IFtcbiAgICAgICAgeyBcbiAgICAgICAgICBuYW1lOiAnVGhhaScsIFxuICAgICAgICAgIHZhbHVlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdBbWFyaW4nLFxuICAgICAgICAgICAgICBsb2NhdGlvbjogJ1NvbWV0aGluZycsXG4gICAgICAgICAgICAgIGNob3NlbjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICBuYW1lOiAnSW5kaWFuJyxcbiAgICAgICAgICB2YWx1ZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnU2Frb29uJyxcbiAgICAgICAgICAgICAgbG9jYXRpb246ICdTb21ldGhpbmcnLFxuICAgICAgICAgICAgICBjaG9zZW46IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdBbWJlcicsXG4gICAgICAgICAgICAgIGxvY2F0aW9uOiAnU29tZXRoaW5nJyxcbiAgICAgICAgICAgICAgY2hvc2VuOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnU2hpdmFcXCdzJyxcbiAgICAgICAgICAgICAgbG9jYXRpb246ICdTb21ldGhpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IFxuICAgICAgICAgIG5hbWU6ICdKYXBhbmVzZScsXG4gICAgICAgICAgdmFsdWU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ1NVU0hJVE9NSScsXG4gICAgICAgICAgICAgIGxvY2F0aW9uOiAnU29tZXRoaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcgPyAnZnJvemVuJyA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tDaG9zZW46IGZ1bmN0aW9uIChpc0Nob3NlbiwgY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4KSB7XG4gICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgd2hvbGUgY2F0ZWdvcnlcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuc3RhdGUucmVzdGF1cmFudHNbY2F0ZWdvcnlJbmRleF07XG4gICAgICAgIHRvZ2dsZUNhdC52YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uIChlYXQpIHtcbiAgICAgICAgICBlYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMuc3RhdGUucmVzdGF1cmFudHNbY2F0ZWdvcnlJbmRleF0udmFsdWVbcmVzdGF1cmFudEluZGV4XTtcbiAgICAgICAgdG9nZ2xlRWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSgpO1xuICAgIH1cbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uIChjYXQpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYXQudmFsdWVbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICByZW5kZXJDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUucmVzdGF1cmFudHNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChjYXQpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0Jykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKGNhdCk7XG4gICAgICB9XG4gICAgfSwgdGhpcylcbiAgICAubWFwKGZ1bmN0aW9uIChjYXQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUm9vbVBhbmVDYXRlZ29yeSggXG4gICAgICAgICAgICAgICAge2RhdGE6Y2F0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLnN0YXRlLm1vZGUsIFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLmNsaWNrQ2hvc2VufSApO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuICByZW5kZXJCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgICAgXCIgw5cgXCJcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge3R5cGU6XCJidXR0b25cIiwgY2xhc3NOYW1lOlwicHVsbC1yaWdodCBidG4gYnRuLWRlZmF1bHRcIiwgb25DbGljazp0aGlzLnRvZ2dsZU1vZGV9LCBcbiAgICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwifSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udGFibGUoIHtjbGFzc05hbWU6XCJ0YWJsZVwiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3JpZXMoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKCB7Y2xhc3NOYW1lOlwiYnV0dG9uUm93XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uKClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFBlb3BsZVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdzbWFsbCcsXG4gICAgICBwZW9wbGU6IFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGVvcGxlOiBbXG4gICAgICAgIHsgbmFtZTogJ0FsaWNlJywgaWQ6ICcxMjMnLCBzdGF0ZTogJ3dhaXRpbmcnIH0sXG4gICAgICAgIHsgbmFtZTogJ0JvYicsIGlkOiAnNDU2Jywgc3RhdGU6ICdmaW5pc2hlZCcgfSxcbiAgICAgICAgeyBuYW1lOiAnQ2hhcmxpZScsIGlkOiAnNzg5Jywgc3RhdGU6ICdmaW5pc2hlZCcgfVxuICAgICAgXVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJTbWFsbE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXNnID0gXCJcIlxuICAgICAgLCBoYXNQaWNrZWQgPSAwO1xuICAgIGlmICghdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoKSB7XG4gICAgICBtc2cgPSBcIllvdSdyZSBhbGwgYWxvbmUuLi5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLnBlb3BsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5wZW9wbGVbaV0uc3RhdGUgPT09ICdmaW5pc2hlZCcpIHtcbiAgICAgICAgICBoYXNQaWNrZWQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXNnID0gaGFzUGlja2VkICsgXCIgb2YgXCIgKyB0aGlzLnN0YXRlLnBlb3BsZS5sZW5ndGggKyBcIiBoYXZlIGNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gbXNnO1xuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5zdGF0ZS5tb2RlID09PSAnc21hbGwnID8gJ2xhcmdlJyA6ICdzbWFsbCcpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlclNtYWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU21hbGxNZXNzYWdlKCk7XG4gIH0sXG4gIHJlbmRlclBlb3BsZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnBlb3BsZS5tYXAoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgcmV0dXJuIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTpcInBlcnNvbiB7cGVyc29uLnN0YXRlfVwifSwgcGVyc29uLm5hbWUpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlckxhcmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS51bChudWxsLCBcbiAgICAgICAgdGhpcy5yZW5kZXJQZW9wbGUoKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm93IGJ0bi1saW5rXCIsICdkYXRhLW1vZGUnOnRoaXMuc3RhdGUubW9kZSwgb25DbGljazp0aGlzLnRvZ2dsZU1vZGV9LCBcbiAgICAgICAgdGhpcy5zdGF0ZS5tb2RlID09PSAnc21hbGwnID8gdGhpcy5yZW5kZXJTbWFsbCgpIDogdGhpcy5yZW5kZXJMYXJnZSgpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGVvcGxlID0gcmVxdWlyZSgnLi9yb29tLXBlb3BsZS5qc3gnKVxuICAsIFJvb21QYW5lID0gcmVxdWlyZSgnLi9yb29tLXBhbmUuanN4JylcbiAgLCBSb29tTW9kYWwgPSByZXF1aXJlKCcuL3Jvb20tbW9kYWwuanN4Jyk7XG5cbnZhciBSb29tID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwifSwgXG4gICAgICAgIFJvb21QZW9wbGUobnVsbCApLFxuICAgICAgICBSb29tUGFuZShudWxsICksXG4gICAgICAgIFJvb21Nb2RhbChudWxsIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFRpbWVyID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7IHRpbWU6ICdOL0EnIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkRnJvbVNlcnZlciAoKTtcbiAgICAvL3NldEludGVydmFsKHRoaXMubG9hZEZyb21TZXJ2ZXIsIHRoaXMucHJvcHMucG9sbEludGVydmFsKTtcbiAgfSxcbiAgbG9hZEZyb21TZXJ2ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy51cmwsXG4gICAgICBkYXRlVHlwZTogJ2pzb24nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoeyB0aW1lOiBwYXlsb2FkLnRpbWUgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5oMShudWxsLCB0aGlzLnN0YXRlLnRpbWUpXG4gICAgKTtcbiAgfVxufSk7Il19
=======
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tLXBhbmUtY2F0ZWdvcnkuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20tcGVvcGxlLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3RpbWVyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvd1wifSwgXG4gICAgICAgIFwiIE1vZGFsIFBhbmUgXCJcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lUmVzdGF1cmFudCA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4Jyk7XG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdGF1cmFudHMgPSB0aGlzLnByb3BzLmRhdGEudmFsdWU7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXN0YXVyYW50c1tpXS5jaG9zZW4pIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYXQgPSB0aGlzLnByb3BzLmRhdGFcbiAgICAgICwgbmFtZSA9IGNhdC5uYW1lXG4gICAgICAsIHJlc3RhdXJhbnRzID0gY2F0LnJlc3RhdXJhbnRzO1xuICAgIHZhciBjYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tY2F0XCI7XG4gICAgaWYgKHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSkge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgY2hvc2VuXCI7XG4gICAgfVxuICAgIHZhciByZW5kZXJlZCA9IHJlc3RhdXJhbnRzXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoZWF0KSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpXG4gICAgLm1hcChmdW5jdGlvbiAoZWF0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lUmVzdGF1cmFudCgge2RhdGE6ZWF0LCBpbmRleDppbmRleCwgcGFyZW50SW5kZXg6dGhpcy5wcm9wcy5pbmRleCwgbW9kZTp0aGlzLnByb3BzLm1vZGV9ICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTpjYXRDbGFzc30sIFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgbmFtZSksXG4gICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICAgIHJlbmRlcmVkXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lUmVzdGF1cmFudCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBlYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tcmVzdFwiO1xuICAgIGlmIChlYXQuY2hvc2VuKSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTplYXRDbGFzc30sIFxuICAgICAgICBlYXQubmFtZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCcpO1xuXG52YXIgUm9vbVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdmcm96ZW4nXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcgPyAnZnJvemVuJyA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uIChjYXQpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYXQudmFsdWVbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICByZW5kZXJDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2F0ZWdvcmllc1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNhdCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oY2F0KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZUNhdGVnb3J5KCB7ZGF0YTpjYXQsIGluZGV4OmluZGV4LCBtb2RlOnRoaXMuc3RhdGUubW9kZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICAgIFwiIMOXIFwiXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIn0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKCB7Y2xhc3NOYW1lOlwidGFibGVcIiwgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yaWVzKClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2NsYXNzTmFtZTpcImJ1dHRvblJvd1wifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJ1dHRvbigpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnLFxuICAgICAgcGVvcGxlOiBbXVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBlb3BsZTogW1xuICAgICAgICB7IG5hbWU6ICdBbGljZScsIGlkOiAnMTIzJywgc3RhdGU6ICd3YWl0aW5nJyB9LFxuICAgICAgICB7IG5hbWU6ICdCb2InLCBpZDogJzQ1NicsIHN0YXRlOiAnZmluaXNoZWQnIH0sXG4gICAgICAgIHsgbmFtZTogJ0NoYXJsaWUnLCBpZDogJzc4OScsIHN0YXRlOiAnZmluaXNoZWQnIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGxNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1zZyA9IFwiXCJcbiAgICAgICwgaGFzUGlja2VkID0gMDtcbiAgICBpZiAoIXRoaXMuc3RhdGUucGVvcGxlLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJZb3UncmUgYWxsIGFsb25lLi4uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucGVvcGxlW2ldLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5zdGF0ZS5wZW9wbGUubGVuZ3RoICsgXCIgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIG1zZztcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/ICdsYXJnZScgOiAnc21hbGwnKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJTbWFsbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlclNtYWxsTWVzc2FnZSgpO1xuICB9LFxuICByZW5kZXJQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wZW9wbGUubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6XCJwZXJzb24ge3BlcnNvbi5zdGF0ZX1cIn0sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udWwobnVsbCwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvdyBidG4tbGlua1wiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGUsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/IHRoaXMucmVuZGVyU21hbGwoKSA6IHRoaXMucmVuZGVyTGFyZ2UoKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBlb3BsZSA9IHJlcXVpcmUoJy4vcm9vbS1wZW9wbGUuanN4JylcbiAgLCBSb29tUGFuZSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLmpzeCcpXG4gICwgUm9vbU1vZGFsID0gcmVxdWlyZSgnLi9yb29tLW1vZGFsLmpzeCcpXG4gICwgcm9vbSA9IHJlcXVpcmUoJ3JlYWx0aW1lL3Jvb20nKTtcbmNvbnNvbGUubG9nKHJvb20pO1xuXG52YXIgUm9vbSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcm9vbS5jcmVhdGVSb29tKHtsb2NhdGlvbjogJ21vdW50YWluIHZpZXcnfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgc2VsZi5zZXRTdGF0ZShyZXMpO1xuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwifSwgXG4gICAgICAgIFJvb21QZW9wbGUobnVsbCApLFxuICAgICAgICBSb29tUGFuZSgge2NhdGVnb3JpZXM6dGhpcy5zdGF0ZS5jYXRlZ29yaWVzfSksXG4gICAgICAgIFJvb21Nb2RhbChudWxsIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFRpbWVyID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7IHRpbWU6ICdOL0EnIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkRnJvbVNlcnZlciAoKTtcbiAgICAvL3NldEludGVydmFsKHRoaXMubG9hZEZyb21TZXJ2ZXIsIHRoaXMucHJvcHMucG9sbEludGVydmFsKTtcbiAgfSxcbiAgbG9hZEZyb21TZXJ2ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy51cmwsXG4gICAgICBkYXRlVHlwZTogJ2pzb24nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoeyB0aW1lOiBwYXlsb2FkLnRpbWUgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5oMShudWxsLCB0aGlzLnN0YXRlLnRpbWUpXG4gICAgKTtcbiAgfVxufSk7Il19
>>>>>>> Move files around and stuff
;