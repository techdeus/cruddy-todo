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
      console.log(data);
      var id = data;
      items[id] = text;
      
      // console.log('this is the path: ', exports.dataDir + '/' + id + '.txt');
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err) {
        if (err) {
          throw ('error writing file'); 
        }
        console.log('File Saved!');
      });
      callback(null, { id, text });
    }  
  }); 
};

exports.readAll = (callback) => {
  // returns an array of tods to client
  var data = [];
  
  // console.log('this is the dataDir: ', exports.dataDir);
  fs.readdir( exports.dataDir + '/', ( err, filenames ) => {
    if ( err ) {
      throw ('Files not read.');
    } else {
      // console.log('this is the filenames: ', filenames);
      filenames.forEach(file => {
        console.log(file);
        data.push({id: file.split('.')[0], text: file.split('.')[0]});
      });
      callback(null, data);   
    }
  }); 
};

exports.readOne = (id, callback) => {
  fs.readFile( exports.dataDir + '/' + id + '.txt', (err, data) => {
    if ( err ) {
      throw ( 'File not read.');
    } else {
      // create a variable storing the object of file id passed
      var todo = {id, text: data.toString()};
      console.log('TODO: ', todo);
      callback(null, todo);
    }
  });
    
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
