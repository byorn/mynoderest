'use strict';
const {Image, validate} = require('../models/Image');

exports.upload_file = async (req, res) => {
    if (!req.files) return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    const fileName = sampleFile.name;
    const fileType = fileName.substring(fileName.indexOf('.')+1);
    if(fileType!='jpg' && fileType!='png')
    return res.status(400).send('File Type is incorrect');

    let newImage = new Image({name:'test'});
    newImage = await newImage.save();

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`public/imgs/${newImage._id}.png`, function(err) {
      if (err)  return res.status(500).send(err);

      res.send(newImage._id);
    });
};


