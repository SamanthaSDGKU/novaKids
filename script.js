const juegos = {
  cancha1: [
    { time: "08:00", phase: "Grupo A", teamA: "CAR 14 y menores", teamB: "Starlings 14-15" },//
    { time: "08:40", phase: "Grupo B", teamA: "Starlings AR", teamB: "Instituto Mex" },//
    { time: "09:20", phase: "Grupo A", teamA: "IRK Presidentes", teamB: "Storm A" },//
    { time: "10:00", phase: "Grupo B", teamA: "Amazonas", teamB: "Storm B" },//
    { time: "10:40", phase: "Grupo A", teamA: "IRK Presidentes", teamB: "Starlings 14-15" },//

    { time: "11:20", phase: "Grupo B", teamA: "CAR 14 y menores", teamB: "Storm B" },//
    { time: "12:00", phase: "Grupo B", teamA: "Starlings AR", teamB: "Amazonas" },//

    { time: "12:40", phase: "Grupo B", teamA: "Instituto Mex", teamB: "Amazonas" },//
    { time: "15:20", phase: "Grupo B", teamA: "Starlings AR", teamB: "Storm B" },//
    { time: "13:20", phase: "Grupo A", teamA: "CAR 14 y menores", teamB: "IRK Presidentes" },//
    { time: "14:00", phase: "Grupo B", teamA: "Instituto Mex", teamB: "Storm B" },//
    { time: "14:40", phase: "Grupo A", teamA: "Storm A", teamB: "Starlings 14-15" },//

    { time: "16:00", phase: "Semifinal 1", teamA: "1° Grupo A", teamB: "2° Grupo B" },
    { time: "17:00", phase: "Semifinal 2", teamA: "1° Grupo B", teamB: "2° Grupo A" },
    { time: "18:00", phase: "Final", teamA: "Ganador SF1", teamB: "Ganador SF2" }
  ],
  cancha2: [
    { time: "08:00", phase: "Grupo A", teamA: "Becerritas", teamB: "Gladiadores B"  },//
    { time: "08:40", phase: "Grupo B", teamA: "Amazonas", teamB: "Starlings 12-13" },//
    { time: "09:20", phase: "Grupo A", teamA: "CAR 12-13", teamB: "Instituto Mex"}, //
    { time: "10:00", phase: "Grupo B", teamA: "Starlings 12-13", teamB: "Gladiadores A"},//
    { time: "10:40", phase: "Grupo A", teamA: "CAR 12-13", teamB: "Gladiadores B" },//
    { time: "11:20", phase: "Grupo B",  teamA: "Vaquitas", teamB: "Amazonas" },//
    { time: "12:00", phase: "Grupo A", teamA: "Becerritas", teamB: "CAR 12-13"  },//

    { time: "12:40", phase: "Grupo A", teamA: "Instituto Mexico", teamB: "Gladiadores B"},//
    { time: "13:20", phase: "Grupo B",  teamA: "Vaquitas", teamB: "Galdiadores A"},//
    { time: "14:00", phase: "Grupo B", teamA: "Amazonas", teamB: "Gladiadores A" },//
    { time: "14:40", phase: "Grupo A", teamA: "Becerritas", teamB: "Instituto Mex" },//
    { time: "15:20", phase: "Grupo B", teamA: "Vaquitas", teamB: "Starlings 12-13" },//
    { time: "16:00", phase: "Semifinal 1", teamA: "1° Grupo A", teamB: "2° Grupo B" },
    { time: "17:00", phase: "Semifinal 2", teamA: "1° Grupo B", teamB: "2° Grupo A" },
    { time: "18:00", phase: "Final", teamA: "Ganador SF1", teamB: "Ganador SF2" }
]
};

// ... juegos definido como antes ...

let puntos = JSON.parse(localStorage.getItem('puntos')) || {
  cancha1: { "Grupo A": {}, "Grupo B": {} },
  cancha2: { "Grupo A": {}, "Grupo B": {} }
};

