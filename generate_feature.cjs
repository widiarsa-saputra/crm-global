const fs = require('fs');
const path = require('path');

function copyAndReplace(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(file => {
            copyAndReplace(path.join(src, file), path.join(dest, file.replace(/TryoutAttempt/g, 'CourseTryout').replace(/QuestionBank/g, 'QuestionOption').replace(/TryoutSubtestResult/g, 'TryoutAttemptAnswer')));
        });
    } else {
        let content = fs.readFileSync(src, 'utf8');
        
        if (dest.includes('course-tryouts')) {
            content = content.replace(/tryout-attempts/g, 'course-tryouts');
            content = content.replace(/tryoutAttempt/g, 'courseTryout');
            content = content.replace(/TryoutAttempt/g, 'CourseTryout');
            content = content.replace(/tryout_attempts/g, 'course_tryouts');
        } else if (dest.includes('question-options')) {
            content = content.replace(/question-banks/g, 'question-options');
            content = content.replace(/questionBank/g, 'questionOption');
            content = content.replace(/QuestionBank/g, 'QuestionOption');
            content = content.replace(/question_banks/g, 'question_options');
        } else if (dest.includes('tryout-attempt-answers-new')) {
            content = content.replace(/tryout-attempts/g, 'tryout-attempt-answers');
            content = content.replace(/tryoutAttempt/g, 'tryoutAttemptAnswer');
            content = content.replace(/TryoutAttempt/g, 'TryoutAttemptAnswer');
            content = content.replace(/tryout_attempts/g, 'tryout_attempt_answers');
        } else if (dest.includes('tryout-subtest-results-new')) {
            content = content.replace(/tryout-attempts/g, 'tryout-subtest-results');
            content = content.replace(/tryoutAttempt/g, 'tryoutSubtestResult');
            content = content.replace(/TryoutAttempt/g, 'TryoutSubtestResult');
            content = content.replace(/tryout_attempts/g, 'tryout_subtest_results');
        }
        
        fs.writeFileSync(dest, content);
    }
}

const baseDir = __dirname;
// 3. Tryout Attempt Answers (from tryout-attempts)
copyAndReplace(path.join(baseDir, 'src/features/tryout-attempts'), path.join(baseDir, 'src/features/tryout-attempt-answers-new'));
// 4. Tryout Subtest Results (from tryout-attempts)
copyAndReplace(path.join(baseDir, 'src/features/tryout-attempts'), path.join(baseDir, 'src/features/tryout-subtest-results-new'));

console.log('Generation completed');
