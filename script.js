/* =========================================================
   THE WEB DEVELOPER
   BACKEND CONNECTED FRONTEND
========================================================= */

const API_URL =
  "https://the-web-devloper-backent.onrender.com/api";

let backendToken =
  sessionStorage.getItem("twd_backend_token") || "";


/* ================= API HELPER ================= */

async function apiRequest(endpoint, options = {}) {

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  };

  if (backendToken) {
    config.headers.Authorization =
      `Bearer ${backendToken}`;
  }

  const response =
    await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {

    backendToken = "";

    sessionStorage.removeItem(
      "twd_backend_token"
    );

    sessionStorage.removeItem(
      "twd_logged_in"
    );

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const text =
    await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text
    };
  }

  if (!response.ok) {

    throw new Error(
      data.message ||
      data.error ||
      `API Error ${response.status}`
    );
  }

  return data;
}


/* ================= BACKEND TEST ================= */

fetch(`${API_URL}/health`)
  .then(res => res.json())
  .then(data => {
    console.log(
      "✅ Backend Connected:",
      data
    );
  })
  .catch(error => {
    console.error(
      "❌ Backend Error:",
      error
    );
  });


/* ================= LOGIN ================= */

const LOGIN_NAME =
  "DEVENDRA GARG";

const LOGIN_PASSWORD =
  "@ND0710";


async function login(event) {

  if (event) {
    event.preventDefault();
  }

  const name =
    document
      .getElementById("loginName")
      .value
      .trim()
      .toUpperCase();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  const error =
    document.getElementById(
      "loginError"
    );


  if (!name || !password) {

    error.textContent =
      "❌ Name and password required.";

    return;
  }


  error.textContent =
    "⏳ Logging in...";


  try {

    const data =
      await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            password
          })
        }
      );


    if (
      data.token ||
      data.accessToken
    ) {

      backendToken =
        data.token ||
        data.accessToken;

      sessionStorage.setItem(
        "twd_backend_token",
        backendToken
      );

      sessionStorage.setItem(
        "twd_logged_in",
        "true"
      );


      document
        .getElementById("loginPage")
        .classList.add("hidden");

      document
        .getElementById("mainWebsite")
        .classList.remove("hidden");


      await loadRemoteData();

      updateStats();

      error.textContent = "";

      return;
    }


    error.textContent =
      "❌ Login failed.";

  } catch (err) {

    console.error(err);

    error.textContent =
      "❌ Name or password is incorrect.";
  }
}


/* ================= ENTER KEY LOGIN ================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Enter") {
      return;
    }

    const loginPage =
      document.getElementById(
        "loginPage"
      );

    if (
      loginPage &&
      !loginPage.classList.contains(
        "hidden"
      )
    ) {

      login(event);
    }

  }
);


/* ================= DATA ================= */

let projects =
  JSON.parse(
    localStorage.getItem(
      "twd_projects"
    ) || "[]"
  );


let policy =
  localStorage.getItem(
    "twd_private_policy"
  ) ||
`PRIVATE CUSTOMER POLICY

1. The customer information provided in this form is private.

2. Website/project information should be used only for the agreed project.

3. The customer confirms that the information provided by them is correct.

4. The customer confirms their agreement by signing below.

5. This document is maintained as project paperwork.`;


/* ================= REMOTE DATA ================= */

async function loadRemoteData() {

  try {

    const projectsData =
      await apiRequest(
        "/projects"
      );


    if (
      Array.isArray(
        projectsData
      )
    ) {

      projects =
        projectsData;
    } else {

      projects =
        projectsData.projects ||
        projectsData.data ||
        [];
    }


    const settingsData =
      await apiRequest(
        "/settings"
      );


    const settings =
      settingsData.settings ||
      settingsData ||
      {};


    if (
      typeof settings.policy ===
      "string"
    ) {

      policy =
        settings.policy;
    }


    if (
      settings.banner
    ) {

      localStorage.setItem(
        "twd_banner",
        settings.banner
      );
    }


    localStorage.setItem(
      "twd_projects",
      JSON.stringify(projects)
    );

    localStorage.setItem(
      "twd_private_policy",
      policy
    );


    applyBanner();

    updateStats();


    console.log(
      "✅ Remote data loaded successfully."
    );

  } catch (error) {

    console.error(
      "❌ Remote data load failed:",
      error
    );

    /*
      Backend fail hone par
      local cache use hogi.
    */

    updateStats();
  }
}


