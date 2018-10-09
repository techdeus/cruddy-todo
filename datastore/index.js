const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, data) {
    if ( err ) {
      throw ('error writing');
    } else {
      var id = data;
      items[id] = text;
      
      
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err) {
        if (err) {
          callback(err); 
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }  
  }); 
};

exports.readAll = (callback) => {
  // returns an array of tods to client
  var data = [];
  fs.readdir( exports.dataDir + '/', ( err, filenames ) => {
    if ( err ) {
      callback(err);
    } else {
      filenames.forEach(file => {
        data.push({id: file.split('.')[0], text: file.split('.')[0]});
      });
      callback(null, data);   
    }
  }); 
};

exports.readOne = (id, callback) => {
  fs.readFile( exports.dataDir + '/' + id + '.txt', (err, data) => {
    if ( err ) {
      callback(err);
    } else {
      // create a variable storing the object of file id passed
      var todo = {id, text: data.toString()};
      callback(null, todo);
    }
  });
    
};

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + '/' + id + '.txt', (err) => {
    if ( err ) {
      callback(err);
    } else {
      fs.writeFile( exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if ( err ) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
