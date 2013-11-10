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
    return <h3>{msg}</h3>;
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
      return <div className={personClass}>{person.name}</div>
    });
  },
  renderLarge: function () {
    return (
      <div className="media">
        {this.renderPeople()}
      </div>
    );
  },
  render: function () {
    return (
      <nav className="navbar navbar-default navbar-fixed-top room-people" data-mode={this.state.mode} onClick={this.toggleMode}>
        <div className="container">
        { this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()}
        </div>
      </nav>
    );
  }
});