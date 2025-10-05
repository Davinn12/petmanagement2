/* js/main.js - funciones simples para formularios y admin */
document.addEventListener('DOMContentLoaded', () => {
  // actualizar resumen en citas si existe
  const formCita = document.getElementById('form-cita');
  if (formCita) {
    const mascota = formCita.querySelector('[name=mascota]');
    const servicio = formCita.querySelector('[name=servicio]');
    const fecha = formCita.querySelector('[name=fecha]');
    const hora = formCita.querySelector('[name=hora]');
    const prof = formCita.querySelector('[name=profesional]');
    const txtMascota = document.getElementById('txt-mascota');
    const txtServicio = document.getElementById('txt-servicio');
    const txtFecha = document.getElementById('txt-fecha');
    const txtProf = document.getElementById('txt-prof');

    function actualizarResumen(){
      txtMascota.textContent = 'Mascota: ' + (mascota.value || '—');
      txtServicio.textContent = 'Servicio: ' + (servicio.value || '—');
      txtFecha.textContent = 'Fecha: ' + ((fecha.value || '—') + (hora.value ? ' ' + hora.value : ''));
      txtProf.textContent = 'Profesional: ' + (prof.value || '—');
    }
    [mascota, servicio, fecha, hora, prof].forEach(el => el && el.addEventListener('input', actualizarResumen));
    actualizarResumen();

    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => {
        const cita = {
          mascota: mascota.value,
          servicio: servicio.value,
          fecha: fecha.value,
          hora: hora.value,
          profesional: prof.value,
          createdAt: new Date().toISOString()
        };
        const list = JSON.parse(localStorage.getItem('citas') || '[]');
        list.push(cita);
        localStorage.setItem('citas', JSON.stringify(list));
        alert('Cita confirmada ✓');
        window.location.href = 'dashboard.html';
      });
    }
  }

  // admin: tabs
  window.showAdminTab = function(tabId) {
    document.querySelectorAll('.admin-tab').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(tabId);
    if (el) el.classList.remove('hidden');
  };

  // admin: iniciar/finalizar cita
  window.iniciarCita = function(btn) {
    const row = btn.closest('tr');
    row.style.background = 'linear-gradient(90deg, rgba(76,175,80,0.06), transparent)';
    alert('Cita iniciada');
  };
  window.finalizarCita = function(btn) {
    const row = btn.closest('tr');
    row.style.opacity = '0.7';
    alert('Cita finalizada — abre registro de tratamiento si aplica');
    // redirigir a formulario de tratamiento
    window.location.href = 'tratamientos.html';
  };

  // admin: guardar tratamiento rápido
  window.guardarTratamientoAdmin = function() {
    const form = document.getElementById('admin-trat-form');
    if (!form) return;
    const data = {
      procedimientos: form.procedimientos.value,
      observaciones: form.observaciones.value,
      medicamentos: form.medicamentos.value,
      profesional: form.profesional.value,
      at: new Date().toISOString()
    };
    const arr = JSON.parse(localStorage.getItem('tratamientos') || '[]');
    arr.push(data);
    localStorage.setItem('tratamientos', JSON.stringify(arr));
    alert('Tratamiento guardado ✓');
    showAdminTab('citasDia');
  };

  // tratamientos.html: guardar tratamiento y generar reporte
  const btnGuardarTrat = document.getElementById('btn-guardar-trat');
  if (btnGuardarTrat){
    btnGuardarTrat.addEventListener('click', () => {
      const form = document.getElementById('form-tratamiento');
      const checkboxs = Array.from(form.querySelectorAll('input[name="proc"]:checked')).map(i=>i.value);
      const data = {
        procedimientos: checkboxs,
        observaciones: form.observaciones.value,
        medicamentos: form.medicamentos.value,
        recomendaciones: form.recomendaciones.value,
        profesional: form.profesional.value,
        at: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('tratamientos') || '[]');
      arr.push(data);
      localStorage.setItem('tratamientos', JSON.stringify(arr));
      alert('Tratamiento guardado ✓');
    });
  }

  const btnGenReporte = document.getElementById('btn-generar-reporte');
  if (btnGenReporte) {
    btnGenReporte.addEventListener('click', () => {
      const arr = JSON.parse(localStorage.getItem('tratamientos') || '[]');
      const last = arr[arr.length - 1] || {};
      const content = `Reporte de Tratamiento\n\n${JSON.stringify(last,null,2)}`;
      const blob = new Blob([content], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'reporte_tratamiento.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // rutas: optimizar (simulación)
  const btnOptimizar = document.getElementById('btn-optimizar');
  if (btnOptimizar) {
    btnOptimizar.addEventListener('click', () => {
      alert('Ruta optimizada (simulación). Se reordenaron las paradas para minimizar tiempo.');
    });
  }
});
