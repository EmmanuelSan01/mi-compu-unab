(function () {
  var IMG ='https://cdn-icons-png.freepik.com/512/4617/4617648.png'
  var occupied = new Set();
  var reservations = {};
  var selected = null;
 
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function render() {
    var grid = document.getElementById('pc-grid');
    grid.innerHTML = '';
    for (var i = 0; i < 24; i++) {
      var num = i + 1;
      var isOcc = occupied.has(i);
      var isSel = selected === i;

      var div = document.createElement('div');
      div.className = 'pc-seat' + (isOcc ? ' occupied' : '') + (isSel ? ' selected' : '');
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', isOcc ? '-1' : '0');
      div.setAttribute('aria-label', 'PC-' + pad(num) + (isOcc ? ', ocupado' : isSel ? ', seleccionado' : ', disponible'));
      div.dataset.idx = i;

      var img = document.createElement('img');
      img.src = IMG;
      img.alt = '';
      div.appendChild(img);

      var lbl = document.createElement('span');
      lbl.className = 'pc-label';
      lbl.textContent = 'PC-' + pad(num);
      div.appendChild(lbl);

      if (!isOcc) {
        div.addEventListener('click', onSelect);
        div.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect.call(this); }
        });
      }
      grid.appendChild(div);
    }
    document.getElementById('avail-count').textContent = 24 - occupied.size;
    document.getElementById('btn-reserve').disabled = !(selected !== null && !occupied.has(selected));
  }

  function onSelect() {
    var idx = parseInt(this.dataset.idx, 10);
    selected = (selected === idx) ? null : idx;
    render();
  }

  document.getElementById('btn-reserve').addEventListener('click', function () {
    if (selected === null) return;
    document.getElementById('modal-pc-tag').textContent = 'PC-' + pad(selected + 1);
    document.getElementById('f-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal').classList.add('active');
    document.getElementById('f-fecha').focus();
  });

  function closeModal() { document.getElementById('modal').classList.remove('active'); }

  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  document.getElementById('btn-confirm').addEventListener('click', function () {
    var fecha  = document.getElementById('f-fecha').value;
    var hora   = document.getElementById('f-hora').value;
    var motivo = document.getElementById('f-motivo').value;
    if (!fecha) { alert('Selecciona una fecha.'); return; }
    reservations[selected] = { fecha: fecha, hora: hora, motivo: motivo };
    occupied.add(selected);
    var pcNum = pad(selected + 1);
    selected = null;
    closeModal();
    showToast('✓ Reserva confirmada — PC-' + pcNum + ' · ' + fecha + ' · ' + hora);
    render();
  });

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 4000);
  }

  render();
})();
