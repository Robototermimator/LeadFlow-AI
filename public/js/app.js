function toggleMenu() {
  var nav = document.getElementById('top-nav');
  if (!nav) return;
  nav.classList.toggle('open');
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('copy-btn')) {
    var value = event.target.getAttribute('data-copy') || '';
    navigator.clipboard.writeText(value).then(function () {
      event.target.textContent = 'Copied';
      setTimeout(function () { event.target.textContent = event.target.textContent.includes('Follow-up') ? 'Copy Follow-up' : 'Copy Outreach'; }, 1000);
    });
  }

  if (event.target && event.target.id === 'generate-btn') {
    event.target.textContent = 'Generating...';
    event.target.disabled = true;
  }
});
