$(document).on("keyup", "#comment_text", () => {
    const count = limiting("#comment_text");
    const limit = $("#cenglishwordslimit").text();

    if (limit < count.english) {
        $("#btnsubmit").attr("disabled", true);
    } else {
        $("#btnsubmit").attr("disabled", false);
    }
    $("#comment_counter").text(count.english);
});


$(document).on("submit", "#commentCreate", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const post_id = $("#post_id").val();
    const description = $("#comment_text").val();
    const comments = $(".totalcomments" + post_id).html();

    if (!description == "") {
        formdata.append("description", description);
        formdata.append("post_id", post_id);
        formdata.append("is_active", 1);

        $.ajax({
            url: BASEURL("api/forum-comment/"),
            type: "POST",
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
                    $("#comments").append(`
                        <div id="comment${item.id}" class="px-3 mb-3">
                            ${commentCard(item)}
                        </div>
                    `);
                    $("#commentCreate").trigger("reset");

                    // Remove empty card
                    if ($("#comments").html() != "") {
                        $("#empty-card").remove();
                    }

                    $("#comment_counter").text(0);

                }
            },
            complete: function () {
                $("#commentsubmit").attr("disabled", false);
                $("#updatePanel").html("");
                $("#comment_text").html("");
                $(".totalcomments" + post_id).html(parseInt(comments) + 1);
                $("#commentCreate").trigger("reset");
                scrollToDown("comments");
            },
            error: function (response, exception) {
                const data = response.responseJSON;
                if (response.status === 0) {
                    msgError("Not connect.\n Verify Network.");
                } else if (response.status == 404) {
                    msgError("Requested page not found. [404]");
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