/* ================= ELEMENTS ================= */

const modal =
  document.getElementById(
    "modal"
  );

const modalContent =
  document.getElementById(
    "modalContent"
  );

const fullPage =
  document.getElementById(
    "fullPage"
  );

const fullPageContent =
  document.getElementById(
    "fullPageContent"
  );


/* ================= SAVE CACHE ================= */

function saveLocalCache() {

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
      p =>
        p.type === "real" &&
        p.status === "Sold"
    );


  const customers =
    uniqueCustomers();


  const favorites =
    projects.filter(
      p => p.favorite
    );


  const websiteCount =
    document.getElementById(
      "websiteCount"
    );

  const saleCount =
    document.getElementById(
      "saleCount"
    );

  const customerCount =
    document.getElementById(
      "customerCount"
    );

  const favoriteCount =
    document.getElementById(
      "favoriteCount"
    );


  if (websiteCount) {
    websiteCount.textContent =
      realAndDemo;
  }


  if (saleCount) {
    saleCount.textContent =
      sales.length;
  }


  if (customerCount) {
    customerCount.textContent =
      customers.length;
  }


  if (favoriteCount) {
    favoriteCount.textContent =
      favorites.length;
  }
}


/* ================= CUSTOMERS ================= */

function uniqueCustomers() {

  const map =
    new Map();


  projects.forEach(
    project => {

      if (
        project.type === "real" &&
        project.customerName &&
        project.customerMobile
      ) {

        map.set(
          project.customerMobile,
          {
            name:
              project.customerName,

            mobile:
              project.customerMobile,

            projectId:
              project.id
          }
        );
      }

    }
  );


  return [
    ...map.values()
  ];
}


/* ================= MODAL ================= */

function openModal() {

  if (!modal) return;

  modal.style.display =
    "block";

  document.body.style.overflow =
    "hidden";
}


function closeModal() {

  if (!modal) return;

  modal.style.display =
    "none";

  document.body.style.overflow =
    "auto";
}


window.addEventListener(
  "click",
  function(event) {

    if (
      modal &&
      event.target === modal
    ) {

      closeModal();
    }

  }
);


/* ================= FULL PAGE ================= */

function openFullPage() {

  if (!fullPage) return;

  fullPage.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}


function closeFullPage() {

  if (!fullPage) return;

  fullPage.classList.add(
    "hidden"
  );

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
        <strong>
          🧪 DEMO WEBSITES
        </strong>

        <span>
          View all demo projects
        </span>
      </button>


      <button
        class="type-card"
        onclick="showWebsiteList('real')"
      >
        <strong>
          🌐 REAL WEBSITES
        </strong>

        <span>
          View all real customer websites
        </span>
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
      ? searchInput.value
          .toLowerCase()
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


  if (!container) return;


  if (!list.length) {

    container.innerHTML = `

      <div class="empty">
        No ${type} website found.
      </div>

    `;

    return;
  }


  container.innerHTML =
    list.map(
      project => {

        return `

          <div class="item">

            <h3>
              ${escapeHTML(
                project.websiteName
              )}
            </h3>


            <span class="badge">
              ${escapeHTML(
                project.category ||
                "Website"
              )}
            </span>


            <p>
              <b>Price:</b>
              ₹${escapeHTML(
                project.price || "0"
              )}
            </p>


            ${
              project.websiteURL
                ? `

                  <p>

                    <a
                      href="${escapeHTML(
                        project.websiteURL
                      )}"
                      target="_blank"
                      rel="noopener noreferrer"
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
                    ${escapeHTML(
                      project.customerName
                    )}
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
      }
    )
    .join("");
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
      ? input.value
          .toLowerCase()
      : "";


  const sales =
    projects.filter(
      p =>
        p.type === "real" &&
        p.status === "Sold" &&
        (
          (
            p.customerName ||
            ""
          )
          .toLowerCase()
          .includes(search)

          ||

          (
            p.websiteName ||
            ""
          )
          .toLowerCase()
          .includes(search)
        )
    );


  const container =
    document.getElementById(
      "saleList"
    );


  if (!container) return;


  if (!sales.length) {

    container.innerHTML = `

      <div class="empty">
        No sold website found.
      </div>

    `;

    return;
  }


  container.innerHTML =
    sales.map(
      (p, i) => `

        <div class="item">

          <p>
            <b>Sr No.:</b>
            ${i + 1}
          </p>


          <h3>
            ${escapeHTML(
              p.customerName
            )}
          </h3>


          <p>
            <b>Website:</b>
            ${escapeHTML(
              p.websiteName
            )}
          </p>


          <p>
            <b>Sold Price:</b>
            ₹${escapeHTML(
              p.soldPrice ||
              p.price
            )}
          </p>

        </div>

      `
    )
    .join("");
}


