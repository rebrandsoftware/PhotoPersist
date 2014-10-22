var FileIO = {

    makeFilePersistent: function(tempURI, newName, callback) {
        //resolve the file URI
        console.log("[FILEIO]: makeFilePersistent: " + tempURI);
        window.resolveLocalFileSystemURL(tempURI, function(fileEntry) {
            console.log("[FILEIO]: Resolved Temp File to FileEntry");
            console.log(fileEntry);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem) {
                    console.log("[FILEIO]: Got filesystem");
                    console.log(fileSystem);
                    fileEntry.moveTo(fileSystem.root, newName, function(newFileEntry) {
                        console.log("[FILEIO]: Moved File");
                        console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                        callback(newFileEntry.fullPath);
                    }, FileIO.errorHandler);
                }, FileIO.errorHandler);
        }, FileIO.errorHandler);
    },

    getFileURI: function(partialPath, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                console.log("[FILEIO]: Got filesystem");
                var fileURI = fileSystem.root.toURL() + partialPath;
                console.log("[FILEIO]: Full Path: " + fileURI);
                callback(fileURI);
            }, FileIO.errorHandler);
    },
    
    getB64FromFileURI: function(fileURI, callback) {
        console.log('[FILEIO]: getB64FromFileURI: ' + fileURI);
        window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
            console.log("[FILEIO]: Resolved FileURI to FileEntry");
            console.log(fileEntry);
            fileEntry.file(function(file) {
                var reader = new FileReader();
                var b64='';
                reader.onloadend = function(evt) {
                    b64 = evt.target.result;
                    console.log("[FILEIO]: got base64 len: " + b64.length);
                    console.log(b64);
                    callback(b64);
                };
                reader.readAsDataURL(file);
            }, FileIO.errorHandler);
        }, FileIO.errorHandler);
    },

    // simple error handler
    errorHandler: function(e) {
        console.log('[FILEIO]: Error: ');
        console.log(e);
    }
};