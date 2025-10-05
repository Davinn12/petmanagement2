// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  
  // === TOGGLE MENU MOBILE ===
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.createElement("div");
  overlay.classList.add("sidebar-overlay");
  document.body.appendChild(overlay);

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      overlay.classList.toggle("active", isOpen);
      hamburger.classList.toggle("active", isOpen);
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      hamburger.classList.remove("active");
    });
  }
  
  // Simular login simple (si viene de login)
  window.login = function() {
    const email = document.getElementById('email')?.value || 'usuario@demo';
    localStorage.setItem('pm_user', JSON.stringify({email, name: 'Usuario'}));
    window.location.href = 'dashboard.html';
  };

  // Cargar usuario si existe
  const user = JSON.parse(localStorage.getItem('pm_user') || 'null');
  if (user) {
    // si estamos en dashboard, mostrar nombre en header (si quieres)
    // ejemplo simple: ajustar header h1 si existe
    const head = document.querySelector('main header h1');
    if (head) head.textContent = `Bienvenido, ${user.name} 👋`;
  }

  // Citas: guardar desde /citas.html
  const citasForm = document.querySelector('form.card.grid-2');
  if (citasForm && window.location.pathname.includes('citas.html')) {
    citasForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        mascota: citasForm.querySelector('select:nth-of-type(1)').value,
        servicio: citasForm.querySelector('select:nth-of-type(2)').value,
        fecha: citasForm.querySelector('input[type="date"]').value,
        hora: citasForm.querySelector('input[type="time"]').value,
        createdAt: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('pm_citas') || '[]');
      arr.push(data);
      localStorage.setItem('pm_citas', JSON.stringify(arr));
      alert('Cita guardada ✓');
      window.location.href = 'dashboard.html';
    });
  }

  // Si estamos en admin, cargar tabla de citas
  if (window.location.pathname.includes('admin.html')) {
    renderAdminCitas();
    renderPersonalList();
  }

  function renderAdminCitas() {
    const tbody = document.querySelector('#admin-citas-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const arr = JSON.parse(localStorage.getItem('pm_citas') || '[]');
    if (arr.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No hay citas programadas</td></tr>';
      return;
    }
    arr.forEach((c, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.fecha} ${c.hora || ''}</td>
        <td>${c.mascota}</td>
        <td>${c.createdAt ? (new Date(c.createdAt)).toLocaleString() : '-'}</td>
        <td>
          <button class="btn" onclick="iniciarCita(${i})">Iniciar</button>
          <button class="btn" onclick="finalizarCita(${i})">Finalizar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  window.iniciarCita = function(index) {
    alert(`Cita ${index+1} iniciada (simulado)`);
  };

  window.finalizarCita = function(index) {
    alert(`Cita ${index+1} finalizada — dirigiendo a formulario de tratamiento`);
    window.location.href = 'tratamientos.html';
  };

  // Admin: guardar tratamiento desde admin tab
  window.guardarTratamientoAdmin = function() {
    const form = document.getElementById('admin-trat-form');
    if (!form) return;
    const data = {
      cliente: form.cliente.value,
      mascota: form.mascota.value,
      procedimientos: form.procedimientos.value,
      observaciones: form.observaciones.value,
      medicamentos: form.medicamentos.value,
      profesional: form.profesional.value,
      at: new Date().toISOString()
    };
    const arr = JSON.parse(localStorage.getItem('pm_tratamientos') || '[]');
    arr.push(data);
    localStorage.setItem('pm_tratamientos', JSON.stringify(arr));
    alert('Tratamiento guardado ✓');
    showAdminTab('tab-citas');
  };

  // tratamientos.html: guardar tratamiento y generar reporte simple
  const btnGuardarTrat = document.getElementById('btn-guardar-trat');
  if (btnGuardarTrat) {
    btnGuardarTrat.addEventListener('click', () => {
      const form = document.getElementById('form-tratamiento');
      const procedimientos = Array.from(form.querySelectorAll('input[name="proc"]:checked')).map(i=>i.value);
      const data = {
        procedimientos,
        observaciones: form.observaciones.value,
        medicamentos: form.medicamentos.value,
        recomendaciones: form.recomendaciones.value,
        profesional: form.profesional.value,
        at: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('pm_tratamientos') || '[]');
      arr.push(data);
      localStorage.setItem('pm_tratamientos', JSON.stringify(arr));
      alert('Tratamiento guardado ✓');
      window.location.href = 'admin.html';
    });
  }

  // Admin: personal
  window.agregarPersonal = function() {
    const form = document.getElementById('add-personal-form');
    if (!form) return;
    const nombre = form.nombre.value;
    const especialidad = form.especialidad.value;
    if (!nombre) { alert('Ingrese nombre'); return; }
    const arr = JSON.parse(localStorage.getItem('pm_personal') || '[]');
    arr.push({nombre, especialidad});
    localStorage.setItem('pm_personal', JSON.stringify(arr));
    renderPersonalList();
    form.reset();
  };

  function renderPersonalList() {
    const list = document.getElementById('personal-list');
    if (!list) return;
    const arr = JSON.parse(localStorage.getItem('pm_personal') || '[]');
    list.innerHTML = arr.length ? arr.map(p => `<div class="list-item">${p.nombre} — ${p.especialidad}</div>`).join('') : '<p>No hay personal registrado</p>';
  }

  // Reportes (simples)
  window.generarReporte = function(tipo) {
    let data = [];
    if (tipo === 'citas') data = JSON.parse(localStorage.getItem('pm_citas') || '[]');
    if (tipo === 'tratamientos') data = JSON.parse(localStorage.getItem('pm_tratamientos') || '[]');
    const content = `${tipo.toUpperCase()} - ${new Date().toLocaleString()}\n\n` + JSON.stringify(data, null, 2);
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${tipo}_reporte.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  // Tabs helper
  window.showAdminTab = function(id) {
    document.querySelectorAll('.admin-tab').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  };

  // Optimizar ruta (simulado)
  const btnOpt = document.getElementById('btn-optimizar');
  if (btnOpt) btnOpt.addEventListener('click', () => alert('Rutas optimizadas (simulación).'));
});
