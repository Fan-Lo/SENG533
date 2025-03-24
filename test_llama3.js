import http from 'k6/http';
import { check, sleep } from 'k6';

// Define test options with clean non-overlapping scenarios
export const options = {
    scenarios: {
        lowload_1_test: {
            executor: 'constant-vus',
            vus: 1,
            duration: '10m',
            gracefulStop: '2m', // Allow time to wrap up requests
        },
        midload_3_test: {
            executor: 'constant-vus',
            startTime: '12m', // Starts after lowload + gracefulStop
            vus: 3,
            duration: '10m',
            gracefulStop: '2m',
        },
        highload_10_test: {
            executor: 'constant-vus',
            startTime: '24m', // Starts after midload + gracefulStop
            vus: 10,
            duration: '10m',
            gracefulStop: '2m',
        },
    },
};

export default function () {
    const url = "http://localhost:11434/api/generate";

    const payload = JSON.stringify({
        model: "llama3",
        prompt: "Summarize the importance of clean code in software development in one paragraph.",
        stream: false
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
        timeout: '400s'
    };

    const response = http.post(url, payload, params);

    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(2); // Wait 2 seconds between requests
}

