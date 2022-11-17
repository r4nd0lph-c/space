// --------------------
// ADD TO FAVOURITE | LOGIC
// --------------------

// favourites user's post-slug
var user_favs = (get_cookie("fav_posts"));
// posts 'favourite' <span> objects
var fav_marks = document.getElementsByClassName("fav_mark");

// used for getting array of favourites user's post-slug from cookies
function get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        let res = JSON.parse(parts.pop().split(';').shift().replaceAll(/\\054/g, ',').slice(1, -1).replaceAll("'", '"'));
        if (res === undefined) res = [];
        return res;
    }
    return [];
}

// help function for set_cookie() & remove_cookie()
function change_cookie(name) {
    if (user_favs.length > 0) {
        let new_cookie = "[";
        for (let j = 0; j < user_favs.length; j++) {
            let line = `'${user_favs[j]}',`;
            new_cookie += line;
        }
        new_cookie = `"${new_cookie.slice(0, -1) + ']'}"`;
        document.cookie = name + "=" + new_cookie + ";path = /";
    } else document.cookie = name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path = /";
}

// used for setting array of favourites user's post-slug to cookies
function set_cookie(name, value) {
    user_favs.push(value);
    change_cookie(name);
}

// used for removing item from array of favourites user's post-slug in cookies
function remove_cookie(name, value) {
    const index = user_favs.indexOf(value);
    if (index > -1) { // only splice array when item is found
        user_favs.splice(index, 1);
    }
    change_cookie(name);
}

// redrawing 'favourite' <span> object's text
function redraw(element) {
    let post_slug = element.classList[0];
    if (user_favs.includes(post_slug)) {
        element.innerHTML = `<i class="bi bi-bookmark" style="color: var(--primary)"></i> remove from favourite`;
    } else {
        element.innerHTML = `<i class="bi bi-bookmark"></i> add to favourite`;
    }
}

// 'favourite' <span> objects click detecting
for (let i = 0; i < fav_marks.length; i++) {
    fav_marks[i].onclick = function () {
        let post_slug = fav_marks[i].classList[0];
        // remove from cookies
        if (user_favs.includes(post_slug)) {
            remove_cookie("fav_posts", post_slug);
        }
        // add to cookies
        else {
            set_cookie("fav_posts", post_slug);
        }
        redraw(fav_marks[i]);
        console.log("COOKIES:", user_favs);
    };
}

// redrawing when first loading ends
for (let i = 0; i < fav_marks.length; i++) {
    redraw(fav_marks[i]);
}


// --------------------
// RATING UP&DOWN | LOGIC
// --------------------


function get_rating_cookies(name) {
    const value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        parts = parts[1].split(";")[0];
        return parts.split(".");
    }
    return [];
}

function change_rating_cookies(name, cookies_array) {
    if (cookies_array.length > 0) {
        let body = "";
        for (let i = 0; i < cookies_array.length; i++) {
            body += cookies_array[i] + ".";
        }
        document.cookie = name + "=" + body.slice(0, -1) + ";path = /";
    } else document.cookie = name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path = /";
}

function add_rating_cookies(name, value) {
    let cookies = get_rating_cookies(name);
    cookies.push(value);
    change_rating_cookies(name, cookies);
}

function remove_rating_cookies(name, value) {
    let cookies = get_rating_cookies(name);
    const index = cookies.indexOf(value);
    if (index > -1) { // only splice array when item is found
        cookies.splice(index, 1);
    }
    change_rating_cookies(name, cookies);
}

function redraw_rating_chevron(name, element) {
    let slug = element.classList[0];
    let cookies = get_rating_cookies(name);
    if (cookies.includes(slug)) {
        element.style.color = "var(--primary)";
    } else {
        element.style.color = "var(--secondary)";
    }
}

function add_rating_db(slug) {
    $.ajax({
        url: "add_rating/",
        type: "POST",
        data: {"slug": slug},
        success: function (data) {
            console.log(data);
        }
    });
}

function remove_rating_db(slug) {
    $.ajax({
        url: "remove_rating/",
        type: "POST",
        data: {"slug": slug},
        success: function (data) {
            console.log(data);
        }
    });
}

function add_rating_frontend(slug) {
    for (let i = 0; i < rating_numbers.length; i++)
        if (rating_numbers[i].classList[0] === slug) {
            rating_numbers[i].textContent = String(Number(rating_numbers[i].textContent) + 1);
            break;
        }
}

function remove_rating_frontend(slug) {
    for (let i = 0; i < rating_numbers.length; i++)
        if (rating_numbers[i].classList[0] === slug) {
            rating_numbers[i].textContent = String(Number(rating_numbers[i].textContent) - 1);
            break;
        }
}

var rating_up_buttons = document.getElementsByClassName("rating-up");
var rating_down_buttons = document.getElementsByClassName("rating-down");
var rating_numbers = document.getElementsByClassName("rating");

// handlers for clicking the "rating up" buttons
for (let i = 0; i < rating_up_buttons.length; i++) {
    rating_up_buttons[i].onclick = function () {
        let slug = rating_up_buttons[i].classList[0];
        if (get_rating_cookies("rating_up").includes(slug)) {
            remove_rating_cookies("rating_up", slug);
            remove_rating_db(slug);
            remove_rating_frontend(slug);
        } else {
            if (!get_rating_cookies("rating_down").includes(slug)) {
                add_rating_cookies("rating_up", slug);
                add_rating_db(slug);
                add_rating_frontend(slug);
            }
        }
        redraw_rating_chevron("rating_up", rating_up_buttons[i]);
    };
}

// handlers for clicking the "rating down" buttons
for (let i = 0; i < rating_down_buttons.length; i++) {
    rating_down_buttons[i].onclick = function () {
        let slug = rating_down_buttons[i].classList[0];
        if (get_rating_cookies("rating_down").includes(slug)) {
            remove_rating_cookies("rating_down", slug);
            add_rating_db(slug);
            add_rating_frontend(slug);
        } else {
            if (!get_rating_cookies("rating_up").includes(slug)) {
                add_rating_cookies("rating_down", slug);
                remove_rating_db(slug);
                remove_rating_frontend(slug);
            }
        }
        redraw_rating_chevron("rating_down", rating_down_buttons[i]);
    };
}

// redraw all chevrons with first load
for (let i = 0; i < rating_up_buttons.length; i++)
    redraw_rating_chevron("rating_up", rating_up_buttons[i]);
for (let i = 0; i < rating_down_buttons.length; i++)
    redraw_rating_chevron("rating_down", rating_down_buttons[i]);

console.log(rating_up_buttons);
console.log(rating_down_buttons);
console.log("COOKIES:", document.cookie);
console.log(get_rating_cookies("rating_up"));
console.log(get_rating_cookies("rating_down"));