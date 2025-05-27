const juegos = {
  cancha1: [
    // Estrellitas - Grupo A
    { time: "08:00", phase: "Grupo A", teamA: "Est1", teamB: "Est2" },
    { time: "08:40", phase: "Grupo A", teamA: "Est3", teamB: "Est4" },
    { time: "09:20", phase: "Grupo A", teamA: "Est1", teamB: "Est3" },
    { time: "10:00", phase: "Grupo A", teamA: "Est2", teamB: "Est4" },
    { time: "10:40", phase: "Grupo A", teamA: "Est1", teamB: "Est4" },
    { time: "11:20", phase: "Grupo A", teamA: "Est2", teamB: "Est3" },

    // Estrellitas - Grupo B
    { time: "12:00", phase: "Grupo B", teamA: "Est5", teamB: "Est6" },
    { time: "12:40", phase: "Grupo B", teamA: "Est7", teamB: "Est8" },
    { time: "13:20", phase: "Grupo B", teamA: "Est5", teamB: "Est7" },
    { time: "14:00", phase: "Grupo B", teamA: "Est6", teamB: "Est8" },
    { time: "14:40", phase: "Grupo B", teamA: "Est5", teamB: "Est8" },
    { time: "15:20", phase: "Grupo B", teamA: "Est6", teamB: "Est7" },

    // Estrellitas - Eliminación
    { time: "16:00", phase: "Semifinal 1", teamA: "1° Grupo A", teamB: "2° Grupo B" },
    { time: "16:40", phase: "Semifinal 2", teamA: "1° Grupo B", teamB: "2° Grupo A" },
    { time: "17:20", phase: "Final", teamA: "Ganador SF1", teamB: "Ganador SF2" }
  ],
  cancha2: [
    // Supernova - Grupo A
    { time: "08:00", phase: "Grupo A", teamA: "Sup1", teamB: "Sup2" },
    { time: "08:40", phase: "Grupo A", teamA: "Sup3", teamB: "Sup4" },
    { time: "09:20", phase: "Grupo A", teamA: "Sup1", teamB: "Sup3" },
    { time: "10:00", phase: "Grupo A", teamA: "Sup2", teamB: "Sup4" },
    { time: "10:40", phase: "Grupo A", teamA: "Sup1", teamB: "Sup4" },
    { time: "11:20", phase: "Grupo A", teamA: "Sup2", teamB: "Sup3" },

    // Supernova - Grupo B
    { time: "12:00", phase: "Grupo B", teamA: "Sup5", teamB: "Sup6" },
    { time: "12:40", phase: "Grupo B", teamA: "Sup7", teamB: "Sup8" },
    { time: "13:20", phase: "Grupo B", teamA: "Sup5", teamB: "Sup7" },
    { time: "14:00", phase: "Grupo B", teamA: "Sup6", teamB: "Sup8" },
    { time: "14:40", phase: "Grupo B", teamA: "Sup5", teamB: "Sup8" },
    { time: "15:20", phase: "Grupo B", teamA: "Sup6", teamB: "Sup7" },

    // Supernova - Eliminación
    { time: "16:00", phase: "Semifinal 1", teamA: "1° Grupo A", teamB: "2° Grupo B" },
    { time: "16:40", phase: "Semifinal 2", teamA: "1° Grupo B", teamB: "2° Grupo A" },
    { time: "17:20", phase: "Final", teamA: "Ganador SF1", teamB: "Ganador SF2" }
  ]
};

let puntos = JSON.parse(localStorage.getItem('puntos')) || {
  cancha1: { "Grupo A": {}, "Grupo B": {} },
  cancha2: { "Grupo A": {}, "Grupo B": {} }
};

let resultados = JSON.parse(localStorage.getItem('resultados')) || {};

function crearFila(juego, index, canchaId) {
  const row = document.createElement('tr');
  const id = `${canchaId}-${index}`;

  const savedResult = resultados[id] || "";

  row.innerHTML = `
    <td>${index+1}</td>
    <td>${juego.time}</td>
    <td>${juego.phase}</td>
    <td>${juego.teamA}</td>
    <td>${juego.teamB}</td>
    <td>
      <select id="winner-${id}">
        <option value="">--</option>
        <option value="${juego.teamA}" ${savedResult === juego.teamA ? "selected" : ""}>${juego.teamA}</option>
        <option value="${juego.teamB}" ${savedResult === juego.teamB ? "selected" : ""}>${juego.teamB}</option>
      </select>
    </td>
    <td><button onclick="registrarGanador('${canchaId}', '${id}', '${juego.teamA}', '${juego.teamB}', '${juego.phase}')">Registrar</button></td>
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

function registrarGanador(canchaId, rowId, teamA, teamB, grupo) {
  const select = document.getElementById(`winner-${rowId}`);
  const ganador = select.value;
  if (!ganador) return alert("Selecciona un equipo ganador.");
  if (!puntos[canchaId][grupo]) return;

  const anterior = resultados[rowId];
  if (anterior) puntos[canchaId][grupo][anterior] -= 3;

  puntos[canchaId][grupo][ganador] += 3;
  resultados[rowId] = ganador;

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