/* ================= STARTUP ================= */

async function startApp() {

  /*
    Agar backend token already hai,
    to direct dashboard open hoga.
  */

  if (backendToken) {

    const loginPage =
      document.getElementById(
        "loginPage"
      );

    const mainWebsite =
      document.getElementById(
        "mainWebsite"
      );


    if (loginPage) {
      loginPage.classList.add(
        "hidden"
      );
    }


    if (mainWebsite) {
      mainWebsite.classList.remove(
        "hidden"
      );
    }


    await loadRemoteData();

  } else {

    updateStats();
    applyBanner();
  }
}


startApp();
//part 2 //
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
          (c.name || "")
            .toLowerCase()
            .includes(search)
      );

  const container =
    document.getElementById(
      "customerList"
    );

  if (!container) return;

  if (!customers.length) {

    container.innerHTML = `
      <div class="empty">
        No customer found.
      </div>
    `;

    return;
  }

  container.innerHTML =
    customers.map(
      (customer, i) => `

        <div class="item">

          <p>
            <b>Sr No.:</b>
            ${i + 1}
          </p>

          <h3>
            👤 ${escapeHTML(
              customer.name
            )}
          </h3>

          <p>
            📱 ${escapeHTML(
              customer.mobile
            )}
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

      `
    ).join("");
}


/* ================= PAPERWORK ================= */

