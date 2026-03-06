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
    model: "fusca",
    year: 1965,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(url, payload, params);

  // valida o response code e o conteúdo da resposta
  check(response, {
    "status is 201": (r) => r.status === 201,
    "message is correct": (r) => r.json("message") === "Car successfully registered!",
    "carId is 6": (r) => r.json("carId") === 6,
  });

  sleep(1);
}

// Gera o relatório em HTML
export function handleSummary(data) {
  return {
    "./report/post-201.html": htmlReport(data),
  };
}