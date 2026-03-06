import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function () {
  const url = "http://localhost:8080/api/cars";

  const payload = JSON.stringify({
    brand: "Volkswagen",
    model: "up tsi",
    year: 2020,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(url, payload, params);

  // valida o response code e o conteúdo da resposta
  check(response, {
    "status is 500": (r) => r.status === 500,
    "error message is correct": (r) =>
      r.json("message") === "Internal server error: model 'up tsi' is not allowed.",
  });

  sleep(1);
}

// Gera o relatório em HTML
export function handleSummary(data) {
  return {
    "./report/post-500.html": htmlReport(data),
  };
}