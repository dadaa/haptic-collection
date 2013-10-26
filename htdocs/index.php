<!DOCTYPE html>
<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this file,
   - You can obtain one at http://mozilla.org/MPL/2.0/.  -->
<html>
  <head>
    <meta charset="utf-8">
    <title data-l10n-id="title">Make the Web Haptic : Haptic Collection</title>
    <link rel="stylesheet" href="css/main.css" type="text/css">
    <script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="js/haptics.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <meta name="viewport" content="width=device-width, user-scalable=no">
  </head>
  <body>
    <?php include('header.php.inc'); ?>
    <div id="contents">
      <ul id="project-list"></ul>
      <div id="detail">
        <img id="photo" src="data/1/image.jpg">
        <button id="close">close</button>
        <div id="buttons">
          <button id="previous">previous</button>
          <button id="next">next</button>
        </div>
      </div>
      <div id="register-form">
        <div>
          <input type="text" id="uploaded-title" placeholder="title"/>
        </div>
        <div>
          <div><img id="uploaded-image" /></div>
          <div><button id="upload-image">image</button></div>
        </div>
        <div>
          <div><audio id="uploaded-haptic" controls>no support browser</audio></div>
          <div><button id="upload-haptic">haptic</button></div>
        </div>
        <hr/>
        <div id="submit-container">
          <button id="submit">append new haptic</button>
        </div>
        <input id="upload" name="file" type="file" />
      </div>
    </div>
    <?php include('footer.php.inc'); ?>
    <div id="wait">
      <div id="progress">
        <label id="progress-label">please wait</label>
        <div id="progress-bar">uploading..</div>
      </div>
    </div>
  </body>
</html>
