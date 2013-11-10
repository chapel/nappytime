/** @jsx React.DOM */

var RoomPaneRestaurant = require('./room-pane-restaurant.jsx');

var RoomPaneCategory = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var restaurants = this.props.data;
    var rendered = restaurants
    .filter(function (cat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return cat.chosen;
      }
    }, this)
    .map(function (cat) {
      var catClass = "list-group-item room-cat";
      if (cat.chosen) {
        catClass += " chosen";
      }
      return (
        <li className={catClass}>
          <h4>{cat.name}</h4>
          <RoomPaneRestaurant data={cat.value} />
        </li>
      );
    }, this);
    return (
      <ul className="list-group">
        {this.rendered}
      </ul>
    );
  }
});