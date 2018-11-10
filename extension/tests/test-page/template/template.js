if (window.location.search.length) {
  let params = new URLSearchParams(window.location.search),
    title = params.get('test') || 'New tab';

  document.getElementById('title').innerText = title;
}