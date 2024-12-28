const LIGHTS = 50;
const genConfig = (index) => ({
  rotate: (1440 / LIGHTS) * (LIGHTS - index),
  radius: (12.5 / LIGHTS) * (LIGHTS - index),
  y: (100 / LIGHTS) * index,
  speed: Math.random() * 10,
  delay: Math.random() * -10,
  appear: index,
});

const treeElement = document.querySelector(".tree");
let l = 0;

while (l < LIGHTS) {
  const { radius, rotate, y, speed, delay, appear } = genConfig(l);
  const light = document.createElement("div");
  light.className = "tree__light";
  light.style = `
    --appear: ${appear};
    --y: ${y};
    --rotate: ${rotate};
    --radius: ${radius};
    --speed: ${speed};
    --delay: ${delay};
  `;
  treeElement.appendChild(light);
  l++;
}

const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
star.className = "tree__star";
star.setAttribute("xmlns", "http://www.w3.org/2000/svg");
star.setAttribute("viewBox", "0 0 113.32 108.44");
star.style = `
  --delay: ${LIGHTS};
  position: absolute; /* Adicionando posição absoluta */
  height: 5vmin; /* Ajustando a altura para 5vmin */
  width: 5vmin; /* Ajustando a largura para 5vmin */
  bottom: 100%; /* Posicionando acima da árvore */
  left: 50%; /* Centralizando horizontalmente */
  transform: translate(-50%, 0); /* Centralizando */
`;
star.innerHTML = `
  <path d="M90.19 104.33L57.12 87.38 24.4 105l5.91-36.69L3.44 42.65l36.72-5.72 16.1-33.5L73.06 36.6l36.83 4.97-26.35 26.21z"
    fill="hsl(45, 80%, 80%)" /* Mudando fill para uma cor visível */
    stroke-width="6.88"
    stroke-linecap="round"
    stroke-linejoin="round">
  </path>`;
treeElement.appendChild(star);

// Define a URL da API com base no ambiente
const apiUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/avisos"
    : "https://basedeconhecimentocot.info/avisos";

// Função para buscar avisos
async function buscarAvisos() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar avisos.");
    const avisos = await response.json();
    const listaAvisos = document.getElementById("listaAvisos");
    listaAvisos.innerHTML = "";
    avisos.forEach((item) => {
      listaAvisos.innerHTML += `<li>${item.aviso} (${new Date(
        item.data
      ).toLocaleDateString()}) 
                <button onclick="apagarAviso('${item.id}')">Apagar</button> 
                <button onclick="alterarAviso('${item.id}')">Alterar</button>
            </li>`;
    });
  } catch (error) {
    console.error("Erro ao buscar avisos:", error);
    alert("Não foi possível carregar os avisos. Tente novamente mais tarde.");
  }
}

// Função para adicionar aviso
async function adicionarAviso() {
  const avisoInput = document.getElementById("avisoInput");
  const aviso = avisoInput.value.trim();

  if (!aviso) {
    alert("O campo de aviso não pode estar vazio!");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aviso }),
    });
    if (!response.ok) throw new Error("Erro ao adicionar aviso.");
    avisoInput.value = "";
    buscarAvisos(); // Atualiza a lista de avisos
  } catch (error) {
    console.error("Erro ao adicionar aviso:", error);
    alert("Não foi possível adicionar o aviso. Tente novamente.");
  }
}

// Função para apagar aviso
async function apagarAviso(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok)
      throw new Error(`Erro ao apagar aviso: ${response.statusText}`);

    buscarAvisos(); // Atualiza a lista após a exclusão
  } catch (error) {
    console.error("Erro ao apagar aviso:", error);
    alert("Não foi possível apagar o aviso. Tente novamente.");
  }
}

// Função para alterar aviso
async function alterarAviso(id) {
  const novoAviso = prompt("Digite o novo aviso:").trim();

  if (!novoAviso) {
    alert("O aviso não pode estar vazio!");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aviso: novoAviso }),
    });
    if (!response.ok) throw new Error("Erro ao alterar aviso.");
    buscarAvisos(); // Atualiza a lista após a alteração
  } catch (error) {
    console.error("Erro ao alterar aviso:", error);
    alert("Não foi possível alterar o aviso. Tente novamente.");
  }
}

// Carrega os avisos ao iniciar
buscarAvisos();
