
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const internshipList = document.getElementById("internshipList");
  const internshipSearch = document.getElementById("internshipSearch");
  const searchButton = document.getElementById("searchButton");
  const internshipStatus = document.getElementById("internshipStatus");
  const applicationForm = document.getElementById("applicationForm");
  const internshipSelect = document.getElementById("internshipId");
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("submitButton");
  const currentYear = document.getElementById("currentYear");

  let internships = [];

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      const message =
        result.errors?.join(" ") ||
        result.message ||
        "Something went wrong. Please try again.";

      throw new Error(message);
    }

    return result;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function renderInternships(items) {
    internshipList.replaceChildren();

    if (!items.length) {
      internshipList.appendChild(
        createElement(
          "p",
          "empty-state",
          "No internships found. Try another search."
        )
      );

      return;
    }

    items.forEach((internship) => {
      const card = createElement("article", "internship-card");

      const cardTop = createElement("div", "internship-card-top");
      const icon = createElement("div", "internship-icon", "E");
      const location = createElement(
        "span",
        "location-badge",
        internship.location || "Location not specified"
      );

      cardTop.append(icon, location);

      const title = createElement(
        "h3",
        "internship-title",
        internship.title
      );

      const company = createElement(
        "p",
        "company-name",
        internship.company
      );

      const duration = createElement(
        "p",
        "internship-duration",
        `Duration: ${internship.duration || "Not specified"}`
      );

      const skillsHeading = createElement("p", "skills-heading", "Skills");

      const skillsContainer = createElement("div", "skills-list");

      (Array.isArray(internship.skills) ? internship.skills : []).forEach(
        (skill) => {
          skillsContainer.appendChild(
            createElement("span", "skill-tag", skill)
          );
        }
      );

      const applyButton = createElement(
        "button",
        "card-apply-button",
        "Apply for this role →"
      );

      applyButton.type = "button";

      applyButton.addEventListener("click", () => {
        internshipSelect.value = String(internship.id);

        document.getElementById("apply").scrollIntoView({
          behavior: "smooth"
        });

        document.getElementById("fullName").focus({
          preventScroll: true
        });
      });

      card.append(
        cardTop,
        title,
        company,
        duration,
        skillsHeading,
        skillsContainer,
        applyButton
      );

      internshipList.appendChild(card);
    });
  }

  function populateInternshipSelect(items) {
    const previousValue = internshipSelect.value;

    internshipSelect.replaceChildren();

    const defaultOption = createElement(
      "option",
      "",
      "Choose an internship"
    );

    defaultOption.value = "";
    internshipSelect.appendChild(defaultOption);

    items.forEach((internship) => {
      const option = createElement(
        "option",
        "",
        `${internship.title} — ${internship.company}`
      );

      option.value = String(internship.id);

      internshipSelect.appendChild(option);
    });

    if (
      items.some((internship) => String(internship.id) === previousValue)
    ) {
      internshipSelect.value = previousValue;
    }
  }

  async function loadInternships(search = "") {
    internshipStatus.textContent = "Loading internship opportunities...";

    internshipList.setAttribute("aria-busy", "true");

    try {
      const query = search.trim()
        ? `?search=${encodeURIComponent(search.trim())}`
        : "";

      const result = await apiRequest(`/api/internships${query}`);

      internships = Array.isArray(result.data) ? result.data : [];

      renderInternships(internships);
      populateInternshipSelect(internships);

      internshipStatus.textContent = `${result.count ?? internships.length} internship(s) found.`;
    } catch (error) {
      internshipList.replaceChildren();

      internshipStatus.textContent = error.message;

      const retryButton = createElement(
        "button",
        "secondary-button",
        "Try again"
      );

      retryButton.type = "button";
      retryButton.addEventListener("click", () => loadInternships());

      internshipList.appendChild(retryButton);
    } finally {
      internshipList.removeAttribute("aria-busy");
    }
  }

  let searchTimer;

  internshipSearch.addEventListener("input", () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      loadInternships(internshipSearch.value);
    }, 300);
  });

  searchButton.addEventListener("click", () => {
    clearTimeout(searchTimer);
    loadInternships(internshipSearch.value);
  });

  internshipSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      clearTimeout(searchTimer);
      loadInternships(internshipSearch.value);
    }
  });

  applicationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!applicationForm.reportValidity()) {
      return;
    }

    const formData = new FormData(applicationForm);

    const application = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      skills: String(formData.get("skills") || "").trim(),
      internshipId: Number(formData.get("internshipId"))
    };

    if (!Number.isSafeInteger(application.internshipId) ||
        application.internshipId <= 0) {
      formStatus.textContent = "Please select a valid internship.";
      formStatus.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const result = await apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify(application)
      });

      formStatus.textContent =
        `${result.message} Your application ID is ${result.data.id}.`;

      formStatus.classList.add("success");

      applicationForm.reset();
    } catch (error) {
      formStatus.textContent = error.message;
      formStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Application";
    }
  });

  loadInternships();
});

