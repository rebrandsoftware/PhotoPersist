var app = {
    takePhoto: function() {
        console.log("[takePhoto]");
        navigator.camera.getPicture(app.photoSuccess, app.errorHandler, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 800,
            targetHeight: 600,
            sourceType: 1,
            saveToPhotoAlbum: false
        });
    },

    photoSuccess: function(tempURI) {
        console.log("[photoSuccess] tempURI: " + tempURI);
        FileIO.makeFilePersistent(tempURI, "MyPhoto.jpg", function(persistentURI) {
            console.log("[photoSuccess] Received Persistent URI: " + persistentURI);
            localStorage.persistentURI = persistentURI;
            FileIO.getFileURI(persistentURI, function(fullPath) {
                console.log("Got full path: " + fullPath);
                $('#imgTakePhoto').attr('src', fullPath).load().nailthumb(); 
                $('#aTakePhoto').attr('href', fullPath); 
            });
        });
    },

    loadPhoto: function() {
        console.log("[loadPhoto]");
        var persistentURI = localStorage.persistentURI;
        console.log("[loadPhoto] persistentURI: " + persistentURI);
        FileIO.getFileURI(persistentURI, function(fullPath) {
            console.log("[loadPhoto] Got full path: " + fullPath);
            $('#imgLoadPhoto').attr('src', fullPath).load().nailthumb();
            $('#aLoadPhoto').attr('href', fullPath);
        });
        
    },
    
    saveBlob: function() {
        console.log("[loadPhotoB64]");
        var persistentURI = localStorage.persistentURI;
        console.log("[loadPhoto] persistentURI: " + persistentURI);
        FileIO.getFileURI(persistentURI, function(fullPath) {
            console.log("[loadPhoto] Got full path: " + fullPath);
            FileIO.getB64FromFileURI(fullPath, function(b64) {
                console.log("called back b64; " + b64.length);
                var blob = FileIO.getBlobFromBase64(b64);
                console.log("Got Blob");
                console.log(blob);
                FileIO.writeBinaryFile(blob, "MyBinaryPhoto.jpg", function(fileURI) {
                    console.log("Got Blob URI: " + fileURI);
                   localStorage.blobURI = fileURI; 
                });
            });
        });
    },
    
    loadBlob: function() {
        console.log("[loadBlob]");
        var blobURI = localStorage.blobURI;
        console.log("[loadBlob] blobURI: " + blobURI);
        FileIO.getFileURI(blobURI, function(fullPath) {
            console.log("[loadBlob] Got full path: " + fullPath);
            $('#imgLoadBlob').attr('src', fullPath).load().nailthumb();;
            $('#aLoadBlob').attr('href', fullPath);
        });
    },

    errorHandler: function(err) {
        console.log("[APPERROR]: ");
        console.log(err);
    },

    initialize: function() {
        $('.swipebox').swipebox();
        
        // Or, hide them
        $("img").error(function(){
                $(this).hide();
        });
        
        $("img").load(function(){
                $(this).show();
        });
        
        $('#btnTakePhoto').on('click', function() {
            console.log("[btnTakePhoto]");
            app.takePhoto();
        });

        $('#btnLoadPhoto').on('click', function() {
            console.log("[btnLoadPhoto]");
            app.loadPhoto();
        });
        
        $('#btnSaveBlob').on('click', function() {
            console.log("[btnSaveBlob]");
            app.saveBlob();
        });
        
        $('#btnLoadBlob').on('click', function() {
            console.log("[btnLoadBlob]");
            app.loadBlob();
        });
    }
};

app.initialize();