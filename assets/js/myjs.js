function console_log(temp){
    console.log(temp);
}

new_img_data = {};

$(document).ready(function (e) {

    $('.navbar-brand').attr('href', window.location.protocol+"//"+window.location.hostname+window.location.pathname);

    $('#submitUploadNewImage').unbind();
    $('#submitUploadNewImage').click(function(){
        var imgName = $(this).data('img-name');
        var form_data = new FormData();

        form_data.append('imgUrl', imgName);

        form_data.append('imgInitW', new_img_data.getImageData.naturalWidth);
        form_data.append('imgInitH', new_img_data.getImageData.naturalHeight);

        form_data.append('imgW', new_img_data.getImageData.width);
        form_data.append('imgH', new_img_data.getImageData.height);

        form_data.append('imgY1', ((new_img_data.getCropBoxData.top) - parseInt($('.cropper-canvas').css('top'))));
        form_data.append('imgX1', ((new_img_data.getCropBoxData.left) - parseInt($('.cropper-canvas').css('left'))));

        form_data.append('cropW', new_img_data.getCropBoxData.width);
        form_data.append('cropH', new_img_data.getCropBoxData.height);

        form_data.append('rotation', new_img_data.getImageData.rotate);

        $.ajax({
            url: "crop.php", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false
            success: function(data){   // A function to be called if request succeeds
                var cropResult = $.parseJSON(data);
                console_log('crop done: '+cropResult);
                if(cropResult.status == "success"){
                    console_log('Image Name: '+ cropResult.url);

                    var uploadURL = window.location.protocol+"//"+window.location.hostname+window.location.pathname+cropResult.url;
                    console_log('the image url is: '+uploadURL);
                    $('h1').text('Your image link is here:');
                    $('button').hide();
                    $('.well').html('<a href="'+uploadURL+'" target="_blank">'+uploadURL+'</a>');
                    $('.well').fadeIn();
                    $('#myModal').modal('hide');

                }
                else{
                    swal(
                        'Opps!',
                        'Something didnt go well! Please try again.',
                        'warning'
                    );
                }
            },
            timeout: function(){
                swal(
                    'Opps!',
                    'Connection Timed out. Please try again.',
                    'warning'
                );
            }
        });

    });

    // Function to preview image after validation
    $(function() {
        $("#fileInput").change(function(){
            $('#selectImage').fadeOut();
            console_log('Upload new Image');
            var file = this.files[0];
            console_log(file);
            var imagefile = file.type;
            var match= ["image/jpeg","image/png","image/jpg"];
            if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))){
                console_log('Invalid image');
                $('#previewing').attr('src','assets/img/noimg43.jpg');

                swal(
                    'Opps!',
                    'Not a valid image file.',
                    'warning'
                );
                return false;
            }
            else{
                console_log('Valid Image');
                // upload to temp
                var form_data = new FormData();                  
                form_data.append('file', file);

                $.ajax({
                    url: "ajax_php_file.php", // Url to which the request is send
                    type: "POST",             // Type of request to be send, called as method
                    data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData:false,        // To send DOMDocument or non processed data file it is set to false
                    error: function(){
                        alert('Error!');
                    },
                    success: function(data){   // A function to be called if request succeeds
                        console_log(data);

                        var UploadResult = $.parseJSON(data);
                        console_log(UploadResult);
                        if(UploadResult.success == 'TRUE'){

                            // set preview
                            var reader = new FileReader();
                            reader.onload = imageIsLoaded;
                            reader.readAsDataURL(file);

                            // load Cropper js
                            setTimeout(function(){
                                console_log('@ Cropper js');
                                // cropper js assign
                                var image = document.querySelector('#previewing');
                                //var minAspectRatio = 0.5;
                                //var maxAspectRatio = 1.5;
                                cropper = new Cropper(image, {
                                    aspectRatio: 4 / 4,
                                    //preview: '#demo-image-holder',
                                    ready: function () {
                                        console_log('ready');
                                        var cropper = this.cropper;
                                        //var containerData = cropper.getContainerData();
                                        //var cropBoxData = cropper.getCropBoxData();
                                        //var aspectRatio = cropBoxData.width / cropBoxData.height;
                                        //var newCropBoxWidth;
                                        new_img_data.getImageData = cropper.getImageData();
                                        new_img_data.getCropBoxData = cropper.getCropBoxData();
                                    },
                                    cropmove: function () {
                                        //console_log('cropmove');
                                        var cropper = this.cropper;
                                        var cropBoxData = cropper.getImageData();
                                        //var aspectRatio = cropBoxData.width / cropBoxData.height;
                                    },
                                    crop: function(e) {
                                        console_log('crop');
                                    },
                                    cropend: function(e){
                                        //console_log('cropend');
                                        new_img_data.getImageData = cropper.getImageData();
                                        new_img_data.getCropBoxData = cropper.getCropBoxData();
                                        console_log(new_img_data);
                                    }
                                });

                                $('#submitUploadNewImage').fadeIn().css('display', 'initial');
                                $('.clickHelpText').fadeOut().css('display', 'none');
                                $('#submitUploadNewImage').data('img-name', UploadResult.name);
                            }, 2000);
                        }
                        else{
                            swal(
                                'Error!',
                                UploadResult.message,
                                'warning'
                            );
                        }
                    },
                    timeout: function(){
                        swal(
                            'Opps!',
                            'Connection time out.',
                            'warning'
                        );
                    }
                });
            }
        });

    });
    function imageIsLoaded(e) {
        //            $("#fileInput").css("color","green");
        //            $('#image_preview').css("display", "block");
        $('#previewing').attr('src', e.target.result);
        $('#previewing').attr('width', '250px');
        $('#previewing').attr('height', '230px');
    };

    $('#previewing').unbind();
    $('#previewing').click(function(){
        $('#fileInput').click();
    });
});