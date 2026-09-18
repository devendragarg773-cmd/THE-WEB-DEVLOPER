// ==========================================
// THE WEB DEVELOPER
// COMPLETE PROJECT MANAGEMENT
// ==========================================

let projects = JSON.parse(
  localStorage.getItem("twd_projects") || "[]"
);

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// ==========================================
// SAVE DATA
// ==========================================

function saveData() {
  localStorage.setItem("twd_projects", JSON.stringify(projects));
  updateStats();
}

// ==========================================
// STATS
// ==========================================

function updateStats() {
  const sales = projects.filter(p => p.status === "Sold");
  const customers = uniqueCustomers();
  const favorites = projects.filter(p => p.favorite);

  document.getElementById("websiteCount").textContent = projects.length;
  document.getElementById("saleCount").textContent = sales.length;
  document.getElementById("customerCount").textContent = customers.length;
  document.getElementById("favoriteCount").textContent = favorites.length;
}

function uniqueCustomers() {
  const map = new Map();

  projects.forEach(p => {
    if (p.buyerName && p.buyerMobile) {
      map.set(p.buyerMobile, {
        name: p.buyerName,
        mobile: p.buyerMobile
      });
    }
  });

  return [...map.values()];
}

// ==========================================
// MODAL
// ==========================================

function openModal() {
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

window.onclick = function(e) {
  if (e.target === modal) {
    closeModal();
  }
};

// ==========================================
// WEBSITE SECTION
// ==========================================

function showWebsites() {
  openModal();

  modalContent.innerHTML = `
    <h2 class="modal-title">🌐 MY TOTAL WEBSITES</h2>

    <input
      class="search"
      id="websiteSearch"
      placeholder="Search website by name..."
      oninput="renderWebsites()"
    >

    <div id="websiteList"></div>
  `;

  renderWebsites();
}

function renderWebsites() {
  const search = document
    .getElementById("websiteSearch")
    .value
    .toLowerCase();

  const list = projects.filter(p =>
    p.websiteName.toLowerCase().includes(search)
  );

  const container = document.getElementById("websiteList");

  if (!list.length) {
    container.innerHTML = `<div class="empty">No website found.</div>`;
    return;
  }

  container.innerHTML = list.map(p => {

    const index = projects.indexOf(p);

    return `
      <div class="item">

        <h3>${escapeHTML(p.websiteName)}</h3>

        <span class="badge">${escapeHTML(p.category || "Website")}</span>

        <p><b>Status:</b> ${escapeHTML(p.status)}</p>

        <p><b>Actual Price:</b> ₹${escapeHTML(p.actualPrice)}</p>

        ${
          p.soldPrice
          ? `<p><b>Sold Price:</b> ₹${escapeHTML(p.soldPrice)}</p>`
          : ""
        }

        ${
          p.websiteURL
          ? `<p><b>Website:</b>
             <a href="${escapeHTML(p.websiteURL)}"
                target="_blank"
                style="color:#00e5ff">
                Open Website
             </a>
             </p>`
          : ""
        }

        ${
          p.description
          ? `<p>${escapeHTML(p.description)}</p>`
          : ""
        }

        <div class="item-actions">

          <button
            class="action-btn favorite-btn"
            onclick="toggleFavorite(${index})">
            ${p.favorite ? "⭐ Favorite" : "☆ Add Favorite"}
          </button>

          <button
            class="action-btn"
            onclick="editProject(${index})">
            ✏️ Edit
          </button>

          <button
            class="action-btn delete-btn"
            onclick="deleteProject(${index})">
            🗑️ Delete
          </button>

        </div>

      </div>
    `;
  }).join("");
}

// ==========================================
// SALES
// ==========================================

function showSales() {
  openModal();

  modalContent.innerHTML = `
    <h2 class="modal-title">💰 TOTAL SELL</h2>

    <input
      class="search"
      id="saleSearch"
      placeholder="Search website or buyer..."
      oninput="renderSales()"
    >

    <div id="saleList"></div>
  `;

  renderSales();
}

function renderSales() {
  const search = document
    .getElementById("saleSearch")
    .value
    .toLowerCase();

  const sales = projects.filter(p =>
    p.status === "Sold" &&
    (
      p.websiteName.toLowerCase().includes(search) ||
      (p.buyerName || "").toLowerCase().includes(search)
    )
  );

  const container = document.getElementById("saleList");

  if (!sales.length) {
    container.innerHTML = `<div class="empty">No sold website found.</div>`;
    return;
  }

  container.innerHTML = sales.map(p => `
    <div class="item">
      <h3>🌐 ${escapeHTML(p.websiteName)}</h3>
      <p>👤 Buyer: ${escapeHTML(p.buyerName || "Not added")}</p>
    </div>
  `).join("");
}

// ==========================================
// CUSTOMERS
// ==========================================

function showCustomers() {
  openModal();

  modalContent.innerHTML = `
    <h2 class="modal-title">👥 CUSTOMERS</h2>

    <input
      class="search"
      id="customerSearch"
      placeholder="Search customer by name..."
      oninput="renderCustomers()"
    >

    <div id="customerList"></div>
  `;

  renderCustomers();
}

function renderCustomers() {
  const search = document
    .getElementById("customerSearch")
    .value
    .toLowerCase();

  const customers = uniqueCustomers().filter(c =>
    c.name.toLowerCase().includes(search)
  );

  const container = document.getElementById("customerList");

  if (!customers.length) {
    container.innerHTML = `<div class="empty">No customer found.</div>`;
    return;
  }

  container.innerHTML = customers.map(c => `
    <div class="item">
      <h3>👤 ${escapeHTML(c.name)}</h3>
      <p>📱 Mobile: ${escapeHTML(c.mobile)}</p>
    </div>
  `).join("");
}

// ==========================================
// FAVORITES
// ==========================================

function showFavorites() {
  openModal();

  const favorites = projects.filter(p => p.favorite);

  modalContent.innerHTML = `
    <h2 class="modal-title">⭐ FAVORITE PROJECTS</h2>

    <div id="favoriteList"></div>
  `;

  const container = document.getElementById("favoriteList");

  if (!favorites.length) {
    container.innerHTML = `
      <div class="empty">
        No favorite projects yet.
      </div>
    `;
    return;
  }

  container.innerHTML = favorites.map(p => `
    <div class="item">
      <h3>⭐ ${escapeHTML(p.websiteName)}</h3>
      <p>Category: ${escapeHTML(p.category || "Website")}</p>
      <p>Status: ${escapeHTML(p.status)}</p>
    </div>
  `).join("");
}

// ==========================================
// ADD NEW - ONE COMPLETE FORM
// ==========================================

function showAddForm(editIndex = null) {
  openModal();

  const edit = editIndex !== null ? projects[editIndex] : null;

  modalContent.innerHTML = `
    <h2 class="modal-title">
      ${edit ? "✏️ EDIT PROJECT" : "➕ ADD NEW PROJECT"}
    </h2>

    <form
      class="form"
      onsubmit="saveProject(event, ${editIndex})"
    >

      <div class="form-group">
        <label>Website Name *</label>
        <input
          class="form-input"
          id="websiteName"
          required
          value="${edit ? escapeHTML(edit.websiteName) : ""}"
          placeholder="Example: Shiv Fashion Website"
        >
      </div>

      <div class="form-group">
        <label>Website Category</label>
        <input
          class="form-input"
          id="category"
          value="${edit ? escapeHTML(edit.category || "") : ""}"
          placeholder="E-commerce / Portfolio / Business..."
        >
      </div>

      <div class="form-group">
        <label>Actual Price *</label>
        <input
          class="form-input"
          id="actualPrice"
          type="number"
          min="0"
          required
          value="${edit ? escapeHTML(edit.actualPrice) : ""}"
          placeholder="Example: 15000"
        >
      </div>

      <div class="form-group">
        <label>Status *</label>

        <select class="form-select" id="status" required>
          <option value="Available"
            ${edit?.status === "Available" ? "selected" : ""}>
            Available
          </option>

          <option value="Sold"
            ${edit?.status === "Sold" ? "selected" : ""}>
            Sold
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Sold Price</label>
        <input
          class="form-input"
          id="soldPrice"
          type="number"
          min="0"
          value="${edit ? escapeHTML(edit.soldPrice || "") : ""}"
          placeholder="If sold, enter sold price"
        >
      </div>

      <div class="form-group">
        <label>Buyer / Customer Name</label>
        <input
          class="form-input"
          id="buyerName"
          value="${edit ? escapeHTML(edit.buyerName || "") : ""}"
          placeholder="Customer name"
        >
      </div>

      <div class="form-group">
        <label>Customer Mobile</label>
        <input
          class="form-input"
          id="buyerMobile"
          type="tel"
          value="${edit ? escapeHTML(edit.buyerMobile || "") : ""}"
          placeholder="10 digit mobile number"
        >
      </div>

      <div class="form-group">
        <label>Live Website Link</label>
        <input
          class="form-input"
          id="websiteURL"
          type="url"
          value="${edit ? escapeHTML(edit.websiteURL || "") : ""}"
          placeholder="https://example.com"
        >
      </div>

      <div class="form-group">
        <label>Project Information</label>
        <textarea
          id="description"
          placeholder="Write complete information about this website..."
        >${edit ? escapeHTML(edit.description || "") : ""}</textarea>
      </div>

      <div class="form-group">
        <label>
          <input
            type="checkbox"
            id="favorite"
            ${edit?.favorite ? "checked" : ""}
          >
          ⭐ Add to Favorite Projects
        </label>
      </div>

      <button class="submit-btn" type="submit">
        ${edit ? "💾 UPDATE & SAVE" : "🚀 SUBMIT & SAVE"}
      </button>

    </form>
  `;
}

// ==========================================
// SAVE COMPLETE FORM
// ==========================================

function saveProject(event, editIndex) {
  event.preventDefault();

  const status = document.getElementById("status").value;
  const buyerName = document.getElementById("buyerName").value.trim();
  const buyerMobile = document.getElementById("buyerMobile").value.trim();
  const soldPrice = document.getElementById("soldPrice").value.trim();

  if (status === "Sold") {

    if (!buyerName) {
      alert("Sold website ke liye Buyer / Customer Name bharna zaroori hai.");
      return;
    }

    if (!soldPrice) {
      alert("Sold website ke liye Sold Price bharna zaroori hai.");
      return;
    }

    if (!buyerMobile) {
      alert("Sold website ke liye Customer Mobile bharna zaroori hai.");
      return;
    }
  }

  const project = {
    websiteName: document.getElementById("websiteName").value.trim(),
    category: document.getElementById("category").value.trim(),
    actualPrice: document.getElementById("actualPrice").value.trim(),
    status: status,
    soldPrice: soldPrice,
    buyerName: buyerName,
    buyerMobile: buyerMobile,
    websiteURL: document.getElementById("websiteURL").value.trim(),
    description: document.getElementById("description").value.trim(),
    favorite: document.getElementById("favorite").checked,
    date: new Date().toLocaleDateString("en-IN")
  };

  if (editIndex === null) {
    projects.push(project);
    alert("✅ Complete project information successfully saved!");
  } else {
    projects[editIndex] = project;
    alert("✅ Project successfully updated!");
  }

  saveData();

  closeModal();
}

// ==========================================
// EDIT
// ==========================================

function editProject(index) {
  showAddForm(index);
}

// ==========================================
// DELETE
// ==========================================

function deleteProject(index) {

  const name = projects[index].websiteName;

  if (!confirm(`Delete "${name}"?`)) {
    return;
  }

  projects.splice(index, 1);

  saveData();

  showWebsites();
}

// ==========================================
// FAVORITE
// ==========================================

function toggleFavorite(index) {
  projects[index].favorite = !projects[index].favorite;

  saveData();

  showWebsites();
}

// ==========================================
// SECURITY FOR DISPLAY
// ==========================================

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// START
// ==========================================

updateStats();