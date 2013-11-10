/** @jsx React.DOM */
var RoomRestaurantDetails = require('./room-restaurant-details.jsx');

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.props.data.chosen, this.props.parentIndex, this.props.index);
    return false;
  },
  renderLabel: function () {
    if (this.props.mode === 'frozen' && this.props.data.roundChosen) {
      return (
        <span className="label label-success">Chosen!</span>
      );
    }
  },
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    } else {
      eatClass += " not-chosen";
    }
    if (eat.wins) {
      eatClass += " winner";
    }
    return (
      <li className={eatClass} onClick={this.onToggle}>
        <div className="restaurant-details-wrapper">
          <span className="small">{eat.name} {this.renderLabel()}</span>
          <RoomRestaurantDetails data={eat} />
        </div>
      </li>
    );
  }
});