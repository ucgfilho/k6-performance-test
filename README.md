# Testes de Performance em API utilizando k6

Suite de testes de performance em API para um serviço de veículos mockado com WireMock, utilizando o [k6](https://k6.io/) como framework de testes de carga.

---

## Tecnologias

| Tecnologia  | Finalidade                         |
| ----------- | ---------------------------------- |
| k6          | Framework de testes de performance |
| WireMock    | Mock server da API                 |
| k6-reporter | Geração de relatórios em HTML      |

---

## Estrutura do Projeto

```
k6-performance-test/
├── __files/
│   └── cars.json               # Massa de dados retornada pelo mock (GET)
├── mappings/
│   ├── api-cars.json           # Mapping GET /api/cars → 200
│   ├── post-cars.json          # Mapping POST /api/cars → 201 (modelo 'fusca')
│   ├── post-cars-500.json      # Mapping POST /api/cars → 500 (modelo 'up tsi')
│   └── post-cars-404.json      # Mapping POST /api/cars → 404 (outros modelos)
├── tests/
│   ├── get.js                  # Teste GET /api/cars
│   ├── post-201.js             # Teste POST /api/cars → cadastro com sucesso
│   └── post-500.js             # Teste POST /api/cars → erro interno do servidor
└── README.md
```

---

## Configuração dos Testes

Todos os testes são executados com as seguintes opções de carga:

| Parâmetro | Valor |
| --------- | ----- |
| VUs       | 10    |
| Duration  | 30s   |

---

## Cenários Testados

### GET `/api/cars`

Arquivo: `tests/get.js`

| Validação              | Critério                          |
| ---------------------- | --------------------------------- |
| Status code            | `200`                             |
| Quantidade de veículos | Lista contém 5 carros             |
| Primeiro veículo       | `brand: Toyota`, `model: Corolla` |
| Último veículo         | `brand: BMW`, `model: M3`         |

### POST `/api/cars` — Cadastro com sucesso (201)

Arquivo: `tests/post-201.js`

Payload enviado:

```json
{ "brand": "Volkswagen", "model": "fusca", "year": 1965 }
```

| Validação           | Critério                         |
| ------------------- | -------------------------------- |
| Status code         | `201`                            |
| Mensagem de retorno | `"Car successfully registered!"` |
| ID do veículo       | `carId: 6`                       |

### POST `/api/cars` — Erro interno do servidor (500)

Arquivo: `tests/post-500.js`

Payload enviado:

```json
{ "brand": "Volkswagen", "model": "up tsi", "year": 2020 }
```

| Validação        | Critério                                                  |
| ---------------- | --------------------------------------------------------- |
| Status code      | `500`                                                     |
| Mensagem de erro | `"Internal server error: model 'up tsi' is not allowed."` |

---

## Mock Server (WireMock)

O servidor mock é configurado via arquivos na pasta `mappings/` e responde na porta `8080`.

| Mapping              | Método | URL       | Condição              | Status |
| -------------------- | ------ | --------- | --------------------- | ------ |
| `api-cars.json`      | GET    | /api/cars | —                     | 200    |
| `post-cars.json`     | POST   | /api/cars | `model == 'fusca'`    | 201    |
| `post-cars-500.json` | POST   | /api/cars | `model == 'up tsi'`   | 500    |
| `post-cars-404.json` | POST   | /api/cars | Qualquer outro modelo | 404    |

---

## Pré-requisitos

- [k6](https://k6.io/docs/getting-started/installation/) instalado
- [WireMock](https://wiremock.org/docs/standalone/) em execução

---

## Executando o WireMock

```bash
java -jar wiremock-standalone.jar --port 8080
```

> Os diretórios `mappings/` e `__files/` devem estar no mesmo diretório onde o WireMock for iniciado.

---

## Executando os Testes

```bash
# Teste GET /api/cars
k6 run tests/get.js

# Teste POST /api/cars → 201 (cadastro com sucesso)
k6 run tests/post-201.js

# Teste POST /api/cars → 500 (erro interno)
k6 run tests/post-500.js
```

Ao final de cada execução, um relatório HTML é gerado automaticamente na pasta `report/` que ser

---

## Relatórios

Os relatórios são gerados via [k6-reporter](https://github.com/benc-uk/k6-reporter) e salvos em:

| Arquivo                        | Teste correspondente |
| ------------------------------ | -------------------- |
| `report/get.html`              | GET /api/cars        |
| `report/cria-veiculo-201.html` | POST /api/cars → 201 |
| `report/cria-veiculo-500.html` | POST /api/cars → 500 |

---

## Autor

**Ubirajara Filho**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ucgfilho/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ucgfilho)

---

## Licença

Este projeto está sob a licença MIT.
