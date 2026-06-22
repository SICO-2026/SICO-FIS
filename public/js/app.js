// ─────────────────────────────────────────────
  // CONFIG
  // Cambia esta URL a la dirección de tu API.
  // ─────────────────────────────────────────────
  const API_BASE = "http://localhost:3000";

  // ─────────────────────────────────────────────
  // ESTADO
  // ─────────────────────────────────────────────
  let equipos = [];

  // ─────────────────────────────────────────────
  // NAVEGACIÓN
  // ─────────────────────────────────────────────
  const NAV_TITLES = {
    dashboard:    ["Tablero de Control",  "Vista general del estado de tus equipos"],
    equipos:      ["Mis Equipos",         "Consulta, registro y administración de equipos industriales"],
    cotizacion:   ["Cotización",          "Genera cotizaciones a partir de los equipos seleccionados"],
    mantenciones: ["Solicitar Servicio",  "Registra mantenciones preventivas o correctivas"],
    historial:    ["Historial",           "Consulta el historial de mantenciones por equipo"],
  };

  function activateSection(sectionId) {
    document.querySelectorAll(".nav button").forEach(b => {
      b.classList.toggle("active", b.dataset.section === sectionId);
    });
    document.querySelectorAll(".section").forEach(s => {
      s.classList.toggle("active", s.id === sectionId);
    });
    const [title, subtitle] = NAV_TITLES[sectionId] ?? ["", ""];
    document.getElementById("page-title").textContent    = title;
    document.getElementById("page-subtitle").textContent = subtitle;
  }

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => activateSection(btn.dataset.section));
  });

  // ─────────────────────────────────────────────
  // UTILIDADES
  // ─────────────────────────────────────────────

  /** Muestra un mensaje de notificación breve. */
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2600);
  }

  /** Formatea un número como peso chileno. */
  function money(value) {
    return Number(value || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });
  }

  /**
   * Realiza una petición JSON a la API.
   * Lanza un error si la respuesta no es 2xx.
   */
  async function requestJSON(url, options = {}) {
    const res  = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.mensaje || `Error HTTP ${res.status}`);
    return data;
  }

  /**
   * Ejecuta una petición y vuelca el resultado JSON en un elemento <pre>.
   * En caso de error, muestra el mensaje en el mismo elemento.
   */
  async function fetchAndRender(elementId, fetcher, { ok: okMsg, err: errMsg }) {
    const el = document.getElementById(elementId);
    try {
      const data = await fetcher();
      el.textContent = JSON.stringify(data, null, 2);
      toast(okMsg);
    } catch (error) {
      el.textContent = `Error: ${error.message}`;
      toast(errMsg);
    }
  }

  /**
   * Lee los campos de un formulario a partir de un mapa { campo: elementId }.
   * Aplica trim() a strings y Number() donde se indique con el prefijo "num:".
   */
  function readForm(fieldMap) {
    const result = {};
    for (const [key, spec] of Object.entries(fieldMap)) {
      const [type, id] = spec.includes(":") ? spec.split(":") : ["str", spec];
      const raw = document.getElementById(id).value;
      result[key] = type === "num" ? Number(raw) : raw.trim();
    }
    return result;
  }

  // ─────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────

  async function cargarDashboard() {
    try {
      const [eqs, mant] = await Promise.allSettled([
        requestJSON(`${API_BASE}/equipos`),
        requestJSON(`${API_BASE}/mantenciones`),
      ]);

      if (eqs.status === "fulfilled") {
        equipos = eqs.value;
        actualizarTipos();

        const activos = equipos.filter(eq => Number(eq.disponible) === 1).length;
        const alertas = equipos.filter(eq => Number(eq.disponible) === 0).length;

        document.getElementById("stat-activos").textContent  = activos;
        document.getElementById("stat-alertas").textContent  = alertas;

        renderAlertas(equipos.filter(eq => Number(eq.disponible) === 0));
      }

      if (mant.status === "fulfilled" && Array.isArray(mant.value)) {
        const lista = mant.value;
        document.getElementById("stat-mantenciones").textContent = lista.length;

        const tiempos = lista
          .map(m => Number(m.tiempo_reparacion_horas))
          .filter(h => !isNaN(h) && h > 0);

        const promedio = tiempos.length
          ? (tiempos.reduce((a, b) => a + b, 0) / tiempos.length).toFixed(1) + " h"
          : "—";

        document.getElementById("stat-promedio").textContent = promedio;
      }

     const apiConectada = eqs.status === "fulfilled" || mant.status === "fulfilled";

if (apiConectada) {
  document.getElementById("api-pill").textContent = "● API conectada";
  document.getElementById("api-pill").style.cssText =
    "background:#ecfdf5;color:#166534;border-color:#bbf7d0";
} else {
  document.getElementById("api-pill").textContent = "● API sin conexión";
  document.getElementById("api-pill").style.cssText =
    "background:#fee2e2;color:#991b1b;border-color:#fecaca";
}
    } catch (error) {
      document.getElementById("api-pill").textContent = "● API sin conexión";
      document.getElementById("api-pill").style.cssText =
        "background:#fee2e2;color:#991b1b;border-color:#fecaca";
      toast("No se pudo conectar con la API.");
      console.error(error);
    }
  }

  function renderAlertas(equiposSinDisponibilidad) {
    const container = document.getElementById("alert-list-container");

    if (equiposSinDisponibilidad.length === 0) {
      container.innerHTML = `
        <div class="alert-row">
          <span class="muted">Sin alertas activas.</span>
        </div>`;
      return;
    }

    container.innerHTML = equiposSinDisponibilidad.map(eq => `
      <div class="alert-row">
        <div class="alert-left">
          <span class="dot red"></span>
          <div>
            <strong>${eq.nombre || `Equipo #${eq.id}`}</strong>
            <span class="muted">${eq.especificaciones || "Sin descripción"}</span>
          </div>
        </div>
        <span class="muted">${eq.tipo || "—"}</span>
      </div>
    `).join("");
  }

  // ─────────────────────────────────────────────
  // EQUIPOS
  // ─────────────────────────────────────────────

  async function cargarEquipos() {
    try {
      equipos = await requestJSON(`${API_BASE}/equipos`);
      actualizarTipos();
      renderEquipos();
      toast("Equipos cargados correctamente.");
    } catch (error) {
      document.getElementById("tabla-equipos").innerHTML =
        `<tr><td colspan="8" class="muted">Error: ${error.message}</td></tr>`;
      toast("Error al cargar equipos.");
    }
  }

  function actualizarTipos() {
    const select = document.getElementById("filtro-tipo");
    const actual = select.value;
    const tipos  = [...new Set(equipos.map(eq => eq.tipo).filter(Boolean))].sort();

    select.innerHTML = `<option value="">Todos los tipos</option>` +
      tipos.map(t => `<option value="${t}">${t}</option>`).join("");

    select.value = tipos.includes(actual) ? actual : "";
  }

  function limpiarFiltros() {
    ["filtro-texto", "filtro-tipo", "filtro-disponible"].forEach(id => {
      document.getElementById(id).value = "";
    });
    renderEquipos();
  }

  function renderEquipos() {
    const tbody     = document.getElementById("tabla-equipos");
    const texto     = document.getElementById("filtro-texto").value.toLowerCase().trim();
    const tipo      = document.getElementById("filtro-tipo").value;
    const disponible = document.getElementById("filtro-disponible").value;

    const filtrados = equipos.filter(eq => {
      const matchTexto = !texto ||
        [eq.nombre, eq.tipo, eq.marca].some(v => String(v || "").toLowerCase().includes(texto));
      const matchTipo  = !tipo || eq.tipo === tipo;
      const matchDisp  = disponible === "" || String(eq.disponible) === disponible;
      return matchTexto && matchTipo && matchDisp;
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="muted">No hay equipos para mostrar.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtrados.map(eq => {
      const disponible = Number(eq.disponible) === 1;
      return `
        <tr>
          <td><input type="checkbox" class="select-equipo" value="${eq.id}"></td>
          <td>${eq.id}</td>
          <td>
            <strong>${eq.nombre || "—"}</strong><br>
            <span class="muted">${eq.especificaciones || ""}</span>
          </td>
          <td>${eq.tipo  || "—"}</td>
          <td>${eq.marca || "—"}</td>
          <td>${money(eq.precio)}</td>
          <td>
            <span class="status ${disponible ? "ok" : "off"}">
              ${disponible ? "Disponible" : "No disponible"}
            </span>
          </td>
          <td>
            <div class="actions">
              <button class="btn secondary small" data-action="editar"   data-id="${eq.id}">Editar</button>
              <button class="btn danger    small" data-action="eliminar" data-id="${eq.id}">Eliminar</button>
            </div>
          </td>
        </tr>`;
    }).join("");
  }

  // Delegación de eventos en la tabla (evita onclick inline)
  document.getElementById("tabla-equipos").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "editar")   editarEquipo(id);
    if (btn.dataset.action === "eliminar") eliminarEquipo(id);
  });

  // ── Formulario de equipo ──

  const EQUIPO_FIELDS = {
    nombre:          "str:nombre",
    tipo:            "str:tipo",
    marca:           "str:marca",
    especificaciones:"str:especificaciones",
    precio:          "num:precio",
    disponible:      "num:disponible",
  };

  document.getElementById("form-equipo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id      = document.getElementById("equipo-id").value;
    const payload = readForm(EQUIPO_FIELDS);

    try {
      if (id) {
        await requestJSON(`${API_BASE}/equipos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast("Equipo actualizado.");
      } else {
        await requestJSON(`${API_BASE}/equipos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast("Equipo creado.");
      }
      resetFormularioEquipo();
      await cargarEquipos();
    } catch (error) {
      toast(error.message);
    }
  });

  function editarEquipo(id) {
    const eq = equipos.find(item => Number(item.id) === id);
    if (!eq) return;

    const campos = ["nombre", "tipo", "marca", "especificaciones", "precio", "disponible"];
    campos.forEach(key => {
      const el = document.getElementById(key);
      if (el) el.value = eq[key] ?? "";
    });
    document.getElementById("equipo-id").value = eq.id;
    document.getElementById("form-title").textContent = `Editar equipo #${eq.id}`;
    document.getElementById("form-equipo").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function resetFormularioEquipo() {
    document.getElementById("form-equipo").reset();
    document.getElementById("equipo-id").value = "";
    document.getElementById("form-title").textContent = "Registrar nuevo equipo";
  }

  async function eliminarEquipo(id) {
    if (!confirm(`¿Eliminar el equipo #${id}?`)) return;
    try {
      await requestJSON(`${API_BASE}/equipos/${id}`, { method: "DELETE" });
      toast("Equipo eliminado.");
      await cargarEquipos();
    } catch (error) {
      toast(error.message);
    }
  }

  // ─────────────────────────────────────────────
  // COTIZACIÓN
  // ─────────────────────────────────────────────

  function usarSeleccionados() {
    const ids = [...document.querySelectorAll(".select-equipo:checked")].map(cb => cb.value);
    document.getElementById("cotizacion-ids").value = ids.join(",");
    toast(ids.length ? "IDs enviados a cotización." : "No hay equipos seleccionados.");
  }

  async function generarCotizacion() {
    const ids = document.getElementById("cotizacion-ids").value
      .split(",")
      .map(v => Number(v.trim()))
      .filter(n => Number.isInteger(n) && n > 0);

    await fetchAndRender(
      "resultado-cotizacion",
      () => requestJSON(`${API_BASE}/cotizacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipo_ids: ids }),
      }),
      { ok: "Cotización generada.", err: "No se pudo generar la cotización." }
    );
  }

  // ─────────────────────────────────────────────
  // MANTENCIONES
  // ─────────────────────────────────────────────

  document.getElementById("form-mantencion").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      equipo_id:              Number(document.getElementById("mant-equipo-id").value),
      tipo:                   document.getElementById("mant-tipo").value,
      descripcion:            document.getElementById("mant-desc").value.trim(),
      fecha:                  document.getElementById("mant-fecha").value,
      tiempo_reparacion_horas:Number(document.getElementById("mant-tiempo").value),
    };

    try {
      await requestJSON(`${API_BASE}/mantenciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast("Mantención registrada.");
      e.target.reset();
      document.getElementById("mant-fecha").valueAsDate = new Date();
      cargarDashboard();
    } catch (error) {
      toast(error.message);
    }
  });

  // ─────────────────────────────────────────────
  // HISTORIAL
  // ─────────────────────────────────────────────

  async function consultarHistorial() {
    const id = Number(document.getElementById("historial-equipo-id").value);
    if (!id) { toast("Ingresa un ID de equipo."); return; }

    await fetchAndRender(
      "resultado-historial",
      () => requestJSON(`${API_BASE}/mantenciones/equipo/${id}`),
      { ok: "Historial cargado.", err: "No se pudo cargar el historial." }
    );
  }

  async function cargarMantenciones() {
    await fetchAndRender(
      "resultado-mantenciones",
      () => requestJSON(`${API_BASE}/mantenciones`),
      { ok: "Mantenciones cargadas.", err: "No se pudieron cargar las mantenciones." }
    );
  }

  // ─────────────────────────────────────────────
  // BINDINGS DE BOTONES
  // ─────────────────────────────────────────────
  document.getElementById("btn-refresh-dashboard").addEventListener("click",   cargarDashboard);
  document.getElementById("btn-cargar-equipos").addEventListener("click",      cargarEquipos);
  document.getElementById("btn-limpiar-filtros").addEventListener("click",     limpiarFiltros);
  document.getElementById("btn-nuevo-equipo").addEventListener("click",        resetFormularioEquipo);
  document.getElementById("btn-generar-cotizacion").addEventListener("click",  generarCotizacion);
  document.getElementById("btn-usar-seleccionados").addEventListener("click",  usarSeleccionados);
  document.getElementById("btn-consultar-historial").addEventListener("click", consultarHistorial);
  document.getElementById("btn-cargar-mantenciones").addEventListener("click", cargarMantenciones);

  document.getElementById("filtro-texto").addEventListener("input",    renderEquipos);
  document.getElementById("filtro-tipo").addEventListener("change",    renderEquipos);
  document.getElementById("filtro-disponible").addEventListener("change", renderEquipos);

  // ─────────────────────────────────────────────
  // INICIO
  // ─────────────────────────────────────────────
  activateSection("dashboard");
  document.getElementById("mant-fecha").valueAsDate = new Date();
  cargarDashboard();
