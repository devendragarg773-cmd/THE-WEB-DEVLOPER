/* =========================================================
   THE WEB DEVELOPER
   COMPLETE FRONTEND MANAGEMENT SYSTEM
========================================================= */


/* ================= LOGIN ================= */

const LOGIN_NAME = "DEVENDRA GARG";
const LOGIN_PASSWORD = "@ND0710";

function login(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("loginName").value.trim().toUpperCase();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  if (name === LOGIN_NAME && password === LOGIN_PASSWORD) {
    sessionStorage.setItem("twd_logged_in", "true");

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("mainWebsite").classList.remove("hidden");

    updateStats();
    return;
  }

  error.textContent = "❌ Name or password is incorrect.";
}

/* ENTER KEY LOGIN */
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const loginPage = document.getElementById("loginPage");

    if (
      loginPage &&
      !loginPage.classList.contains("hidden")
    ) {
      login(event);
    }
  }
});


/* ================= DATA ================= */

let projects = JSON.parse(
  localStorage.getItem("twd_projects") || "[]"
);

let policy = localStorage.getItem(
  "twd_private_policy"
) || `PRIVATE CUSTOMER POLICY

1. The customer information provided in this form is private.

2. Website/project information should be used only for the agreed project.

3. The customer confirms that the information provided by them is correct.

4. The customer confirms their agreement by signing below.

5. This document is maintained as project paperwork.`;


/* ================= ELEMENTS ================= */

const modal =
  document.getElementById("modal");

const modalContent =
  document.getElementById("modalContent");

const fullPage =
  document.getElementById("fullPage");

const fullPageContent =
  document.getElementById("fullPageContent");


/* ================= SAVE ================= */

function saveData() {

  localStorage.setItem(
    "twd_projects",
    JSON.stringify(projects)
  );

  localStorage.setItem(
    "twd_private_policy",
    policy
  );

  updateStats();
}


/* ================= STATS ================= */

function updateStats() {

  const realAndDemo =
    projects.length;

  const sales =
    projects.filter(
      p => p.type === "real" && p.status === "Sold"
    );

  const customers =
    uniqueCustomers();

  const favorites =
    projects.filter(
      p => p.favorite
    );

  document.getElementById(
    "websiteCount"
  ).textContent = realAndDemo;

  document.getElementById(
    "saleCount"
  ).textContent = sales.length;

  document.getElementById(
    "customerCount"
  ).textContent = customers.length;

  document.getElementById(
    "favoriteCount"
  ).textContent = favorites.length;
}


/* ================= CUSTOMERS ================= */

function uniqueCustomers() {

  const map = new Map();

  projects.forEach(project => {

    if (
      project.type === "real" &&
      project.customerName &&
      project.customerMobile
    ) {

      map.set(
        project.customerMobile,
        {
          name: project.customerName,
          mobile: project.customerMobile,
          projectId: project.id
        }
      );
    }
  });

  return [...map.values()];
}


/* ================= MODAL ================= */

function openModal() {

  modal.style.display = "block";

  document.body.style.overflow =
    "hidden";
}


function closeModal() {

  modal.style.display = "none";

  document.body.style.overflow =
    "auto";
}


window.addEventListener(
  "click",
  function(event) {

    if (event.target === modal) {
      closeModal();
    }

  }
);


/* ================= FULL PAGE ================= */

function openFullPage() {

  fullPage.classList.remove("hidden");

  document.body.style.overflow =
    "hidden";
}


function closeFullPage() {

  fullPage.classList.add("hidden");

  document.body.style.overflow =
    "auto";
}


/* ================= WEBSITE TYPE ================= */

