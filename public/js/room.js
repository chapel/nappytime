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
        React.DOM.span( {className:"small"}, eat.name, this.renderLabel()),
        RoomRestaurantDetails( {data:eat} )
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
    this.props.parent.refs.modal.startCountdown();
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
    if (this.getMe().isCreator) {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.toggleMode}, 
          buttonMessage
        )
      );
    }
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
      if (this.getMe().isCreator) {
        return (
          React.DOM.h4(null, "Click Edit and make your choices")
        );
      } else {
        return (
          React.DOM.h4(null, "The owner of this room need to choose some options from the list first")
        );
      }
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'I\'m Done';
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
          React.DOM.td( {className:"buttonRow"}, 
            this.renderInfo(),
            React.DOM.div( {className:"clearfix"}),
            this.renderButtonEdit(),
            React.DOM.div( {className:"clearfix"}),
            this.renderButtonInit()
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
  renderSmallMessage: function () {
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
    return React.DOM.h3(null, msg);
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
    return this.getPeople()
    .filter(function (person) {
      return person.name !== this.getMe().name;
    }, this)
    .map(function (person) {
      var personClass = 'pull-left label label-';
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
      React.DOM.div( {className:"media"}, 
        this.renderPeople()
      )
    );
  },
  render: function () {
    return (
      React.DOM.nav( {className:"navbar navbar-default navbar-fixed-top room-people", 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        React.DOM.div( {className:"container"}, 
         this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()
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
            React.DOM.span(null, eat.location.address[0], eat.location.city)
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
    return {location: {}, categories: [], people: [], me: {}};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    var self = this;
    room.createRoom({location: roomLocation || 'mountain view'}, function (err, res) {
      self.setState({
        location: res.location, 
        categories: res.categories, 
        people: [
          { name: 'Alice', id: '123', state: 'waiting' },
          { name: 'Bob', id: '456', state: 'finished' },
          { name: 'Charlie', id: '789', state: 'finished' }
        ],
        me: {
          name: 'Alice',
          isCreator: true
        }
      });
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
    return (
      React.DOM.div( {id:"room"}, 
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tY291bnRkb3duLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1tb2RhbC5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1yZXN0YXVyYW50LmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLXJlc3RhdXJhbnQtZGV0YWlscy5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSb29tQ291bnRkb3duID0gcmVxdWlyZSgnLi9yb29tLWNvdW50ZG93bi5qc3gnKTtcblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICwgb25Db3VudGRvd24gPSBmdW5jdGlvbiBvbkNvdW50ZG93bihjb3VudFZhbCkge1xuICAgICAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY291bnRkb3duOiBjb3VudFZhbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNvdW50VmFsID4gMSkge1xuICAgICAgICAgICAgICBvbkNvdW50ZG93bihjb3VudFZhbCAtIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5wcm9wcy5vbkZpbmlzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9O1xuICAgIG9uQ291bnRkb3duKHRoaXMucHJvcHMuY291bnRkb3duKTtcbiAgfSxcbiAgcmVuZGVyQ291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1pbiA9ICh0aGlzLnN0YXRlLmNvdW50ZG93biAvIDYwKSB8IDBcbiAgICAgICwgc2VjID0gKHRoaXMuc3RhdGUuY291bnRkb3duICUgNjApO1xuICAgIHJldHVybiAobWluIDwgMTAgPyAnMCcgOiAnJykgKyBtaW4gKyAnOicgKyAoc2VjIDwgMTAgPyAnMCcgOiAnJykgKyBzZWM7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uaDIobnVsbCwgXCJQaWNraW5nIGEgd2lubmVyIGluIFwiLCB0aGlzLnJlbmRlckNvdW50ZG93bigpKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpXG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICAvLyBUaGUgZm9sbG93aW5nIHR3byBtZXRob2RzIGFyZSB0aGUgb25seSBwbGFjZXMgd2UgbmVlZCB0b1xuICAvLyBpbnRlZ3JhdGUgd2l0aCBCb290c3RyYXAgb3IgalF1ZXJ5IVxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgLy8gV2hlbiB0aGUgY29tcG9uZW50IGlzIGFkZGVkLCB0dXJuIGl0IGludG8gYSBtb2RhbFxuICAgICQodGhpcy5nZXRET01Ob2RlKCkpXG4gICAgICAubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlLCBzaG93OiBmYWxzZX0pO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkub2ZmKCdoaWRkZW4nKTtcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm1vZGFsKCdoaWRlJyk7XG4gIH0sXG4gIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm1vZGFsKCdzaG93Jyk7XG4gIH0sXG4gIHN0YXJ0Q291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAnY291bnRkb3duJ1xuICAgIH0pO1xuICAgIHRoaXMub3BlbigpO1xuICB9LFxuICBhZnRlckNvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLnByb3BzLnBhcmVudC5jaG9vc2VXaW5uZXIoKTtcbiAgfSxcbiAgcmVuZGVyQm9keTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdjb3VudGRvd24nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSb29tQ291bnRkb3duKCB7Y291bnRkb3duOjEsIG9uRmluaXNoOnRoaXMuYWZ0ZXJDb3VudGRvd259IClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1vZGFsIGZhZGVcIn0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtZGlhbG9nXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtY29udGVudFwifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJvZHkoKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS5yZXN0YXVyYW50cztcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS52ZXRvKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImxhYmVsIGxhYmVsLWRhbmdlclwifSwgXCJWZXRvZWQhXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBuYW1lID0gY2F0Lm5hbWVcbiAgICAgICwgcmVzdGF1cmFudHMgPSBjYXQucmVzdGF1cmFudHM7XG4gICAgdmFyIGNhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1jYXRcIjtcbiAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpKSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICBpZiAoY2F0LndpbnMpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIHdpbm5lclwiO1xuICAgIH1cbiAgICB2YXIgcmVuZGVyZWQgPSByZXN0YXVyYW50c1xuICAgIC5tYXAoZnVuY3Rpb24gKGVhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZVJlc3RhdXJhbnQoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmVhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGV4OnRoaXMucHJvcHMuaW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5wcm9wcy5tb2RlLFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLnByb3BzLmNob29zZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIG5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKSksXG4gICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICAgIHJlbmRlcmVkXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSb29tUmVzdGF1cmFudERldGFpbHMgPSByZXF1aXJlKCcuL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCcpO1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMucHJvcHMuZGF0YS5jaG9zZW4sIHRoaXMucHJvcHMucGFyZW50SW5kZXgsIHRoaXMucHJvcHMuaW5kZXgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlID09PSAnZnJvemVuJyAmJiB0aGlzLnByb3BzLmRhdGEucm91bmRDaG9zZW4pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtc3VjY2Vzc1wifSwgXCJDaG9zZW4hXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBlYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tcmVzdFwiO1xuICAgIGlmIChlYXQuY2hvc2VuKSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICBpZiAoZWF0LndpbnMpIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIHdpbm5lclwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmVhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJzbWFsbFwifSwgZWF0Lm5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKSksXG4gICAgICAgIFJvb21SZXN0YXVyYW50RGV0YWlscygge2RhdGE6ZWF0fSApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtY2F0ZWdvcnkuanN4Jyk7XG5cbnZhciBSb29tUGFuZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2Zyb3plbidcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZCgpO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiB0aGlzLmdldEZyb3plblN0YXRlKClcbiAgICB9KTtcbiAgfSxcbiAgZ2V0RnJvemVuU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNBbnlDYXRDaG9zZW4oKSkge1xuICAgICAgcmV0dXJuICduZWVkQ2hvaWNlJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdmcm96ZW4nO1xuICAgIH1cbiAgfSxcbiAgaW5pdERvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLnBhcmVudC5yZWZzLm1vZGFsLnN0YXJ0Q291bnRkb3duKCk7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0JyA/IHRoaXMuZ2V0RnJvemVuU3RhdGUoKSA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgZ2V0Q2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5jYXRlZ29yaWVzO1xuICB9LFxuICBnZXRNZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5tZTtcbiAgfSxcbiAgY2xpY2tDaG9zZW46IGZ1bmN0aW9uIChpc0Nob3NlbiwgY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBpZiAodHlwZW9mKHJlc3RhdXJhbnRJbmRleCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHdob2xlIGNhdGVnb3J5XG4gICAgICAgIHZhciB0b2dnbGVDYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XTtcbiAgICAgICAgdG9nZ2xlQ2F0LnJlc3RhdXJhbnRzLmZvckVhY2goZnVuY3Rpb24gKGVhdCkge1xuICAgICAgICAgIGVhdC5jaG9zZW4gPSBpc0Nob3NlbjtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2dnbGluZyBzaW5nbGUgcmVzdGF1cmFudFxuICAgICAgICB2YXIgdG9nZ2xlRWF0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbY2F0ZWdvcnlJbmRleF0ucmVzdGF1cmFudHNbcmVzdGF1cmFudEluZGV4XTtcbiAgICAgICAgdG9nZ2xlRWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZnJvemVuJykge1xuICAgICAgLy8gdmV0byAvIHJvdW5kQ2hvc2VuIG1vZGVcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdmV0byBieSBjYXRlZ29yaWVzXG4gICAgICAgIHZhciB0b2dnbGVDYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XTtcbiAgICAgICAgdG9nZ2xlQ2F0LnZldG8gPSAhdG9nZ2xlQ2F0LnZldG87XG4gICAgICAgIGlmICh0b2dnbGVDYXQudmV0bykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2ZXRvZXM6ICh0aGlzLnN0YXRlLnZldG9lcyB8fCAwKSArIDEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApIC0gMSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdLnJlc3RhdXJhbnRzW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5yb3VuZENob3NlbiA9ICF0b2dnbGVFYXQucm91bmRDaG9zZW47XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuKSB7XG4gICAgICAgICAgdmFyIGlqID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbjtcbiAgICAgICAgICBkZWxldGUgdGhpcy5nZXRDYXRlZ29yaWVzKClbaWpbMF1dLnJlc3RhdXJhbnRzW2lqWzFdXS5yb3VuZENob3NlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9nZ2xlRWF0LnJvdW5kQ2hvc2VuKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdW5kQ2hvc2VuOiBbY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4XSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcm91bmRDaG9zZW46IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoY2F0KSB7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0LnJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2F0LnJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgaXNBbnlDYXRDaG9zZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdldENhdGVnb3JpZXMoKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2ldO1xuICAgICAgaWYgKHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oY2F0KSkge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgcmVuZGVyQ2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZUNhdGVnb3J5KCBcbiAgICAgICAgICAgICAgICB7ZGF0YTpjYXQsIFxuICAgICAgICAgICAgICAgIGluZGV4OmluZGV4LCBcbiAgICAgICAgICAgICAgICBtb2RlOnRoaXMuc3RhdGUubW9kZSwgXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMuY2xpY2tDaG9zZW59ICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICByZW5kZXJlZFxuICAgICAgKVxuICAgICk7XG4gICAgICAgICAgICBcbiAgfSxcbiAgcmVuZGVyQnV0dG9uRWRpdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25NZXNzYWdlID0gJ0VkaXQnO1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0Jykge1xuICAgICAgYnV0dG9uTWVzc2FnZSA9ICdDbG9zZSc7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldE1lKCkuaXNDcmVhdG9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICAgIGJ1dHRvbk1lc3NhZ2VcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckluZm86IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmV0b2VzID0gdGhpcy5zdGF0ZS52ZXRvZXMgfHwgMFxuICAgICAgLCByb3VuZENob3NlbiA9IHRoaXMuc3RhdGUucm91bmRDaG9zZW4gPyAxIDogMDtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZnJvemVuJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvb20taW5mbyBwdWxsLXJpZ2h0XCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFkZ2VcIn0sIHZldG9lcyksIFwiIHZldG9lZFwiKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFkZ2VcIn0sIHJvdW5kQ2hvc2VuKSwgXCIgY2hvc2VuXCIpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXJDYWxsVG9BY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNXaW5uZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBcIkFuZCB0aGUgd2lubmVyIGlzLi4uXCIpXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnbmVlZENob2ljZScpIHtcbiAgICAgIGlmICh0aGlzLmdldE1lKCkuaXNDcmVhdG9yKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiQ2xpY2sgRWRpdCBhbmQgbWFrZSB5b3VyIGNob2ljZXNcIilcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiVGhlIG93bmVyIG9mIHRoaXMgcm9vbSBuZWVkIHRvIGNob29zZSBzb21lIG9wdGlvbnMgZnJvbSB0aGUgbGlzdCBmaXJzdFwiKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyQnV0dG9uSW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25NZXNzYWdlID0gJ0lcXCdtIERvbmUnO1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMuaW5pdERvbmV9LCBcbiAgICAgICAgICBidXR0b25NZXNzYWdlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZSA9IHRoaXMuc3RhdGUubW9kZTtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNXaW5uZXIpIHtcbiAgICAgIG1vZGUgPSAnd2lubmVyJztcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS50YWJsZSgge2NsYXNzTmFtZTpcInRhYmxlXCIsICdkYXRhLW1vZGUnOm1vZGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2FsbFRvQWN0aW9uKCksXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3JpZXMoKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKCB7Y2xhc3NOYW1lOlwiYnV0dG9uUm93XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVySW5mbygpLFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uRWRpdCgpLFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uSW5pdCgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnXG4gICAgfTtcbiAgfSxcbiAgZ2V0UGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLnBlb3BsZTtcbiAgfSxcbiAgZ2V0TWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUubWU7XG4gIH0sXG4gIHJlbmRlclNtYWxsTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtc2cgPSBcIlwiXG4gICAgICAsIGhhc1BpY2tlZCA9IDBcbiAgICAgICwgbWUgPSB0aGlzLmdldE1lKCk7XG4gICAgaWYgKCF0aGlzLmdldFBlb3BsZSgpLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdldFBlb3BsZSgpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwZXJzb24gPSB0aGlzLmdldFBlb3BsZSgpW2ldO1xuICAgICAgICBpZiAocGVyc29uLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGggKyBcIiwgaW5jbHVkaW5nIG1lLCBoYXZlIGNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuRE9NLmgzKG51bGwsIG1zZyk7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyAnbGFyZ2UnIDogJ3NtYWxsJylcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTbWFsbE1lc3NhZ2UoKTtcbiAgfSxcbiAgcmVuZGVyUGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGVvcGxlKClcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHJldHVybiBwZXJzb24ubmFtZSAhPT0gdGhpcy5nZXRNZSgpLm5hbWU7XG4gICAgfSwgdGhpcylcbiAgICAubWFwKGZ1bmN0aW9uIChwZXJzb24pIHtcbiAgICAgIHZhciBwZXJzb25DbGFzcyA9ICdwdWxsLWxlZnQgbGFiZWwgbGFiZWwtJztcbiAgICAgIGlmIChwZXJzb24uc3RhdGUgPT09ICd3YWl0aW5nJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnd2FybmluZyc7XG4gICAgICB9IGVsc2UgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnc3VjY2Vzcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJzb25DbGFzcyArPSAnZGVmYXVsdCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpwZXJzb25DbGFzc30sIHBlcnNvbi5uYW1lKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJMYXJnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibWVkaWFcIn0sIFxuICAgICAgICB0aGlzLnJlbmRlclBlb3BsZSgpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5uYXYoIHtjbGFzc05hbWU6XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLWZpeGVkLXRvcCByb29tLXBlb3BsZVwiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGUsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJjb250YWluZXJcIn0sIFxuICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlID09PSAnc21hbGwnID8gdGhpcy5yZW5kZXJTbWFsbCgpIDogdGhpcy5yZW5kZXJMYXJnZSgpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21SZXN0YXVyYW50RGV0YWlscyA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlYXQgPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgY29uc29sZS5sb2coKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJlc3RhdXJhbnQtZGV0YWlscyBtZWRpYVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJwdWxsLWxlZnRcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5pbWcoIHtjbGFzczpcIm1lZGlhLW9iamVjdFwiLCBzcmM6ZWF0LmltYWdlX3VybCwgYWx0OmVhdC5uYW1lfSApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzczpcIm1lZGlhLWJvZHlcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5oNSgge2NsYXNzOlwibWVkaWEtaGVhZGluZ1wifSwgZWF0Lm5hbWUpLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLmltZygge2NsYXNzOlwibWVkaWEtb2JqZWN0XCIsIHNyYzplYXQucmF0aW5nX2ltZ191cmxfc21hbGwsIGFsdDpcInJhdGluZ3NcIn0gKSksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKG51bGwsIGVhdC5sb2NhdGlvbi5hZGRyZXNzWzBdLCBlYXQubG9jYXRpb24uY2l0eSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00uc3BhbihudWxsLCBlYXQuZGlzcGxheV9waG9uZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QZW9wbGUgPSByZXF1aXJlKCcuL3Jvb20tcGVvcGxlLmpzeCcpXG4gICwgUm9vbVBhbmUgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS5qc3gnKVxuICAsIFJvb21Nb2RhbCA9IHJlcXVpcmUoJy4vcm9vbS1tb2RhbC5qc3gnKVxuICAsIHJvb20gPSByZXF1aXJlKCdyZWFsdGltZS9yb29tJyk7XG5cbnZhciBSb29tID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7bG9jYXRpb246IHt9LCBjYXRlZ29yaWVzOiBbXSwgcGVvcGxlOiBbXSwgbWU6IHt9fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByb29tLmNyZWF0ZVJvb20oe2xvY2F0aW9uOiByb29tTG9jYXRpb24gfHwgJ21vdW50YWluIHZpZXcnfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYXRpb246IHJlcy5sb2NhdGlvbiwgXG4gICAgICAgIGNhdGVnb3JpZXM6IHJlcy5jYXRlZ29yaWVzLCBcbiAgICAgICAgcGVvcGxlOiBbXG4gICAgICAgICAgeyBuYW1lOiAnQWxpY2UnLCBpZDogJzEyMycsIHN0YXRlOiAnd2FpdGluZycgfSxcbiAgICAgICAgICB7IG5hbWU6ICdCb2InLCBpZDogJzQ1NicsIHN0YXRlOiAnZmluaXNoZWQnIH0sXG4gICAgICAgICAgeyBuYW1lOiAnQ2hhcmxpZScsIGlkOiAnNzg5Jywgc3RhdGU6ICdmaW5pc2hlZCcgfVxuICAgICAgICBdLFxuICAgICAgICBtZToge1xuICAgICAgICAgIG5hbWU6ICdBbGljZScsXG4gICAgICAgICAgaXNDcmVhdG9yOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaG9vc2VXaW5uZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ZWdvcmllcyA9IHRoaXMuc3RhdGUuY2F0ZWdvcmllc1xuICAgICAgLCB3aW5uaW5nQ2F0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nQ2F0ID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzW3dpbm5pbmdDYXRJbmRleF1cbiAgICAgICwgd2lubmluZ1Jlc3RhdXJhbnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHdpbm5pbmdDYXQucmVzdGF1cmFudHMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nUmVzdGF1cmFudCA9IHdpbm5pbmdDYXQucmVzdGF1cmFudHNbd2lubmluZ1Jlc3RhdXJhbnRJbmRleF07XG4gICAgd2lubmluZ0NhdC53aW5zID0gdHJ1ZTtcbiAgICB3aW5uaW5nUmVzdGF1cmFudC53aW5zID0gdHJ1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGhhc1dpbm5lcjogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwifSwgXG4gICAgICAgIFJvb21QZW9wbGUoIHtyZWY6XCJwZW9wbGVcIixcbiAgICAgICAgICBwYXJlbnQ6dGhpc30gKSxcbiAgICAgICAgUm9vbVBhbmUoIHtyZWY6XCJwYW5lXCIsXG4gICAgICAgICAgcGFyZW50OnRoaXMsIGhhc1dpbm5lcjp0aGlzLnN0YXRlLmhhc1dpbm5lcn0gKSxcbiAgICAgICAgUm9vbU1vZGFsKCB7cmVmOlwibW9kYWxcIiwgXG4gICAgICAgICAgcGFyZW50OnRoaXN9IClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pO1xuIl19
;