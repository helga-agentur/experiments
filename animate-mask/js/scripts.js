document.addEventListener('DOMContentLoaded', () => {

    const articles = document.querySelectorAll('article');
    console.log(articles);

    document.addEventListener('click', () => {
      Array.from(articles).forEach((article, iteration) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            article.classList.add('visible');
          });
        }, iteration * 150);
        setTimeout(() => {
          requestAnimationFrame(() => {
            console.log('now');
            article.classList.add('hover');
          });
        }, (iteration + 1) * 300)
      });
    });

});