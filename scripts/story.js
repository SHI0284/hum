// 첫 화면 문구: 방문할 때마다 두 가지 중 하나를 무작위로 선택합니다.
(() => {
  const headings = [
    '<em>일상의 소리</em>를,<br />나만의 형태로.',
    '귀 기울인 순간을,<br />감각으로 <em>남기다</em>',
  ];
  document.getElementById('hero-title').innerHTML =
    headings[Math.floor(Math.random() * headings.length)];

  // 스크롤 위치에 비례해 원을 0~90%까지 채웁니다. 위로 돌아가면 되감깁니다.
  const story = document.getElementById('story');
  const fill = story.querySelector('.pie-fill');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  function paintPie() {
    const rect = story.getBoundingClientRect();
    const progress = motionPreference.matches
      ? 1
      : Math.min(1, Math.max(0, (innerHeight * 0.9 - rect.top) / (innerHeight * 0.65)));
    fill.setAttribute('stroke-dasharray', `${progress * 90} 100`);
    pending = false;
  }
  function queuePie() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(paintPie);
    }
  }
  window.addEventListener('scroll', queuePie, { passive: true });
  window.addEventListener('resize', queuePie);
  motionPreference.addEventListener('change', queuePie);
  paintPie();

  // 네 가지 감각: 클릭/키보드로 그래픽을 펼치고 다시 누르면 돌아옵니다.
  document.querySelectorAll('.values-grid figure').forEach((card) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'value-toggle';
    button.setAttribute(
      'aria-label',
      card.querySelector('figcaption').textContent.trim() + ' 그래픽 움직이기'
    );
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const active = card.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(active));
    });
    card.append(button);
  });

  // 터치에서는 탭, 키보드에서는 포커스/Enter로 실제 사진을 확인합니다.
  document.querySelectorAll('.poster-reveal').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.closest('figure').classList.toggle('is-revealed');
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? '실루엣 보기' : '실제 캠페인 사진 보기');
    });
  });
})();