function showWebsites() {

  openFullPage();

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      🌐 MY TOTAL WEBSITES
    </h1>

    <div class="type-buttons">

      <button
        class="type-card"
        onclick="showWebsiteList('demo')"
      >
        <strong>🧪 DEMO WEBSITES</strong>
        <span>View all demo projects</span>
      </button>

      <button
        class="type-card"
        onclick="showWebsiteList('real')"
      >
        <strong>🌐 REAL WEBSITES</strong>
        <span>View all real customer websites</span>
      </button>

    </div>
  `;
}


function showWebsiteList(type) {

  const title =
    type === "real"
      ? "🌐 REAL WEBSITES"
      : "🧪 DEMO WEBSITES";

  fullPageContent.innerHTML = `

    <button
      class="back-btn"
      onclick="showWebsites()"
    >
      ← Back
    </button>

    <h1 class="modal-title">
      ${title}
    </h1>

    <input
      class="search"
      id="websiteSearch"
      placeholder="Search website..."
      oninput="renderWebsiteList('${type}')"
    >

    <div id="websiteList"></div>
  `;

  renderWebsiteList(type);
}


function renderWebsiteList(type) {

  const searchInput =
    document.getElementById(
      "websiteSearch"
    );

  const search =
    searchInput
      ? searchInput.value.toLowerCase()
      : "";

  const list =
    projects.filter(
      p =>
        p.type === type &&
        (
          p.websiteName || ""
        )
        .toLowerCase()
        .includes(search)
    );

  const container =
    document.getElementById(
      "websiteList"
    );

  if (!list.length) {

    container.innerHTML = `
      <div class="empty">
        No ${type} website found.
      </div>
    `;

    return;
  }

  container.innerHTML =
    list.map(project => {

      const index =
        projects.findIndex(
          p => p.id === project.id
        );

      return `

        <div class="item">

          <h3>
            ${escapeHTML(project.websiteName)}
          </h3>

          <span class="badge">
            ${escapeHTML(
              project.category || "Website"
            )}
          </span>

          <p>
            <b>Price:</b>
            ₹${escapeHTML(project.price || "0")}
          </p>

          ${
            project.websiteURL
              ? `
                <p>
                  <a
                    href="${escapeHTML(project.websiteURL)}"
                    target="_blank"
                    style="color:#00e5ff"
                  >
                    🔗 Open Live Website
                  </a>
                </p>
              `
              : ""
          }

          ${
            project.customerName
              ? `
                <p>
                  <b>Customer:</b>
                  ${escapeHTML(project.customerName)}
                </p>
              `
              : ""
          }

          <p>
            ${escapeHTML(
              project.description || ""
            )}
          </p>

          <div class="item-actions">

            <button
              class="action-btn favorite-btn"
              onclick="toggleFavorite('${project.id}')"
            >
              ${
                project.favorite
                  ? "⭐ Favorite"
                  : "☆ Add Favorite"
              }
            </button>

          </div>

        </div>
      `;

    }).join("");
}


/* ================= SALES ================= */

function showSales() {

  openFullPage();

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      💰 TOTAL SELL
    </h1>

    <input
      class="search"
      id="saleSearch"
      placeholder="Search customer or website..."
      oninput="renderSales()"
    >

    <div id="saleList"></div>
  `;

  renderSales();
}


function renderSales() {

  const input =
    document.getElementById(
      "saleSearch"
    );

  const search =
    input
      ? input.value.toLowerCase()
      : "";

  const sales =
    projects.filter(
      p =>
        p.type === "real" &&
        p.status === "Sold" &&
        (
          (p.customerName || "")
            .toLowerCase()
            .includes(search) ||

          (p.websiteName || "")
            .toLowerCase()
            .includes(search)
        )
    );

  const container =
    document.getElementById(
      "saleList"
    );

  if (!sales.length) {

    container.innerHTML = `
      <div class="empty">
        No sold website found.
      </div>
    `;

    return;
  }

  container.innerHTML =
    sales.map((p, i) => `

      <div class="item">

        <p>
          <b>Sr No.:</b>
          ${i + 1}
        </p>

        <h3>
          ${escapeHTML(p.customerName)}
        </h3>

        <p>
          <b>Website:</b>
          ${escapeHTML(p.websiteName)}
        </p>

        <p>
          <b>Sold Price:</b>
          ₹${escapeHTML(p.soldPrice || p.price)}
        </p>

      </div>

    `).join("");
}


/* ================= CUSTOMERS ================= */

