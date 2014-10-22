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
                var $el = $('#imgTakePhoto');
                //$el.attr('src', fullPath).load(); 
                FileIO.getB64FromFileURI(fullPath, function(b64) {
                    console.log("called back b64; " + b64.length);
                    var $el2 = ('#imgTakePhotoB64');
                    $el.attr('src', b64).load();
                });
            });
        });
    },

    loadPhoto: function() {
        console.log("[loadPhoto]");
        var persistentURI = localStorage.persistentURI;
        console.log("[loadPhoto] persistentURI: " + persistentURI);
        FileIO.getFileURI(persistentURI, function(fullPath) {
            console.log("[loadPhoto] Got full path: " + fullPath);
            var $el = $('#imgLoadPhoto');
            //$el.attr('src', fullPath).load();
            FileIO.getB64FromFileURI(fullPath, function(b64) {
                console.log("called back b64; " + b64.length);
                var $el2 = ('#imgLoadPhotoB64');
                $el.attr('src', b64).load();
            });
        });
        
    },

    errorHandler: function(err) {
        console.log("[APPERROR]: ");
        console.log(err);
    },

    initialize: function() {
        $('#btnTakePhoto').on('click', function() {
            console.log("[btnTakePhoto]");
            app.takePhoto();
        });

        $('#btnLoadPhoto').on('click', function() {
            console.log("[btnLoadPhoto]");
            app.loadPhoto();
        });
    }
};

app.initialize();