function showPaperwork(projectId) {

  const project =
    projects.find(
      p => String(p.id) === String(projectId)
    );

  if (!project) {

    alert(
      "Customer/project not found."
    );

    return;
  }

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
        ${escapeHTML(
          project.customerName
        )}
      </h3>

      <p>
        📱 ${escapeHTML(
          project.customerMobile
        )}
      </p>

      <p>
        🌐 ${escapeHTML(
          project.websiteName
        )}
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
        >${escapeHTML(
          policy
        )}</textarea>

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
              ? `
                <img
                  src="${escapeHTML(
                    project.signature
                  )}"
                  style="
                    max-width:100%;
                    background:white;
                    border-radius:10px;
                  "
                >
              `
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


/* ================= SAVE POLICY ================= */

async function savePolicy() {

  const editor =
    document.getElementById(
      "policyEditor"
    );

  if (!editor) return;

  policy =
    editor.value;


  try {

    await apiRequest(
      "/settings/policy",
      {
        method: "PUT",

        body:
          JSON.stringify({
            policy
          })
      }
    );


    saveLocalCache();


    alert(
      "✅ Private policy saved to backend."
    );

  } catch (error) {

    console.error(
      "Policy save error:",
      error
    );


    /*
      Local cache bhi save kar rahe hain
      taaki data browser me na kho.
    */

    saveLocalCache();


    alert(
      "⚠️ Backend save failed. Local copy saved."
    );
  }
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

        <strong>
          🌐 REAL WEBSITE
        </strong>

        <span>
          Add customer website
        </span>

      </button>


      <button
        class="type-card"
        onclick="showAddForm('demo')"
      >

        <strong>
          🧪 DEMO WEBSITE
        </strong>

        <span>
          Add demo project
        </span>

      </button>

    </div>
  `;
}


/* ================= ADD FORM ================= */

function showAddForm(
  type,
  editIndex = null
) {

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

      ${
        isReal
          ? "🌐 REAL WEBSITE"
          : "🧪 DEMO WEBSITE"
      }

    </h1>


    <form
      class="form"
      onsubmit="
        saveProject(
          event,
          '${type}',
          ${editIndex}
        )
      "
    >


      <div class="form-group">

        <label>
          Website Name *
        </label>

        <input
          class="form-input"
          id="websiteName"
          required
          value="${
            edit
              ? escapeHTML(
                  edit.websiteName
                )
              : ""
          }"
        >

      </div>


      <div class="form-group">

        <label>
          Website Category *
        </label>

        <input
          class="form-input"
          id="category"
          required

          value="${
            edit
              ? escapeHTML(
                  edit.category || ""
                )
              : ""
          }"

          placeholder="
            Business / Portfolio / E-commerce
          "
        >

      </div>


      <div class="form-group">

        <label>
          ${
            isReal
              ? "Sold Price"
              : "Price"
          } *
        </label>

        <input
          class="form-input"
          id="price"
          type="number"
          min="0"
          required

          value="${
            edit
              ? escapeHTML(
                  edit.price || ""
                )
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
                    ? escapeHTML(
                        edit.websiteURL || ""
                      )
                    : ""
                }"

                placeholder="
                  https://example.com
                "
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
                    ? escapeHTML(
                        edit.customerName || ""
                      )
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
                    ? escapeHTML(
                        edit.customerMobile || ""
                      )
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
                    ? escapeHTML(
                        edit.websiteURL || ""
                      )
                    : ""
                }"

                placeholder="
                  https://example.com
                "
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
          placeholder="
            Write project information...
          "
        >${
          edit
            ? escapeHTML(
                edit.description || ""
              )
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
              >${escapeHTML(
                policy
              )}</textarea>

            </div>


            <button
              type="button"
              class="signature-open"
              onclick="
                openSignatureForNewProject()
              "
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


  /*
    Existing signature ka preview
  */

  if (
    edit &&
    edit.signature
  ) {

    const preview =
      document.getElementById(
        "newSignaturePreview"
      );

    if (preview) {

      preview.innerHTML = `

        <p>
          ✅ Existing Signature
        </p>

        <img
          src="${escapeHTML(
            edit.signature
          )}"
          style="
            max-width:100%;
            background:white;
            border-radius:10px;
          "
        >

      `;
    }
  }
}


/* ================= SAVE PROJECT ================= */

async function saveProject(
  event,
  type,
  editIndex
) {

  event.preventDefault();


  const websiteName =
    document
      .getElementById(
        "websiteName"
      )
      .value
      .trim();


  const category =
    document
      .getElementById(
        "category"
      )
      .value
      .trim();


  const price =
    document
      .getElementById(
        "price"
      )
      .value
      .trim();


  const websiteURL =
    document
      .getElementById(
        "websiteURL"
      )
      .value
      .trim();


  const description =
    document
      .getElementById(
        "description"
      )
      .value
      .trim();


  if (
    !websiteName ||
    !category ||
    !price
  ) {

    alert(
      "Please fill all compulsory fields."
    );

    return;
  }


  const old =
    editIndex !== null &&
    editIndex !== undefined
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
      new Date()
        .toLocaleDateString(
          "en-IN"
        ),

    status:
      type === "real"
        ? "Sold"
        : "Demo"
  };


  /* ================= REAL PROJECT ================= */

  if (type === "real") {

    project.customerName =
      document
        .getElementById(
          "customerName"
        )
        .value
        .trim();


    project.customerMobile =
      document
        .getElementById(
          "customerMobile"
        )
        .value
        .trim();


    project.soldPrice =
      price;


    const policyInput =
      document.getElementById(
        "formPolicy"
      );


    if (policyInput) {

      policy =
        policyInput.value;
    }


    if (
      !project.customerName ||
      !project.customerMobile
    ) {

      alert(
        "Customer name and mobile required."
      );

      return;
    }
  }


  try {

    let savedProject;


    /* ================= EDIT ================= */

    if (
      editIndex !== null &&
      editIndex !== undefined
    ) {

      const result =
        await apiRequest(
          `/projects/${encodeURIComponent(
            project.id
          )}`,
          {
            method: "PUT",

            body:
              JSON.stringify(
                project
              )
          }
        );


      savedProject =
        result.project ||
        result.data ||
        result;


      projects[editIndex] =
        savedProject;


      alert(
        "✅ Website successfully updated!"
      );


    } else {

      /* ================= NEW ================= */

      const result =
        await apiRequest(
          "/projects",
          {
            method: "POST",

            body:
              JSON.stringify(
                project
              )
          }
        );


      savedProject =
        result.project ||
        result.data ||
        result;


      /*
        Backend agar ID generate kare
        to uska ID use hoga.
      */

      if (
        savedProject &&
        savedProject.id
      ) {

        project.id =
          savedProject.id;
      }


      projects.push(
        savedProject &&
        savedProject.id
          ? savedProject
          : project
      );


      alert(
        "✅ Website successfully saved!"
      );
    }


    saveLocalCache();


    /*
      Policy bhi backend me save
      kar do agar real website hai.
    */

    if (type === "real") {

      try {

        await apiRequest(
          "/settings/policy",
          {
            method: "PUT",

            body:
              JSON.stringify({
                policy
              })
          }
        );

      } catch (policyError) {

        console.error(
          "Policy backend error:",
          policyError
        );
      }
    }


    window.currentNewSignature =
      null;


    closeFullPage();

    updateStats();


  } catch (error) {

    console.error(
      "Save project error:",
      error
    );


    alert(
      "❌ Backend me website save nahi hui.\n\n" +
      error.message
    );
  }
}
// part 3  //
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


  if (!container) return;


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
            ⭐ ${escapeHTML(
              p.websiteName
            )}
          </h3>

          <p>
            Category:
            ${escapeHTML(
              p.category || ""
            )}
          </p>

          <p>
            Price:
            ₹${escapeHTML(
              p.price || "0"
            )}
          </p>

          ${
            p.websiteURL
              ? `
                <p>

                  <a
                    href="${escapeHTML(
                      p.websiteURL
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="color:#00e5ff"
                  >
                    🔗 Open Live Website
                  </a>

                </p>
              `
              : ""
          }

        </div>

      `
    ).join("");
}


