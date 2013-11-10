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
      mode: (this.getMode() === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  getMode: function () {
    var mode = "";
    if (this.props.hasWinner) {
      mode = 'winner';
    } else if (this.state.mode === 'edit') {
      mode = this.state.mode;
    } else {
      mode = this.getFrozenState();
    }
    return mode;
  },
  getCategories: function () {
    return this.props.parent.state.categories;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.getMode() === 'edit') {
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
    } else if (this.getMode() === 'frozen') {
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
                mode:this.getMode(), 
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
    if (this.getMode() === 'edit') {
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
    if (this.getMode() === 'frozen') {
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
    } else if (this.getMode() === 'needChoice') {
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
    if (this.getMode() === 'frozen') {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.initDone}, 
          buttonMessage
        )
      );
    }
  },
  render: function () {
    return (
      React.DOM.table( {className:"table", 'data-mode':this.getMode()}, 
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
      if (typeof roomCoords === 'undefined' && typeof roomLocation === 'undefined') {
        window.location.href = '/';
      }
      room.createRoom({location: roomCoords || roomLocation || 'mountain view', name: roomName}, function (err, res) {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1jb3VudGRvd24uanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbUNvdW50ZG93biA9IHJlcXVpcmUoJy4vcm9vbS1jb3VudGRvd24uanN4Jyk7XG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAsIG9uQ291bnRkb3duID0gZnVuY3Rpb24gb25Db3VudGRvd24oY291bnRWYWwpIHtcbiAgICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvdW50ZG93bjogY291bnRWYWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjb3VudFZhbCA+IDEpIHtcbiAgICAgICAgICAgICAgb25Db3VudGRvd24oY291bnRWYWwgLSAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYucHJvcHMub25GaW5pc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfTtcbiAgICBvbkNvdW50ZG93bih0aGlzLnByb3BzLmNvdW50ZG93bik7XG4gIH0sXG4gIHJlbmRlckNvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtaW4gPSAodGhpcy5zdGF0ZS5jb3VudGRvd24gLyA2MCkgfCAwXG4gICAgICAsIHNlYyA9ICh0aGlzLnN0YXRlLmNvdW50ZG93biAlIDYwKTtcbiAgICByZXR1cm4gKG1pbiA8IDEwID8gJzAnIDogJycpICsgbWluICsgJzonICsgKHNlYyA8IDEwID8gJzAnIDogJycpICsgc2VjO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmgyKG51bGwsIFwiUGlja2luZyBhIHdpbm5lciBpbiBcIiwgdGhpcy5yZW5kZXJDb3VudGRvd24oKSlcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSb29tQ291bnRkb3duID0gcmVxdWlyZSgnLi9yb29tLWNvdW50ZG93bi5qc3gnKVxuXG52YXIgUm9vbU1vZGFsID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgLy8gVGhlIGZvbGxvd2luZyB0d28gbWV0aG9kcyBhcmUgdGhlIG9ubHkgcGxhY2VzIHdlIG5lZWQgdG9cbiAgLy8gaW50ZWdyYXRlIHdpdGggQm9vdHN0cmFwIG9yIGpRdWVyeSFcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFdoZW4gdGhlIGNvbXBvbmVudCBpcyBhZGRlZCwgdHVybiBpdCBpbnRvIGEgbW9kYWxcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKVxuICAgICAgLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSwgc2hvdzogZmFsc2V9KTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm9mZignaGlkZGVuJyk7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xuICB9LFxuICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xuICB9LFxuICBzdGFydENvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogJ2NvdW50ZG93bidcbiAgICB9KTtcbiAgICB0aGlzLm9wZW4oKTtcbiAgfSxcbiAgYWZ0ZXJDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5wcm9wcy5wYXJlbnQuY2hvb3NlV2lubmVyKCk7XG4gIH0sXG4gIHJlbmRlckJvZHk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnY291bnRkb3duJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUm9vbUNvdW50ZG93bigge2NvdW50ZG93bjoxLCBvbkZpbmlzaDp0aGlzLmFmdGVyQ291bnRkb3dufSApXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbCBmYWRlXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1vZGFsLWRpYWxvZ1wifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1vZGFsLWNvbnRlbnRcIn0sIFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJCb2R5KClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lUmVzdGF1cmFudCA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4Jyk7XG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdGF1cmFudHMgPSB0aGlzLnByb3BzLmRhdGEucmVzdGF1cmFudHM7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXN0YXVyYW50c1tpXS5jaG9zZW4pIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIG9uVG9nZ2xlOiBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMuY2hvb3NlKCF0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCksIHRoaXMucHJvcHMuaW5kZXgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlID09PSAnZnJvemVuJyAmJiB0aGlzLnByb3BzLmRhdGEudmV0bykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJsYWJlbCBsYWJlbC1kYW5nZXJcIn0sIFwiVmV0b2VkIVwiKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYXQgPSB0aGlzLnByb3BzLmRhdGFcbiAgICAgICwgbmFtZSA9IGNhdC5uYW1lXG4gICAgICAsIHJlc3RhdXJhbnRzID0gY2F0LnJlc3RhdXJhbnRzO1xuICAgIHZhciBjYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tY2F0XCI7XG4gICAgaWYgKHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSkge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgY2hvc2VuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIG5vdC1jaG9zZW5cIjtcbiAgICB9XG4gICAgaWYgKGNhdC53aW5zKSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiB3aW5uZXJcIjtcbiAgICB9XG4gICAgdmFyIHJlbmRlcmVkID0gcmVzdGF1cmFudHNcbiAgICAubWFwKGZ1bmN0aW9uIChlYXQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUm9vbVBhbmVSZXN0YXVyYW50KCBcbiAgICAgICAgICAgICAgICB7ZGF0YTplYXQsIFxuICAgICAgICAgICAgICAgIGluZGV4OmluZGV4LCBcbiAgICAgICAgICAgICAgICBwYXJlbnRJbmRleDp0aGlzLnByb3BzLmluZGV4LCBcbiAgICAgICAgICAgICAgICBtb2RlOnRoaXMucHJvcHMubW9kZSxcbiAgICAgICAgICAgICAgICBjaG9vc2U6dGhpcy5wcm9wcy5jaG9vc2V9ICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTpjYXRDbGFzcywgb25DbGljazp0aGlzLm9uVG9nZ2xlfSwgXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBuYW1lLCB0aGlzLnJlbmRlckxhYmVsKCkpLFxuICAgICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgICByZW5kZXJlZFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbVJlc3RhdXJhbnREZXRhaWxzID0gcmVxdWlyZSgnLi9yb29tLXJlc3RhdXJhbnQtZGV0YWlscy5qc3gnKTtcblxudmFyIFJvb21QYW5lUmVzdGF1cmFudCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIG9uVG9nZ2xlOiBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMuY2hvb3NlKCF0aGlzLnByb3BzLmRhdGEuY2hvc2VuLCB0aGlzLnByb3BzLnBhcmVudEluZGV4LCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlckxhYmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2Zyb3plbicgJiYgdGhpcy5wcm9wcy5kYXRhLnJvdW5kQ2hvc2VuKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIn0sIFwiQ2hvc2VuIVwiKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlYXQgPSB0aGlzLnByb3BzLmRhdGFcbiAgICAgICwgZWF0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLXJlc3RcIjtcbiAgICBpZiAoZWF0LmNob3Nlbikge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgY2hvc2VuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIG5vdC1jaG9zZW5cIjtcbiAgICB9XG4gICAgaWYgKGVhdC53aW5zKSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiB3aW5uZXJcIjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTplYXRDbGFzcywgb25DbGljazp0aGlzLm9uVG9nZ2xlfSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyZXN0YXVyYW50LWRldGFpbHMtd3JhcHBlclwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJzbWFsbFwifSwgZWF0Lm5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKSksXG4gICAgICAgICAgUm9vbVJlc3RhdXJhbnREZXRhaWxzKCB7ZGF0YTplYXR9IClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCcpO1xuXG52YXIgUm9vbVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdmcm96ZW4nXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogdGhpcy5nZXRGcm96ZW5TdGF0ZSgpXG4gICAgfSk7XG4gIH0sXG4gIGdldEZyb3plblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzQW55Q2F0Q2hvc2VuKCkpIHtcbiAgICAgIHJldHVybiAnbmVlZENob2ljZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnZnJvemVuJztcbiAgICB9XG4gIH0sXG4gIGluaXREb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmlzTmV3KSB7XG4gICAgICB0aGlzLnByb3BzLnBhcmVudC5zYXZlUm9vbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLnBhcmVudC5yZWZzLm1vZGFsLnN0YXJ0Q291bnRkb3duKCk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5nZXRNb2RlKCkgPT09ICdlZGl0JyA/IHRoaXMuZ2V0RnJvemVuU3RhdGUoKSA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgZ2V0TW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlID0gXCJcIjtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNXaW5uZXIpIHtcbiAgICAgIG1vZGUgPSAnd2lubmVyJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBtb2RlID0gdGhpcy5zdGF0ZS5tb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlID0gdGhpcy5nZXRGcm96ZW5TdGF0ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbW9kZTtcbiAgfSxcbiAgZ2V0Q2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5jYXRlZ29yaWVzO1xuICB9LFxuICBnZXRNZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5tZTtcbiAgfSxcbiAgY2xpY2tDaG9zZW46IGZ1bmN0aW9uIChpc0Nob3NlbiwgY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4KSB7XG4gICAgaWYgKHRoaXMuZ2V0TW9kZSgpID09PSAnZWRpdCcpIHtcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgd2hvbGUgY2F0ZWdvcnlcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQucmVzdGF1cmFudHMuZm9yRWFjaChmdW5jdGlvbiAoZWF0KSB7XG4gICAgICAgICAgZWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHNpbmdsZSByZXN0YXVyYW50XG4gICAgICAgIHZhciB0b2dnbGVFYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldE1vZGUoKSA9PT0gJ2Zyb3plbicpIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcgaWYgaW4gbmV3IG1vZGVcbiAgICAgIGlmICh0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5pc05ldykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyB2ZXRvIC8gcm91bmRDaG9zZW4gbW9kZVxuICAgICAgaWYgKHR5cGVvZihyZXN0YXVyYW50SW5kZXgpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB2ZXRvIGJ5IGNhdGVnb3JpZXNcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQudmV0byA9ICF0b2dnbGVDYXQudmV0bztcbiAgICAgICAgaWYgKHRvZ2dsZUNhdC52ZXRvKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApICsgMSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmV0b2VzOiAodGhpcy5zdGF0ZS52ZXRvZXMgfHwgMCkgLSAxIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2dnbGluZyBzaW5nbGUgcmVzdGF1cmFudFxuICAgICAgICB2YXIgdG9nZ2xlRWF0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbY2F0ZWdvcnlJbmRleF0ucmVzdGF1cmFudHNbcmVzdGF1cmFudEluZGV4XTtcbiAgICAgICAgdG9nZ2xlRWF0LnJvdW5kQ2hvc2VuID0gIXRvZ2dsZUVhdC5yb3VuZENob3NlbjtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucm91bmRDaG9zZW4pIHtcbiAgICAgICAgICB2YXIgaWogPSB0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmdldENhdGVnb3JpZXMoKVtpalswXV0ucmVzdGF1cmFudHNbaWpbMV1dLnJvdW5kQ2hvc2VuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2dnbGVFYXQucm91bmRDaG9zZW4pIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcm91bmRDaG9zZW46IFtjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXhdIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3VuZENob3NlbjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uIChjYXQpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQucmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYXQucmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBpc0FueUNhdENob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2V0Q2F0ZWdvcmllcygpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2F0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbaV07XG4gICAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbihjYXQpKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICByZW5kZXJDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZW5kZXJlZCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpXG4gICAgLm1hcChmdW5jdGlvbiAoY2F0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lQ2F0ZWdvcnkoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmNhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5nZXRNb2RlKCksIFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLmNsaWNrQ2hvc2VufSApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgcmVuZGVyZWRcbiAgICAgIClcbiAgICApO1xuICAgICAgICAgICAgXG4gIH0sXG4gIHJlbmRlckJ1dHRvbkVkaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uTWVzc2FnZSA9ICdFZGl0JztcbiAgICBpZiAodGhpcy5nZXRNb2RlKCkgPT09ICdlZGl0Jykge1xuICAgICAgYnV0dG9uTWVzc2FnZSA9ICdDbG9zZSc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJidG4tZWRpdCBwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICBidXR0b25NZXNzYWdlXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVySW5mbzogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2ZXRvZXMgPSB0aGlzLnN0YXRlLnZldG9lcyB8fCAwXG4gICAgICAsIHJvdW5kQ2hvc2VuID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbiA/IDEgOiAwO1xuICAgIGlmICh0aGlzLmdldE1vZGUoKSA9PT0gJ2Zyb3plbicpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLWluZm8gcHVsbC1yaWdodFwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImJhZGdlXCJ9LCB2ZXRvZXMpLCBcIiB2ZXRvZWRcIiksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImJhZGdlXCJ9LCByb3VuZENob3NlbiksIFwiIGNob3NlblwiKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyQ2FsbFRvQWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFzV2lubmVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJBbmQgdGhlIHdpbm5lciBpcy4uLlwiKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0TW9kZSgpID09PSAnbmVlZENob2ljZScpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBcIllvdSBuZWVkIHRvIHBpY2sgYXQgbGVhc3Qgb25lIHJlc3RhdXJhbnRcIilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5pc05ldykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiQ2xpY2sgRG9uZSB0byBmaW5hbGl6ZSB5b3VyIGNob2ljZXNcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXJCdXR0b25Jbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbk1lc3NhZ2UgPSAnRG9uZSc7XG4gICAgaWYgKHRoaXMuZ2V0TW9kZSgpID09PSAnZnJvemVuJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge3R5cGU6XCJidXR0b25cIiwgY2xhc3NOYW1lOlwicHVsbC1yaWdodCBidG4gYnRuLWRlZmF1bHRcIiwgb25DbGljazp0aGlzLmluaXREb25lfSwgXG4gICAgICAgICAgYnV0dG9uTWVzc2FnZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS50YWJsZSgge2NsYXNzTmFtZTpcInRhYmxlXCIsICdkYXRhLW1vZGUnOnRoaXMuZ2V0TW9kZSgpfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGxUb0FjdGlvbigpLFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yaWVzKClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2NsYXNzTmFtZTpcImJ1dHRvbi1yb3dcIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJ1dHRvbi1yb3ctZml4ZWRcIn0sIFxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckluZm8oKSxcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCdXR0b25FZGl0KCksXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJjbGVhcmZpeFwifSksXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uSW5pdCgpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnXG4gICAgfTtcbiAgfSxcbiAgZ2V0UGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLnBlb3BsZTtcbiAgfSxcbiAgZ2V0TWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUubWU7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyAnbGFyZ2UnIDogJ3NtYWxsJylcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGw6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXNnID0gXCJcIlxuICAgICAgLCBoYXNQaWNrZWQgPSAwXG4gICAgICAsIG1lID0gdGhpcy5nZXRNZSgpO1xuICAgIGlmICghdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGgpIHtcbiAgICAgIG1zZyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGVyc29uID0gdGhpcy5nZXRQZW9wbGUoKVtpXTtcbiAgICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICAgIGhhc1BpY2tlZCArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtc2cgPSBoYXNQaWNrZWQgKyBcIiBvZiBcIiArIHRoaXMuZ2V0UGVvcGxlKCkubGVuZ3RoICsgXCIsIGluY2x1ZGluZyBtZSwgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLXBlb3BsZS1jaGlsZFwifSwgdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUucm9vbUlkLCBcIiAtIFwiLCBtc2cpO1xuICB9LFxuICByZW5kZXJQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQZW9wbGUoKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgcmV0dXJuIHBlcnNvbi5faWQgIT09IHRoaXMuZ2V0TWUoKS5faWQ7XG4gICAgfSwgdGhpcylcbiAgICAubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHZhciBwZXJzb25DbGFzcyA9ICdyb29tLXBlb3BsZS1jaGlsZCBwdWxsLWxlZnQgbGFiZWwgbGFiZWwtJztcbiAgICAgIGlmIChwZXJzb24uc3RhdGUgPT09ICd3YWl0aW5nJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnd2FybmluZyc7XG4gICAgICB9IGVsc2UgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnc3VjY2Vzcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnZGVmYXVsdCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpwZXJzb25DbGFzc30sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibWVkaWEgcm9vbS1wZW9wbGUtY2hpbGRcIn0sIFxuICAgICAgICB0aGlzLnJlbmRlclBlb3BsZSgpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyTmV3OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLXBlb3BsZS1uZXdcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5yb29tSWQsIFwiIC0gVGhpcyBpcyBhIG5ldyByb29tIFwiXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5yb29tSWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbClcbiAgICAgICk7XG4gICAgfVxuICAgIHZhciBwZW9wbGVDbGFzcyA9IFwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3Agcm9vbS1wZW9wbGVcIjtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLm5hdigge2NsYXNzTmFtZTpwZW9wbGVDbGFzcywgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgdGhpcy5yZW5kZXJTbWFsbCgpLFxuICAgICAgICB0aGlzLnJlbmRlckxhcmdlKCksXG4gICAgICAgIHRoaXMucmVuZGVyTmV3KClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVJlc3RhdXJhbnREZXRhaWxzID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zb2xlLmxvZygpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVzdGF1cmFudC1kZXRhaWxzIG1lZGlhXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInB1bGwtbGVmdFwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmltZygge2NsYXNzOlwibWVkaWEtb2JqZWN0XCIsIHNyYzplYXQuaW1hZ2VfdXJsLCBhbHQ6ZWF0Lm5hbWV9IClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzOlwibWVkaWEtYm9keVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmg1KCB7Y2xhc3M6XCJtZWRpYS1oZWFkaW5nXCJ9LCBlYXQubmFtZSksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uaW1nKCB7Y2xhc3M6XCJtZWRpYS1vYmplY3RcIiwgc3JjOmVhdC5yYXRpbmdfaW1nX3VybF9zbWFsbCwgYWx0OlwicmF0aW5nc1wifSApKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnNwYW4obnVsbCwgZWF0LmxvY2F0aW9uLmFkZHJlc3NbMF0gKyAnICcgKyBlYXQubG9jYXRpb24uY2l0eSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00uc3BhbihudWxsLCBlYXQuZGlzcGxheV9waG9uZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QZW9wbGUgPSByZXF1aXJlKCcuL3Jvb20tcGVvcGxlLmpzeCcpXG4gICwgUm9vbVBhbmUgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS5qc3gnKVxuICAsIFJvb21Nb2RhbCA9IHJlcXVpcmUoJy4vcm9vbS1tb2RhbC5qc3gnKVxuICAsIHJvb20gPSByZXF1aXJlKCdyZWFsdGltZS9yb29tJyk7XG5cbnZhciBSb29tID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7bG9jYXRpb246IHt9LCBjYXRlZ29yaWVzOiBbXSwgcGVvcGxlOiBbXSwgbWU6IHtuYW1lOiBzdG9yZS5nZXQoJ25hbWUnKSB8fCAnQW5vbnltb3VzJ319O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmxvYWQoKTtcbiAgICByb29tLm9uSm9pbmVkKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHNlbGYuc2V0U3RhdGUoe3Blb3BsZTogcmVzLmN1cnJlbnR9KTtcbiAgICB9KTtcbiAgICByb29tLm9uTGVmdChmdW5jdGlvbiAocmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtwZW9wbGU6IHJlcy5jdXJyZW50fSk7XG4gICAgfSk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKHBhdGggPT09ICcvcm9vbS9uZXcnKSB7XG4gICAgICBpZiAodHlwZW9mIHJvb21Db29yZHMgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiByb29tTG9jYXRpb24gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgICAgfVxuICAgICAgcm9vbS5jcmVhdGVSb29tKHtsb2NhdGlvbjogcm9vbUNvb3JkcyB8fCByb29tTG9jYXRpb24gfHwgJ21vdW50YWluIHZpZXcnLCBuYW1lOiByb29tTmFtZX0sIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2NhdGlvbjogcmVzLmxvY2F0aW9uLFxuICAgICAgICAgIGNhdGVnb3JpZXM6IHJlcy5jYXRlZ29yaWVzLFxuICAgICAgICAgIHJvb21JZDogcmVzLnJvb20sXG4gICAgICAgICAgaXNOZXc6IHJlcy5zdGF0ZSA9PT0gJ25ldydcbiAgICAgICAgfSk7XG4gICAgICAgIC8qXG4gICAgICAgIHJvb20uam9pblJvb20oe3Jvb206IHJlcy5yb29tLCBuYW1lOiBzZWxmLnN0YXRlLm1lLm5hbWV9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBlb3BsZTogcmVzLmN1cnJlbnQsXG4gICAgICAgICAgICBtZTogcmVzLm1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByb29tSWQgPSBwYXRoLnN1YnN0cigxKS5zcGxpdCgnLycpWzFdO1xuICAgICAgcm9vbS5qb2luUm9vbSh7cm9vbTogcm9vbUlkLCBuYW1lOiBzZWxmLnN0YXRlLm1lLm5hbWV9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICAgIHBlb3BsZTogcmVzLmN1cnJlbnQsIFxuICAgICAgICAgIG1lOiByZXMubWUsXG4gICAgICAgICAgbG9jYXRpb246IHJlcy5yb29tLmxvY2F0aW9uLFxuICAgICAgICAgIGNhdGVnb3JpZXM6IHJlcy5yb29tLmNhdGVnb3JpZXMsXG4gICAgICAgICAgcm9vbUlkOiByb29tSWQsXG4gICAgICAgICAgaXNOZXc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBzYXZlUm9vbTogZnVuY3Rpb24gKCkge1xuICAgIC8vIHNlcmlhbGl6ZSBmb3Igc2F2aW5nXG4gICAgdmFyIHNlcmlhbGl6ZWQgPSB7fTtcbiAgICBzZXJpYWxpemVkLmxvY2F0aW9uID0gdGhpcy5zdGF0ZS5sb2NhdGlvbjtcbiAgICBzZXJpYWxpemVkLmNyZWF0b3IgPSB0aGlzLnN0YXRlLm1lO1xuICAgIHNlcmlhbGl6ZWQucm9vbUlkID0gdGhpcy5zdGF0ZS5yb29tSWQ7XG4gICAgc2VyaWFsaXplZC5jYXRlZ29yaWVzID0gW107XG4gICAgdGhpcy5zdGF0ZS5jYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGNhdCkge1xuICAgICAgdmFyIHJlc3RhdXJhbnRzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdC5yZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2F0LnJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICAgIHJlc3RhdXJhbnRzLnB1c2goY2F0LnJlc3RhdXJhbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlc3RhdXJhbnRzLmxlbmd0aCkge1xuICAgICAgICBzZXJpYWxpemVkLmNhdGVnb3JpZXMucHVzaCh7XG4gICAgICAgICAgbmFtZTogY2F0Lm5hbWUsXG4gICAgICAgICAgcmVzdGF1cmFudHM6IHJlc3RhdXJhbnRzXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgcm9vbS5zYXZlUm9vbShzZXJpYWxpemVkLCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yb29tLycgKyByZXM7XG4gICAgICByZXR1cm47XG4gICAgfSk7XG4gIH0sXG4gIGNob29zZVdpbm5lcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYXRlZ29yaWVzID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzXG4gICAgICAsIHdpbm5pbmdDYXRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc3RhdGUuY2F0ZWdvcmllcy5sZW5ndGgpXG4gICAgICAsIHdpbm5pbmdDYXQgPSB0aGlzLnN0YXRlLmNhdGVnb3JpZXNbd2lubmluZ0NhdEluZGV4XVxuICAgICAgLCB3aW5uaW5nUmVzdGF1cmFudEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogd2lubmluZ0NhdC5yZXN0YXVyYW50cy5sZW5ndGgpXG4gICAgICAsIHdpbm5pbmdSZXN0YXVyYW50ID0gd2lubmluZ0NhdC5yZXN0YXVyYW50c1t3aW5uaW5nUmVzdGF1cmFudEluZGV4XTtcbiAgICB3aW5uaW5nQ2F0LndpbnMgPSB0cnVlO1xuICAgIHdpbm5pbmdSZXN0YXVyYW50LndpbnMgPSB0cnVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaGFzV2lubmVyOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb29tQ2xhc3MgPSBcIlwiO1xuICAgIGlmICh0aGlzLnN0YXRlLmlzTmV3KSB7XG4gICAgICByb29tQ2xhc3MgKz0gXCIgaXMtbmV3XCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7aWQ6XCJyb29tXCIsIGNsYXNzTmFtZTpyb29tQ2xhc3N9LCBcbiAgICAgICAgUm9vbVBlb3BsZSgge3JlZjpcInBlb3BsZVwiLFxuICAgICAgICAgIHBhcmVudDp0aGlzfSApLFxuICAgICAgICBSb29tUGFuZSgge3JlZjpcInBhbmVcIixcbiAgICAgICAgICBwYXJlbnQ6dGhpcywgaGFzV2lubmVyOnRoaXMuc3RhdGUuaGFzV2lubmVyfSApLFxuICAgICAgICBSb29tTW9kYWwoIHtyZWY6XCJtb2RhbFwiLCBcbiAgICAgICAgICBwYXJlbnQ6dGhpc30gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIFJvb20oIHt1cmw6XCIvcmVhbHRpbWVcIn0gKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb20tY29udGFpbmVyJylcbik7XG4iXX0=
;