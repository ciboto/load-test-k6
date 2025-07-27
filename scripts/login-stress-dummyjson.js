import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  vus: 10,
  duration: '30s',
};

// Faz o GET /users apenas uma vez antes dos testes
// maneira diferente do teste login-peak que pega local de um json estatico
// esse teste faz um get nos users da api como setup
export function setup() {
  const res = http.get('https://dummyjson.com/users');

  check(res, {
    'setup: GET users status 200': (r) => r.status === 200,
  });

  let users = [];

  try {
    const json = res.json();
    if (!json.users || json.users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado no body JSON');
    } else {
      users = json.users;
      console.log(`✅ Total de usuários recebidos: ${users.length}`);
    }
  } catch (e) {
    console.log(`❌ Erro ao parsear JSON do GET /users: ${e}`);
  }

  return users;
}

// Cada VU faz login com um dos usuários conhecidos
export default function (users) {
  const user = users[Math.floor(Math.random() * users.length)];

  if (!user.password) {
    console.log(`⚠️ Usuário ${user.username} não possui senha definida`);
    return;
  }

  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post('https://dummyjson.com/auth/login', payload, { headers });
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
    try {
      const body = JSON.parse(res.body);
      console.log(`✅ Login sucesso: ${user.username} | token: ${body.accessToken}`);
    } catch (e) {
      console.log(`❌ Erro ao parsear resposta do login: ${e}`);
    }
  } else {
    console.log(`❌ Login falhou para ${user.username} | status: ${res.status}`);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'results/load-test-login-stress-index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
