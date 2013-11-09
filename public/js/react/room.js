/** @jsx React.DOM */
var Room = React.createClass({displayName: 'Room',
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
        PeoplePane(null ),
        RoomPane(null ),
        ModalPane(null )
      )
    );
  }
});

var PeoplePane = React.createClass({displayName: 'PeoplePane',
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
      React.DOM.div( {className:"col-lg-8 btn-link", 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()
      )
    );
  }
});

var RoomPane = React.createClass({displayName: 'RoomPane',
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
          chosen: true,
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
          chosen: true,
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
  renderCategories: function () {
    return this.state.restaurants
    .filter(function (cat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return cat.chosen;
      }
    }, this)
    .map(function (cat) {
      return (
        React.DOM.li( {className:cat.chosen ? 'chosen' : ''}, 
          React.DOM.span(null, cat.name),
          React.DOM.ul(null, 
            this.renderRestaurants(cat.value)
          )
        )
      );
    }, this);
  },
  renderRestaurants: function (eats) {
    return eats
    .filter(function (eat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return eat.chosen;
      }
    }, this)
    .map(function (eat) {
      return (
        React.DOM.li( {className:eat.chosen ? 'chosen' : ''}, 
          eat.name
        )
      );
    }, this);
  },
  render: function () {
    return (
      React.DOM.div( {className:"col-lg-8 btn-link", 'data-mode':this.state.mode}, 
        React.DOM.button( {type:"button", className:"pull-right edit btn btn-default", onClick:this.toggleMode}, 
          React.DOM.span( {className:"glyphicon glyphicon-edit"})
        ),
        this.renderCategories()
      )
    );
  }
});

var ModalPane = React.createClass({displayName: 'ModalPane',
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
  },
  render: function () {
    return (
      React.DOM.div( {className:"col-lg-12"}, 
        " Modal Pane "
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);