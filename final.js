import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const prompts = [
  { name: 'math_open', prompt: 'Solve: What is the square root of 144?' },
  { name: 'math_mc', prompt: 'What is 15 * 3?\nA) 45\nB) 35\nC) 50\nD) 40' },
  { name: 'logic_open', prompt: 'What comes next in the sequence: 2, 4, 8, 16, ...?' },
  { name: 'logic_mc', prompt: 'Which of the following is a logical contradiction?\nA) All bachelors are unmarried\nB) The sun is hot\nC) It is raining and it is not raining\nD) Water is wet' },
  { name: 'code_open', prompt: 'Write a Python function that checks if a number is prime.' },
  { name: 'code_mc', prompt: 'Which code snippet prints "Hello, World!" in Python?\nA) print("Hello, World!")\nB) echo "Hello, World!"\nC) Console.WriteLine("Hello, World!")\nD) System.out.println("Hello, World!")' },
  { name: 'writing_open', prompt: 'Write a short story about a robot discovering emotions.' },
  { name: 'writing_mc', prompt: 'Which sentence is grammatically correct?\nA) He go to school.\nB) They was happy.\nC) She is reading.\nD) We goes home.' },
  { name: 'comprehension_open', prompt: 'Summarize the main idea of this passage: "Photosynthesis is the process by which green plants convert sunlight into energy..."' },
  { name: 'comprehension_mc', prompt: 'What is the main purpose of photosynthesis?\nA) To absorb water\nB) To produce energy\nC) To generate heat\nD) To move nutrients' },
  { name: 'science_open', prompt: 'Explain Newton\'s second law of motion.' },
  { name: 'science_mc', prompt: 'Which of the following is a chemical change?\nA) Melting ice\nB) Boiling water\nC) Burning wood\nD) Breaking glass' },
  { name: 'knowledge_open', prompt: 'Who wrote the play "Romeo and Juliet"?' },
  { name: 'knowledge_mc', prompt: 'Which planet is known as the Red Planet?\nA) Earth\nB) Mars\nC) Venus\nD) Jupiter' },
];

const trends = {};
for (const p of prompts) {
  trends[p.name] = new Trend(`response_time_${p.name}`);
}

const model = __ENV.MODEL || 'llama3';

export const options = {
  scenarios: {
    default: {
      executor: 'per-vu-iterations',
      vus: Number(__ENV.VUS) || 1,
      iterations: 1,
      maxDuration: '600m',
    },
  },
};

export default function () {
  console.info(`>>> Starting benchmark for model: ${model}`);

  for (const p of prompts) {
    const payload = JSON.stringify({
      model: model,
      prompt: p.prompt,
      stream: false,
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
      timeout: '100m',
    };

    console.info(`--- Sending prompt: ${p.name}`);

    const res = http.post('http://localhost:11434/api/generate', payload, params);

    check(res, {
      'status is 200': (r) => r.status === 200,
    });

    trends[p.name].add(res.timings.duration, { model: model });

    sleep(1);
  }
}

