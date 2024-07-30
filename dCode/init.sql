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

CREATE TABLE IF NOT EXISTS user_problem_attempts (
    attempt_id SERIAL PRIMARY KEY,
    auth0_user_id VARCHAR(255) NOT NULL,
    problem_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'unstarted' CHECK (status IN ('incomplete', 'complete', 'unstarted')),
    score INT,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
