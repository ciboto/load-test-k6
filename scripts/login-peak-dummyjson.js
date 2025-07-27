import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  vus: 1,
  interations: 10,
};

// Lê e parseia o JSON com os usuários (com username e password)
const usersData = JSON.parse(open('../data/usersDummy.json'));


export default function () {
  // Pega um usuário aleatório do arquivo
  const user = usersData.users[Math.floor(Math.random() * usersData.users.length)];

  const payload = JSON.stringify({
    username: user.username,
    password: user.password 
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('https://dummyjson.com/auth/login', payload, params);

  check(res, {
    'status 200': (r) => r.status === 200,
    'accessToken presente': (r) => {
      try {
        return JSON.parse(r.body).accessToken !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (res.status === 200) {
    const body = JSON.parse(res.body);
    console.log(`Login sucesso para ${user.username}: token ${body.accessToken}`);
  } else {
    console.log(`Login falhou para ${user.username}: status ${res.status}`);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'results/load-test-login-peak-index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
