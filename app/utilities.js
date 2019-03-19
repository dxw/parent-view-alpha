module.exports = {

  sanitiseText: function(text) {
    // replaces spaces with hyphens and removes commas and full stops
    return text.replace(/\s+/g, '-').replace(/[.’,]/g, '').toLowerCase();
  }

};
