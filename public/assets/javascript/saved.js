/* global bootbox */
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");
  // Adding event listeners for dynamically generated buttons for deleting articles,
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.comments", handleArticleComments);
  $(document).on("click", ".btn.save", handleCommentSave);
  $(document).on("click", ".btn.comment-delete", handleCommentDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // Empty the article container, run an AJAX request for any saved headlines
    $.get("/api/headlines?saved=true").then(function(data) {
      articleContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
        $("<a class='btn btn-info comments'>Article Comments</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);

    //attach the article's id to the jQuery element
    card.data("_id", article._id);
    // return the constructed card jQuery element
    return card;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Append data
    articleContainer.append(emptyAlert);
  }

  function renderCommentsList(data) {
    var newComments = [];
    var currentComment;
    if (!data.comments.length) {
      // Display no comments message
      currentComment = $("<li class='list-group-item'>No comments for this article yet.</li>");
      newComments.push(currentComment);
    } else {
      // Detect comments => render the list of  comments
      for (var i = 0; i < data.comments.length; i++) {
        // build comments list
        currentComment = $("<li class='list-group-item comment'>")
          .text(data.comments[i].commentText)
          .append($("<button class='btn btn-danger comment-delete'>x</button>"));
        // Save comment id on delete button
        currentComment.children("button").data("_id", data.comments[i]._id);
        // Add the comment to the render array 
        newComments.push(currentComment);
      }
    }
    // Append the comments container with the new comments
    $(".comment-container").append(newComments);
  }

  function handleArticleDelete() {
    // This function handles deleting articles/headlines
    // We grab the id of the article to delete from the card element the delete button sits inside
    var articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Using a delete method here just to be semantic since we are deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }
  function handleArticleComments(event) {
    var currentArticle = $(this)
      .parents(".card")
      .data();
    // Grab comments by id
    $.get("/api/comments/" + currentArticle._id).then(function(data) {
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Comments For: " + currentArticle.headline),
        $("<hr>"),
        $("<ul class='list-group comment-container'>"),
        $("<textarea placeholder='New Comment' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Comment</button>")
      );
      // Adding new HTML to the comment modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var commentData = {
        _id: currentArticle._id,
        comments: data || []
      };
      // Add params about the article and comments to save button
      // When trying to add a new comment
      $(".btn.save").data("article", commentData);
      // populate the html
      renderCommentsList(commentData);
    });
  }

  function handleCommentSave() {
   
    var commentData;
    var newComment = $(".bootbox-body textarea")
      .val()
      .trim();

      console.log("New Comment:",newComment)
    // If new comment data, format
    // and post it to comments route with commentData
    if (newComment) {
      commentData = { _headlineId: $(this).data("article")._id, commentText: newComment };
      $.post("/api/comments", commentData).then(function() {
        // When complete, close the bootbox
        bootbox.hideAll();
      });
    }
  }

  function handleCommentDelete() {
    //Function to delete comments
    var commentDelete = $(this).data("_id");
    // Send DELETE request to "/api/comments/" with the id
    $.ajax({
      url: "/api/comments/" + commentToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(function() {
        articleContainer.empty();
        initPage();
      });
  }
});
