$(document).on("click", ".reactCreateBtn", function (e) {
    e.preventDefault();
    const id = $(this).val();

    $(this).addClass("fw-bold text-warning reactDeleteBtn");
    $(this).removeClass("reactCreateBtn");

    $.ajax({
        url: BASEURL("api/forum-reaction/"),
        type: "POST",
        data: {
            comment_id: id
        },
        cache: false,
        headers: {
            "X-CSRFToken": token,
            "Authorization": "Bearer " + access_token
        },
        beforeSend: function () { },
        success: function (item) {
            $("#reactBtn" + id).attr("data-id", item.id);
            console.log("created ", item.id)
        },
        complete: function () { },
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
            } else {
                msgError("Something went wrong!");
            }
        }
    });
});


$(document).on("click", ".reactDeleteBtn", function (e) {
    e.preventDefault();
    let react_id = $(this).attr("data-id");

    $(this).removeClass("fw-bold text-warning reactDeleteBtn");
    $(this).addClass("reactCreateBtn");

    $.ajax({
        url: BASEURL("api/forum-reaction/" + react_id),
        type: "DELETE",
        headers: {
            "X-CSRFToken": token,
            "Authorization": "Bearer " + access_token
        },
        beforeSend: function () { },
        success: function () {
            console.log("Removed ", react_id)
        },
        complete: function () { },
        error: function (response, exception) {
            if (response.status === 0) {
                msgError("Not connect. Verify Network.");
            } else if (response.status == 404) {
                msgError("This reaction might be deleted or not exist.");
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
});