function showCustomers() {

  openFullPage();

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      👥 TOTAL CUSTOMER
    </h1>

    <input
      class="search"
      id="customerSearch"
      placeholder="Search customer..."
      oninput="renderCustomers()"
    >

    <div id="customerList"></div>
  `;

  renderCustomers();
}


function renderCustomers() {

  const input =
    document.getElementById(
      "customerSearch"
    );

  const search =
    input
      ? input.value.toLowerCase()
      : "";

  const customers =
    uniqueCustomers()
      .filter(
        c =>
          c.name
            .toLowerCase()
            .includes(search)
      );

  const container =
    document.getElementById(
      "customerList"
    );

  if (!customers.length) {

    container.innerHTML = `
      <div class="empty">
        No customer found.
      </div>
    `;

    return;
  }

  container.innerHTML =
    customers.map((customer, i) => `

      <div class="item">

        <p>
          <b>Sr No.:</b>
          ${i + 1}
        </p>

        <h3>
          👤 ${escapeHTML(customer.name)}
        </h3>

        <p>
          📱 ${escapeHTML(customer.mobile)}
        </p>

        <div class="item-actions">

          <button
            class="action-btn"
            onclick="showPaperwork('${customer.projectId}')"
          >
            📄 Paper Work
          </button>

        </div>

      </div>

    `).join("");
}


/* ================= PAPERWORK ================= */

function showPaperwork(projectId) {

  const project =
    projects.find(
      p => p.id === projectId
    );

  if (!project) return;

  openFullPage();

  fullPageContent.innerHTML = `

    <button
      class="back-btn"
      onclick="showCustomers()"
    >
      ← Back
    </button>

    <h1 class="modal-title">
      📄 CUSTOMER PAPER WORK
    </h1>

    <div class="item">

      <h3>
        ${escapeHTML(project.customerName)}
      </h3>

      <p>
        📱 ${escapeHTML(project.customerMobile)}
      </p>

      <p>
        🌐 ${escapeHTML(project.websiteName)}
      </p>

    </div>


    <div class="form">

      <div class="form-group">

        <label>
          Private Policy
        </label>

        <textarea
          id="policyEditor"
          class="policy-editor"
        >${escapeHTML(policy)}</textarea>

      </div>


      <button
        class="action-btn"
        onclick="savePolicy()"
      >
        💾 Save Private Policy
      </button>


      <div class="form-group">

        <label>
          Customer Signature
        </label>

        <div class="paperwork">
          ${
            project.signature
              ? `<img
                   src="${project.signature}"
                   style="max-width:100%;background:white;border-radius:10px"
                 >`
              : "No signature added yet."
          }
        </div>

        <button
          class="signature-open"
          onclick="openSignature('${project.id}')"
        >
          ✍️ Open Signature Page
        </button>

      </div>

    </div>
  `;
}


function savePolicy() {

  policy =
    document.getElementById(
      "policyEditor"
    ).value;

  saveData();

  alert("✅ Private policy saved.");
}


/* ================= ADD WEBSITE ================= */

function showAddWebsite() {

  openFullPage();

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      ➕ ADD NEW WEBSITE
    </h1>

    <div class="type-buttons">

      <button
        class="type-card"
        onclick="showAddForm('real')"
      >
        <strong>🌐 REAL WEBSITE</strong>
        <span>Add customer website</span>
      </button>

      <button
        class="type-card"
        onclick="showAddForm('demo')"
      >
        <strong>🧪 DEMO WEBSITE</strong>
        <span>Add demo project</span>
      </button>

    </div>
  `;
}


/* ================= ADD FORM ================= */

