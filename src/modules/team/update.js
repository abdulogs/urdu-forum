$(document).on("click", ".updateBtn", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    $("#hiddenFields").html(`<input type="hidden" id="id">`)
    $("#modelTitle").html(`<b class="bx bx-edit me-2 font-20 text-success bg-light p-2 rounded-circle"></b><b>Update</b>`);
    $(".modalForm").attr("id", "update");
    $(".password-field").addClass("d-none");
    $("#btnSubmit").attr("disabled", false).html("Update");

    $.ajax({
        url: BASEURL("api/user/" + id),
        type: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        },
        beforeSend: function () {},
        success: function (data) {
            $("#id").val(id);
            $("#firstname").val(data.first_name);
            $("#lastname").val(data.last_name);
            $("#username").val(data.username);
            $("#email").val(data.email);
            setChecked("#is_superuser", data.is_superuser);
            setChecked("#is_staff", data.is_staff);
            setChecked("#is_active", data.is_active);
            modalOpen("createupdateform");
        },
        complete: function () {},
        error: function (response, exception) {
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


$(document).on("submit", "#update", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const id = $("#id").val();
    const first_name = $("#firstname").val();
    const last_name = $("#lastname").val();
    const username = $("#username").val();
    const email = $("#email").val();
    const is_superuser = getChecked("#is_superuser");
    const is_staff = getChecked("#is_staff");
    const is_active = getChecked("#is_active");

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
        formdata.append("is_superuser", is_superuser);
        formdata.append("is_staff", is_staff);
        formdata.append("is_active", is_active);

        $.ajax({
            url: BASEURL("api/user/" + id + "/"),
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
                $("#btnSubmit").attr("disabled", true).html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
            },
            success: function (item) {
                if (item) {
                    msgSuccess("Updated successfully!");

                    $("#row" + id).html(card(item));

                    modalClose("createupdateform");
                }
            },
            complete: function () {
                $("#btnSubmit").attr("disabled", false).html("Update");
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
                } else if (data["is_active"]) {
                    msgError(data["is_active"][0]);
                } else {
                    msgError("Something went wrong!");
                }
            }
        });
    }
});


$(document).on("click", ".changePasswordBtn", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    $("#userid").val(id);
    modalOpen("changepasswordform")
});


$(document).on("submit", "#change-password", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const id = $("#userid").val();
    const password = $("#newpassword").val();
    const password2 = $("#confrimpassword").val();

    if (password == "") {
        msgError("New password is required");
    } else if (password2 == "") {
        msgError("Confirm password is required");
    } else if (password2 !== password) {
        msgError("Passwords not matched");
    } else {
        formdata.append("password", password);
        formdata.append("password2", password2);

        $.ajax({
            url: BASEURL("api/change-password/"),
            type: "POST",
            data: {
                password: password,
                password2: password2,
                userid: id,
            },
            headers: {
                "X-CSRFToken": token,
                "Authorization": "Bearer " + access_token
            },

            beforeSend: function () {
                $("#btnsubmit1").html(`<div class="spinner-border  spinner-border-sm text-light"></div>`);
                $("#btnsubmit1").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Password changed successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit1").html(`Change`);
                $("#btnsubmit1").attr("disabled", false);
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
    }
});
