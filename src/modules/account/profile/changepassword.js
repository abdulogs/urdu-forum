$(document).on("submit", "#changepassword", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const password = $("#password").val();
    const password2 = $("#password2").val();

    if (password == "") {
        msgError("New password is required");
    } else if (password2 == "") {
        msgError("Confirm password is required");
    } else if (password2 !== password) {
        msgError("Passwords not matched");
    } else {
        formdata.append("password", password);
        formdata.append("password2", password2);
        formdata.append("userid", user_id);

        $.ajax({
            url: BASEURL("api/change-password/"),
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
                $("#btnsubmit").attr("disabled", true).text("Loading...");
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Password changed successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit").attr("disabled", false).text("Change");
            },
            error: function (response, exception) {
                const data = response.responseJSON
                console.log(data)
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
                } else if (data["password"]) {
                    msgError(data["password"][0]);
                } else if (data["password2"]) {
                    msgError(data["password2"][0]);
                } else {
                    msgError("Something went wrong!");
                }
            },
        });
    }
});
