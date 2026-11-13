import { baca } from "./data.js";

export function terapkanTampilan() {
  const { tema, hurufBesar } = baca().pengaturan;
  const akar = document.documentElement;
  if (tema === "sistem") akar.removeAttribute("data-tema");
  else akar.setAttribute("data-tema", tema);
  if (hurufBesar) akar.setAttribute("data-huruf", "besar");
  else akar.removeAttribute("data-huruf");
  const gelap = tema === "gelap" || (tema === "sistem" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", gelap ? "#15131f" : "#6c5ce7");
}
