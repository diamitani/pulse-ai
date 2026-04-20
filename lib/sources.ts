export interface Source {
  name: string
  url: string
  rssUrl: string
  category: string
}

export const SOURCES: Source[] = [
  // AI Research
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/', rssUrl: 'https://blog.google/technology/ai/feed/', category: 'AI Research' },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/', rssUrl: 'https://openai.com/blog/feed/', category: 'AI Research' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog', rssUrl: 'https://huggingface.co/feed.xml', category: 'AI Research' },
  { name: 'Distill.pub', url: 'https://distill.pub/', rssUrl: 'https://distill.pub/journal/feed.xml', category: 'AI Research' },
  { name: 'arXiv AI', url: 'https://arxiv.org/list/cs.AI/recent', rssUrl: 'https://arxiv.org/list/cs.AI/rss', category: 'AI Research' },
  { name: 'arXiv ML', url: 'https://arxiv.org/list/cs.LG/recent', rssUrl: 'https://arxiv.org/list/cs.LG/rss', category: 'AI Research' },
  { name: 'arXiv NLP', url: 'https://arxiv.org/list/cs.CL/recent', rssUrl: 'https://arxiv.org/list/cs.CL/rss', category: 'AI Research' },
  { name: 'arXiv CV', url: 'https://arxiv.org/list/cs.CV/recent', rssUrl: 'https://arxiv.org/list/cs.CV/rss', category: 'AI Research' },
  // AI News
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/', rssUrl: 'https://www.artificialintelligence-news.com/feed/', category: 'AI News' },
  { name: 'Synced Review', url: 'https://syncedreview.com/', rssUrl: 'https://syncedreview.com/feed/', category: 'AI News' },
  { name: 'AI Weekly', url: 'https://aiweekly.co/', rssUrl: 'https://aiweekly.co/feed.xml', category: 'AI News' },
  { name: 'AlphaSignal', url: 'https://alphasignal.ai/', rssUrl: 'https://alphasignal.ai/feed', category: 'AI News' },
  // General Tech
  { name: 'TechCrunch', url: 'https://techcrunch.com/', rssUrl: 'https://techcrunch.com/feed/', category: 'General Tech' },
  { name: 'The Verge', url: 'https://www.theverge.com/', rssUrl: 'https://www.theverge.com/rss/index.xml', category: 'General Tech' },
  { name: 'Ars Technica', url: 'https://arstechnica.com/', rssUrl: 'https://feeds.arstechnica.com/arstechnica/index', category: 'General Tech' },
  { name: 'Wired', url: 'https://www.wired.com/', rssUrl: 'https://www.wired.com/feed/rss', category: 'General Tech' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/', rssUrl: 'https://venturebeat.com/feed/', category: 'General Tech' },
  { name: 'Dev.to', url: 'https://dev.to/', rssUrl: 'https://dev.to/feed', category: 'General Tech' },
  // AI Education
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/', rssUrl: 'https://towardsdatascience.com/feed', category: 'AI Education' },
  { name: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/', rssUrl: 'https://machinelearningmastery.com/feed/', category: 'AI Education' },
  { name: 'Lex Fridman Podcast', url: 'https://lexfridman.com/podcast/', rssUrl: 'https://lexfridman.com/feed/podcast/', category: 'AI Education' },
  // AI Ethics & Policy
  { name: 'Future of Life Institute', url: 'https://futureoflife.org/', rssUrl: 'https://futureoflife.org/feed/', category: 'AI Ethics' },
  { name: 'EFF', url: 'https://www.eff.org/', rssUrl: 'https://www.eff.org/rss/', category: 'AI Policy' },
  // MLOps & Tools
  { name: 'MLOps Community', url: 'https://mlops.community/', rssUrl: 'https://mlops.community/feed/', category: 'MLOps' },
  // Data Science
  { name: 'KDnuggets', url: 'https://www.kdnuggets.com/', rssUrl: 'https://www.kdnuggets.com/feed', category: 'Data Science' },
  // Products
  { name: 'Product Hunt', url: 'https://www.producthunt.com/', rssUrl: 'https://feeds.producthunt.com/posts/rss', category: 'AI Products' },
]
