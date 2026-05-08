const React = require('react');

const lucideIcons = new Proxy({}, {
  get: (target, prop) => {
    return prop === 'createElement' ? React.createElement : () =>
      React.createElement('svg', {
        'data-testid': `lucide-${typeof prop === 'string' ? prop.toLowerCase() : 'icon'}`,
        width: 24,
        height: 24,
      });
  },
});

module.exports = lucideIcons;
