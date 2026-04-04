export const generateWords = (count: number): string[] => {
  const commonWords = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", 
    "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", 
    "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", 
    "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", 
    "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", 
    "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", 
    "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ];
  
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words;
};

export const generateTimeModeWords = (minCount: number, durationSeconds: number): string[] => {
  // Average person types ~40 WPM. Let's generate enough for up to 150 WPM.
  // 150 WPM * (duration / 60) = total words
  const estimatedWords = Math.max(minCount, Math.ceil((150 * durationSeconds) / 60));
  return generateWords(estimatedWords);
};
