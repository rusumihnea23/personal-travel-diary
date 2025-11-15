  const themeButton = document.getElementById('Theme-Button');
  const aboutButton = document.getElementById('About-Button');
  const body = document.body;

  // Theme-button
  themeButton.addEventListener('click', () => {
    body.classList.toggle('darkmode');
    if (body.classList.contains('darkmode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // About-button opens popup
  aboutButton.addEventListener('click', () => {
    const aboutModal = new bootstrap.Modal(document.getElementById('aboutPopup'));
    aboutModal.show();
  });

