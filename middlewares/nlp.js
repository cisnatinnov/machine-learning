const natural = require('natural'),
classifier = new natural.BayesClassifier(),
metaphone = natural.Metaphone,
Analyzer = natural.SentimentAnalyzer,
stemmer = natural.PorterStemmer,
analyzer = new Analyzer("English", stemmer, "afinn");

const classification = (text) => {
  classifier.addDocument(['happy', 'fun', 'bad ass', 'love', 'good', 'hello'], 'Positive Word');
  classifier.addDocument(['sad', 'bad', 'fuck', 'fuck you', 'hate'], 'Negative Word');

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
  return analyzer.getSentiment(arrText)
}

module.exports = {
  classification,
  phonetic_match,
  sentiment_analysis
}