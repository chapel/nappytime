/** @jsx React.DOM */

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
    return {
      eats: this.props.data
    };
  },
  render: function (eats) {
    var eats = this.state.eats;
    var rendered = eats
    .filter(function (eat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return eat.chosen;
      }
    }, this)
    .map(function (eat) {
      var eatClass = "list-group-item room-rest";
      if (eat.chosen) {
        eatClass += " chosen";
      }
      return (
        <li className={eatClass}>
          {eat.name}
        </li>
      );
    }, this);
    return (
      <ul className="list-group">
        {}
      </ul>
    );
  }
});