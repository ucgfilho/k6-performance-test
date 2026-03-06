import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function () {
  const url = "http://localhost:8080/api/cars";

  const response = http.get(url);

  // valida o response code e o conteúdo da resposta
  check(response, {
    "status is 200": (r) => r.status === 200,
    "contains 5 cars": (r) => r.json().length === 5,
    "car 1 is Toyota Corolla": (r) =>
      r.json()[0].model === "Corolla" && r.json()[0].brand === "Toyota",
    "car 5 is BMW M3": (r) => r.json()[4].model === "M3" && r.json()[4].brand === "BMW",
  });

  sleep(1);
}

// Gera o relatório em HTML
export function handleSummary(data) {
  return {
    "./report/get.html": htmlReport(data),
  };
}