let resultados = JSON.parse(localStorage.getItem('resultados')) || {};

function crearFila(juego, index, canchaId) {
  const row = document.createElement('tr');
  const id = `${canchaId}-${index}`;

  const saved = resultados[id] || { ganador: "", sets: ["", ""] };

  row.innerHTML = `
    <td>${index}</td>
    <td>${juego.time}</td>
    <td>${juego.phase}</td>
    <td>${juego.teamA}</td>
    <td>${juego.teamB}</td>
    <td>
      <input type="number" id="set1-${id}" value="${saved.sets[0]}" placeholder="S1A" min="0" max="21" /><br>
      <input type="number" id="set2-${id}" value="${saved.sets[1]}" placeholder="S2A" min="0" max="21" />
    </td>
    <td>
      <input type="number" id="set1b-${id}" value="${saved.sets[2]}" placeholder="S1B" min="0" max="21" /><br>
      <input type="number" id="set2b-${id}" value="${saved.sets[3]}" placeholder="S2B" min="0" max="21" />
    </td>
    <td><button onclick="registrarResultado('${canchaId}', '${id}', '${juego.teamA}', '${juego.teamB}', '${juego.phase}')">Registrar</button></td>
  `;

  return row;
}

function mostrarJuegos() {
  Object.keys(juegos).forEach(cancha => {
    const tbody = document.getElementById(cancha);
    juegos[cancha].forEach((juego, i) => {
      tbody.appendChild(crearFila(juego, i, cancha));
      if (!puntos[cancha][juego.phase]) puntos[cancha][juego.phase] = {};
      if (juego.phase.startsWith("Grupo")) {
        puntos[cancha][juego.phase][juego.teamA] ||= 0;
        puntos[cancha][juego.phase][juego.teamB] ||= 0;
      }
    });
  });
  actualizarTablaPuntos();
}

function registrarResultado(canchaId, rowId, teamA, teamB, grupo) {
  const set1A = parseInt(document.getElementById(`set1-${rowId}`).value);
  const set2A = parseInt(document.getElementById(`set2-${rowId}`).value);
  const set1B = parseInt(document.getElementById(`set1b-${rowId}`).value);
  const set2B = parseInt(document.getElementById(`set2b-${rowId}`).value);

  if ([set1A, set2A, set1B, set2B].some(val => isNaN(val))) {
    return alert("Completa todos los puntos de los sets.");
  }

  const puntosA = set1A + set2A;
  const puntosB = set1B + set2B;

  let ganador = "";
  if (puntosA > puntosB) ganador = teamA;
  else if (puntosB > puntosA) ganador = teamB;
  else return alert("Empate no permitido, verifica los sets.");

  const anterior = resultados[rowId]?.ganador;
  if (anterior && puntos[canchaId][grupo][anterior]) {
    puntos[canchaId][grupo][anterior] -= 3;
  }

  puntos[canchaId][grupo][ganador] += 3;
  resultados[rowId] = {
    ganador,
    sets: [set1A, set2A, set1B, set2B]
  };

  localStorage.setItem('puntos', JSON.stringify(puntos));
  localStorage.setItem('resultados', JSON.stringify(resultados));
  actualizarTablaPuntos();
}

function actualizarTablaPuntos() {
  ["cancha1", "cancha2"].forEach((cancha, idx) => {
    ["Grupo A", "Grupo B"].forEach(grupo => {
      const tabla = document.getElementById(`tabla${idx + 1}${grupo.slice(-1)}`);
      tabla.innerHTML = "";
      const ordenado = Object.entries(puntos[cancha][grupo] || {}).sort((a, b) => b[1] - a[1]);
      ordenado.forEach(([equipo, score]) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${equipo}</td><td>${score}</td>`;
        tabla.appendChild(fila);
      });
    });
  });
}

window.onload = mostrarJuegos;
