import Main from "./solution";

let inputA = "00:01:07,400-234-090\n00:01:07,400-234-090\n00:05:01,701-080-080\n00:05:00,400-234-090";

let sol = new Main().solution(inputA);

console.log(`Total cost = ${sol} cents €`);