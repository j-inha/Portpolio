document.addEventListener("DOMContentLoaded", function () {
  // 필터 버튼
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const categories = item.dataset.category.split(" ");
        item.style.display = (filter === 'all' || categories.includes(filter)) ? '' : 'none';
      });
    });
  });

  // 프로젝트(모달형) – 외부 파일 불러오기
  document.querySelectorAll('.portfolio-item[data-modal]').forEach(item => {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      const modalId = item.getAttribute('data-modal');
      showModal('generic-modal', `modal-${modalId}.html`);
    });
  });

  // 모델링/픽셀 – 이미지 확대 모달 (data-modal 없을 때)
  document.querySelectorAll('.portfolio-item:not([data-modal])').forEach(item => {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      const title = item.querySelector('h3') ? item.querySelector('h3').textContent : '';
      const desc = item.querySelector('p') ? item.querySelector('p').textContent : '';
      showSimpleModal(img.src, title, desc);
    });
  });

  // 외부 파일로 프로젝트 모달
  function showModal(modalId, url) {
    const modalBg = document.getElementById(modalId);
    fetch(url)
      .then(res => res.text())
      .then(html => {
        modalBg.innerHTML = html;
        modalBg.style.display = "flex";
        setModalEvents(modalBg);
      });
  }

  // 간단 이미지+텍스트 모달
  function showSimpleModal(imgSrc, title, desc) {
    const modalBg = document.getElementById('generic-modal');
    modalBg.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img src="${imgSrc}" alt="${title}">
        <h2 style="margin-bottom:0.6rem;">${title}</h2>
        <p style="font-size:1.1rem;">${desc}</p>
      </div>
    `;
    modalBg.style.display = "flex";
    setModalEvents(modalBg);
  }

  // 공통: 닫기 이벤트 등록
  function setModalEvents(modalBg) {
    const closeBtn = modalBg.querySelector('.modal-close');
    if (closeBtn) closeBtn.onclick = () => { modalBg.style.display = "none"; modalBg.innerHTML = ''; };
    modalBg.onclick = (e) => {
      if (e.target === modalBg) {
        modalBg.style.display = "none";
        modalBg.innerHTML = '';
      }
    };
    // ESC 키로 닫기 추가
    document.onkeydown = function(e) {
      if (e.key === "Escape") {
        modalBg.style.display = "none";
        modalBg.innerHTML = '';
        document.onkeydown = null;
      }
    }
  }
});
