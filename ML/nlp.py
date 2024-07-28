import nltk
import spacy
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from nltk.corpus import stopwords
from collections import Counter

# Download NLTK stopwords
nltk.download('stopwords')
nltk.download('punkt')

# Load Spacy model
nlp = spacy.load('en_core_web_sm')

def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Remove whitespace
    text = text.strip()
    # Tokenize the text
    tokens = nltk.word_tokenize(text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    # Join tokens back into string
    return ' '.join(tokens)

def extract_keywords(text, method='tfidf', top_n=10):
    """
    Extract keywords from text using TF-IDF or CountVectorizer method.
    
    :param text: List of strings (resumes)
    :param method: 'tfidf' or 'count'
    :param top_n: Number of top keywords to extract
    :return: List of keywords
    """
    if method == 'tfidf':
        vectorizer = TfidfVectorizer(max_features=top_n)
    else:
        vectorizer = CountVectorizer(max_features=top_n)
    
    X = vectorizer.fit_transform(text)
    feature_names = vectorizer.get_feature_names_out()
    scores = X.toarray().sum(axis=0)
    
    keywords = {feature_names[i]: scores[i] for i in range(len(feature_names))}
    sorted_keywords = sorted(keywords.items(), key=lambda x: x[1], reverse=True)
    
    return [keyword[0] for keyword in sorted_keywords]

def extract_nouns(text):
    """
    Extract nouns from the text using spaCy.
    
    :param text: String
    :return: List of nouns
    """
    doc = nlp(text)
    nouns = [token.text for token in doc if token.pos_ == 'NOUN']
    return nouns

# Example usage
if __name__ == "__main__":
    resumes = [
        """
        John Doe
        Senior Software Engineer
        Experience in Python, Java, and C++
        Developed multiple web applications using Django and Flask
        Expertise in Machine Learning and Data Science
        """,
        """
        Jane Smith
        Data Scientist
        Skilled in Python, R, and SQL
        Experience with TensorFlow and PyTorch
        Worked on predictive modeling and data visualization projects
        """
    ]

    # Preprocess resumes
    preprocessed_resumes = [preprocess_text(resume) for resume in resumes]

    # Extract keywords using TF-IDF
    keywords_tfidf = extract_keywords(preprocessed_resumes, method='tfidf', top_n=10)
    print("TF-IDF Keywords:", keywords_tfidf)

    # Extract keywords using CountVectorizer
    keywords_count = extract_keywords(preprocessed_resumes, method='count', top_n=10)
    print("CountVectorizer Keywords:", keywords_count)

    # Extract nouns using spaCy
    nouns = [extract_nouns(resume) for resume in resumes]
    print("Nouns:", nouns)
