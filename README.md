# Portfolio de Testes K6 - QA

Este repositório contém scripts de teste de performance usando [K6](https://k6.io/), focados em testes de login e requisições GET/POST, integrados com relatórios em HTML.

> Para os testes os endpoints são apenas para testes, sem conter dados reais, api usadas:
- https://jsonplaceholder.typicode.com/posts
- https://dummyjson.com/users
- https://dummyjson.com/auth/login

---

## 📁 Estrutura do Projeto
```load-test-k6/
├── .github/workflows/k6-tests.yml # Workflow GitHub Actions para rodar testes
├── data/
│ └── usersDummy.json # Dados de usuários para login-peak
├── scripts/
│ ├── get-posts-load.js # Script teste GET/POST
│ ├── login-peak-dummyjson.js # Teste login peak (pico)
│ └── login-stress-dummyjson.js # Teste login stress
└── README.md # Este arquivo
```
---
## Como rodar localmente

1. Instale o [k6](https://k6.io/docs/getting-started/installation/)
2. Clone o repositório e navegue até a pasta
3. Execute um dos testes com:
```bash
k6 run scripts/login-peak-dummyjson.js
k6 run scripts/login-stress-dummyjson.js
k6 run scripts/get-posts-load.js
```

Os relatórios HTML serão gerados automaticamente na pasta `results/`.

---

## GitHub Actions
Este projeto possui um workflow configurado para rodar os testes manualmente com diferentes cargas, via GitHub Actions.

### Como usar
- Vá na aba Actions no GitHub
- Selecione o workflow k6-tests
- Clique em Run workflow
- Escolha o tipo de teste:
    - login-peak — Teste de pico no login
    - login-stress — Teste de stress no login
    - getpost — Teste GET/POST
- Execute o workflow

### Artefatos HTML
Após a execução, os relatórios HTML são salvos como artifacts na seção de artefatos do workflow para download e análise