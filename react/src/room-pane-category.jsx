/** @jsx React.DOM */

var RoomPaneRestaurant = require('./room-pane-restaurant.jsx');

var RoomPaneCategory = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  doesCatHaveChosen: function () {
    var restaurants = this.props.data.value;
    var hasChosen = false;
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.value;
    var catClass = "list-group-item room-cat";
    if (this.doesCatHaveChosen()) {
      catClass += " chosen";
    }
    var rendered = restaurants
    .filter(function (eat) {
      if (this.props.mode === 'edit') {
        return true;
      } else {
        return this.doesCatHaveChosen();
      }
    }, this)
    .map(function (eat, index) {
      return <RoomPaneRestaurant data={eat} index={index} parentIndex={this.props.index} mode={this.props.mode} />;
    }, this);
    return (
      <li className={catClass}>
        <h4>{name}</h4>
        <ul className="list-group">
          {rendered}
        </ul>
      </li>
    );
  }
});