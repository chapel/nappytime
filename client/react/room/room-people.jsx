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
    return <div className="room-people-child">{this.props.parent.state.roomId} - {msg}</div>;
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
      return <div className={personClass}>{person.name}</div>
    });
  },
  renderLarge: function () {
    return (
      <div className="media room-people-child">
        {this.renderPeople()}
      </div>
    );
  },
  renderNew: function () {
    return (
      <div className="room-people-new">
        {this.props.parent.state.roomId} - This is a new room
      </div>
    );
  },
  render: function () {
    if (!this.props.parent.state.roomId) {
      return (
        <div></div>
      );
    }
    var peopleClass = "navbar navbar-default navbar-fixed-top room-people";
    return (
      <nav className={peopleClass} data-mode={this.state.mode} onClick={this.toggleMode}>
        <div className="container">
        {this.renderSmall()}
        {this.renderLarge()}
        {this.renderNew()}
        </div>
      </nav>
    );
  }
});