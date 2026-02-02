function renderArticles(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    articles.forEach((a, i) => {
        const div = document.createElement("div");
        div.className = "article";

        // Build reaction emojis
        const reactionsHTML = ["🔥","❤️","😂","😮","😢","👏","👍","🎓","💡","✨"]
            .map(e => `<span onclick="react(${i}, '${e}')">${e} ${(a.reactions[e]||0)}</span>`).join("");

        // Add Edit/Delete buttons
        const actionsHTML = `
            <button onclick="editArticle(${i})" style="margin-right:10px;">Edit</button>
            <button onclick="deleteArticle(${i})">Delete</button>
        `;

        div.innerHTML = `
            <h3>${a.title}</h3>
            <p>${a.content}</p>
            <small>${new Date(a.date).toDateString()}</small>
            <div class="emoji-bar">${reactionsHTML}</div>
            <div style="margin-top:10px;">${actionsHTML}</div>
        `;
        container.appendChild(div);
    });
}

function deleteArticle(index) {
    if (confirm("Are you sure you want to delete this article?")) {
        articles.splice(index, 1);
        localStorage.setItem("articles", JSON.stringify(articles));
        render();
    }
}

function editArticle(index) {
    const article = articles[index];
    // Show the create form pre-filled
    createForm.style.display = "block";
    title.value = article.title;
    content.value = article.content;

    // Temporarily override addArticle to update instead
    const originalAdd = addArticle;
    addArticle = function() {
        article.title = title.value;
        article.content = content.value;
        localStorage.setItem("articles", JSON.stringify(articles));
        title.value = "";
        content.value = "";
        addArticle = originalAdd; // restore original function
        render();
        createForm.style.display = "none";
    };
}

// Updated sort function to include popularity
function sortArticles(criteria) {
    if (criteria === "date") {
        articles.sort((a,b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === "popularity") {
        articles.sort((a,b) => {
            const aReactions = Object.values(a.reactions).reduce((sum,v)=>sum+v,0);
            const bReactions = Object.values(b.reactions).reduce((sum,v)=>sum+v,0);
            return bReactions - aReactions;
        });
    }
    render();
}
