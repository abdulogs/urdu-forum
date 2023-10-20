$(document).on("click", ".updateBtn", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const name = $("#postTitle" + id).text();
    const description = $("#postDesc" + id).text();
    $("#name").val(name);
    $("#description").val(description);
    $("#hiddenFields").html(`<input type="hidden" id="id" value="${id}">`)
    $(".modalForm").attr("id", "update");
    scrollToUp("posting");
});


$(document).on("submit", "#update", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const id = $("#id").val();
    const name = $("#name").val();
    const description = $("#description").val();

    formdata.append("name", name);
    formdata.append("description", description);

    if (name != "" && description != "") {
        $.ajax({
            url: BASEURL("api/forum-post/" + id + "/"),
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
                $("#btnsubmit").prop("disabled", true).html("Loading...");
            },
            success: function (item) {
                if (item) {
                    msgSuccess("Updated successfully!");
                    $("#card" + id).html(card(item));
                }
            },
            complete: function () {
                $("#btnsubmit").prop("disabled", false).html("Publish");
                $(".modalForm").attr("id", "create");
                $("#create").trigger("reset");
            },
            error: function (response, exception) {
                const data = response.responseJSON
                if (response.status === 0) {
                    msgError("Not connect.\n Verify Network.");
                } else if (response.status == 404) {
                    msgError("This post might be deleted or not exist.");
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
                    msgError("Something went wrong!");
                }
            }
        });
    }
});