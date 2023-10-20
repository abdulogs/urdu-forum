function commentCard(item) {
    let btns = "";
    let reaction = "";

    if (item.reaction) {
        reaction = `
        <button class="btn p-0 d-flex align-items-center ms-1 fw-bold text-warning reactDeleteBtn" id="reactBtn${item.id}" value="${item.id}" data-id="${item.reaction}">
            <i class="bx bx-smile font-18 me-2"></i> Helpful
        </button>`;
    } else {
        reaction = `
        <button class="btn p-0 d-flex align-items-center ms-1 reactCreateBtn" id="reactBtn${item.id}" value="${item.id}" data-id="${item.reaction}">
            <i class="bx bx-smile font-18 me-2"></i> Helpful
       </button>`;
    }


    if (item.created_by_id == user_id || is_superuser == true) {
        btns = `<div class="dropdown dropstart ms-auto">
                    <button class="btn btn-sm font-12 p-1 shadow-none bx bx-dots-vertical-rounded" type="button" data-bs-toggle="dropdown"></button>
                    <div class="dropdown-menu shadow rounded-4 border-0">
                        <a class="dropdown-item d-flex align-items-center updateComment" data-id="${item.id}" data-post="${item.post_id}" href="javascript:void(0)">
                            <span class="bx bx-edit me-2 font-14 p-1 bg-light rounded-circle"></span> Edit
                        </a>
                        <a class="dropdown-item d-flex align-items-center deleteComment" data-id="${item.id}" data-post="${item.post_id}" href="javascript:void(0)">
                            <span class="bx bx-trash me-2 font-14 p-1 bg-light rounded-circle"></span> Delete
                        </a>
                    </div>
                </div>`;
    }

    return `
    <div class="d-flex my-2">
        ${avatar(item.created_by, 35)}
        <div class="mb-1">
            <div class="px-3 p-2 bg-white shadow-sm rounded-3 ms-2">
                <h5 class="font-14 m-0 fw-bold">
                    ${fullname(item.created_by)} - ${username(item.created_by)}
                </h5>
                <div class="m-0 fs-6 mt-2 text-break" dir="auto" id="commenttext${item.id}">${item.description}</div>
            </div>
            <div class="mt-1 d-flex align-items-center">
                ${reaction} ${timenow(item.created_at)}
            </div>
        </div>
        ${btns}
    </div>`;
}


function loadComments(post_id, ordering = false) {
    let template = "";
    let page = ($("#loadCommentsBtn").val() == "") ? 1 : $("#loadCommentsBtn").val();
    let sort = $("#comments_ordering").val();

    $.ajax({
        url: BASEURL("api/forum-comment/"),
        method: "GET",
        data: {
            page: page,
            records: 10,
            page: page,
            ordering: sort,
            post_id: post_id
        },
        cache: false,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        beforeSend: function () {
            if (ordering) {
                $("#comments").html(spinner());
            } else {
                $("#comments").append(spinner());
            }
        },
        success: function (data) {
            if (data.count == 0) {
                $("#comments").html(is_empty("0 answers!"));
            }

            if (data.count != 0) {
                data.results.forEach(item => {
                    template += `<div id="comment${item.id}" class="px-3 mb-3">${commentCard(item)}</div>`;
                });

                if (ordering) {
                    $("#comments").html(template);
                } else {
                    $("#comments").append(template);
                }
            }

            if (data.count > 10) {
                $("#loadCommentsBtn").show();
            } else {
                $("#loadCommentsBtn").hide();
            }

            if (data.next == null) {
                $("#loadCommentsBtn").hide();
            } else {
                $("#loadCommentsBtn").prop("disabled", false);
            }

            $("#loadCommentsBtn").attr("value", data.next);

        },
        complete: function () {
            $("#spinner").remove();
        },
        error: function (response, exception) {
            const data = response.responseJSON
            if (response.status === 0) {
                msgError("Not connect. Verify Network.");
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

$(document).on("click", ".loadComments", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    $("#post_id").val(id);
    $("#blog_details").html("");
    $("#comments").html("");
    loadComments(id);
});

$(document).on("click", "#loadCommentsBtn", function (e) {
    e.preventDefault();
    const id = $("#post_id").val();
    $("#loadCommentsBtn").text("Load more...")
    loadComments(id);
});

$(document).on("change", "#comments_ordering", function (e) {
    e.preventDefault();
    const id = $("#post_id").val();
    loadComments(id, true);
});