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
      const creator = item.querySelector("creator").textContent;
      news.push({ title, description, link, pubDate, creator});
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
      <p>Creator: ${item.creator}</p>
      <button>Save</button>
    `;
    container.appendChild(article);
    const saveButton = article.querySelector("button");
    saveButton.addEventListener("click", () => {
      addNewstoDB(item.title, item.description, item.link, item.pubDate,item.creator);
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
function addNewstoDB(title, description,link,pubDate,creator) {
  fetch("https://savory-trapezoidal-oatmeal.glitch.me/news", {
    method: "POST",
    body: JSON.stringify({
      title:title,
      description:description,
      link:link,
      pubDate:pubDate,
      creator:creator,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => (response.json(),alert("Succesfully added to the DB!")))
    .catch((error) => console.log("error: ", error.message));
}
let savelistButton = document.getElementById("save-list");
savelistButton.addEventListener("click", () => {
  addListNewstoDB(news);
});
function addListNewstoDB(news) {
  fetch("https://cat-zircon-mojoceratops.glitch.me/newslist", {
    method: "POST",
    body: JSON.stringify({
      news:news,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => (response.json(),alert("News list has been succesfully added to the DB!")))
    .catch((error) => console.log("error: ", error.message));
}
console.log(news);


// extra

/*let versions = ["2.5.0", "2.4.2-5354", "2.4.2-test.675", "2.4.1-integration.1"];
function getProductionVersion(versions){
  let productionVersion = null;
  for (let i = 0; i < versions.length; i++) {
    if (!versions[i].includes('-')) {
      if (productionVersion === null || versions[i].localeCompare(productionVersion) > 0) {
        productionVersion = versions[i];
      }
    }
  }
  return productionVersion;
}
console.log(getProductionVersion(versions));*/