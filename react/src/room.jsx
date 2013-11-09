/** @jsx React.DOM */
var Room = React.createClass({
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
      <div id="room">
        <PeoplePane />
        <RoomPane />
        <ModalPane />
      </div>
    );
  }
});

var PeoplePane = React.createClass({
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
      return <li className="person {person.state}">{person.name}</li>
    });
  },
  renderLarge: function () {
    return (
      <ul>
        {this.renderPeople()}
      </ul>
    );
  },
  render: function () {
    return (
      <div className="col-lg-8 btn-link" data-mode={this.state.mode} onClick={this.toggleMode}>
        {this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()}
      </div>
    );
  }
});

var RoomPane = React.createClass({
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
        <li className={cat.chosen ? 'chosen' : ''}>
          <span>{cat.name}</span>
          <ul>
            {this.renderRestaurants(cat.value)}
          </ul>
        </li>
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
        <li className={eat.chosen ? 'chosen' : ''}>
          {eat.name}
        </li>
      );
    }, this);
  },
  render: function () {
    return (
      <div className="col-lg-8 btn-link" data-mode={this.state.mode}>
        <button type="button" className="pull-right edit btn btn-default" onClick={this.toggleMode}>
          <span className="glyphicon glyphicon-edit"></span>
        </button>
        {this.renderCategories()}
      </div>
    );
  }
});

var ModalPane = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
  },
  render: function () {
    return (
      <div className="col-lg-12">
        Modal Pane
      </div>
    );
  }
});

React.renderComponent(
  <Room url="/realtime" />,
  document.getElementById('room-container')
);