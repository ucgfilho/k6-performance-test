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
    brand: "volks",
    model: "r10",
    year: 2020
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(url, payload, params);

  // valida o response code e o conteúdo da resposta
  check(response, {
    "status is 404": (r) => r.status === 404,
    "message is correct": (r) => r.json("message") === "Vehicle not found.",
  });

  sleep(1);
}

// Gera o relatório em HTML
export function handleSummary(data) {
  return {
    "./report/post-404.html": htmlReport(data),
  };
}