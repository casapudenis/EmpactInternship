let news = [];
const rssapi = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";
fetch(rssapi)
  .then(response => response.text())
  .then(xmlStr => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, "text/xml");
    const items = xml.querySelectorAll("item");
    console.log(xml);
    items.forEach(item => {
      const title = item.querySelector("title").textContent;
      const description = item.querySelector("description").textContent;
      const link = item.querySelector("link").textContent;
      const pubDate = new Date(item.querySelector("pubDate").textContent);
      news.push({ title, description, link, pubDate });
    });
    news.sort((a, b) => a.title.localeCompare(b.title));
    displayNews(news);
  })
  .catch(error => console.error(error));

function displayNews(news) {
  const container = document.getElementById("news-container");
  container.innerHTML = "";
  news.forEach(item => {
    const article = document.createElement("div");
    article.innerHTML = `
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <p><a href="${item.link}">${item.link}</a></p>
      <p>${item.pubDate.toDateString()}</p>
      <button>Save</button>
    `;
    container.appendChild(article);
    const saveButton = article.querySelector("button");
    saveButton.addEventListener("click", () => {
      addNewstoDB(item.title, item.description, item.link, item.pubDate);
    });
  });
}
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value.toLowerCase();
  const filteredNews = news.filter(item => {
    return item.title.toLowerCase().includes(searchValue) || item.description.toLowerCase().includes(searchValue);
  });
  if (filteredNews.length > 0) {
    displayNews(filteredNews);
  } 
  else {
    const container = document.getElementById("news-container");
    container.innerHTML = "No matching news found.";
  }
});
function addNewstoDB(title, description,link,pubDate) {
  fetch("https://savory-trapezoidal-oatmeal.glitch.me/news", {
    method: "POST",
    body: JSON.stringify({
      title:title,
      description:description,
      link:link,
      pubDate:pubDate,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log("error: ", error.message));
}