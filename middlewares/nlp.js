const natural = require('natural'),
classifier = new natural.BayesClassifier(),
metaphone = natural.Metaphone,
Analyzer = natural.SentimentAnalyzer,
stemmer = natural.PorterStemmer,
analyzer = new Analyzer("English", stemmer, "afinn");

let positive = ['happy', 'fun', 'love', 'good', 'hello']
let negative = ['sad', 'bad', 'fuck', 'fuck you', 'hate', 'ass', 'asshole', 'ass hole']
const classification = (text) => {
  classifier.addDocument(positive, 'Positive Word');
  classifier.addDocument(negative, 'Negative Word');

  classifier.train();

  return classifier.classify(text.toLowerCase())
}

const phonetic_match = (wordA, wordB) => {
  if (metaphone.compare(wordA, wordB))
    return "They sound alike!"
  else
    return "Doesn't sound similar"
}

const sentiment_analysis = (text) => {
  let arrText = text.split(' ')
  let sentiment = analyzer.getSentiment(arrText)
  if (sentiment < 0) negative.push(text)
  if (sentiment >= 0) positive.push(text)
  return sentiment
}

module.exports = {
  classification,
  phonetic_match,
  sentiment_analysis
}