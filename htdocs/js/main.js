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

    MainController.load();
  },

  load: function() {
    MainController.id_list = [];
    MainController.getJSON("api/getProjectList.php", function(result, error) {
      if (error) {
        alert(error);
        return;
      }
      var projectList = $("#project-list");
      for (var i = 0, n = result.length; i < n; i++) {
        var project = result[i];
        var id = project.id;
        var imageURL = project.image;
        var hapticURL = project.haptic;

        var image = $(document.createElement("img"));
        image.attr("src", imageURL);
        image.addClass("image");

        var li = $(document.createElement("li"));
        li.append(image);
        li.attr("id", id);
        li.attr("image", imageURL);
        li.attr("haptic", hapticURL);
        li.click(MainController.play);
        projectList.append(li);

        HapticsController.load(hapticURL);

        MainController.id_list.push(id);
      }

      HapticsController.enable(document.getElementById("photo"));
    });
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