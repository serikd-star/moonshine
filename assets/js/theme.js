/**
 * Переключатель темы оформления
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'moonshine-theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'brown';
  }

  function setTheme(name) {
    name = name === 'steel' ? 'steel' : 'brown';
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem(STORAGE_KEY, name);
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === name);
    });
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'steel' || saved === 'brown') {
      setTheme(saved);
    }
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(btn.getAttribute('data-theme'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
