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
                fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
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
    
    getBlobFromBase64: function (b64Data, contentType, sliceSize) { 
        // console.log('[FILEIO]: getBlobFromBase64');
        // var binary = atob(bs64data.split(',')[1]); 
        // // atob() decode base64 data.. 
        // console.log("[FILEIO]: got binary");
        // var array = []; 
        // for (var i = 0; i < binary.length; i++) { 
            // array.push(binary.charCodeAt(i));   
            // // convert to binary.. 
        // } 
        // console.log("[FILEIO]: pushed to array");
        // var blob=null;
        // var byteArrays = [new Uint8Array(array)];
        // var contentType = 'image/jpeg';
        // try{
           // blob = new Blob(byteArrays, {type: contentType});
        // }
        // catch(e){
            // // TypeError old chrome and FF
            // window.BlobBuilder = window.BlobBuilder || 
                                 // window.WebKitBlobBuilder || 
                                 // window.MozBlobBuilder || 
                                 // window.MSBlobBuilder;
            // if(e.name == 'TypeError' && window.BlobBuilder){
                // console.log("[FILEIO]: using blob builder");
                // var bb = new BlobBuilder();
                // bb.append(byteArrays);
                // blob = bb.getBlob(contentType);
            // }
            // else if(e.name == "InvalidStateError"){
                // // InvalidStateError (tested on FF13 WinXP)
                // console.log("[FILEIO]: invalid state error");
                // blob = new Blob(byteArrays, {type : contentType});
            // }
            // else{
                // console.log("[FILEIO]: we're screwed");
                // // We're screwed, blob constructor unsupported entirely   
            // }
        // }
        // //var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});    // create blob file.. 
        // console.log('[FILEIO]: Got Blob');
        // console.log(blob);
        // return blob;
        var b64DataOrig = b64Data;
        if (b64Data.indexOf(",") > -1) {
            b64Data = b64Data.split(',')[1];
        }
        contentType = contentType || 'image/jpeg';
        sliceSize = sliceSize || 512;
        var blob=null;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            console.log("Slice");
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
                
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
        

        
        //var blob = new Blob(byteArrays, {type: contentType});
        
        try{
           blob = new Blob( byteArrays, {type : contentType});
           console.log("Try Blob");
           return blob;
        }
        catch(e){
            // TypeError old chrome and FF
            console.log("Calling Img Blob");
            FileIO.b64toBlob(b64DataOrig, 
                function(blob) {
                    console.log("Success!");
                    console.log(blob);
                    return blob;
                }, 
                function() {
                    console.log("Error");
                    return null;
            });
        }

    },
        
    b64toBlob: function(b64, onsuccess, onerror) {
        var img = new Image();
    
        img.onerror = onerror;
    
        img.onload = function onload() {
            console.log("loaded image")
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
    
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log("drew image");
            canvas.toBlob(onsuccess);
        };
    
        img.src = b64;
    },

    // simple error handler
    errorHandler: function(e) {
        console.log('[FILEIO]: Error: ');
        console.log(e);
    }
};