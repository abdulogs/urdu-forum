$(document).on("click", ".updateComment", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const text = $("#commenttext" + id).html();
    $(".commentForm").attr("id", "commentUpdate");
    $("#comment_id").val(id);
    $("#comment_text").val(text);
});


$(document).on("submit", "#commentUpdate", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const id = $("#comment_id").val();
    const description = $("#comment_text").val();

    if (!description == "") {
        formdata.append("description", description);
        $.ajax({
            url: BASEURL("api/forum-comment/" + id + "/"),
            type: "PATCH",
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
                "X-CSRFToken": token,
                "Authorization": "Bearer " + access_token
            },
            beforeSend: function () {
                $("#commentsubmit").attr("disabled", true);
            },
            success: function (item) {
                if (item) {
                    $("#comment" + id).html(commentCard(item));
                }
                $("#comment_counter").text(0);
            },
            complete: function () {
                $("#commentsubmit").attr("disabled", false);
                $("#updatePanel").html("");
                $("#comment_text").html("");
                $(".commentForm").attr("id", "commentCreate");
                $("#commentCreate").trigger("reset")
            },
            error: function (response, exception) {
                const data = response.responseJSON
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
                } else if (data["description"]) {
                    msgError(data["description"][0]);
                } else {
                    msgError("Something went wrong!");
                }
            }
        });
    }
});