if (!Array.prototype.hasOwnProperty('last')) {
  Object.defineProperty(Array.prototype, 'last', {
    get: function () {
      return this[this.length - 1];
    },
  });
} else {
  console.warn(`'last' already existed in the prototype of 'Array'`);
}