// scraping articles and storing them as a JSON
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the comments from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#comments").append("<h2>" + data.title + "</h2>");
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new comment 
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // If comment, write comment
      if (data.comment) {
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// Post comment on click of comment save button
$(document).on("click", "#savecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });
// clear input values
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
