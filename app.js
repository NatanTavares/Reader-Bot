const puppeteer = require('puppeteer')

async function start(url, getContent) {
  async function loadMore(page, selector) {
    const moreButton = await page.$(selector);
    if (moreButton) {
      console.log('> Getting comments...');
      await moreButton.click();
      await page.waitFor(selector, {timeout: 4000}).catch(()=> console.log('>[timeout] Complete!'));
      await loadMore(page, selector);
    }
  }
 
  async function getComments(page, selector) {
    const comments = await page.$$eval(selector, links => links.map(link => link.innerText));
    return comments;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await loadMore(page, '.dCJp8');
  const comments = await getComments(page, getContent);
  const counted = count(comments);
  const sorted = sort(counted);
  sorted.forEach(user => console.log(user));
  await browser.close();
}

function count(users) {
  const count = {}
  users.forEach(user => count[user] = (count[user] || 0) + 1);
  return count;
}

function sort(counted) {
  const entries = Object.entries(counted);
  const sorted = entries.sort((a,b) => b[1] - a[1]);
  return sorted;
}

start('https://www.instagram.com/p/CChMVvQgYKK/', '.C4VMK span a');
