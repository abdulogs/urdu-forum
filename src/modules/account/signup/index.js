$(document).on("submit", "#signup", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const first_name = $("#firstname").val();
    const last_name = $("#lastname").val();
    const username = $("#username").val();
    const email = $("#email").val();
    const password1 = $("#password1").val();
    const password2 = $("#password2").val();

    if (first_name == "") {
        msgError("Firstname is required");
    } else if (last_name == "") {
        msgError("Lastname is required");
    } else if (username == "") {
        msgError("Username is required");
    } else if (email == "") {
        msgError("Email is required");
    } else if (password1 == "") {
        msgError("Create password is required");
    } else if (password2 == "") {
        msgError("Confirm password is required");
    } else {

        formdata.append("first_name", first_name);
        formdata.append("last_name", last_name);
        formdata.append("username", username);
        formdata.append("email", email);
        formdata.append("password", password1);
        formdata.append("password2", password2);
        formdata.append("is_superuser", false);
        formdata.append("is_staff", true);
        formdata.append("is_active", true);

        $.ajax({
            url: BASEURL("api/register/"),
            type: "POST",
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            headers: { "X-CSRFToken": token },
            beforeSend: function () {
                $("#btnsubmit").attr("disabled", true).text("Loading...");
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Account created successfully");
                    redirect("/login/");
                }
            },
            complete: function () {
                $("#btnsubmit").attr("disabled", false).text("Create account");
            },
            error: function (response, exception) {
                const data = response.responseJSON;
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
                } else if (data["first_name"]) {
                    msgError(data["first_name"][0]);
                } else if (data["last_name"]) {
                    msgError(data["last_name"][0]);
                } else if (data["username"]) {
                    msgError(data["username"][0]);
                } else if (data["email"]) {
                    msgError(data["email"][0]);
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