# Projeto de Testes de Carga com k6 – Performance para APIs
![License](https://img.shields.io/badge/License-CC_BY--NC--ND_4.0-lightgrey?style=for-the-badge)
![K6 Load](https://img.shields.io/badge/K6_Load-Tested-green?logo=k6&logoColor=grey&style=for-the-badge)

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
```yaml
name: K6 Load Teste

on:
  workflow_dispatch:
    inputs:
      test_type:
        description: 'Tipo de teste a executar, options: getpost, login-peak, login-stress'
        required: true
        default: 'peak'
        type: choice
        options:
          - login-peak
          - login-stress
          - getpost

jobs:
  run-k6:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v4

      - name: Instalar K6
        run: |
          sudo apt update
          sudo apt install -y gnupg software-properties-common
          curl -s https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt update
          sudo apt install -y k6

      - name: Criar pasta de resultados
        run: mkdir -p results

      - name: Rodar teste K6 escolhido
        run: |
          case "${{ github.event.inputs.test_type }}" in
            login-peak)
              echo "Rodando login-peak-dummyjson.js"
              k6 run scripts/login-peak-dummyjson.js
              ;;
            login-stress)
              echo "Rodando login-stress-dummyjson.js"
              k6 run scripts/login-stress-dummyjson.js
              ;;
            getpost)
              echo "Rodando get-posts-load.js"
              k6 run scripts/get-posts-load.js
              ;;
            *)
              echo "Tipo de teste inválido!"
              exit 1
              ;;
          esac

      - name: Upload de relatórios HTML
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: relatorios-k6
          path: results/
```
### Artefatos HTML

- Após a execução, os relatórios HTML são salvos como artifacts na seção de artefatos do workflow para download e análise
---
## ⚖️ Licença
Este projeto está licenciado sob a [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) - Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
