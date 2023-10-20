function card(item) {
    return `
    <td class="align-middle px-3 cursor-pointer detailBtn" data-id="${item.id}">${createdby(item)}</td>
    <td class="align-middle">${item.email}</td>
    <td class="align-middle">${is_active(item.is_active)}</td>
    <td class="align-middle">${is_role(item)}</td>
    <td class="align-middle">${timenow(item.created_at)}</td>
    <td class="align-middle px-3">
        <a class="btn btn-sm font-16 p-0 bx bx-pencil text-info updateBtn" data-id="${item.id}" href="javascript:void(0)"></a>
        <a class="btn btn-sm font-16 p-0 bx bx-lock text-success changePasswordBtn" data-id="${item.id}" href="javascript:void(0)"></a>
        <a class="btn btn-sm font-16 p-0 bx bx-trash text-danger deleteBtn" data-id="${item.id}" href="javascript:void(0)"></a>
    </td>`;
}


function loadData(page = 1) {
    let limit = parseInt($("#limit").val());
    let search = $("#searchText").val();
    let ordering = $("#ordering").val();
    let availability = $("#availability").val();
    let role = $("#role").val();
    let template = "";

    $.ajax({
        url: BASEURL("api/user"),
        method: "GET",
        data: {
            page: page,
            records: limit,
            search: search,
            ordering: ordering,
            is_active: availability,
            [role]: true
        },
        cache: false,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        success: function (data) {
            if (data.count == 0) {
                $('#listing').html(`<tr id="emptyrow"><td colspan="6" class="border-0">${is_empty("0 Members found!")}</td><tr>`);
            }
            if (data.count != 0) {
                data.results.forEach(item => {
                    template += `<tr id="row${item.id}">${card(item)}</tr>`;
                });
                $('#listing').html(template);
            }
            NextPreviousBtns(data, page, limit);
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
        }
    });
}
loadData();