/* ================= TOGGLE FAVORITE ================= */

async function toggleFavorite(id) {

  const project =
    projects.find(
      p =>
        String(p.id) ===
        String(id)
    );


  if (!project) return;


  const newFavorite =
    !project.favorite;


  /*
    Backend par favorite update
  */

  try {

    const result =
      await apiRequest(
        `/projects/${encodeURIComponent(
          project.id
        )}`,
        {
          method: "PUT",

          body:
            JSON.stringify({
              ...project,
              favorite:
                newFavorite
            })
        }
      );


    const updated =
      result.project ||
      result.data ||
      result;


    project.favorite =
      updated.favorite !== undefined
        ? updated.favorite
        : newFavorite;


    saveLocalCache();


    showWebsiteList(
      project.type
    );


  } catch (error) {

    console.error(
      "Favorite update error:",
      error
    );


    alert(
      "❌ Favorite backend me update nahi hua."
    );
  }
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


    <p
      style="
        color:#94a3b8;
        margin-bottom:20px;
      "
    >
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
      ? input.value
          .toLowerCase()
      : "";


  const list =
    projects.filter(
      p =>
        (
          p.websiteName ||
          ""
        )
        .toLowerCase()
        .includes(search)
    );


  const container =
    document.getElementById(
      "editDeleteList"
    );


  if (!container) return;


  if (!list.length) {

    container.innerHTML = `

      <div class="empty">
        No website found.
      </div>

    `;

    return;
  }


  container.innerHTML =
    list.map(
      project => {

        const index =
          projects.findIndex(
            p =>
              String(p.id) ===
              String(project.id)
          );


        return `

          <div class="item">

            <h3>
              ${escapeHTML(
                project.websiteName
              )}
            </h3>


            <span class="badge">
              ${escapeHTML(
                (
                  project.type ||
                  ""
                ).toUpperCase()
              )}
            </span>


            <p>
              Category:
              ${escapeHTML(
                project.category || ""
              )}
            </p>


            <p>
              Price:
              ₹${escapeHTML(
                project.price || "0"
              )}
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
      }
    ).join("");
}


/* ================= EDIT ================= */

function editProject(index) {

  const project =
    projects[index];


  if (!project) return;


  showAddForm(
    project.type,
    index
  );
}


/* ================= DELETE ================= */

async function deleteProject(index) {

  const project =
    projects[index];


  if (!project) return;


  const confirmDelete =
    confirm(
      `Delete "${project.websiteName}"?`
    );


  if (!confirmDelete) {
    return;
  }


  try {

    await apiRequest(
      `/projects/${encodeURIComponent(
        project.id
      )}`,
      {
        method: "DELETE"
      }
    );


    projects.splice(
      index,
      1
    );


    saveLocalCache();


    alert(
      "✅ Website deleted successfully."
    );


    renderEditDelete();


  } catch (error) {

    console.error(
      "Delete error:",
      error
    );


    alert(
      "❌ Website backend se delete nahi hui.\n\n" +
      error.message
    );
  }
}


/* ================= SIGNATURE SYSTEM ================= */

let signatureCanvas =
  document.getElementById(
    "signatureCanvas"
  );


let signatureContext =
  signatureCanvas
    ? signatureCanvas.getContext("2d")
    : null;


let drawing =
  false;


let signatureProjectId =
  null;


/* ================= RESIZE CANVAS ================= */

function resizeSignatureCanvas() {

  if (
    !signatureCanvas ||
    !signatureContext
  ) {
    return;
  }


  const ratio =
    window.devicePixelRatio ||
    1;


  const rect =
    signatureCanvas
      .getBoundingClientRect();


  signatureCanvas.width =
    rect.width * ratio;


  signatureCanvas.height =
    rect.height * ratio;


  /*
    Canvas scaling reset
  */

  signatureContext.setTransform(
    1,
    0,
    0,
    1,
    0,
    0
  );


  signatureContext.scale(
    ratio,
    ratio
  );


  signatureContext.lineWidth =
    2;


  signatureContext.lineCap =
    "round";


  signatureContext.strokeStyle =
    "#111827";
}


/* ================= RESIZE EVENT ================= */

window.addEventListener(
  "resize",
  () => {

    const signaturePage =
      document.getElementById(
        "signaturePage"
      );


    if (
      signaturePage &&
      !signaturePage.classList.contains(
        "hidden"
      )
    ) {

      resizeSignatureCanvas();
    }

  }
);


/* ================= CANVAS POSITION ================= */

function getCanvasPosition(
  event
) {

  if (
    !signatureCanvas
  ) {
    return {
      x: 0,
      y: 0
    };
  }


  const rect =
    signatureCanvas
      .getBoundingClientRect();


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


/* ================= START DRAWING ================= */

function startDrawing(event) {

  if (
    !signatureContext
  ) {
    return;
  }


  event.preventDefault();


  drawing =
    true;


  const point =
    getCanvasPosition(
      event
    );


  signatureContext.beginPath();


  signatureContext.moveTo(
    point.x,
    point.y
  );
}


/* ================= DRAW ================= */

function drawSignature(event) {

  if (
    !drawing ||
    !signatureContext
  ) {
    return;
  }


  event.preventDefault();


  const point =
    getCanvasPosition(
      event
    );


  signatureContext.lineTo(
    point.x,
    point.y
  );


  signatureContext.stroke();
}


/* ================= STOP ================= */

function stopDrawing() {

  drawing =
    false;
}


/* ================= CANVAS EVENTS ================= */

if (
  signatureCanvas
) {

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
    {
      passive: false
    }
  );


  signatureCanvas.addEventListener(
    "touchmove",
    drawSignature,
    {
      passive: false
    }
  );


  signatureCanvas.addEventListener(
    "touchend",
    stopDrawing
  );
}


/* ================= OPEN EXISTING SIGNATURE ================= */

function openSignature(
  projectId
) {

  signatureProjectId =
    projectId;


  const page =
    document.getElementById(
      "signaturePage"
    );


  if (!page) return;


  page.classList.remove(
    "hidden"
  );


  resizeSignatureCanvas();


  retrySignature();
}


/* ================= NEW PROJECT SIGNATURE ================= */

function openSignatureForNewProject() {

  signatureProjectId =
    null;


  const page =
    document.getElementById(
      "signaturePage"
    );


  if (!page) return;


  page.classList.remove(
    "hidden"
  );


  resizeSignatureCanvas();


  retrySignature();
}


/* ================= RETRY SIGNATURE ================= */

function retrySignature() {

  if (
    !signatureCanvas ||
    !signatureContext
  ) {
    return;
  }


  signatureContext.clearRect(
    0,
    0,
    signatureCanvas.width,
    signatureCanvas.height
  );
}


/* ================= CONFIRM SIGNATURE ================= */

async function confirmSignature() {

  if (
    !signatureCanvas
  ) {
    return;
  }


  const image =
    signatureCanvas.toDataURL(
      "image/png"
    );


  /* ================= EXISTING PROJECT ================= */

  if (
    signatureProjectId
  ) {

    const project =
      projects.find(
        p =>
          String(p.id) ===
          String(
            signatureProjectId
          )
      );


    if (!project) {

      alert(
        "Project not found."
      );

      return;
    }


    try {

      const updatedProject = {

        ...project,

        signature:
          image

      };


      const result =
        await apiRequest(
          `/projects/${encodeURIComponent(
            project.id
          )}`,
          {
            method: "PUT",

            body:
              JSON.stringify(
                updatedProject
              )
          }
        );


      const saved =
        result.project ||
        result.data ||
        result;


      const index =
        projects.findIndex(
          p =>
            String(p.id) ===
            String(project.id)
        );


      if (index !== -1) {

        projects[index] =
          saved;
      }


      saveLocalCache();


      alert(
        "✅ Signature saved successfully."
      );


      closeSignature();


      showPaperwork(
        project.id
      );


    } catch (error) {

      console.error(
        "Signature save error:",
        error
      );


      alert(
        "❌ Signature backend me save nahi hui.\n\n" +
        error.message
      );
    }


    return;
  }


  /* ================= NEW PROJECT ================= */

  window.currentNewSignature =
    image;


  const preview =
    document.getElementById(
      "newSignaturePreview"
    );


  if (preview) {

    preview.innerHTML = `

      <p>
        ✅ Signature confirmed
      </p>


      <img
        src="${escapeHTML(
          image
        )}"
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

let cameraStream =
  null;


/* ================= USE CAMERA ================= */

async function useCamera() {

  try {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      alert(
        "Camera browser me available nahi hai."
      );

      return;
    }


    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode:
            "environment"
        },

        audio: false

      });


    const video =
      document.getElementById(
        "cameraPreview"
      );


    if (!video) {
      return;
    }


    video.srcObject =
      cameraStream;


    video.classList.remove(
      "hidden"
    );


    const captureBtn =
      document.getElementById(
        "captureBtn"
      );


    if (captureBtn) {

      captureBtn.classList.remove(
        "hidden"
      );
    }


  } catch (error) {

    console.error(
      "Camera error:",
      error
    );


    alert(
      "Camera permission nahi mili. Browser me camera permission allow karo."
    );
  }
}


