$(document).on("submit", "#search", function (e) {
    e.preventDefault();
    loadData();
});


$(document).on("change", "#ordering", function (e) {
    e.preventDefault();
    $("#ordering").val($(this).val());
    loadData();
});


$(document).on("change", "#limit", function (e) {
    e.preventDefault();
    $("#limit").val($(this).val());
    loadData();
});


$(document).on("change", "#availability", function (e) {
    e.preventDefault();
    $("#availability").val($(this).val());
    loadData();
});



$(document).on("click", "#previousBtn", function () {
    loadData($(this).val());;
});

$(document).on("click", "#nextBtn", function () {
    loadData($(this).val());;
});