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
    
    writeBinaryFile: function(binaryData, fileName, callback) {
        console.log("[FILEIO]: writeBinaryFile");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(filename, {create: true, exclusive: false}, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        console.log("[FILEIO]: created writer");
                        writer.onwriteend = function(evt) {
                            console.log("[FILEIO]: write end");
                            console.log(evt);
                            callback(fileEntry.fullPath);
                        };
        
                        writer.write(binaryData); 
                    });
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
                    console.log("[FILEIO]: line breaks: " + b64.indexOf("\n"));
                    callback(b64);
                };
                reader.readAsDataURL(file);
            }, FileIO.errorHandler);
        }, FileIO.errorHandler);
    },
    
    getBlobFromBase64: function (bs64data) { 
        console.log('[FILEIO]: getBinaryFromBase64: ' + fileURI);
        var binary = atob(bs64data.split(',')[1]); 
        // atob() decode base64 data.. 
        var array = []; 
        for (var i = 0; i < binary.length; i++) { 
            array.push(binary.charCodeAt(i));   
            // convert to binary.. 
        } 
        var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});    // create blob file.. 
        console.log('[FILEIO]: Got Blob');
        return file;
    },

    // simple error handler
    errorHandler: function(e) {
        console.log('[FILEIO]: Error: ');
        console.log(e);
    }
};