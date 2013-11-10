/** @jsx React.DOM */

var RoomPaneCategory = require('./room-pane-category.jsx');

var RoomPane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'frozen'
    };
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState({
      mode: this.getFrozenState()
    });
  },
  getFrozenState: function () {
    if (!this.isAnyCatChosen()) {
      return 'needChoice';
    } else {
      return 'frozen';
    }
  },
  initDone: function () {
    if (this.props.parent.state.isNew) {
      this.props.parent.saveRoom();
    } else {
      this.props.parent.refs.modal.startCountdown();
    }
  },
  toggleMode: function () {
    this.setState({
      mode: (this.getMode() === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  getMode: function () {
    var mode = "";
    if (this.props.hasWinner) {
      mode = 'winner';
    } else if (this.state.mode === 'edit') {
      mode = this.state.mode;
    } else {
      mode = this.getFrozenState();
    }
    return mode;
  },
  getCategories: function () {
    return this.props.parent.state.categories;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.getMode() === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.restaurants.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    } else if (this.getMode() === 'frozen') {
      // do nothing if in new mode
      if (this.props.parent.state.isNew) {
        return false;
      }
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.getCategories()[ij[0]].restaurants[ij[1]].roundChosen;
        }
        if (toggleEat.roundChosen) {
          this.setState({ roundChosen: [categoryIndex, restaurantIndex] });
        } else {
          this.setState({ roundChosen: null });
        }
      }
    }
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.restaurants.length; i++) {
      if (cat.restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  isAnyCatChosen: function () {
    var hasChosen = false;
    for (var i = 0; i < this.getCategories().length; i++) {
      var cat = this.getCategories()[i];
      if (this.doesCatHaveChosen(cat)) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    var rendered = this.getCategories()
    .map(function (cat, index) {
      return <RoomPaneCategory 
                data={cat} 
                index={index} 
                mode={this.getMode()} 
                choose={this.clickChosen} />;
    }, this);
    return (
      <ul className="list-group">
        {rendered}
      </ul>
    );
            
  },
  renderButtonEdit: function () {
    var buttonMessage = 'Edit';
    if (this.getMode() === 'edit') {
      buttonMessage = 'Close';
    }
    return (
      <button type="button" className="btn-edit pull-right btn btn-default" onClick={this.toggleMode}>
        {buttonMessage}
      </button>
    );
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    if (this.getMode() === 'frozen') {
      return (
        <div className="room-info pull-right">
          <div><span className="badge">{vetoes}</span> vetoed</div>
          <div><span className="badge">{roundChosen}</span> chosen</div>
        </div>
      );
    }
  },
  renderCallToAction: function () {
    if (this.props.hasWinner) {
      return (
        <h4>And the winner is...</h4>
      );
    } else if (this.getMode() === 'needChoice') {
      return (
        <h4>You need to pick at least one restaurant</h4>
      );
    } else if (this.props.parent.state.isNew) {
      return (
        <h4>Click Done to finalize your choices</h4>
      );
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'Done';
    if (this.getMode() === 'frozen') {
      return (
        <button type="button" className="pull-right btn btn-default" onClick={this.initDone}>
          {buttonMessage}
        </button>
      );
    }
  },
  render: function () {
    return (
      <table className="table" data-mode={this.getMode()}>
        <tr>
          <td>
            {this.renderCallToAction()}
            {this.renderCategories()}
          </td>
          <td className="button-row">
            <div className="button-row-fixed">
              {this.renderInfo()}
              <div className="clearfix"></div>
              {this.renderButtonEdit()}
              <div className="clearfix"></div>
              {this.renderButtonInit()}
            </div>
          </td>
        </tr>
      </table>
    );
  }
});