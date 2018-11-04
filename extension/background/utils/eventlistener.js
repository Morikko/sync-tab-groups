const EventListener = function() {
  this.events = []; // Empty list of events/actions
}

EventListener.prototype.on = function(event, fn) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(fn);
}

EventListener.prototype.fire = function(event) {
  if (this.events[event]) {
    this.events[event].forEach(function(fn) {
      fn();
    });
  }
}

export default EventListener