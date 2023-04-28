const rssapi = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";
fetch(rssapi)
    .then(response => response.text())
    .then(xmlStr => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlStr, "text/xml");
      console.log(xml);
      const news = [];
      const items = xml.querySelectorAll("item");
      items.forEach(item => {
        const title = item.querySelector("title").textContent;
        const description = item.querySelector("description").textContent;
        const link = item.querySelector("link").textContent;
        const pubDate = new Date(item.querySelector("pubDate").textContent);
        news.push({ title, description, link, pubDate });
      });
      displayNews(news);
    })
    .catch(error => console.error(error));
function displayNews(news){
  const container = document.getElementById("news-container");
  container.innerHTML = "";
  news.forEach(item => {
    const article = document.createElement("div");
    article.innerHTML = `
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <p><a href="${item.link}">${item.link}</a></p>
      <p>${item.pubDate.toDateString()}</p>
    `;
    container.appendChild(article);
  });
};
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input",search);
function search(){
  

}