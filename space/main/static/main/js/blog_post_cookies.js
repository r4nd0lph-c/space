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
