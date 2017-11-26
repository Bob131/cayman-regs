var RegsSortEnum = {
    DEFAULT: 0,
    ADDRESS: 1,
    ALPHA: 3
};

var regs_sort = RegsSortEnum.DEFAULT;

function change_page_to (page) {
    var frame = document.getElementById ("frame");
    var page_number = frame.contentDocument.getElementById ("pageNumber");
    page_number.value = page;
    page_number.dispatchEvent (new Event ("change"));
}

function sort_regs (subset) {
    if (regs_sort === RegsSortEnum.ADDRESS) {
        return subset.sort (function (a, b) {
            var a_addr = parseInt (a["addr"].split (" ")[0], 16);
            var b_addr = parseInt (b["addr"].split (" ")[0], 16);

            if (a_addr < b_addr) {
                return -1;
            } else if (a_addr > b_addr) {
                return 1;
            } else {
                return 0;
            }
        });

    } else if (regs_sort === RegsSortEnum.ALPHA) {
        return subset.sort (function (a, b) {
            if (a["id"] < b["id"]) {
                return -1;
            } else if (a["id"] > b["id"]) {
                return 1;
            } else {
                return 0;
            }
        });

    } else {
        return subset;
    }
}

function display_regs (subset) {
    subset = sort_regs (subset);

    var elem = document.getElementById ("reg-list-insert");

    while (elem.hasChildNodes ()) {
        elem.removeChild (elem.lastChild);
    }

    for (var i = 0; i < subset.length; i++) {
        var reg_addr_link = document.createElement ("a");
        reg_addr_link.appendChild (document.createTextNode (subset[i]["addr"]));

        reg_addr_link.href = `javascript:change_page_to(${subset[i]["page"]})`;

        var reg_addr = document.createElement ("td");
        reg_addr.appendChild (reg_addr_link);

        var reg_id = document.createElement ("td");
        reg_id.appendChild (document.createTextNode (subset[i]["id"]));

        var reg_row = document.createElement ("tr");
        reg_row.appendChild (reg_addr);
        reg_row.appendChild (reg_id);

        elem.appendChild (reg_row);
    }
}

function filter_regs (needle) {
    needle = needle.trim ().toUpperCase ();
    if (needle === "") {
        display_regs (regs);
        return;
    }

    var filtered_regs = [];

    for (var i = 0; i < regs.length; i++) {
        if (regs[i]["id"].includes (needle) ||
            regs[i]["addr"].toUpperCase ().includes (needle))
        {
            filtered_regs.push (regs[i]);
        }
    }

    display_regs (filtered_regs);
}

function list_regs () {
    var filter = document.getElementById ("filter-entry");
    filter_regs (filter.value);
}

function regs_add_listeners () {
    var filter = document.getElementById ("filter-entry");
    filter.addEventListener ("input",
        function () { filter_regs (filter.value); }
    );

    var sort = document.getElementById ("sort-default");
    sort.addEventListener ("click",
        function () {
            regs_sort = RegsSortEnum.DEFAULT;
            list_regs ();
        }
    );

    sort = document.getElementById ("sort-address");
    sort.addEventListener ("click",
        function () {
            regs_sort = RegsSortEnum.ADDRESS;
            list_regs ();
        }
    );

    sort = document.getElementById ("sort-alpha");
    sort.addEventListener ("click",
        function () {
            regs_sort = RegsSortEnum.ALPHA;
            list_regs ();
        }
    );
}
