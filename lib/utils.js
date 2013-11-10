exports.subEvent = function (mainEvent) {
  return function (event) {
    return mainEvent + '-' + event;
  };
};
