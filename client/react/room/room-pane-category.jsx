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
        <span className="label label-danger">Vetoed!</span>
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
    var rendered = restaurants
    .map(function (eat, index) {
      return <RoomPaneRestaurant 
                data={eat} 
                index={index} 
                parentIndex={this.props.index} 
                mode={this.props.mode}
                choose={this.props.choose} />;
    }, this);
    return (
      <li className={catClass} onClick={this.onToggle}>
        <h4>{name} {this.renderLabel()}</h4>
        <ul className="list-group">
          {rendered}
        </ul>
      </li>
    );
  }
});