function showAddForm(type, editIndex = null) {

  const edit =
    editIndex !== null
      ? projects[editIndex]
      : null;

  const isReal =
    type === "real";

  fullPageContent.innerHTML = `

    <button
      class="back-btn"
      onclick="showAddWebsite()"
    >
      ← Back
    </button>

    <h1 class="modal-title">
      ${isReal
        ? "🌐 REAL WEBSITE"
        : "🧪 DEMO WEBSITE"}
    </h1>

    <form
      class="form"
      onsubmit="
        saveProject(event, '${type}', ${editIndex})
      "
    >

      <div class="form-group">
        <label>Website Name *</label>

        <input
          class="form-input"
          id="websiteName"
          required
          value="${
            edit
              ? escapeHTML(edit.websiteName)
              : ""
          }"
        >
      </div>


      <div class="form-group">
        <label>Website Category *</label>

        <input
          class="form-input"
          id="category"
          required
          value="${
            edit
              ? escapeHTML(edit.category)
              : ""
          }"
          placeholder="Business / Portfolio / E-commerce"
        >
      </div>


      <div class="form-group">
        <label>
          ${isReal ? "Sold Price" : "Price"} *
        </label>

        <input
          class="form-input"
          id="price"
          type="number"
          min="0"
          required
          value="${
            edit
              ? escapeHTML(edit.price)
              : ""
          }"
        >
      </div>


      ${
        isReal
          ? `

            <div class="form-group">

              <label>
                Live Website Link *
              </label>

              <input
                class="form-input"
                id="websiteURL"
                type="url"
                required
                value="${
                  edit
                    ? escapeHTML(edit.websiteURL || "")
                    : ""
                }"
                placeholder="https://example.com"
              >

            </div>


            <div class="form-group">

              <label>
                Customer Name *
              </label>

              <input
                class="form-input"
                id="customerName"
                required
                value="${
                  edit
                    ? escapeHTML(edit.customerName || "")
                    : ""
                }"
              >

            </div>


            <div class="form-group">

              <label>
                Customer Mobile *
              </label>

              <input
                class="form-input"
                id="customerMobile"
                type="tel"
                required
                value="${
                  edit
                    ? escapeHTML(edit.customerMobile || "")
                    : ""
                }"
              >

            </div>

          `
          : `
            <div class="form-group">

              <label>
                Live Website Link
              </label>

              <input
                class="form-input"
                id="websiteURL"
                type="url"
                value="${
                  edit
                    ? escapeHTML(edit.websiteURL || "")
                    : ""
                }"
              >

            </div>
          `
      }


      <div class="form-group">

        <label>
          Project Information
        </label>

        <textarea
          id="description"
          placeholder="Write project information..."
        >${
          edit
            ? escapeHTML(edit.description || "")
            : ""
        }</textarea>

      </div>


      ${
        isReal
          ? `

            <div class="form-group">

              <label>
                Private Policy
              </label>

              <textarea
                id="formPolicy"
                class="policy-editor"
              >${escapeHTML(policy)}</textarea>

            </div>


            <button
              type="button"
              class="signature-open"
              onclick="openSignatureForNewProject()"
            >
              ✍️ Customer Signature
            </button>


            <div
              id="newSignaturePreview"
              class="paperwork"
            >
              No signature added yet.
            </div>

          `
          : ""
      }


      <button
        class="submit-btn"
        type="submit"
      >
        🚀 SUBMIT & SAVE
      </button>

    </form>
  `;

  window.currentNewSignature =
    edit?.signature || null;
}


/* ================= SAVE PROJECT ================= */

function saveProject(
  event,
  type,
  editIndex
) {

  event.preventDefault();

  const websiteName =
    document
      .getElementById("websiteName")
      .value.trim();

  const category =
    document
      .getElementById("category")
      .value.trim();

  const price =
    document
      .getElementById("price")
      .value.trim();

  const websiteURL =
    document
      .getElementById("websiteURL")
      .value.trim();

  const description =
    document
      .getElementById("description")
      .value.trim();


  if (!websiteName || !category || !price) {

    alert(
      "Please fill all compulsory fields."
    );

    return;
  }


  const old =
    editIndex !== null
      ? projects[editIndex]
      : {};


  const project = {

    id:
      old.id ||
      Date.now().toString(),

    type,

    websiteName,

    category,

    price,

    websiteURL,

    description,

    favorite:
      old.favorite || false,

    signature:
      window.currentNewSignature ||
      old.signature ||
      null,

    date:
      old.date ||
      new Date().toLocaleDateString(
        "en-IN"
      ),

    status:
      type === "real"
        ? "Sold"
        : "Demo"
  };


  if (type === "real") {

    project.customerName =
      document
        .getElementById("customerName")
        .value.trim();

    project.customerMobile =
      document
        .getElementById("customerMobile")
        .value.trim();

    project.soldPrice =
      price;

    const policyInput =
      document.getElementById(
        "formPolicy"
      );

    if (policyInput) {
      policy = policyInput.value;
    }
  }


  if (editIndex === null) {

    projects.push(project);

    alert(
      "✅ Website successfully saved!"
    );

  } else {

    projects[editIndex] =
      project;

    alert(
      "✅ Website successfully updated!"
    );
  }


  saveData();

  window.currentNewSignature =
    null;

  closeFullPage();
}


