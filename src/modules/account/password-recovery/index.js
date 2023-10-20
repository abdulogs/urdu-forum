$(document).on("submit", "#recoverpassword", function (e) {
    e.preventDefault();
    const password = $("#password").val();
    const password1 = $("#password1").val();
    const uid = $("#uid").val();
    const tok = $("#tok").val();

    if (password == "") {
        msgError("Please enter new password...")
        return false;
    } else if (password1 == "") {
        msgError("Please enter confirm password...")
        return false;
    } if (password !== password1) {
        msgError("Password not matched...")
        return false;
    } else {
        $.ajax({
            url: BASEURL(`api/reset-password/${uid}/${tok}/`),
            type: "POST",
            cache: false,
            data: {
                password: password,
                password2: password1,
                tok: tok,
                uid: uid
            },
            headers: {
                "X-CSRFToken": token,
            },
            beforeSend: function () {
                $("#btnsubmit").attr("disabled", true).text("Loading...");
            },
            success: function (data) {
                if (data.message) {
                    msgSuccess(data["message"]);
                    redirect("/login/");
                }
            },
            complete: function () {
                $("#btnsubmit").attr("disabled", false).text("Change");
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
                } else {
                    msgError("Something went wrong!");
                }
            },
        });
    }
});