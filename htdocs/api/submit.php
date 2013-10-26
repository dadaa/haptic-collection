<?php
  date_default_timezone_set("Asia/Tokyo");
  $result = array();
  $title = $_POST["title"];
  $image = file_get_contents($_FILES['image']['tmp_name']);
  $haptic = file_get_contents($_FILES['haptic']['tmp_name']);

  try {
    $id = time()."_".$title;
    $dataDirectoryRelational = getenv("DATA_DIRECTORY");
    $directory = "../".$dataDirectoryRelational."/".$id;
    if (mkdir($directory)) {
    } else {
      throw new Exception("Could not make a directory[".$directory."]");
    }
    file_put_contents($directory."/image.jpg", $image);
    file_put_contents($directory."/haptic.wav", $haptic);

    $result["id"] = $id;
    $result["image"] = $dataDirectoryRelational."/".$id."/image.jpg";
    $result["haptic"] = $dataDirectoryRelational."/".$id."/haptic.wav";
  } catch (Exception $e) {
    $result["error"] = $e->getMessage();
  }
  echo json_encode($result);
?>