/* ================= FAVORITES ================= */

function showFavorites() {

  openFullPage();

  const favorites =
    projects.filter(
      p => p.favorite
    );

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      ⭐ MY FAVORITE WEBSITE
    </h1>

    <div id="favoriteList"></div>
  `;

  const container =
    document.getElementById(
      "favoriteList"
    );

  if (!favorites.length) {

    container.innerHTML = `
      <div class="empty">
        No favorite website yet.
      </div>
    `;

    return;
  }

  container.innerHTML =
    favorites.map(
      p => `

        <div class="item">

          <h3>
            ⭐ ${escapeHTML(p.websiteName)}
          </h3>

          <p>
            Category:
            ${escapeHTML(p.category)}
          </p>

          <p>
            Price:
            ₹${escapeHTML(p.price)}
          </p>

        </div>
      `
    ).join("");
}


function toggleFavorite(id) {

  const project =
    projects.find(
      p => p.id === id
    );

  if (!project) return;

  project.favorite =
    !project.favorite;

  saveData();

  showWebsiteList(
    project.type
  );
}


/* =========================================================
   EDIT / DELETE
   IMPORTANT:
   Editing/deleting is ONLY available from this section.
========================================================= */

function showEditDelete() {

  openFullPage();

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      ✏️ EDIT / DELETE
    </h1>

    <p style="
      color:#94a3b8;
      margin-bottom:20px;
    ">
      Only this section can edit or delete
      saved websites.
    </p>

    <input
      class="search"
      id="editSearch"
      placeholder="Search website..."
      oninput="renderEditDelete()"
    >

    <div id="editDeleteList"></div>
  `;

  renderEditDelete();
}


function renderEditDelete() {

  const input =
    document.getElementById(
      "editSearch"
    );

  const search =
    input
      ? input.value.toLowerCase()
      : "";

  const list =
    projects.filter(
      p =>
        (p.websiteName || "")
          .toLowerCase()
          .includes(search)
    );

  const container =
    document.getElementById(
      "editDeleteList"
    );

  if (!list.length) {

    container.innerHTML = `
      <div class="empty">
        No website found.
      </div>
    `;

    return;
  }


  container.innerHTML =
    list.map(project => {

      const index =
        projects.findIndex(
          p => p.id === project.id
        );

      return `

        <div class="item">

          <h3>
            ${escapeHTML(project.websiteName)}
          </h3>

          <span class="badge">
            ${project.type.toUpperCase()}
          </span>

          <p>
            Category:
            ${escapeHTML(project.category)}
          </p>

          <p>
            Price:
            ₹${escapeHTML(project.price)}
          </p>

          <div class="item-actions">

            <button
              class="action-btn"
              onclick="editProject(${index})"
            >
              ✏️ Edit
            </button>

            <button
              class="action-btn delete-btn"
              onclick="deleteProject(${index})"
            >
              🗑️ Delete
            </button>

          </div>

        </div>
      `;

    }).join("");
}


function editProject(index) {

  const project =
    projects[index];

  if (!project) return;

  showAddForm(
    project.type,
    index
  );
}


