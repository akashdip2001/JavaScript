## Take 4 Questions from `.json` file.

The part of the code that ensures only 4 questions are displayed is in the `loadQuestions` function:

### Relevant Code:
```javascript
shuffledQuestions = data.sort(() => Math.random() - 0.5).slice(0, 4);
```

### Explanation:
1. **`data.sort(() => Math.random() - 0.5)`**:
   - This shuffles the array of questions randomly.
   - The `Math.random()` generates a random number between 0 and 1, and subtracting 0.5 ensures roughly equal probability for positive or negative results, shuffling the array.

2. **`.slice(0, 4)`**:
   - This takes the first 4 elements from the shuffled array of questions.
   - The `slice` method ensures only a subset of the array (in this case, the first 4 questions) is used for the quiz.

### Result:
The `shuffledQuestions` array will contain exactly 4 questions, no matter how many questions are available in the original `data`. The quiz will then iterate over these 4 questions in sequence.