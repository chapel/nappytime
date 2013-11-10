/** @jsx React.DOM */

var PeoplePane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'small'
    };
  },
  renderSmallMessage: function () {
    var msg = ""
      , hasPicked = 0
      , me = this.props.me;
    if (!this.props.people.length) {
      msg = "";
    } else {
      for (var i = 0; i < this.props.people.length; i++) {
        var person = this.props.people[i];
        if (person.state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.props.people.length + ", including me, have chosen";
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
    return this.props.people
    .filter(function (person) {
      return person.name !== this.props.me.name;
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