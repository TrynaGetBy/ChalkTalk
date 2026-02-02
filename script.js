document.addEventListener("DOMContentLoaded", () => {

  // THEME TOGGLE
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light");

  window.toggleTheme = function () {
    document.body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light") ? "light" : "dark"
    );
  };

  let articles = JSON.parse(localStorage.getItem("articles")) || [];

  window.goTo = function (id) {
    document.querySelectorAll("section").forEach(sec =>
      sec.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
  };

  window.toggleForm = function () {
    form.style.display =
      form.style.display === "none" ? "block" : "none";
  };

  window.addArticle = function () {
    if (!title.value || !content.value) return;

    articles.unshift({
      title: title.value,
      image: image.value,
      content: content.value,
      date: new Date(),
      reactions: {}
    });

    localStorage.setItem("articles", JSON.stringify(articles));

    title.value = "";
    image.value = "";
    content.value = "";

    render();
  };

  window.deleteArticle = function (i) {
    if (!confirm("Delete this article permanently?")) return;
    articles.splice(i, 1);
    localStorage.setItem("articles", JSON.stringify(articles));
    render();
  };

  window.react = function (i, e) {
    articles[i].reactions[e] =
      (articles[i].reactions[e] || 0) + 1;
    localStorage.setItem("articles", JSON.stringify(articles));
    render();
  };

  window.sortByDate = function () {
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    render();
  };

  function renderList(container, allowDelete) {
    container.innerHTML = "";
    articles.forEach((a, i) => {
      const div = document.createElement("div");
      div.className = "article";
      div.innerHTML = `
        ${a.image ? `<img src="${a.image}">` : ""}
        <h3>${a.title}</h3>
        <p>${a.content}</p>
        <small>${new Date(a.date).toDateString()}</small>
        <div class="emoji">
          ${["🔥","❤️","😂","😮","😢","👏","👍","🎓","💡","✨"]
            .map(x => `<span onclick="react(${i}, '${x}')">${x} ${(a.reactions[x]||0)}</span>`)
            .join("")}
        </div>
        ${allowDelete ? `<button class="delete" onclick="deleteArticle(${i})">Delete</button>` : ""}
      `;
      container.appendChild(div);
    });
  }

  function render() {
    renderList(homeList, false);
    renderList(articleList, false);
    renderList(myList, true);
  }

  render();
});
