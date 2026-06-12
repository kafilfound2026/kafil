let currentFilter = "all";
let currentPage = 1;
const PAGE_SIZE = 4;

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderCards();
  bindFilters();
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

function filteredCases() {
  if (currentFilter === "all") return CASES;
  if (currentFilter === "waiting") return CASES.filter(caseItem => caseItem.status === "waiting");
  if (currentFilter === "done") return CASES.filter(caseItem => caseItem.status === "done");
  return CASES;
}

function renderCards() {
  const grid = document.getElementById("cards-grid");
  const cases = filteredCases();
  const total = cases.length;
  const pages = Math.ceil(total / PAGE_SIZE) || 1;
  currentPage = Math.min(currentPage, pages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = cases.slice(start, start + PAGE_SIZE);

  document.getElementById("btn-prev").disabled = currentPage <= 1;
  document.getElementById("btn-next").disabled = currentPage >= pages;
  document.getElementById("page-info").textContent = `الصفحة ${currentPage} من ${pages}`;

  if (paged.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>لا توجد حالات متاحة حاليًا. عد لاحقًا لرؤية التحديثات.</p>
      </div>`;
    return;
  }

  grid.innerHTML = paged.map(caseItem => `
    
    <div class="case-card">
      <div class="card-header">
        <span class="card-id">${caseItem.id}</span>
        <span class="card-status ${caseItem.status === 'waiting' ? 'waiting' : 'done'}">
          ${caseItem.status === 'حالة مكفولة' ? '⏳ بانتظار الكفالة' : '✅ مكفولة'}
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
  `).join("");
}

function bindFilters() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      currentPage = 1;
      renderCards();
    });
  });
}

function changePage(direction) {
  currentPage += direction;
  renderCards();
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div class="detail-icon">🏷️</div>
      <div class="detail-text"><strong>التصنيف</strong><span>${caseItem.category}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-icon">💰</div>
      <div class="detail-text"><strong>مبلغ الكفالة المطلوب</strong><span>${caseItem.amount}$ شهرياً</span></div>
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
