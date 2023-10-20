$(document).on("click", ".deleteBtn", function (e) {
    const id = $(this).data("id");

    confirmbox({
        id: "confirmbox",
        title: "Are you sure?",
        description: "Do you really want to delete this member?"
    }).then(function () {
        $.ajax({
            url: BASEURL("api/user/" + id),
            type: "DELETE",
            headers: {
                "X-CSRFToken": token,
                "Authorization": "Bearer " + access_token
            },
            beforeSend: function () {
                $("#themeloader").show();
            },
            success: function () {
                msgSuccess("Deleted successfully!")
                $("#row" + id).remove();

                if ($("#listing").has("tr").length == 0) {
                    $("#listing").html(`<tr id="emptyrow"><td colspan="6" class="border-0">${is_empty("0 Members found!")}</td><tr>`);
                }

            },
            complete: function () {
                $("#themeloader").hide();
            },
            error: function (response, exception) {
                if (response.status === 0) {
                    msgError("Not connect.\n Verify Network.");
                } else if (response.status == 404) {
                    msgError("Requested page not found. [404]");
                } else if (response.status == 500) {
                    msgError("Internal Server Error [500].");
                } else if (response.status == 401) {
                    msgError("Your session timesout");
                    redirect("/dashboard/logout/");
                } else if (response.status == 403) {
                    msgError("Forbidden user [403]");
                    redirect("/dashboard/logout/");
                } else if (exception === "parsererror") {
                    msgError("Requested JSON parse failed.");
                } else if (exception === "timeout") {
                    msgError("Time out error.");
                } else if (exception === "abort") {
                    msgError("Ajax request aborted.");
                } else {
                    msgError("Something went wrong!");
                }
            },
        });
    })
});