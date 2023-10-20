function card(item) {
    let btns = "";

    if (item.created_by_id == user_id || is_superuser == true) {
        btns = ` <div class="dropdown dropstart ms-auto">
                    <button button class="btn btn-sm font-12 p-1 shadow-none bx bx-dots-vertical-rounded" type="button" data-bs-toggle="dropdown"></button>
                    <div class="dropdown-menu shadow rounded-4 border-0">
                        <a class="dropdown-item d-flex align-items-center updateBtn" data-id="${item.id}" href="javascript:void(0)">
                            <span class="bx bx-edit me-2 font-14 p-1 bg-light rounded-circle"></span> Edit
                        </a>
                        <a class="dropdown-item d-flex align-items-center deleteBtn" data-id="${item.id}" href="javascript:void(0)">
                            <span class="bx bx-trash me-2 font-14 p-1 bg-light rounded-circle"></span> Delete
                        </a>
                    </div>
                </div>`;
    }

    return `<div class="card border-0 rounded-4 mb-4 shadow">
                <div class="card-header border-0 bg-transparent py-2 d-flex align-items-center">
                    ${avatar(item.created_by, 40)}
                    <div class="py-2 px-2">
                        <h5 class="font-14 m-0 fw-bold mb-1">
                            ${fullname(item.created_by)} - ${username(item.created_by)}</span>
                        </h5>
                        ${timenow(item.created_at)}
                    </div>
                    ${btns}
                </div>
                <div class="card-body py-2">
                    <h3 class="m-0 font-30 fw-bold" dir="auto" id="postTitle${item.id}">${item.name}</h3>
                    <div class="m-0 font-20" dir="auto" id="postDesc${item.id}">${item.description}</div>
                    <div class="mt-3 d-flex align-items-center">
                        <a class="m-0 link-dark text-decoration-none loadComments" href="javascript:void(0)" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#openComments"><b class="totalcomments${item.id}">${item.comments}</b> Answers</a> 
                    </div>
                </div>
                <div class="card-footer bg-transparent d-flex align-items-center py-2">
                    <button type="button" class="btn btn-light w-100 rounded-pill d-flex align-items-center justify-content-center loadComments" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#openComments">
                        <span class="bx bx-comment font-18 me-1"></span>
                        <b class="font-14">Give answer</b>
                    </button>
                </div>
            </div>
        </div>`;
}

function loadPosts(ordering = false) {
    let limit = 10;
    let sort = $("#posts_ordering").val()
    let page = (ordering) ? 1 : $("#loadPostsBtn").val();
    let created_by = $("#filter_posts").val()
    let search = $("#searchText").val();
    let template = "";
    $.ajax({
        url: BASEURL("api/forum-post"),
        method: "GET",
        data: {
            page: page,
            records: limit,
            ordering: sort,
            created_by_id: created_by,
            search: search
        },
        cache: false,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        beforeSend: function () {
            if (ordering) {
                $("#listing").html(spinner());
            } else {
                $("#listing").append(spinner());
            }
        },
        success: function (data) {
            if (data.count == 0) {
                $("#listing").html(is_empty("No posts found!"));
            }

            if (data.count != 0) {
                data.results.forEach(item => {
                    template += `<div id="card${item.id}">${card(item)}</div>`;
                });
                if (ordering) {
                    $("#listing").html(template);
                } else {
                    $("#listing").append(template);
                }
            }

            if (data.count > limit) {
                $("#loadPostsBtn").show();
            } else {
                $("#loadPostsBtn").hide();
            }

            if (data.next == null) {
                $("#loadPostsBtn").hide();
            } else {
                $("#loadPostsBtn").prop("disabled", false);
            }

            $("#loadPostsBtn").attr("value", data.next);
        },
        complete: function () {
            $("#spinner").remove();
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
        }
    });
}
loadPosts();



$(document).on("change", "#posts_ordering", function (e) {
    e.preventDefault();
    loadPosts(true);
});

$(document).on("change", "#filter_posts", function (e) {
    e.preventDefault();
    loadPosts(true);
});

$(document).on("click", "#loadPostsBtn", function (e) {
    e.preventDefault();
    loadPosts();
});


$(document).on("submit", "#search", function (e) {
    e.preventDefault();
    loadPosts(true);
});
