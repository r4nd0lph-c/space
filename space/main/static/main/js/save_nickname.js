// --------------------
// REMEMBER NICK | LOGIC
// --------------------

function get_nick_cookies(name) {
    const value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts[1].split(";")[0];
    }
    return "";
}

function set_nick_cookies(name, nickname) {
    document.cookie = name + "=" + nickname + ";path = /";
}

var post_comm_btn = document.getElementById("post_comm");
var nickname_input = document.getElementById("id_nickname");
var nickname = get_nick_cookies("nickname");

post_comm_btn.onclick = function () {
    set_nick_cookies("nickname", nickname_input.value);
}

if (nickname !== "") nickname_input.value = nickname;