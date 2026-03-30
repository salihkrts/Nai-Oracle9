const fs = require('fs');
const path = 'src/App.tsx';
const content = fs.readFileSync(path, 'utf8');

console.log('--- App.tsx Diagnostic ---');
console.log('Total Lines:', content.split('\n').length);

const checkBraces = (str) => {
    let stack = [];
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (c === '{') stack.push(i);
        else if (c === '}') {
            if (stack.length === 0) return { error: 'Extra closing brace', pos: i };
            stack.pop();
        }
    }
    if (stack.length > 0) return { error: 'Unclosed opening brace', count: stack.length };
    return null;
};

const braceResult = checkBraces(content);
if (braceResult) {
  console.log('Brace Violation:', braceResult);
} else {
  console.log('Braces: OK');
}

// Check for "dayScenarios"
const dayMatch = content.match(/dayScenarios/gi);
console.log('dayScenarios matches:', dayMatch ? dayMatch.length : 0);

// Check for "ck }"
const ckMatch = content.match(/ck \}/g);
console.log('ck } matches:', ckMatch ? ckMatch.length : 0);

// Check for "useCallba"
const useCallbackMatch = content.match(/useCallba(?![ck])/g);
console.log('Broken useCallback matches:', useCallbackMatch ? useCallbackMatch.length : 0);

// Check if return starts and ends correctly
const returnStart = content.indexOf('return (');
console.log('Return statement found at:', returnStart);

const lastDiv = content.lastIndexOf('</div>');
console.log('Last </div> tag at index:', lastDiv);

const lastReturnBracket = content.lastIndexOf(');');
console.log('Last return bracket at index:', lastReturnBracket);

// Check for duplicate imports or definitions
const componentMatches = content.match(/export default function App/g);
console.log('App component definitions:', componentMatches ? componentMatches.length : 0);

console.log('--- Diagnostic Complete ---');
