const jsdom = require('jsdom');
const markdown = require('markdown-it')();

const { JSDOM } = jsdom;
const { document } = (new JSDOM(`<div>`)).window;
const div = document.querySelector('div');

const splitMarkdown = (md, sep) => {
  return md.split(sep).reverse();
};

const removeElement = (el) => {
  el.parentNode.removeChild(el);
};

const getTitle = (parent) => {
  const element = parent.querySelector('h1');
  const text = element.textContent;
  removeElement(element);
  return text;
};

const getDate = (parent) => {
  const element = parent.querySelector('h2');
  const text = element.textContent;
  removeElement(element);
  return text;
};

const getTags = (parent) => {
  const element = parent.querySelector('ul');
  const items = element.querySelectorAll('li');
  const tags = [...items].map((tag, i) => {
    return { id: i, txt: tag.textContent };
  });
  removeElement(element);
  return tags;
};

const getLink = (id, title) => {
  return (
    `${title}-${id}`
      .replace(/[.,/#!$%^&*;:'{}=_`~()]/g, '')
      .replace(/\s/g, '-')
      .toLowerCase()
  );
};

const getBody = (el) => {
  const selector = 'p, h2, h3, h4, blockquote, img, table';
  return [...el.querySelectorAll(selector)].reduce((p, c, i) => {
    switch (c.nodeName) {
      case 'TABLE': {
        p.push({ id: i, type: 'table', html: c.innerHTML });
        break;
      }
      case 'IMG': {
        p.push({ id: i, type: 'image', src: c.src, alt: c.alt });
        break;
      }
      case 'P': {
        if (c.firstChild.nodeName !== 'IMG') {
          const name = c.parentNode.nodeName;
          const type = name === 'BLOCKQUOTE' ? 'blockquote' : 'para';
          p.push({ id: i, type, html: c.innerHTML });
        }
        break;
      }
      case 'H2': {
        p.push({ id: i, type: 'h2', txt: c.textContent });
        break;
      }
      case 'H3': {
        p.push({ id: i, type: 'h3', txt: c.textContent });
        break;
      }
      case 'H4': {
        p.push({ id: i, type: 'h4', txt: c.textContent });
        break;
      }
    }
    return p;
  }, []);
};

const buildEntry = (md, id) => {
  const html = markdown.render(md);
  div.innerHTML = html;

  const title = getTitle(div);
  const date = getDate(div);
  const tags = getTags(div);
  const link = getLink(id, title);
  const body = getBody(div);

  const entry = {
    id: ++id,
    title,
    date,
    tags,
    link,
    body
  };

  return entry;

};

const wrangleData = (data) => {
  return new Promise((resolve, reject) => {
    const sep = '\r\n\r\n----\r\n\r\n';
    const md = splitMarkdown(data, sep);
    const entries = md.map(buildEntry).reverse();
    const links = entries.map(entry => entry.link);
    try {
      resolve({ entries, links });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = wrangleData;
