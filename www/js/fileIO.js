var FileIO = {

    makeFilePersistent: function(tempURI, newName, callback) {
        //resolve the file URI
        console.log("[FILEIO]: makeFilePersistent");
        console.log(tempURI);
        window.resolveLocalFileSystemURL(tempURI, function(fileEntry) {
            console.log("[FILEIO]: Resolved Temp File");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem) {
                    console.log("[FILEIO]: Got filesystem");
                    fileEntry.moveTo(fileSystem.root, newName, function(newFileEntry) {
                        console.log("[FILEIO]: Moved File");
                        console.log("[FILEIO]: New URI: " + newFileEntry.fullpath);
                        callback(newFileEntry.fullpath);
                    }, FileIO.errorHandler);
                }, FileIO.errorHandler);
        }, FileIO.errorHandler);
    },

    getFileURI: function(partialPath, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                console.log("[FILEIO]: Got filesystem");
                var fileURI = fileSystem.root.fullPath + partialPath;
                console.log("[FILEIO]: Full Path: " + fileURI);
                callback(fileURI);
            }, FileIO.errorHandler);
    },

    resolveFileURI: function(fileURI, callback) {
        window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
            callback(fileEntry);
        }, FileIO.errorHandler);
    },

    // simple error handler
    errorHandler: function(e) {
        console.log('[FILEIO]: Error: ');
        console.log(e);
    }
};