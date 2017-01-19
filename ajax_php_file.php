<?php
if(isset($_FILES["file"]["type"]))
{
    $validextensions = array("jpeg", "jpg", "png");
    $temporary = explode(".", $_FILES["file"]["name"]);
    $file_extension = end($temporary);

    $details = $_FILES["file"]["type"].' - '.$_FILES["file"]["size"];

    if ((($_FILES["file"]["type"] == "image/png") || ($_FILES["file"]["type"] == "image/jpg") || ($_FILES["file"]["type"] == "image/jpeg")
        ) && ($_FILES["file"]["size"] < 100000000)//Approx. 100kb files can be uploaded.
        && in_array($file_extension, $validextensions)) {
        if ($_FILES["file"]["error"] > 0){
            echo json_encode(array('success'=>'FALSE',
                                   'message'=>'Return Code:'.$_FILES["file"]["error"]));

            //            echo "Return Code: " . $_FILES["file"]["error"] . "<br/><br/>".$details;
        }
        else{
            $fileExt = explode("/",$_FILES["file"]["type"]);
            $newName = 'NewImage'.uniqid().'.'.$fileExt[1];
            $sourcePath = $_FILES['file']['tmp_name']; // Storing source path of the file in a variable
            $targetPath = "upload/".$newName;
            //                $targetPath = "upload/".$_FILES['file']['name']; // Target path where file is to be stored

            //                move_uploaded_file($_FILES['Filedata']['tmp_name'], str_replace(" ", "_",$full_path));//make the upload

            move_uploaded_file($sourcePath,$targetPath) ; // Moving Uploaded file

            echo json_encode(array('success'=>'TRUE',
                                   'name'=>$newName));

//            echo "<span id='success'>Image Uploaded Successfully...!!</span><br/>";
//            echo "<br/><b>File Name:</b> " . $newName . "<br>";
//            echo "<b>Type:</b> " . $_FILES["file"]["type"] . "<br>";
//            echo "<b>Size:</b> " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
//            echo "<b>Temp file:</b> " . $_FILES["file"]["tmp_name"] . "<br>";
        }
    }
    else{
        echo json_encode(array('success'=>'FALSE',
                               'message'=>'Invalid file Size or Type:'.$details));
        //        echo "<span id='invalid'>***Invalid file Size or Type***".$details."<span>";
    }
}
?>