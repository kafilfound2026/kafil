document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderCards();
});

function updateStats() {
  const waiting = CASES.filter(caseItem => caseItem.status === "waiting").length;
  const done = CASES.filter(caseItem => caseItem.status === "done").length;
  animateCount("count-total", CASES.length);
  animateCount("count-waiting", waiting);
  animateCount("count-done", done);
}

function animateCount(id, target) {
  const element = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.round(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    element.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

function renderCard(caseItem) {
  return `
    <div class="case-card">
      <div class="card-header">
        <span class="card-id">${caseItem.id}</span>
        <span class="card-status ${caseItem.status === 'waiting' ? 'waiting' : 'done'}">
          ${caseItem.status === 'waiting' ? '⏳ بانتظار الكفالة' : '✅ مكفولة'}
        </span>
      </div>
      <div class="card-body">
        <div class="card-name">${caseItem.name}</div>
        <div class="card-desc">${caseItem.description}</div>
        <div class="card-amount">💰 الهدف: ${caseItem.amount}$</div>
      </div>
      <div class="card-footer">
        <button class="btn-details" onclick='openModal(${JSON.stringify(caseItem)})'>التفاصيل</button>
      </div>
    </div>
  `;
}

function renderCards() {
  const orphansGrid = document.getElementById("orphans-grid");
  const widowsGrid = document.getElementById("widows-grid");

  const orphans = CASES.filter(caseItem => caseItem.category === "يتيمة");
  const widows = CASES.filter(caseItem => caseItem.category === "أرملة");

  orphansGrid.innerHTML = orphans.length > 0 
    ? orphans.map(renderCard).join("") 
    : `<div class="empty-state"><div class="empty-icon">🔍</div><p>لا توجد حالات أيتام متاحة حاليًا.</p></div>`;

  widowsGrid.innerHTML = widows.length > 0 
    ? widows.map(renderCard).join("") 
    : `<div class="empty-state"><div class="empty-icon">🔍</div><p>لا توجد حالات أرامل متاحة حاليًا.</p></div>`;
}

function openModal(caseItem) {
  document.getElementById("modal-title").textContent = caseItem.name;
  document.getElementById("modal-body").innerHTML = `
    <div class="detail-row">
      <div class="detail-icon">🆔</div>
      <div class="detail-text"><strong>رقم الحالة</strong><span>${caseItem.id}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-icon">📍</div>
      <div class="detail-text"><strong>المدينة</strong><span>${caseItem.city}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-icon">💰</div>
      <div class="detail-text"><strong>مبلغ الكفالة المطلوب</strong><span>${caseItem.amount}$ لثلاثة أشهر</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-icon">📝</div>
      <div class="detail-text"><strong>الوصف التفصيلي</strong><span>${caseItem.details}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-icon">📊</div>
      <div class="detail-text"><strong>الحالة</strong>
        <span>${caseItem.status === 'waiting' ? '⏳ بانتظار كفيل' : '✅ تمت الكفالة'}</span>
      </div>
    </div>
  `;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal(event) {
  if (event.target === document.getElementById("modal-overlay")) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById("modal-overlay").classList.remove("open");
}
