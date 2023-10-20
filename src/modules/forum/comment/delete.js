$(document).on("click", ".deleteComment", function (e) {
    const id = $(this).data("id");
    const post_id = $(this).data("post");
    const comments = $(".totalcomments" + post_id).html();

    confirmbox({
        id: "confirmbox",
        title: "Are you sure?",
        description: "Do you really want to delete this answer?"
    }).then(function () {
        $.ajax({
            url: BASEURL("api/forum-comment/" + id),
            type: "DELETE",
            headers: {
                "X-CSRFToken": token,
                "Authorization": "Bearer " + access_token
            },
            beforeSend: function () {},
            success: function () {
                $(".totalcomments" + post_id).html(comments - 1);
                $("#comment" + id).remove();
                if ($("#comments").has("div").length == 0) {
                    $("#comments").html(is_empty("0 answer!"));
                }
            },
            complete: function () {},
            error: function (response, exception) {
                if (response.status === 0) {
                    msgError("Not connect. Verify Network.");
                } else if (response.status == 404) {
                    msgError("This comment might be deleted or not exist.");
                } else if (response.status == 500) {
                    msgError("Internal Server Error [500].");
                } else if (response.status == 401) {
                    msgError("Your session timesout");
                    redirect("/logout/");
                } else if (response.status == 403) {
                    msgError("Forbidden user [403]");
                    redirect("/logout/");
                } else if (exception === "parsererror") {
                    msgError("Requested JSON parse failed.");
                } else if (exception === "timeout") {
                    msgError("Time out error.");
                } else if (exception === "abort") {
                    msgError("Ajax request aborted.");
                } else {
                    msgError("Something went wrong!");
                }
            }
        });
    })
});