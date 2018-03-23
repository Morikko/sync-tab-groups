let initUrl = window.location.href;

if (window.location.search.length) {
    var params = new URLSearchParams(window.location.search),
        url = params.get('url') || 'about:blank',
        title = params.get('test') || 'New tab';

    //history.pushState({}, "For tests!", url);
    document.getElementById('title').innerText = title;
}

/*
document.addEventListener("DOMContentLoaded", () => {
  let a = document.createElement('a')
  a.href = initUrl;
  a.innerText = initUrl;
  let text = document.createElement('span');
  text.innerText = "Original link: "
  document.body.appendChild(text);
  document.body.appendChild(a);
});
*/
