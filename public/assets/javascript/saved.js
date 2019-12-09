$ (document).ready(function(){

    var articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleComments);
    $(document).on("click", ".btn.save", handleCommentSave);
    $(document).on("click", ".btn.comment-delete", handleCommentDelete);

    initPage();

    function initPage() {

        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){

            if (data && data.length) {
                renderArticles(data)
            } else {

                renderEmpty();
            }
        })
    }

    function renderArticles(articles) {

        var articlePanels = [];

        for (var i=0; i<articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        articleContainer.append(articlePanels);
    }
    function createPanel(article) {

        var panel = 
        $(["<div class='panel panel-default'>",
    "<div class='panel-heading'>",
    "<h3>",
    article.headline,
    "<a class='btn btn-success save'>",
    "Save Article",
    "</a>",
    "</h3>",
    "</div>",
    "<div class='panel-body'>",
    article.summary,
    "</div>",
    "</div>",
].join(""));

panel.data("_id", article._id);

return panel;
    };
    function renderEmpty() {

        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
    "<h4>You don't have any saved articles.</h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3>Want to see some news?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a href='/'>Browse News</a></h4>",
    "</div>",
    "</div>"
        ].join(""));

        articleContainer.append(emptyAlert);
    };
    function renderCommentsList(data) {

        var commentsToRender = [];
        var currentComment; 
        if(!data.comments.length) {
            currentComment = [
                "<li class='list-group-item'>",
                "No comments here yet.",
                "</li>"
            ].join("");
            commentsToRender.push(currentComment);

        }else {

            for (var i=0; i<data.comments.length; i++) {

                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.comments[i].commentText,
                    "<button class='btn btn-danger note-delete'>X</button>",
                    "</li>"
                ].join(""));

                currentComment.children("button").data("_id", data.comments[i]._id);

                commentsToRender.push(currentComment);
            }
        }
    }

    function handleCommentSave() {

        var commentData;
        var newComment = $(".bootbox-body textarea").val().trim();

        if (newComment) {
            commentData = {
                _id: $(this).data("article")._id,
                commentText: newComment
            }
            $.post("api/comments", commentData).then(function(){

                bootbox.hideAll();
            });
        }
    }
    function handleCommentDelete() {

        var commentToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/comments" + commentToDelete,
            method: "DELETE"
        }).then(function() {

            bootbox.hideAll();
        })

        
        }
    
    function handleArticleDelete() {

        var articleToDelete = $(this).arents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/a[o/headlines" + articleToDelete._id
        }).then(function(data) {

            if (data.ok){
                initPage();
            }
        })
    }
    function handleArticleComments() {

        var currentArticle = $(this).parents(".panel").data();
        $.get("api/comments" + currentArticle._id).then(function(data) {

            var modalText = [
                "<div class='container-fluid text-center'>",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group comment-container'>",
                "</ul>",
                "<textarea placeholder='New Comment' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Comment</button>",
                "</div>"

            ].join("");

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var commentData = {
                _id: currentArticle._id,
                comments: data || []
            };
        $(".btn.save").data("article", commentData);

        renderCommentsList(commentData);
        })
    }
})