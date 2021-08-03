let myStorage = window.localStorage;
window.onload = () => {
    let user_form = document.getElementById("user_form");
    user_form.addEventListener("submit", (e) => {
        e.preventDefault();
        let user_name = document.getElementById("user_name").value;
        const api_url = `https://api.github.com/users/${user_name}`;
        get_user_information(api_url, user_name);
        console.log(myStorage.getItem(`${user_name}_avatar_url`));
    })
}

/***** fetching user information from github api and using DOM for showing content and  setting item in local storage *****/
function get_user_information(url, user_name) {
    if (myStorage.getItem(`${user_name}`)) {
        fetch_from_local_storage(user_name);
    } else {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.name === undefined) {
                    document.getElementById("error").innerHTML = "user name is not exist";
                    document.getElementById("user_name").classList.add("border-red");
                    document.getElementById("error").setAttribute("style", "display:block;");

                } else {
                    myStorage.setItem(`${user_name}`, user_name);
                    document.getElementById("user_name").classList.remove("border-red");
                    document.getElementById("error").setAttribute("style", "display:none;");
                    document.getElementById("user_image").src = data.avatar_url;
                    myStorage.setItem(`${user_name}_avatar_url`, data.avatar_url);
                    document.getElementById("user_image").setAttribute("style", "display:block;");
                    document.getElementById("name").innerHTML = "name: " + check_null(data.name);
                    myStorage.setItem(`${user_name}_name`, data.name);
                    document.getElementById("blog").innerHTML = "blog: " + check_null(data.blog);
                    myStorage.setItem(`${user_name}_blog`, data.blog);
                    document.getElementById("location").innerHTML = "location: " + check_null(data.location);
                    myStorage.setItem(`${user_name}_location`, data.location);
                    const bio = data.bio;
                    myStorage.setItem(`${user_name}_bio`, data.bio);
                    if (bio) {
                        const split_bio = bio.split('\r\n');
                        document.getElementById("bio").innerHTML = "bio: " + split_bio.join('</br>');
                    } else {
                        document.getElementById("bio").innerHTML = "bio: -----";
                    }
                    get_favorite_language(data.repos_url, user_name);
                }
            })
    }
}

/***** fetching favorite language from github api and using DOM for showing content and setting item in local storage *****/
const get_favorite_language = (url, user_name) => {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            const repos = data;
            const languages = [];

            for (let i = 0; i < repos.length; i++) {
                if (repos[i].language !== null) {
                    languages.push(repos[i].language)
                }
                if (i == 4)
                    break;
            }
            const favorite = mostFrequent(languages, languages.length);
            document.getElementById("language").innerHTML = "favorite language: " + check_null(favorite);
            myStorage.setItem(`${user_name}_favorite`, favorite);
        })
}

/***** finding most frequent item in array. this function that used for finding favorite language. *****/
function mostFrequent(arr, n) {

    // Sort the array
    arr.sort();

    // find the max frequency using linear
    // traversal
    let max_count = 1, res = arr[0];
    let curr_count = 1;

    for (let i = 1; i < n; i++) {
        if (arr[i] == arr[i - 1])
            curr_count++;
        else {
            if (curr_count > max_count) {
                max_count = curr_count;
                res = arr[i - 1];
            }
            curr_count = 1;
        }
    }

    // If last element is most frequent
    if (curr_count > max_count) {
        max_count = curr_count;
        res = arr[n - 1];
    }
    return res;
}

/***** for handling null item in local storage *****/
function check_null_local_storage(element) {
    if (element == "null" || element == "")
        return "------";
    return element;
}
/***** for handling null item in page *****/
function check_null(element) {

    return element ? element : "------";
}
/***** using DOM and local storage for showing content for user that exist in local storage *****/
function fetch_from_local_storage(user_name) {
    console.log("Yes")
    document.getElementById("user_name").classList.remove("border-red");
    document.getElementById("error").setAttribute("style", "display:none;")
    document.getElementById("user_image").src = check_null_local_storage(myStorage.getItem(`${user_name}_avatar_url`));
    document.getElementById("user_image").setAttribute("style", "display:block;");
    document.getElementById("name").innerHTML = "name: " + check_null_local_storage(myStorage.getItem(`${user_name}_name`));
    document.getElementById("blog").innerHTML = "blog: " + check_null_local_storage(myStorage.getItem(`${user_name}_blog`));
    document.getElementById("location").innerHTML = "location: " + check_null_local_storage(myStorage.getItem(`${user_name}_location`));
    const bio = myStorage.getItem(`${user_name}_bio`);
    if (bio != "null") {
        const split_bio = bio.split('\r\n');
        document.getElementById("bio").innerHTML = "bio: " + split_bio.join('</br>');
    } else {
        document.getElementById("bio").innerHTML = "bio: -----";
    }
    document.getElementById("language").innerHTML = "favorite language: " + check_null_local_storage(myStorage.getItem(`${user_name}_favorite`));
}

