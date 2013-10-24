<?php
  $result = array();
  try {
    $dataDirectoryRelational = getenv("DATA_DIRECTORY");
    $dataDirectory = "../".$dataDirectoryRelational;
    $dataDirectoryRef = opendir($dataDirectory);
    while($projectDirectory = readdir($dataDirectoryRef)) {
      if (strpos($projectDirectory, ".") === 0) {
        continue;
      }
      $projectID = $projectDirectory;
      $projectDirectory = $dataDirectory.$projectDirectory;
      if (is_dir($projectDirectory) == false) {
        continue;
      }

      $project = array();
      $project["id"] = $projectID;
      $project["image"] = $dataDirectoryRelational.$projectID."/image.jpg";
      $project["haptic"] = $dataDirectoryRelational.$projectID."/haptic.wav";
      $project["description"] = $dataDirectoryRelational.$projectID."/description.txt";
      array_push($result, $project);
    }
    closedir($dataDirectoryRef);


  } catch (Exception $e) {
    $result["error"] = $e->getMessage();
  }
  echo json_encode($result);
?>