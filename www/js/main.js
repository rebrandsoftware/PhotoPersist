var app = {
    takePhoto: function() {
        console.log("[takePhoto]");
        navigator.camera.getPicture(app.photoSuccess, app.errorHandler, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 800,
            targetHeight: 600,
            sourceType: 1,
            saveToPhotoAlbum: true
        });
    },

    photoSuccess: function(tempURI) {
        console.log("[photoSuccess] tempURI: " + tempURI);
        FileIO.makeFilePersistent(tempURI, "MyPhoto.jpg", function(persistentURI) {
            console.log("[photoSuccess] Received Persistent URI: " + persistentURI);
            localStorage.persistentURI = persistentURI;
            var $el = $('#imgTakePhoto');
            $el.attr('src', persistentURI).load();
        });
    },

    loadPhoto: function() {
        console.log("[loadPhoto]");
        var persistentURI = localStorage.persistentURI;
        console.log("[loadPhoto] persistentURI: " + persistentURI);
        var $el = $('#imgTakePhoto');
        $el.attr('src', persistentURI).load();
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