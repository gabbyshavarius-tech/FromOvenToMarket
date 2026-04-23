// =============================================
// KONFIGURASI — Ganti dengan URL Apps Script kamu
// =============================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwX-oR1P0T1I-e9vjtEaDl6jrJGGRX1wEp2nYj2CZjnicEh9m43OsEBXn9KVp3nFIUP/exec";

// =============================================
// FORM SUBMISSION (index.html)
// =============================================
const form = document.getElementById("submission-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    const judul = document.getElementById("judul").value.trim();
    const link = document.getElementById("link").value.trim();
    const deskripsi = document.getElementById("deskripsi").value.trim();

    // Reset errors
    hideAlerts();
    clearErrors();

    // Validasi
    let valid = true;

    if (!nama) { showError("err-nama"); valid = false; }
    if (!kelas) { showError("err-kelas"); valid = false; }
    if (!judul) { showError("err-judul"); valid = false; }
    if (!link || !isValidURL(link)) { showError("err-link"); valid = false; }

    if (!valid) return;

    // Loading state
    setLoading(true);

    const payload = { nama, kelas, judul, link, deskripsi };

    try {
      await submitViaIframe(payload);

      document.getElementById("alert-success").classList.remove("hidden");
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      showGlobalError("Gagal mengirim data. Periksa koneksi atau URL Apps Script.");
    } finally {
      setLoading(false);
    }
  });
}

// =============================================
// GALLERY (gallery.html)
// =============================================
async function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  const loading = document.getElementById("loading");
  const errorEl = document.getElementById("gallery-error");
  const emptyEl = document.getElementById("gallery-empty");

  if (!grid) return;

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getAll`, { method: "GET" });
    const result = await res.json();

    loading.classList.add("hidden");

    if (!result.data || result.data.length === 0) {
      emptyEl.classList.remove("hidden");
      return;
    }

    result.data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition";

      card.innerHTML = `
        <div>
          <span class="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">${escapeHtml(item.kelas)}</span>
        </div>
        <h2 class="text-base font-bold text-gray-800 leading-snug">${escapeHtml(item.judul)}</h2>
        <p class="text-sm text-gray-500">oleh <span class="font-medium text-gray-700">${escapeHtml(item.nama)}</span></p>
        ${item.deskripsi ? `<p class="text-sm text-gray-600 line-clamp-3">${escapeHtml(item.deskripsi)}</p>` : ""}
        <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer"
          class="mt-auto inline-block text-sm text-blue-500 hover:text-blue-700 font-medium underline break-all">
          🔗 Lihat Project
        </a>
        <p class="text-xs text-gray-400">${item.tanggal || ""}</p>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    loading.classList.add("hidden");
    errorEl.classList.remove("hidden");
  }
}

// =============================================
// HELPERS
// =============================================
function isValidURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function showError(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function clearErrors() {
  ["err-nama", "err-kelas", "err-judul", "err-link"].forEach((id) => {
    document.getElementById(id)?.classList.add("hidden");
  });
}

function hideAlerts() {
  document.getElementById("alert-success")?.classList.add("hidden");
  document.getElementById("alert-error")?.classList.add("hidden");
}

function showGlobalError(msg) {
  const el = document.getElementById("alert-error");
  document.getElementById("error-message").textContent = msg;
  el.classList.remove("hidden");
}

function setLoading(state) {
  const btn = document.getElementById("submit-btn");
  const text = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spinner");

  btn.disabled = state;
  text.textContent = state ? "Mengirim..." : "Kirim Karya";
  spinner.classList.toggle("hidden", !state);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str || ""));
  return div.innerHTML;
}

// Kirim data via hidden form + iframe untuk bypass CORS
function submitViaIframe(payload) {
  return new Promise((resolve, reject) => {
    // Buat iframe tersembunyi sebagai target form
    const iframe = document.createElement("iframe");
    iframe.name = "hidden-iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Buat form tersembunyi
    const hiddenForm = document.createElement("form");
    hiddenForm.method = "GET";
    hiddenForm.action = APPS_SCRIPT_URL;
    hiddenForm.target = "hidden-iframe";

    // Tambah semua field + action
    const fields = { ...payload, action: "submit" };
    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = val;
      hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);

    // Submit dan tunggu sebentar (Apps Script butuh ~2 detik)
    hiddenForm.submit();

    setTimeout(() => {
      document.body.removeChild(hiddenForm);
      document.body.removeChild(iframe);
      resolve();
    }, 2500);
  });
}