/* ================= CAPTURE PHOTO ================= */

async function capturePhoto() {

  const video =
    document.getElementById(
      "cameraPreview"
    );


  const canvas =
    document.getElementById(
      "cameraCanvas"
    );


  if (
    !video ||
    !canvas
  ) {
    return;
  }


  canvas.width =
    video.videoWidth;


  canvas.height =
    video.videoHeight;


  const context =
    canvas.getContext(
      "2d"
    );


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


  /* ================= EXISTING PROJECT ================= */

  if (
    signatureProjectId
  ) {

    const project =
      projects.find(
        p =>
          String(p.id) ===
          String(
            signatureProjectId
          )
      );


    if (!project) {
      return;
    }


    try {

      const updatedProject = {

        ...project,

        signature:
          image

      };


      const result =
        await apiRequest(
          `/projects/${encodeURIComponent(
            project.id
          )}`,
          {
            method: "PUT",

            body:
              JSON.stringify(
                updatedProject
              )
          }
        );


      const saved =
        result.project ||
        result.data ||
        result;


      const index =
        projects.findIndex(
          p =>
            String(p.id) ===
            String(project.id)
        );


      if (index !== -1) {

        projects[index] =
          saved;
      }


      saveLocalCache();


      stopCamera();


      alert(
        "✅ Signature photo saved."
      );


      closeSignature();


      showPaperwork(
        project.id
      );


    } catch (error) {

      console.error(
        "Camera signature error:",
        error
      );


      alert(
        "❌ Signature photo save nahi hui.\n\n" +
        error.message
      );
    }


    return;
  }


  /* ================= NEW PROJECT ================= */

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
        src="${escapeHTML(
          image
        )}"
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
//part 4//
/* ================= STOP CAMERA ================= */

