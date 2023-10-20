$(document).on("submit", "#aboutdetails", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const first_name = $("#firstname").val();
    const last_name = $("#lastname").val();
    const username = $("#username").val();
    const email = $("#email").val();
    const about = $("#about").val();

    if (first_name == "") {
        msgError("Firstname is required");
    } else if (last_name == "") {
        msgError("Lastname is required");
    } else if (username == "") {
        msgError("Username is required");
    } else if (email == "") {
        msgError("Email is required");
    } else {

        formdata.append("first_name", first_name);
        formdata.append("last_name", last_name);
        formdata.append("username", username);
        formdata.append("email", email);
        formdata.append("about", about);

        $.ajax({
            url: BASEURL("api/user/" + user_id + "/"),
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
                $("#btnsubmit2").prop("disabled", true).text("Loading...");
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Profile updated successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit2").prop("disabled", false).text("Update");
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
                } else if (data["first_name"]) {
                    msgError(data["first_name"][0]);
                } else if (data["last_name"]) {
                    msgError(data["last_name"][0]);
                } else if (data["username"]) {
                    msgError(data["username"][0]);
                } else if (data["email"]) {
                    msgError(data["email"][0]);
                } else if (data["about"]) {
                    msgError(data["about"][0]);
                } else {
                    msgError("Something went wrong!");
                }
            },
        });
    }
});

$(document).on("submit", "#changeavatar", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const image = $("#image")[0].files[0];

    formdata.append("avatar", image);

    $.ajax({
        url: BASEURL("api/user/" + user_id + "/"),
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
            $("#btnsubmit1").prop("disabled", true).text("Loading...");
        },
        success: function (response) {
            if (response) {
                msgSuccess("Avatar updated successfully");
                reload();
            }
        },
        complete: function () {
            $("#btnsubmit1").prop("disabled", false).text("Change");
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
            } else if (data["avatar"]) {
                msgError(data["avatar"][0]);
            } else {
                msgError("Something went wrong!");
            }
        },
    });
});

$(document).on("change", "#image", function (e) {
    e.preventDefault();
    $("#uploadbtn").html(`<button type="submit" class="btn btn-dark mx-2 rounded-pill px-4 py-2" id="btnsubmit1">Change</button>`)
})