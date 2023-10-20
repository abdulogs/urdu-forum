$(document).on("click", ".deleteBtn", function (e) {
    const id = $(this).data("id");

    if (confirm("Do you really want to delete this post?")) {
        $.ajax({
            url: BASEURL("api/forum-post/" + id),
            type: "DELETE",
            headers: {
                "X-CSRFToken": token,
                "Authorization": "Bearer " + access_token
            },
            beforeSend: function () {},
            success: function () {
                msgSuccess("Deleted successfully")
                $("#card" + id).remove();
                if ($("#listing").has("div").length == 0) {
                    $("#listing").html(is_empty("No posts found"));
                }
            },
            complete: function () {},
            error: function (response, exception) {
                if (response.status === 0) {
                    msgError("Not connect.\n Verify Network.");
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
    }
});