function stopCamera() {

  if (cameraStream) {

    cameraStream
      .getTracks()
      .forEach(
        track => track.stop()
      );

    cameraStream =
      null;
  }


  const video =
    document.getElementById(
      "cameraPreview"
    );


  if (video) {

    video.srcObject =
      null;

    video.classList.add(
      "hidden"
    );
  }


  const captureBtn =
    document.getElementById(
      "captureBtn"
    );


  if (captureBtn) {

    captureBtn.classList.add(
      "hidden"
    );
  }
}


/* ================= CLOSE SIGNATURE ================= */

function closeSignature() {

  stopCamera();


  const page =
    document.getElementById(
      "signaturePage"
    );


  if (page) {

    page.classList.add(
      "hidden"
    );
  }
}


/* =========================================================
   BANNER EDIT
========================================================= */

function showBannerEditor() {

  openFullPage();


  let savedBanner =
    localStorage.getItem(
      "twd_banner"
    );


  fullPageContent.innerHTML = `

    <h1 class="modal-title">
      🖼️ BANNER EDIT
    </h1>


    <p
      style="
        color:#94a3b8;
        margin-bottom:20px;
      "
    >
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


/* ================= PREVIEW BANNER ================= */

function previewBanner(event) {

  const file =
    event.target.files[0];


  if (!file) {
    return;
  }


  /*
    Basic image size check.
    Bahut badi image backend ko
    unnecessary heavy bana sakti hai.
  */

  if (
    file.size >
    10 * 1024 * 1024
  ) {

    alert(
      "Image 10MB se chhoti rakho."
    );

    event.target.value =
      "";

    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function(e) {

      const preview =
        document.getElementById(
          "bannerPreview"
        );


      if (preview) {

        preview.style.backgroundImage =
          `url("${e.target.result}")`;
      }


      window.newBanner =
        e.target.result;
    };


  reader.readAsDataURL(
    file
  );
}


/* ================= SAVE BANNER ================= */

async function saveBanner() {

  if (
    !window.newBanner
  ) {

    alert(
      "Pehle banner image select karo."
    );

    return;
  }


  try {

    await apiRequest(
      "/settings/banner",
      {
        method: "PUT",

        body:
          JSON.stringify({
            banner:
              window.newBanner
          })
      }
    );


    /*
      Local cache bhi rakho.
    */

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


  } catch (error) {

    console.error(
      "Banner save error:",
      error
    );


    /*
      Backend fail ho to
      local browser copy save.
    */

    localStorage.setItem(
      "twd_banner",
      window.newBanner
    );


    applyBanner();


    alert(
      "⚠️ Backend banner save failed.\nLocal copy saved."
    );
  }
}


/* ================= APPLY BANNER ================= */

function applyBanner() {

  const banner =
    localStorage.getItem(
      "twd_banner"
    );


  if (!banner) {
    return;
  }


  const bg =
    document.getElementById(
      "mainBg"
    );


  if (!bg) {
    return;
  }


  bg.style.backgroundImage =
    `url("${banner}")`;


  bg.style.backgroundSize =
    "cover";


  bg.style.backgroundPosition =
    "center";
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  const confirmLogout =
    confirm(
      "Kya aap logout karna chahte ho?"
    );


  if (!confirmLogout) {
    return;
  }


  backendToken =
    "";


  sessionStorage.removeItem(
    "twd_backend_token"
  );


  sessionStorage.removeItem(
    "twd_logged_in"
  );


  const mainWebsite =
    document.getElementById(
      "mainWebsite"
    );


  const loginPage =
    document.getElementById(
      "loginPage"
    );


  if (mainWebsite) {

    mainWebsite.classList.add(
      "hidden"
    );
  }


  if (loginPage) {

    loginPage.classList.remove(
      "hidden"
    );
  }


  const password =
    document.getElementById(
      "loginPassword"
    );


  if (password) {

    password.value =
      "";
  }


  const error =
    document.getElementById(
      "loginError"
    );


  if (error) {

    error.textContent =
      "";
  }
}


/* =========================================================
   SECURITY DISPLAY
========================================================= */

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


/* =========================================================
   BACKEND CONNECTION TEST
========================================================= */

async function testBackendConnection() {

  try {

    const result =
      await apiRequest(
        "/health"
      );


    console.log(
      "================================"
    );


    console.log(
      "✅ THE WEB DEVELOPER BACKEND"
    );


    console.log(
      "Backend Status:",
      result
    );


    console.log(
      "================================"
    );


    return true;

  } catch (error) {

    console.error(
      "❌ Backend connection failed:",
      error
    );


    return false;
  }
}


/* =========================================================
   PAGE START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    /*
      Initial UI update
    */

    updateStats();

    applyBanner();


    /*
      Backend test
    */

    await testBackendConnection();


    /*
      Existing login token ho to
      remote data load karo.
    */

    if (backendToken) {

      try {

        await loadRemoteData();

      } catch (error) {

        console.error(
          "Startup remote load error:",
          error
        );
      }
    }

  }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

window.addEventListener(
  "unhandledrejection",
  function(event) {

    console.error(
      "Unhandled Promise Error:",
      event.reason
    );

  }
);


/* =========================================================
   FINAL START
========================================================= */

updateStats();

applyBanner();
