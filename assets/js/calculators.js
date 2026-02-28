/**
 * Калькуляторы для домашнего самогоноварения
 */

(function () {
  'use strict';

  // ——— 1. Разбавление спирта ———
  // Вода (л) = V * (ABV_current / ABV_target - 1)
  function calcDilution() {
    var volume = parseFloat(document.getElementById('dil-volume').value) || 0;
    var abvCurrent = parseFloat(document.getElementById('dil-abv-current').value) || 0;
    var abvTarget = parseFloat(document.getElementById('dil-abv-target').value) || 0;

    var resultEl = document.getElementById('dil-result');
    if (!volume || !abvCurrent || !abvTarget || abvTarget >= abvCurrent) {
      resultEl.innerHTML = '<span class="hint">Введите объём (л), текущую и целевую крепость (%). Целевая должна быть меньше текущей.</span>';
      return;
    }

    var waterL = volume * (abvCurrent / abvTarget - 1);
    var finalL = volume + waterL;
    resultEl.innerHTML =
      'Добавить воды: <span class="value">' + waterL.toFixed(2) + ' л</span>' +
      '<span class="hint">Итого объём: ' + finalL.toFixed(2) + ' л при ' + abvTarget + '%</span>';
  }

  function setupDilution() {
    ['dil-volume', 'dil-abv-current', 'dil-abv-target'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcDilution);
    });
    calcDilution();
  }

  // ——— 2. Сахар → теоретический спирт ———
  // ~0.64 л чистого спирта с 1 кг сахара (при 100% сбраживании)
  function calcSugar() {
    var sugarKg = parseFloat(document.getElementById('sugar-kg').value) || 0;
    var volumeL = parseFloat(document.getElementById('sugar-volume').value) || 0;

    var resultEl = document.getElementById('sugar-result');
    if (!sugarKg) {
      resultEl.innerHTML = '<span class="hint">Введите количество сахара (кг).</span>';
      return;
    }

    var pureAlcoholL = sugarKg * 0.64;
    var abvTheoretical = volumeL > 0 ? (pureAlcoholL / volumeL) * 100 : 0;
    resultEl.innerHTML =
      'Теоретический выход спирта: <span class="value">' + (pureAlcoholL * 1000).toFixed(0) + ' мл</span> (' + pureAlcoholL.toFixed(2) + ' л 100%)' +
      (volumeL > 0 ? '<span class="hint">Крепость браги при полном сбраживании: ~' + abvTheoretical.toFixed(1) + '%</span>' : '');
  }

  function setupSugar() {
    ['sugar-kg', 'sugar-volume'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcSugar);
    });
    calcSugar();
  }

  // ——— 3. Крепость по ареометру (плотность до/после брожения) ———
  // ABV ≈ (OG - FG) * 131.25 (для SG); для упрощения вводим плотность в формате 1.08 → 1.08
  function calcHydrometer() {
    var og = parseFloat(document.getElementById('hyd-og').value) || 0;
    var fg = parseFloat(document.getElementById('hyd-fg').value) || 0;

    var resultEl = document.getElementById('hyd-result');
    if (!og || !fg || fg >= og) {
      resultEl.innerHTML = '<span class="hint">Введите начальную (OG) и конечную (FG) плотность. FG должна быть меньше OG.</span>';
      return;
    }

    var abv = (og - fg) * 131.25;
    if (abv < 0) abv = 0;
    resultEl.innerHTML =
      'Крепость браги: <span class="value">~' + abv.toFixed(1) + '%</span>' +
      '<span class="hint">Формула: (OG − FG) × 131.25. Плотность в формате 1.050.</span>';
  }

  function setupHydrometer() {
    ['hyd-og', 'hyd-fg'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcHydrometer);
    });
    calcHydrometer();
  }

  // ——— 4. Чистый спирт из объёма и крепости ———
  function calcPureAlcohol() {
    var volumeL = parseFloat(document.getElementById('pa-volume').value) || 0;
    var abv = parseFloat(document.getElementById('pa-abv').value) || 0;

    var resultEl = document.getElementById('pa-result');
    if (!volumeL || !abv) {
      resultEl.innerHTML = '<span class="hint">Введите объём (л) и крепость (%).</span>';
      return;
    }

    var pureL = (volumeL * abv) / 100;
    var pureMl = Math.round(pureL * 1000);
    resultEl.innerHTML =
      'Чистого спирта (100%): <span class="value">' + pureMl + ' мл</span> (' + pureL.toFixed(2) + ' л)' +
      '<span class="hint">Объём × крепость / 100</span>';
  }

  function setupPureAlcohol() {
    ['pa-volume', 'pa-abv'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcPureAlcohol);
    });
    calcPureAlcohol();
  }

  // Инициализация при загрузке
  function init() {
    setupDilution();
    setupSugar();
    setupHydrometer();
    setupPureAlcohol();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
