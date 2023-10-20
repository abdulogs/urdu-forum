$(document).on("click", ".loadComments", function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    $.ajax({
        url: BASEURL("api/forum-post/" + id),
        type: "GET",
        headers: { "Authorization": "Bearer " + access_token },
        beforeSend: function () {
            $("#post_data").html(`
            <div class="placeholder-glow py-2">
                <p class="placeholder col-10 rounded-pill"></p>
                <p class="placeholder col-8 rounded-pill"></p>
                <p class="placeholder col-5 rounded-pill"></p>
                <p class="placeholder col-2 rounded-pill"></p>
            </div>`);

            $("#posted_by").html(`
            <div class="placeholder-glow py-2">
                <p class="placeholder col-1 rounded-pill"></p>
                <p class="placeholder col-3 rounded-pill"></p>
            </div>`);
        },
        success: function (item) {
            $("#posted_by").html(
                `<div class="d-flex align-items-center">
                    ${avatar(item.created_by, 40)}
                    <div class="py-2 px-2">
                        <h5 class="font-14 m-0 fw-bold mb-1">
                            ${fullname(item.created_by)} - <span class="fw-normal">${username(item.created_by)}</span>
                        </h5>
                        ${timenow(item.created_at)}
                    </div>
                </div>`
            );

            $("#post_data").html(`
                <h3 class="m-0 font-30 fw-bold" dir="auto">${item.name}</h3>
                <div class="m-0 font-20" dir="auto">${item.description}</div>
                <div class="py-2">
                    <button type="button" class="btn rounded-pill p-0 font-12 d-flex align-items-center px-3 border">
                        <b class="me-2 totalcomments${item.id}">${item.comments}</b> Answers 
                    </button>
                </div>`
            );


            if(item.created_by.id == user_id){
                $("#commentBox").hide()
            } else {
                $("#commentBox").show()
            }


        },
        complete: function () { },
        error: function (response, exception) {
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
            } else {
                msgError("Something went wrong!");
            }
        }
    });
});