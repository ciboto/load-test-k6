import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status é 200': (r) => r.status === 200,
    'responde rápido (< 500ms)': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'results/load-test-get-posts-index.html': htmlReport(data), // gera o HTML
    stdout: textSummary(data, { indent: ' ', enableColors: true }), // resumo no terminal
  };
}
