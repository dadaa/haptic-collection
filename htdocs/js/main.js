/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
var MainController = {
  init: function() {
    $(window).keydown(function(e) {
      switch (e.keyCode) {
        case 37 : {
          MainController.previous();
          break;
        }
        case 39 : {
          MainController.next();
          break;
        }
        case 27 : {
          $("#detail").hide();
          break;
        }
      }
    });

    $("#close").click(function() {
      $("#detail").hide();
    });
    $("#previous").click(MainController.previous);
    $("#next").click(MainController.next);

    $("#upload-image").click(function() {
      MainController.upload_type = "image";
      $("#upload").click();
    });
    $("#upload-haptic").click(function() {
      MainController.upload_type = "haptic";
      $("#upload").click();
    });
    $("#upload").change(MainController.upload);
    $("#submit").click(MainController.submit);

    MainController.load();
  },

  load: function() {
    MainController.id_list = [];
    MainController.getJSON("api/list.php", function(result, error) {
      if (error) {
        alert(error);
        return;
      }
      for (var i = 0, n = result.length; i < n; i++) {
        MainController.appendProject(result[i])
      }

      HapticsController.enable(document.getElementById("photo"));
    });
  },

  appendProject: function(project) {
      var id = project.id;
      var imageURL = project.image;
      var hapticURL = project.haptic;

      var image = $(document.createElement("img"));
      image.attr("src", imageURL);
      image.addClass("image");
      var label = $(document.createElement("div"));
      label.addClass("project-name");
      label.text(id);

      var li = $(document.createElement("li"));
      li.append(image);
      li.append(label);
      li.attr("id", id);
      li.attr("image", imageURL);
      li.attr("haptic", hapticURL);
      li.click(MainController.play);
      $("#project-list").append(li);

      HapticsController.load(hapticURL);
      MainController.id_list.push(id);
  },

  play: function(e) {
    var target = $(e.currentTarget);
    var id = target.attr("id");
    for (var i = 0, n = MainController.id_list.length; i < n; i++) {
      if (MainController.id_list[i] == id) {
        MainController.show(i);
        break;
      }
    }
    $("#detail").show();
  },

  previous: function() {
    if (MainController.current_index == 0) {
      MainController.show(MainController.id_list.length-1);
    } else {
      MainController.show(MainController.current_index-1);
    }
  },

  next: function() {
    if (MainController.current_index == MainController.id_list.length-1) {
      MainController.show(0);
    } else {
      MainController.show(MainController.current_index+1);
    }
  },

  show: function(index) {
    MainController.current_index = index;
    var id = MainController.id_list[index];
    var target = document.getElementById(id);
    var imageURL = target.getAttribute("image");
    var hapticURL = target.getAttribute("haptic");
    var photo = $("#photo");
    photo.attr("src", imageURL);
    photo.attr("MozHaptics", hapticURL);
  },

  submit: function() {
    var title = $("#uploaded-title").val();
    var imageURL = $("#uploaded-image").attr("src");
    var hapticURL = $("#uploaded-haptic").attr("src");
    if (title.length == 0) {
      alert("please input the title");
      return;
    }
    if (!imageURL) {
      alert("please select the image");
      return;
    }
    if (!hapticURL) {
      alert("please select the haptic wav");
      return;
    }

    var formData = new FormData();
    formData.append("title", title);
    formData.append("image", $("#uploaded-image").get(0).file);
    formData.append("haptic", $("#uploaded-haptic").get(0).file);

    $.ajax({
      url: "api/submit.php",
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,  // jQuery がデータを処理しないよう指定
      contentType: false,   // jQuery が contentType を設定しないよう指定
      success: function(result) {
        console.log(result)
        MainController.appendProject(result);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(textStatus+":"+MLHttpRequest.responseText);
      }
    });
  },

  upload: function(e) {
    var file = this.files[0];
    var urlObject = window.URL ? window.URL : window.webkitURL;
    var url = urlObject.createObjectURL(file);

    var target = MainController.upload_type == "image" ? $("#uploaded-image") : $("#uploaded-haptic");
    target.attr("src", url);
    target.css("display", "block");
    target.get(0).file = file;
  },

  getParametersFromQuery: function() {
    var parameters = {};
    var url = window.location.href;
    var indexOfQ = url.indexOf("?");
    if (indexOfQ >= 0) {
      var queryString = url.substring(indexOfQ+1);
      var params = queryString.split("&");
      for (var i = 0, n = params.length; i < n; i++) {
        var param = params[i];
        var keyvalue = param.split("=");
        parameters[keyvalue[0]] = keyvalue[1];
      }
      parameters["QueryString"] = queryString;
    }
    return parameters;
  },

  getJSON: function(url, callback) {
    $.getJSON(url, function(result) {
      if (result["error"]) {
        callback(null, result["error"]);
      } else {
        callback(result);
      }
    })
    .error(function(xhr, textStatus, errorThrown) {
      callback(null, textStatus+":"+xhr.responseText);
    })
  }

}

$(document).ready(function() {
  MainController.init();
});