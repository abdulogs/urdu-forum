$(document).on("keyup", "#description", () => {
    const count = limiting("#description");
    const limit = $("#penglishwordslimit").text();

    if (limit < count.english) {
        $("#btnsubmit").attr("disabled", true);
    } else {
        $("#btnsubmit").attr("disabled", false);
    }
    $("#post_counter").text(count.english);
});


$(document).on("submit", "#create", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const name = $("#name").val();
    const description = $("#description").val();

    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("is_active", true);

    if (name != "" && description != "") {
        $.ajax({
            url: BASEURL("api/forum-post/"),
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
                $("#btnsubmit").prop("disabled", true).html("Loading...");
            },
            success: function (item) {
                if (item) {
                    msgSuccess("Created successfully");
                    $("#listing").prepend(`<div id="card${item.id}">${card(item)}</div>`);

                    if ($("#listing").html() != "") {
                        $("#empty-card").remove();
                    }
                    $("#post_counter").text(0);
                }
            },
            complete: function () {
                $("#btnsubmit").prop("disabled", false).html("Publish");
                $("#create").trigger("reset");
            },
            error: function (response, exception) {
                const data = response.responseJSON
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
                } else if (data["name"]) {
                    msgError(data["name"][0]);
                } else if (data["description"]) {
                    msgError(data["description"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            }
        });
    }
});
