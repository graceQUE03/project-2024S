CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    auth0_user_id VARCHAR(255) UNIQUE NOT NULL,
    placement_test_taken BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS problems (
    problem_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(3000) NOT NULL,
    code VARCHAR(3000) NOT NULL,
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tests JSONB NOT NULL
);

-- mock problem data for now 

INSERT INTO problems (name, description, code, difficulty, tests)
VALUES('Addition', 'Simple addition of two numbers', 'function(a, b) {
return a + b;
}', 'easy', 
'{
    "test1": {"description": "adding two positive numbers", "input": [2, 3], "output": 5}, 
    "test2": {"description": "adding zero and a positive number", "input": [0, 3], "output": 3},
    "test3": {"description": "adding two negative numbers", "input": [-7, -9], "output": -16}, 
    "test4": {"description": "adding a positive and a negative number", "input": [6, -14], "output": -8},
    "test5": {"description": "adding two decimal number", "input": [4.5, 2.3], "output": 6.8}
  }');

INSERT INTO problems (name, description, code, difficulty, tests)
VALUES('Factorial', 'Recursive function to calculate factorial', 'function fac(n) {
  return n < 2 ? 1 : n * fac(n - 1);
};', 'medium',
  '{
    "test1": {"description": "factorial of 1", "input": [1], "output": 1}, 
    "test2": {"description": "factorial of 2", "input": [2], "output": 2},
    "test3": {"description": "factorial of 3", "input": [3], "output": 6}, 
    "test4": {"description": "factorial of 5", "input": [5], "output": 120},
    "test5": {"description": "factorial of 10", "input": [10], "output": 3628800}
  }');

  INSERT INTO problems (name, description, code, difficulty, tests)
VALUES('Addition', 'Simple addition of two numbers', 'function(a, b + c) {
return a + b + c;
}', 'easy', 
'{
    "test1": {"description": "adding three positive numbers", "input": [2, 3, 5], "output": 10}, 
    "test2": {"description": "adding zero and two positive numbers", "input": [0, 3, 7], "output": 10},
    "test3": {"description": "adding two negative numbers and a positive number", "input": [-7, -9, 2], "output": -14}, 
    "test4": {"description": "adding two positive numbers and a negative number", "input": [6, 14, -2], "output": 18},
    "test5": {"description": "adding three decimal numbers", "input": [4.5, 2.3, 0.1], "output": 6.9}
  }');


INSERT INTO problems (name, description, code, difficulty, tests)
VALUES ('Reverse String', 'Function to reverse a given string without using built-in methods', 
'function foo(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}', 'easy', 
'{
  "test1": {"description": "reverse a single word", "input": ["hello"], "output": "olleh"}, 
  "test2": {"description": "reverse a sentence", "input": ["hello world"], "output": "dlrow olleh"},
  "test3": {"description": "reverse a palindrome", "input": ["madam"], "output": "madam"}, 
  "test4": {"description": "reverse an empty string", "input": [""], "output": ""},
  "test5": {"description": "reverse a string with spaces", "input": [" a b "], "output": " b a "}
}');

INSERT INTO problems (name, description, code, difficulty, tests)
VALUES('Longest Substring Without Repeating Characters', 
'Write a function foo that takes a string as input and returns the length of the longest substring without repeating characters.', 
'function foo(s) {
    let n = s.length;
    let ans = 0;
    let map = new Map();
    for (let j = 0, i = 0; j < n; j++) {
        if (map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i);
        }
        ans = Math.max(ans, j - i + 1);
        map.set(s[j], j);
    }
    return ans;
}', 
'hard', 
'{
    "test1": {"description": "finding the longest substring in a string with all unique characters", "input": ["abcdef"], "output": 6}, 
    "test2": {"description": "finding the longest substring in a string with repeated characters", "input": ["abcabcbb"], "output": 3},
    "test3": {"description": "finding the longest substring in a string with a mix of unique and repeated characters", "input": ["pwwkew"], "output": 3}, 
    "test4": {"description": "finding the longest substring in an empty string", "input": [""], "output": 0},
    "test5": {"description": "finding the longest substring in a string with all characters being the same", "input": ["bbbbb"], "output": 1}
}');


CREATE TABLE IF NOT EXISTS user_problem_attempts (
    attempt_id SERIAL PRIMARY KEY,
    auth0_user_id VARCHAR(255) NOT NULL,
    problem_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'unstarted' CHECK (status IN ('incomplete', 'complete', 'unstarted')),
    score INT,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_description TEXT DEFAULT '',
    generated_code TEXT DEFAULT ''
);
