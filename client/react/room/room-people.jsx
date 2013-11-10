/** @jsx React.DOM */

var PeoplePane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'small'
    };
  },
  renderSmallMessage: function () {
    var msg = ""
      , hasPicked = 0;
    if (!this.props.people.length) {
      msg = "You're all alone...";
    } else {
      for (var i = 0; i < this.props.people.length; i++) {
        if (this.props.people[i].state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.props.people.length + " have chosen";
      return (
        <h3>{msg}</h3>
      )
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
    return this.props.people.map(function (person) {
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