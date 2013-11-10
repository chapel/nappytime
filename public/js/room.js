;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
var RoomCountdown = require('./room-countdown.jsx');

var RoomModal = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function() {
    var self = this
      , onCountdown = function onCountdown(countVal) {
          self.setState({
            countdown: countVal
          });
          setTimeout(function () {
            if (countVal > 1) {
              onCountdown(countVal - 1);
            } else {
              self.props.onFinish();
            }
          }, 1000);
        };
    onCountdown(this.props.countdown);
  },
  renderCountdown: function () {
    var min = (this.state.countdown / 60) | 0
      , sec = (this.state.countdown % 60);
    return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  },
  render: function () {
    return (
      React.DOM.h2(null, "Picking a winner in ", this.renderCountdown())
    );
  }
});
},{"./room-countdown.jsx":1}],2:[function(require,module,exports){
/** @jsx React.DOM */
var RoomCountdown = require('./room-countdown.jsx')

var RoomModal = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  // The following two methods are the only places we need to
  // integrate with Bootstrap or jQuery!
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.getDOMNode())
      .modal({backdrop: 'static', keyboard: false, show: false});
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden');
  },
  close: function() {
    $(this.getDOMNode()).modal('hide');
  },
  open: function() {
    $(this.getDOMNode()).modal('show');
  },
  startCountdown: function () {
    this.setState({
      mode: 'countdown'
    });
    this.open();
  },
  afterCountdown: function () {
    this.close();
    this.props.parent.chooseWinner();
  },
  renderBody: function () {
    if (this.state.mode === 'countdown') {
      return (
        RoomCountdown( {countdown:1, onFinish:this.afterCountdown} )
      );
    }
  },
  render: function () {
    return (
      React.DOM.div( {className:"modal fade"}, 
        React.DOM.div( {className:"modal-dialog"}, 
          React.DOM.div( {className:"modal-content"}, 
            this.renderBody()
          )
        )
      )
    );
  }
});
},{"./room-countdown.jsx":1}],3:[function(require,module,exports){
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
  renderLabel: function () {
    if (this.props.mode === 'frozen' && this.props.data.veto) {
      return (
        React.DOM.span( {className:"label label-danger"}, "Vetoed!")
      );
    }
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.restaurants;
    var catClass = "list-group-item room-cat";
    if (this.doesCatHaveChosen()) {
      catClass += " chosen";
    } else {
      catClass += " not-chosen";
    }
    if (cat.wins) {
      catClass += " winner";
    }
    var rendered = restaurants
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
        React.DOM.h4(null, name, this.renderLabel()),
        React.DOM.ul( {className:"list-group"}, 
          rendered
        )
      )
    );
  }
});
},{"./room-pane-restaurant.jsx":4}],4:[function(require,module,exports){
/** @jsx React.DOM */
var RoomRestaurantDetails = require('./room-restaurant-details.jsx');

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.props.data.chosen, this.props.parentIndex, this.props.index);
    return false;
  },
  renderLabel: function () {
    if (this.props.mode === 'frozen' && this.props.data.roundChosen) {
      return (
        React.DOM.span( {className:"label label-success"}, "Chosen!")
      );
    }
  },
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    } else {
      eatClass += " not-chosen";
    }
    if (eat.wins) {
      eatClass += " winner";
    }
    return (
      React.DOM.li( {className:eatClass, onClick:this.onToggle}, 
        React.DOM.div( {className:"restaurant-details-wrapper"}, 
          React.DOM.span( {className:"small"}, eat.name, this.renderLabel()),
          RoomRestaurantDetails( {data:eat} )
        )
      )
    );
  }
});
},{"./room-restaurant-details.jsx":7}],5:[function(require,module,exports){
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
      mode: this.getFrozenState()
    });
  },
  getFrozenState: function () {
    if (!this.isAnyCatChosen()) {
      return 'needChoice';
    } else {
      return 'frozen';
    }
  },
  initDone: function () {
    if (this.props.parent.state.isNew) {
      this.props.parent.saveRoom();
    } else {
      this.props.parent.refs.modal.startCountdown();
    }
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  getCategories: function () {
    return this.props.parent.state.categories;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.restaurants.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    } else if (this.state.mode === 'frozen') {
      // do nothing if in new mode
      if (this.props.parent.state.isNew) {
        return false;
      }
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.getCategories()[ij[0]].restaurants[ij[1]].roundChosen;
        }
        if (toggleEat.roundChosen) {
          this.setState({ roundChosen: [categoryIndex, restaurantIndex] });
        } else {
          this.setState({ roundChosen: null });
        }
      }
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
  isAnyCatChosen: function () {
    var hasChosen = false;
    for (var i = 0; i < this.getCategories().length; i++) {
      var cat = this.getCategories()[i];
      if (this.doesCatHaveChosen(cat)) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    var rendered = this.getCategories()
    .map(function (cat, index) {
      return RoomPaneCategory( 
                {data:cat, 
                index:index, 
                mode:this.state.mode, 
                choose:this.clickChosen} );
    }, this);
    return (
      React.DOM.ul( {className:"list-group"}, 
        rendered
      )
    );
            
  },
  renderButtonEdit: function () {
    var buttonMessage = 'Edit';
    if (this.state.mode === 'edit') {
      buttonMessage = 'Close';
    }
    return (
      React.DOM.button( {type:"button", className:"btn-edit pull-right btn btn-default", onClick:this.toggleMode}, 
        buttonMessage
      )
    );
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    if (this.state.mode === 'frozen') {
      return (
        React.DOM.div( {className:"room-info pull-right"}, 
          React.DOM.div(null, React.DOM.span( {className:"badge"}, vetoes), " vetoed"),
          React.DOM.div(null, React.DOM.span( {className:"badge"}, roundChosen), " chosen")
        )
      );
    }
  },
  renderCallToAction: function () {
    if (this.props.hasWinner) {
      return (
        React.DOM.h4(null, "And the winner is...")
      );
    } else if (this.state.mode === 'needChoice') {
      return (
        React.DOM.h4(null, "You need to pick at least one restaurant")
      );
    } else if (this.props.parent.state.isNew) {
      return (
        React.DOM.h4(null, "Click Done to finalize your choices")
      );
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'Done';
    if (this.state.mode === 'frozen') {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.initDone}, 
          buttonMessage
        )
      );
    }
  },
  render: function () {
    var mode = this.state.mode;
    if (this.props.hasWinner) {
      mode = 'winner';
    }
    return (
      React.DOM.table( {className:"table", 'data-mode':mode}, 
        React.DOM.tr(null, 
          React.DOM.td(null, 
            this.renderCallToAction(),
            this.renderCategories()
          ),
          React.DOM.td( {className:"button-row"}, 
            React.DOM.div( {className:"button-row-fixed"}, 
              this.renderInfo(),
              React.DOM.div( {className:"clearfix"}),
              this.renderButtonEdit(),
              React.DOM.div( {className:"clearfix"}),
              this.renderButtonInit()
            )
          )
        )
      )
    );
  }
});
},{"./room-pane-category.jsx":3}],6:[function(require,module,exports){
/** @jsx React.DOM */

var PeoplePane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'small'
    };
  },
  getPeople: function () {
    return this.props.parent.state.people;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'small' ? 'large' : 'small')
    });
  },
  renderSmall: function () {
    var msg = ""
      , hasPicked = 0
      , me = this.getMe();
    if (!this.getPeople().length) {
      msg = "";
    } else {
      for (var i = 0; i < this.getPeople().length; i++) {
        var person = this.getPeople()[i];
        if (person.state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.getPeople().length + ", including me, have chosen";
    }
    return React.DOM.div( {className:"room-people-child"}, this.props.parent.state.roomId, " - ", msg);
  },
  renderPeople: function () {
    return this.getPeople()
    .filter(function (person) {
      return person._id !== this.getMe()._id;
    }, this)
    .map(function (person) {
      var personClass = 'room-people-child pull-left label label-';
      if (person.state === 'waiting') {
        personClass += 'warning';
      } else if (person.state === 'finished') {
        personClass += 'success';
      } else {
        personClass += 'default';
      }
      return React.DOM.div( {className:personClass}, person.name)
    });
  },
  renderLarge: function () {
    return (
      React.DOM.div( {className:"media room-people-child"}, 
        this.renderPeople()
      )
    );
  },
  renderNew: function () {
    return (
      React.DOM.div( {className:"room-people-new"}, 
        this.props.parent.state.roomId, " - This is a new room "
      )
    );
  },
  render: function () {
    if (!this.props.parent.state.roomId) {
      return (
        React.DOM.div(null)
      );
    }
    var peopleClass = "navbar navbar-default navbar-fixed-top room-people";
    return (
      React.DOM.nav( {className:peopleClass, 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        React.DOM.div( {className:"container"}, 
        this.renderSmall(),
        this.renderLarge(),
        this.renderNew()
        )
      )
    );
  }
});
},{}],7:[function(require,module,exports){
/** @jsx React.DOM */

var RoomRestaurantDetails = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var eat = this.props.data;
    console.log();
    return (
      React.DOM.div( {className:"restaurant-details media"}, 
        React.DOM.div( {className:"pull-left"}, 
          React.DOM.img( {class:"media-object", src:eat.image_url, alt:eat.name} )
        ),
        React.DOM.div( {class:"media-body"}, 
          React.DOM.h5( {class:"media-heading"}, eat.name),
          React.DOM.div(null, React.DOM.img( {class:"media-object", src:eat.rating_img_url_small, alt:"ratings"} )),
          React.DOM.div(null, 
            React.DOM.span(null, eat.location.address[0] + ' ' + eat.location.city)
          ),
          React.DOM.div(null, 
            React.DOM.span(null, eat.display_phone)
          )
        )
      )
    );
  }
});
},{}],8:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {location: {}, categories: [], people: [], me: {name: store.get('name') || 'Anonymous'}};
  },
  componentWillMount: function() {
    var self = this;
    this.load();
    room.onJoined(function (res) {
      self.setState({people: res.current});
    });
    room.onLeft(function (res) {
      self.setState({people: res.current});
    });
  },
  load: function () {
    var self = this;
    var path = window.location.pathname;
    if (path === '/room/new') {
      room.createRoom({location: roomLocation || 'mountain view', name: roomName}, function (err, res) {
        self.setState({
          location: res.location,
          categories: res.categories,
          roomId: res.room,
          isNew: res.state === 'new'
        });
        /*
        room.joinRoom({room: res.room, name: self.state.me.name}, function (err, res) {
          self.setState({
            people: res.current,
            me: res.me
          });
        });
        */
      });
    } else {
      var roomId = path.substr(1).split('/')[1];
      room.joinRoom({room: roomId, name: self.state.me.name}, function (err, res) {
        if (err && err.code === 404) {
          window.location.href = '/';
          return;
        }
        self.setState({
          people: res.current, 
          me: res.me,
          location: res.room.location,
          categories: res.room.categories,
          roomId: roomId,
          isNew: false
        });
      });
    }
  },
  saveRoom: function () {
    // serialize for saving
    var serialized = {};
    serialized.location = this.state.location;
    serialized.creator = this.state.me;
    serialized.roomId = this.state.roomId;
    serialized.categories = [];
    this.state.categories.forEach(function (cat) {
      var restaurants = [];
      for (var i = 0; i < cat.restaurants.length; i++) {
        if (cat.restaurants[i].chosen) {
          restaurants.push(cat.restaurants[i]);
        }
      }
      if (restaurants.length) {
        serialized.categories.push({
          name: cat.name,
          restaurants: restaurants
        })
      }
    });
    room.saveRoom(serialized, function (err, res) {
      window.location.href = '/room/' + res;
      return;
    });
  },
  chooseWinner: function () {
    var categories = this.state.categories
      , winningCatIndex = Math.floor(Math.random() * this.state.categories.length)
      , winningCat = this.state.categories[winningCatIndex]
      , winningRestaurantIndex = Math.floor(Math.random() * winningCat.restaurants.length)
      , winningRestaurant = winningCat.restaurants[winningRestaurantIndex];
    winningCat.wins = true;
    winningRestaurant.wins = true;
    this.setState({
      hasWinner: true
    });
  },
  render: function () {
    var roomClass = "";
    if (this.state.isNew) {
      roomClass += " is-new";
    }
    return (
      React.DOM.div( {id:"room", className:roomClass}, 
        RoomPeople( {ref:"people",
          parent:this} ),
        RoomPane( {ref:"pane",
          parent:this, hasWinner:this.state.hasWinner} ),
        RoomModal( {ref:"modal", 
          parent:this} )
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);

},{"./room-modal.jsx":2,"./room-pane.jsx":5,"./room-people.jsx":6}]},{},[1,2,3,4,5,6,7,8])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1jb3VudGRvd24uanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpO1xuXG52YXIgUm9vbU1vZGFsID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCBvbkNvdW50ZG93biA9IGZ1bmN0aW9uIG9uQ291bnRkb3duKGNvdW50VmFsKSB7XG4gICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb3VudGRvd246IGNvdW50VmFsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY291bnRWYWwgPiAxKSB7XG4gICAgICAgICAgICAgIG9uQ291bnRkb3duKGNvdW50VmFsIC0gMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnByb3BzLm9uRmluaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgb25Db3VudGRvd24odGhpcy5wcm9wcy5jb3VudGRvd24pO1xuICB9LFxuICByZW5kZXJDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWluID0gKHRoaXMuc3RhdGUuY291bnRkb3duIC8gNjApIHwgMFxuICAgICAgLCBzZWMgPSAodGhpcy5zdGF0ZS5jb3VudGRvd24gJSA2MCk7XG4gICAgcmV0dXJuIChtaW4gPCAxMCA/ICcwJyA6ICcnKSArIG1pbiArICc6JyArIChzZWMgPCAxMCA/ICcwJyA6ICcnKSArIHNlYztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5oMihudWxsLCBcIlBpY2tpbmcgYSB3aW5uZXIgaW4gXCIsIHRoaXMucmVuZGVyQ291bnRkb3duKCkpXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbUNvdW50ZG93biA9IHJlcXVpcmUoJy4vcm9vbS1jb3VudGRvd24uanN4JylcblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIC8vIFRoZSBmb2xsb3dpbmcgdHdvIG1ldGhvZHMgYXJlIHRoZSBvbmx5IHBsYWNlcyB3ZSBuZWVkIHRvXG4gIC8vIGludGVncmF0ZSB3aXRoIEJvb3RzdHJhcCBvciBqUXVlcnkhXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAvLyBXaGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQsIHR1cm4gaXQgaW50byBhIG1vZGFsXG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSlcbiAgICAgIC5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UsIHNob3c6IGZhbHNlfSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5vZmYoJ2hpZGRlbicpO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcbiAgfSxcbiAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcbiAgfSxcbiAgc3RhcnRDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICdjb3VudGRvd24nXG4gICAgfSk7XG4gICAgdGhpcy5vcGVuKCk7XG4gIH0sXG4gIGFmdGVyQ291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMucHJvcHMucGFyZW50LmNob29zZVdpbm5lcigpO1xuICB9LFxuICByZW5kZXJCb2R5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2NvdW50ZG93bicpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJvb21Db3VudGRvd24oIHtjb3VudGRvd246MSwgb25GaW5pc2g6dGhpcy5hZnRlckNvdW50ZG93bn0gKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwgZmFkZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1kaWFsb2dcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1jb250ZW50XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQm9keSgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS1yZXN0YXVyYW50LmpzeCcpO1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3RhdXJhbnRzID0gdGhpcy5wcm9wcy5kYXRhLnJlc3RhdXJhbnRzO1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpLCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlckxhYmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2Zyb3plbicgJiYgdGhpcy5wcm9wcy5kYXRhLnZldG8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtZGFuZ2VyXCJ9LCBcIlZldG9lZCFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIG5hbWUgPSBjYXQubmFtZVxuICAgICAgLCByZXN0YXVyYW50cyA9IGNhdC5yZXN0YXVyYW50cztcbiAgICB2YXIgY2F0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLWNhdFwiO1xuICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCkpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIGlmIChjYXQud2lucykge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgd2lubmVyXCI7XG4gICAgfVxuICAgIHZhciByZW5kZXJlZCA9IHJlc3RhdXJhbnRzXG4gICAgLm1hcChmdW5jdGlvbiAoZWF0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lUmVzdGF1cmFudCggXG4gICAgICAgICAgICAgICAge2RhdGE6ZWF0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgcGFyZW50SW5kZXg6dGhpcy5wcm9wcy5pbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLnByb3BzLm1vZGUsXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMucHJvcHMuY2hvb3NlfSApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6Y2F0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgbmFtZSwgdGhpcy5yZW5kZXJMYWJlbCgpKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgICAgcmVuZGVyZWRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21SZXN0YXVyYW50RGV0YWlscyA9IHJlcXVpcmUoJy4vcm9vbS1yZXN0YXVyYW50LWRldGFpbHMuanN4Jyk7XG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5wcm9wcy5kYXRhLmNob3NlbiwgdGhpcy5wcm9wcy5wYXJlbnRJbmRleCwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS5yb3VuZENob3Nlbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJsYWJlbCBsYWJlbC1zdWNjZXNzXCJ9LCBcIkNob3NlbiFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWF0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIGVhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1yZXN0XCI7XG4gICAgaWYgKGVhdC5jaG9zZW4pIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIGlmIChlYXQud2lucykge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgd2lubmVyXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6ZWF0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVzdGF1cmFudC1kZXRhaWxzLXdyYXBwZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwic21hbGxcIn0sIGVhdC5uYW1lLCB0aGlzLnJlbmRlckxhYmVsKCkpLFxuICAgICAgICAgIFJvb21SZXN0YXVyYW50RGV0YWlscygge2RhdGE6ZWF0fSApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3gnKTtcblxudmFyIFJvb21QYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnZnJvemVuJ1xuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6IHRoaXMuZ2V0RnJvemVuU3RhdGUoKVxuICAgIH0pO1xuICB9LFxuICBnZXRGcm96ZW5TdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc0FueUNhdENob3NlbigpKSB7XG4gICAgICByZXR1cm4gJ25lZWRDaG9pY2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2Zyb3plbic7XG4gICAgfVxuICB9LFxuICBpbml0RG9uZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5pc05ldykge1xuICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2F2ZVJvb20oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5wYXJlbnQucmVmcy5tb2RhbC5zdGFydENvdW50ZG93bigpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnID8gdGhpcy5nZXRGcm96ZW5TdGF0ZSgpIDogJ2VkaXQnKVxuICAgIH0pO1xuICB9LFxuICBnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmNhdGVnb3JpZXM7XG4gIH0sXG4gIGdldE1lOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLm1lO1xuICB9LFxuICBjbGlja0Nob3NlbjogZnVuY3Rpb24gKGlzQ2hvc2VuLCBjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgd2hvbGUgY2F0ZWdvcnlcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQucmVzdGF1cmFudHMuZm9yRWFjaChmdW5jdGlvbiAoZWF0KSB7XG4gICAgICAgICAgZWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHNpbmdsZSByZXN0YXVyYW50XG4gICAgICAgIHZhciB0b2dnbGVFYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICAvLyBkbyBub3RoaW5nIGlmIGluIG5ldyBtb2RlXG4gICAgICBpZiAodGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUuaXNOZXcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gdmV0byAvIHJvdW5kQ2hvc2VuIG1vZGVcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdmV0byBieSBjYXRlZ29yaWVzXG4gICAgICAgIHZhciB0b2dnbGVDYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XTtcbiAgICAgICAgdG9nZ2xlQ2F0LnZldG8gPSAhdG9nZ2xlQ2F0LnZldG87XG4gICAgICAgIGlmICh0b2dnbGVDYXQudmV0bykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2ZXRvZXM6ICh0aGlzLnN0YXRlLnZldG9lcyB8fCAwKSArIDEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApIC0gMSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdLnJlc3RhdXJhbnRzW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5yb3VuZENob3NlbiA9ICF0b2dnbGVFYXQucm91bmRDaG9zZW47XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuKSB7XG4gICAgICAgICAgdmFyIGlqID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbjtcbiAgICAgICAgICBkZWxldGUgdGhpcy5nZXRDYXRlZ29yaWVzKClbaWpbMF1dLnJlc3RhdXJhbnRzW2lqWzFdXS5yb3VuZENob3NlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9nZ2xlRWF0LnJvdW5kQ2hvc2VuKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdW5kQ2hvc2VuOiBbY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4XSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcm91bmRDaG9zZW46IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoY2F0KSB7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0LnJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2F0LnJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgaXNBbnlDYXRDaG9zZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdldENhdGVnb3JpZXMoKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2ldO1xuICAgICAgaWYgKHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oY2F0KSkge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgcmVuZGVyQ2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZUNhdGVnb3J5KCBcbiAgICAgICAgICAgICAgICB7ZGF0YTpjYXQsIFxuICAgICAgICAgICAgICAgIGluZGV4OmluZGV4LCBcbiAgICAgICAgICAgICAgICBtb2RlOnRoaXMuc3RhdGUubW9kZSwgXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMuY2xpY2tDaG9zZW59ICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICByZW5kZXJlZFxuICAgICAgKVxuICAgICk7XG4gICAgICAgICAgICBcbiAgfSxcbiAgcmVuZGVyQnV0dG9uRWRpdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25NZXNzYWdlID0gJ0VkaXQnO1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0Jykge1xuICAgICAgYnV0dG9uTWVzc2FnZSA9ICdDbG9zZSc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJidG4tZWRpdCBwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICBidXR0b25NZXNzYWdlXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVySW5mbzogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2ZXRvZXMgPSB0aGlzLnN0YXRlLnZldG9lcyB8fCAwXG4gICAgICAsIHJvdW5kQ2hvc2VuID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbiA/IDEgOiAwO1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm9vbS1pbmZvIHB1bGwtcmlnaHRcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgdmV0b2VzKSwgXCIgdmV0b2VkXCIpLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgcm91bmRDaG9zZW4pLCBcIiBjaG9zZW5cIilcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckNhbGxUb0FjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1dpbm5lcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiQW5kIHRoZSB3aW5uZXIgaXMuLi5cIilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICduZWVkQ2hvaWNlJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiWW91IG5lZWQgdG8gcGljayBhdCBsZWFzdCBvbmUgcmVzdGF1cmFudFwiKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmlzTmV3KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJDbGljayBEb25lIHRvIGZpbmFsaXplIHlvdXIgY2hvaWNlc1wiKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckJ1dHRvbkluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uTWVzc2FnZSA9ICdEb25lJztcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZnJvemVuJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge3R5cGU6XCJidXR0b25cIiwgY2xhc3NOYW1lOlwicHVsbC1yaWdodCBidG4gYnRuLWRlZmF1bHRcIiwgb25DbGljazp0aGlzLmluaXREb25lfSwgXG4gICAgICAgICAgYnV0dG9uTWVzc2FnZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGUgPSB0aGlzLnN0YXRlLm1vZGU7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFzV2lubmVyKSB7XG4gICAgICBtb2RlID0gJ3dpbm5lcic7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udGFibGUoIHtjbGFzc05hbWU6XCJ0YWJsZVwiLCAnZGF0YS1tb2RlJzptb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGxUb0FjdGlvbigpLFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yaWVzKClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2NsYXNzTmFtZTpcImJ1dHRvbi1yb3dcIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJ1dHRvbi1yb3ctZml4ZWRcIn0sIFxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckluZm8oKSxcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCdXR0b25FZGl0KCksXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJjbGVhcmZpeFwifSksXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uSW5pdCgpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnXG4gICAgfTtcbiAgfSxcbiAgZ2V0UGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLnBlb3BsZTtcbiAgfSxcbiAgZ2V0TWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUubWU7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyAnbGFyZ2UnIDogJ3NtYWxsJylcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGw6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXNnID0gXCJcIlxuICAgICAgLCBoYXNQaWNrZWQgPSAwXG4gICAgICAsIG1lID0gdGhpcy5nZXRNZSgpO1xuICAgIGlmICghdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGgpIHtcbiAgICAgIG1zZyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGVyc29uID0gdGhpcy5nZXRQZW9wbGUoKVtpXTtcbiAgICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICAgIGhhc1BpY2tlZCArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtc2cgPSBoYXNQaWNrZWQgKyBcIiBvZiBcIiArIHRoaXMuZ2V0UGVvcGxlKCkubGVuZ3RoICsgXCIsIGluY2x1ZGluZyBtZSwgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLXBlb3BsZS1jaGlsZFwifSwgdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUucm9vbUlkLCBcIiAtIFwiLCBtc2cpO1xuICB9LFxuICByZW5kZXJQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQZW9wbGUoKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgcmV0dXJuIHBlcnNvbi5faWQgIT09IHRoaXMuZ2V0TWUoKS5faWQ7XG4gICAgfSwgdGhpcylcbiAgICAubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHZhciBwZXJzb25DbGFzcyA9ICdyb29tLXBlb3BsZS1jaGlsZCBwdWxsLWxlZnQgbGFiZWwgbGFiZWwtJztcbiAgICAgIGlmIChwZXJzb24uc3RhdGUgPT09ICd3YWl0aW5nJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnd2FybmluZyc7XG4gICAgICB9IGVsc2UgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnc3VjY2Vzcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnZGVmYXVsdCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpwZXJzb25DbGFzc30sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibWVkaWEgcm9vbS1wZW9wbGUtY2hpbGRcIn0sIFxuICAgICAgICB0aGlzLnJlbmRlclBlb3BsZSgpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyTmV3OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLXBlb3BsZS1uZXdcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5yb29tSWQsIFwiIC0gVGhpcyBpcyBhIG5ldyByb29tIFwiXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5yb29tSWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbClcbiAgICAgICk7XG4gICAgfVxuICAgIHZhciBwZW9wbGVDbGFzcyA9IFwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3Agcm9vbS1wZW9wbGVcIjtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLm5hdigge2NsYXNzTmFtZTpwZW9wbGVDbGFzcywgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgdGhpcy5yZW5kZXJTbWFsbCgpLFxuICAgICAgICB0aGlzLnJlbmRlckxhcmdlKCksXG4gICAgICAgIHRoaXMucmVuZGVyTmV3KClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVJlc3RhdXJhbnREZXRhaWxzID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zb2xlLmxvZygpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVzdGF1cmFudC1kZXRhaWxzIG1lZGlhXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInB1bGwtbGVmdFwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmltZygge2NsYXNzOlwibWVkaWEtb2JqZWN0XCIsIHNyYzplYXQuaW1hZ2VfdXJsLCBhbHQ6ZWF0Lm5hbWV9IClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzOlwibWVkaWEtYm9keVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmg1KCB7Y2xhc3M6XCJtZWRpYS1oZWFkaW5nXCJ9LCBlYXQubmFtZSksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uaW1nKCB7Y2xhc3M6XCJtZWRpYS1vYmplY3RcIiwgc3JjOmVhdC5yYXRpbmdfaW1nX3VybF9zbWFsbCwgYWx0OlwicmF0aW5nc1wifSApKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnNwYW4obnVsbCwgZWF0LmxvY2F0aW9uLmFkZHJlc3NbMF0gKyAnICcgKyBlYXQubG9jYXRpb24uY2l0eSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00uc3BhbihudWxsLCBlYXQuZGlzcGxheV9waG9uZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QZW9wbGUgPSByZXF1aXJlKCcuL3Jvb20tcGVvcGxlLmpzeCcpXG4gICwgUm9vbVBhbmUgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS5qc3gnKVxuICAsIFJvb21Nb2RhbCA9IHJlcXVpcmUoJy4vcm9vbS1tb2RhbC5qc3gnKVxuICAsIHJvb20gPSByZXF1aXJlKCdyZWFsdGltZS9yb29tJyk7XG5cbnZhciBSb29tID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7bG9jYXRpb246IHt9LCBjYXRlZ29yaWVzOiBbXSwgcGVvcGxlOiBbXSwgbWU6IHtuYW1lOiBzdG9yZS5nZXQoJ25hbWUnKSB8fCAnQW5vbnltb3VzJ319O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmxvYWQoKTtcbiAgICByb29tLm9uSm9pbmVkKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHNlbGYuc2V0U3RhdGUoe3Blb3BsZTogcmVzLmN1cnJlbnR9KTtcbiAgICB9KTtcbiAgICByb29tLm9uTGVmdChmdW5jdGlvbiAocmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtwZW9wbGU6IHJlcy5jdXJyZW50fSk7XG4gICAgfSk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKHBhdGggPT09ICcvcm9vbS9uZXcnKSB7XG4gICAgICByb29tLmNyZWF0ZVJvb20oe2xvY2F0aW9uOiByb29tTG9jYXRpb24gfHwgJ21vdW50YWluIHZpZXcnLCBuYW1lOiByb29tTmFtZX0sIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2NhdGlvbjogcmVzLmxvY2F0aW9uLFxuICAgICAgICAgIGNhdGVnb3JpZXM6IHJlcy5jYXRlZ29yaWVzLFxuICAgICAgICAgIHJvb21JZDogcmVzLnJvb20sXG4gICAgICAgICAgaXNOZXc6IHJlcy5zdGF0ZSA9PT0gJ25ldydcbiAgICAgICAgfSk7XG4gICAgICAgIC8qXG4gICAgICAgIHJvb20uam9pblJvb20oe3Jvb206IHJlcy5yb29tLCBuYW1lOiBzZWxmLnN0YXRlLm1lLm5hbWV9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBlb3BsZTogcmVzLmN1cnJlbnQsXG4gICAgICAgICAgICBtZTogcmVzLm1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByb29tSWQgPSBwYXRoLnN1YnN0cigxKS5zcGxpdCgnLycpWzFdO1xuICAgICAgcm9vbS5qb2luUm9vbSh7cm9vbTogcm9vbUlkLCBuYW1lOiBzZWxmLnN0YXRlLm1lLm5hbWV9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICAgIHBlb3BsZTogcmVzLmN1cnJlbnQsIFxuICAgICAgICAgIG1lOiByZXMubWUsXG4gICAgICAgICAgbG9jYXRpb246IHJlcy5yb29tLmxvY2F0aW9uLFxuICAgICAgICAgIGNhdGVnb3JpZXM6IHJlcy5yb29tLmNhdGVnb3JpZXMsXG4gICAgICAgICAgcm9vbUlkOiByb29tSWQsXG4gICAgICAgICAgaXNOZXc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBzYXZlUm9vbTogZnVuY3Rpb24gKCkge1xuICAgIC8vIHNlcmlhbGl6ZSBmb3Igc2F2aW5nXG4gICAgdmFyIHNlcmlhbGl6ZWQgPSB7fTtcbiAgICBzZXJpYWxpemVkLmxvY2F0aW9uID0gdGhpcy5zdGF0ZS5sb2NhdGlvbjtcbiAgICBzZXJpYWxpemVkLmNyZWF0b3IgPSB0aGlzLnN0YXRlLm1lO1xuICAgIHNlcmlhbGl6ZWQucm9vbUlkID0gdGhpcy5zdGF0ZS5yb29tSWQ7XG4gICAgc2VyaWFsaXplZC5jYXRlZ29yaWVzID0gW107XG4gICAgdGhpcy5zdGF0ZS5jYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGNhdCkge1xuICAgICAgdmFyIHJlc3RhdXJhbnRzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdC5yZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2F0LnJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICAgIHJlc3RhdXJhbnRzLnB1c2goY2F0LnJlc3RhdXJhbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlc3RhdXJhbnRzLmxlbmd0aCkge1xuICAgICAgICBzZXJpYWxpemVkLmNhdGVnb3JpZXMucHVzaCh7XG4gICAgICAgICAgbmFtZTogY2F0Lm5hbWUsXG4gICAgICAgICAgcmVzdGF1cmFudHM6IHJlc3RhdXJhbnRzXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgcm9vbS5zYXZlUm9vbShzZXJpYWxpemVkLCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yb29tLycgKyByZXM7XG4gICAgICByZXR1cm47XG4gICAgfSk7XG4gIH0sXG4gIGNob29zZVdpbm5lcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYXRlZ29yaWVzID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzXG4gICAgICAsIHdpbm5pbmdDYXRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc3RhdGUuY2F0ZWdvcmllcy5sZW5ndGgpXG4gICAgICAsIHdpbm5pbmdDYXQgPSB0aGlzLnN0YXRlLmNhdGVnb3JpZXNbd2lubmluZ0NhdEluZGV4XVxuICAgICAgLCB3aW5uaW5nUmVzdGF1cmFudEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogd2lubmluZ0NhdC5yZXN0YXVyYW50cy5sZW5ndGgpXG4gICAgICAsIHdpbm5pbmdSZXN0YXVyYW50ID0gd2lubmluZ0NhdC5yZXN0YXVyYW50c1t3aW5uaW5nUmVzdGF1cmFudEluZGV4XTtcbiAgICB3aW5uaW5nQ2F0LndpbnMgPSB0cnVlO1xuICAgIHdpbm5pbmdSZXN0YXVyYW50LndpbnMgPSB0cnVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaGFzV2lubmVyOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb29tQ2xhc3MgPSBcIlwiO1xuICAgIGlmICh0aGlzLnN0YXRlLmlzTmV3KSB7XG4gICAgICByb29tQ2xhc3MgKz0gXCIgaXMtbmV3XCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7aWQ6XCJyb29tXCIsIGNsYXNzTmFtZTpyb29tQ2xhc3N9LCBcbiAgICAgICAgUm9vbVBlb3BsZSgge3JlZjpcInBlb3BsZVwiLFxuICAgICAgICAgIHBhcmVudDp0aGlzfSApLFxuICAgICAgICBSb29tUGFuZSgge3JlZjpcInBhbmVcIixcbiAgICAgICAgICBwYXJlbnQ6dGhpcywgaGFzV2lubmVyOnRoaXMuc3RhdGUuaGFzV2lubmVyfSApLFxuICAgICAgICBSb29tTW9kYWwoIHtyZWY6XCJtb2RhbFwiLCBcbiAgICAgICAgICBwYXJlbnQ6dGhpc30gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIFJvb20oIHt1cmw6XCIvcmVhbHRpbWVcIn0gKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb20tY29udGFpbmVyJylcbik7XG4iXX0=
;