function deleteProject(index) {

  const project =
    projects[index];

  if (!project) return;

  const confirmDelete =
    confirm(
      `Delete "${project.websiteName}"?`
    );

  if (!confirmDelete) return;

  projects.splice(
    index,
    1
  );

  saveData();

  renderEditDelete();
}


/* ================= SIGNATURE SYSTEM ================= */

let signatureCanvas =
  document.getElementById(
    "signatureCanvas"
  );

let signatureContext =
  signatureCanvas.getContext("2d");

let drawing = false;

let signatureProjectId =
  null;


function resizeSignatureCanvas() {

  const ratio =
    window.devicePixelRatio || 1;

  const rect =
    signatureCanvas.getBoundingClientRect();

  signatureCanvas.width =
    rect.width * ratio;

  signatureCanvas.height =
    rect.height * ratio;

  signatureContext.scale(
    ratio,
    ratio
  );

  signatureContext.lineWidth = 2;

  signatureContext.lineCap =
    "round";

  signatureContext.strokeStyle =
    "#111827";
}


window.addEventListener(
  "resize",
  () => {
    if (
      !document
        .getElementById("signaturePage")
        .classList.contains("hidden")
    ) {
      resizeSignatureCanvas();
    }
  }
);


function getCanvasPosition(event) {

  const rect =
    signatureCanvas.getBoundingClientRect();

  const point =
    event.touches
      ? event.touches[0]
      : event;

  return {
    x:
      point.clientX -
      rect.left,

    y:
      point.clientY -
      rect.top
  };
}


function startDrawing(event) {

  event.preventDefault();

  drawing = true;

  const point =
    getCanvasPosition(event);

  signatureContext.beginPath();

  signatureContext.moveTo(
    point.x,
    point.y
  );
}


function drawSignature(event) {

  if (!drawing) return;

  event.preventDefault();

  const point =
    getCanvasPosition(event);

  signatureContext.lineTo(
    point.x,
    point.y
  );

  signatureContext.stroke();
}


function stopDrawing() {

  drawing = false;
}


signatureCanvas.addEventListener(
  "mousedown",
  startDrawing
);

signatureCanvas.addEventListener(
  "mousemove",
  drawSignature
);

signatureCanvas.addEventListener(
  "mouseup",
  stopDrawing
);

signatureCanvas.addEventListener(
  "mouseleave",
  stopDrawing
);

signatureCanvas.addEventListener(
  "touchstart",
  startDrawing,
  { passive: false }
);

signatureCanvas.addEventListener(
  "touchmove",
  drawSignature,
  { passive: false }
);

signatureCanvas.addEventListener(
  "touchend",
  stopDrawing
);


/* Open existing customer signature */

function openSignature(projectId) {

  signatureProjectId =
    projectId;

  document
    .getElementById(
      "signaturePage"
    )
    .classList.remove("hidden");

  resizeSignatureCanvas();

  retrySignature();
}


/* Signature for new customer */

function openSignatureForNewProject() {

  signatureProjectId =
    null;

  document
    .getElementById(
      "signaturePage"
    )
    .classList.remove("hidden");

  resizeSignatureCanvas();

  retrySignature();
}


/* Retry */

function retrySignature() {

  signatureContext.clearRect(
    0,
    0,
    signatureCanvas.width,
    signatureCanvas.height
  );
}


/* Confirm */

function confirmSignature() {

  const image =
    signatureCanvas.toDataURL(
      "image/png"
    );

  if (signatureProjectId) {

    const project =
      projects.find(
        p => p.id === signatureProjectId
      );

    if (project) {

      project.signature =
        image;

      saveData();

      alert(
        "✅ Signature saved successfully."
      );

      closeSignature();

      showPaperwork(
        signatureProjectId
      );

      return;
    }
  }


  window.currentNewSignature =
    image;

  const preview =
    document.getElementById(
      "newSignaturePreview"
    );

  if (preview) {

    preview.innerHTML = `
      <p>✅ Signature confirmed</p>

      <img
        src="${image}"
        style="
          max-width:100%;
          background:white;
          border-radius:10px;
        "
      >
    `;
  }

  closeSignature();
}


/* ================= CAMERA ================= */

