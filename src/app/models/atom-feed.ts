import {AtomEntry} from './atom-entry';
import {TopWord} from './top-word';
import {common50} from '../helpers/common50';

export class AtomFeed {
  title: string;
  subtitle: string;
  logo: string;
  author: { uri: string, name: string, email: string };
  entries: AtomEntry[] = [];
  error: string;
  common50 = common50;
  private topWords: TopWord[] = [];

  constructor(xml: string) {
    this.parseXML(xml);
  }

  getTopWords(count = 10) {
    return this.topWords.slice(0, count);
  }

  private parseTopWords(html: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const words = tmp.textContent.match(/\b(\w+)\b/g);
    const wordsMap = {};
    words.forEach(word => {
      if (this.common50[word]) {
        return;
      }
      if (wordsMap[word]) {
        wordsMap[word]['count']++;
      } else {
        wordsMap[word] = {word: word, count: 1};
      }
    });
    this.topWords = Object.values<TopWord>(wordsMap)
      .sort((a: TopWord, b: TopWord) => a.count > b.count ? -1 : (a.count < b.count ? 1 : a.word.localeCompare(b.word)));
  }

  private getDOM(xml: string) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(xml, 'text/xml');
    const error = dom.getElementsByTagName('parsererror').item(0);
    if (error) {
      this.error = error.textContent;
      return null;
    }
    return dom;
  }

  private parseXML(xml) {
    const dom = this.getDOM(xml);
    if (!dom) {
      return;
    }
    this.parseTopWords(dom.getElementsByTagName('feed').item(0).textContent);
    this.title = this.elementValue(dom, 'title');
    this.subtitle = this.elementValue(dom, 'subtitle');
    this.logo = this.elementValue(dom, 'logo');
    const author = dom.getElementsByTagName('author').item(0);

    this.author = {
      uri: this.elementValue(author, 'uri'),
      name: this.elementValue(author, 'name'),
      email: this.elementValue(author, 'email'),
    };

    const entries = dom.getElementsByTagName('entry');
    Array.from(entries).forEach(entry => {
      const entryAuthor = entry.getElementsByTagName('author').item(0);
      const e = {
        id: this.elementValue(entry, 'id'),
        title: this.elementValue(entry, 'title'),
        link: this.elementValue(entry, 'link', 'href'),
        summary: this.elementValue(entry, 'summary'),
        author: {uri: this.elementValue(entryAuthor, 'uri'), name: this.elementValue(entryAuthor, 'name')},
        updated: Date.parse(this.elementValue(entry, 'updated'))
      };
      this.entries.push(e);
    });
  }

  private elementValue(element: Document | Element, name: string, attribute?: string) {
    const item = element.getElementsByTagName(name).item(0);
    return item ? (attribute ? item.getAttribute(attribute) : item.textContent) : null;
  }
}
