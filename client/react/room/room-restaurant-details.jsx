/** @jsx React.DOM */

var RoomRestaurantDetails = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var eat = this.props.data;
    console.log();
    return (
      <div className="restaurant-details media">
        <div className="pull-left">
          <img class="media-object" src={eat.image_url} alt={eat.name} />
        </div>
        <div class="media-body">
          <h5 class="media-heading">{eat.name}</h5>
          <div><img class="media-object" src={eat.rating_img_url_small} alt="ratings" /></div>
          <div>
            <span>{eat.location.address[0]} {eat.location.city}</span>
          </div>
          <div>
            <span>{eat.display_phone}</span>
          </div>
        </div>
      </div>
    );
  }
});