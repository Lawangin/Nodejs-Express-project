const fs = require('fs');

const deleteFile = (filePath) => {
    // unlink deletes the path the file attach to it
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    })
};

exports.deleteFile = deleteFile;