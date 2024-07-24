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
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- mock problem data for now 

INSERT INTO problems (name, description, code, difficulty)
VALUES('Addition', 'Simple addition of two numbers', 'function(a, b) {
return a + b;
}', 'easy');

INSERT INTO problems (name, description, code, difficulty)
VALUES('Factorial', 'Recursive function to calculate factorial', 'function fac(n) {
  return n < 2 ? 1 : n * fac(n - 1);
};', 'medium');

CREATE TABLE IF NOT EXISTS user_problem_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'unstarted' CHECK (status IN ('incomplete', 'complete', 'unstarted')),
    score INT,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (problem_id) REFERENCES problems(problem_id)
);