let cameraStream = null;


async function useCamera() {

  try {

    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        },
        audio: false
      });

    const video =
      document.getElementById(
        "cameraPreview"
      );

    video.srcObject =
      cameraStream;

    video.classList.remove(
      "hidden"
    );

    document
      .getElementById(
        "captureBtn"
      )
      .classList.remove(
        "hidden"
      );

  } catch (error) {

    alert(
      "Camera permission nahi mili. Browser me camera permission allow karo."
    );
  }
}


function capturePhoto() {

  const video =
    document.getElementById(
      "cameraPreview"
    );

  const canvas =
    document.getElementById(
      "cameraCanvas"
    );

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  const context =
    canvas.getContext("2d");

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL(
      "image/jpeg",
      0.85
    );


  if (signatureProjectId) {

    const project =
      projects.find(
        p => p.id === signatureProjectId
      );

    if (project) {

      project.signature =
        image;

      saveData();

      stopCamera();

      alert(
        "✅ Signature photo saved."
      );

      closeSignature();

      showPaperwork(
        signatureProjectId
      );

      return;
    }
  }


  window.currentNewSignature =
    image;

  const preview =
    document.getElementById(
      "newSignaturePreview"
    );

  if (preview) {

    preview.innerHTML = `

      <p>
        ✅ Signature photo confirmed
      </p>

      <img
        src="${image}"
        style="
          width:100%;
          max-height:300px;
          object-fit:contain;
          background:white;
          border-radius:10px;
        "
      >

    `;
  }

  stopCamera();

  closeSignature();
}


function stopCamera() {

  if (cameraStream) {

    cameraStream
      .getTracks()
      .forEach(
        track => track.stop()
      );

    cameraStream = null;
  }

  const video =
    document.getElementById(
      "cameraPreview"
    );

  video.srcObject = null;

  video.classList.add(
    "hidden"
  );

  document
    .getElementById(
      "captureBtn"
    )
    .classList.add(
      "hidden"
    );
}


function closeSignature() {

  stopCamera();

  document
    .getElementById(
      "signaturePage"
    )
    .classList.add("hidden");
}


/* ================= BANNER EDIT ================= */

function showBannerEditor() {

  openFullPage();

  const savedBanner =
    localStorage.getItem(
      "twd_banner"
    );

  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      🖼️ BANNER EDIT
    </h1>

    <p style="
      color:#94a3b8;
      margin-bottom:20px;
    ">
      Mobile/computer se image select karo.
    </p>

    <div class="banner-upload">

      <input
        type="file"
        id="bannerInput"
        accept="image/*"
        onchange="previewBanner(event)"
      >

      <div
        id="bannerPreview"
        class="banner-preview"
        style="
          background-image:
          url('${savedBanner || ""}');
        "
      ></div>

      <button
        class="submit-btn"
        onclick="saveBanner()"
      >
        💾 SAVE BANNER
      </button>

    </div>
  `;
}


function previewBanner(event) {

  const file =
    event.target.files[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload =
    function(e) {

      const preview =
        document.getElementById(
          "bannerPreview"
        );

      preview.style.backgroundImage =
        `url("${e.target.result}")`;

      window.newBanner =
        e.target.result;
    };

  reader.readAsDataURL(file);
}


function saveBanner() {

  if (!window.newBanner) {

    alert(
      "Pehle banner image select karo."
    );

    return;
  }

  localStorage.setItem(
    "twd_banner",
    window.newBanner
  );

  applyBanner();

  window.newBanner =
    null;

  alert(
    "✅ Banner successfully changed."
  );

  closeFullPage();
}


function applyBanner() {

  const banner =
    localStorage.getItem(
      "twd_banner"
    );

  if (!banner) return;

  const bg =
    document.getElementById(
      "mainBg"
    );

  bg.style.backgroundImage =
    `url("${banner}")`;

  bg.style.backgroundSize =
    "cover";

  bg.style.backgroundPosition =
    "center";
}


/* ================= SECURITY DISPLAY ================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


/* ================= START ================= */

updateStats();

applyBanner();
