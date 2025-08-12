import { useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/location-modal.css";
import {
  CONFIG,
  shouldShowLocationModal,
  checkLocationByCoords,
  checkLocationByCity,
  getSuggestions,
  locationStorage,
  QUICK_CITIES,
} from "../utils/locationUtils.js";

// --- UI helpers moved outside the component to avoid React Hook dependency warning ---
function showResult(type, message, actions = "") {
  let icon = "info";
  if (type === "success") icon = "success";
  else if (type === "error") icon = "error";
  else if (type === "warning") icon = "warning";

  Swal.fire({
    icon,
    html: `<div class="swal-result-content">${message}${actions}</div>`,
    confirmButtonText: "Fermer",
    customClass: {
      popup: "swal2-location-popup",
    },
  });
}

function showManualInput(errorMessage = "") {
  Swal.fire({
    title: "Vérification manuelle",
    html: `
      <div class='swal-manual-error' role="alert" aria-live="assertive">
        <span class="warning-icon" aria-hidden="true">⚠️</span> ${errorMessage}
        <small>Veuillez sélectionner votre ville manuellement ci-dessous.</small>
      </div>
      <label for='swal2-city-input' class='swal-city-label'>Saisissez votre ville :</label>
      <div class='swal-input-wrapper'>
        <input id='swal2-city-input' class='swal2-input' placeholder='ex: Villeurbanne, Lyon 3ème...'
          autocomplete='off' aria-label="Saisissez votre ville" aria-autocomplete="list" aria-controls="swal2-suggestions" aria-haspopup="listbox" role="combobox">
        <ul id='swal2-suggestions' class='swal-suggestions' role="listbox" aria-label="Suggestions de villes"></ul>
      </div>
      <button id='swal2-city-check' class='swal2-confirm swal2-styled swal-city-check-btn' aria-label="Vérifier la ville">Vérifier</button>
      <div class='swal-quick-cities-label'>Ou sélectionnez directement :</div>
      <div id='swal2-quick-cities' class='swal-quick-cities' role="group" aria-label="Villes rapides"></div>
      <div class='swal-contact-info'>
        <b>Contact :</b> <a href='tel:${CONFIG.PHONE.replace(/ /g, "")}' class='swal-phone-link' aria-label="Téléphone">${CONFIG.PHONE}</a>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: "swal2-location-popup swal2-bottom-right",
    },
  });

  setTimeout(() => {
    const quickCitiesDiv = document.getElementById("swal2-quick-cities");
    if (quickCitiesDiv) {
      QUICK_CITIES.forEach((city) => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.className = "swal2-styled swal-quick-city-btn";
        btn.setAttribute("aria-label", `Choisir la ville ${city}`);
        btn.onclick = () => {
          const cityInput = document.getElementById("swal2-city-input");
          if (cityInput) cityInput.value = city;
          const suggestionsDiv = document.getElementById("swal2-suggestions");
          if (suggestionsDiv) suggestionsDiv.style.display = "none";
          cityInput && cityInput.focus();
        };
        quickCitiesDiv.appendChild(btn);
      });
    }

    const checkBtn = document.getElementById("swal2-city-check");
    if (checkBtn) {
      checkBtn.onclick = () => {
        const city = document.getElementById("swal2-city-input").value.trim();
        handleCityCheck(city);
      };
    }

    const cityInput = document.getElementById("swal2-city-input");
    const suggestionsDiv = document.getElementById("swal2-suggestions");

    if (cityInput && suggestionsDiv) {
      let selectedSuggestionIndex = -1;

      cityInput.oninput = (e) => {
        const value = e.target.value.trim();
        const suggestions = getSuggestions(value);
        selectedSuggestionIndex = -1;

        if (suggestions.length > 0 && value.length >= 2) {
          suggestionsDiv.innerHTML = suggestions
            .map(
              (suggestion, index) =>
                `<li class='suggestion-item' data-index='${index}' role="option" tabindex="-1">${suggestion}</li>`
            )
            .join("");
          suggestionsDiv.style.display = "block";

          suggestions.forEach((suggestion, index) => {
            const item = suggestionsDiv.querySelector(
              `[data-index='${index}']`
            );
            if (item) {
              item.onclick = () => {
                const cityInputEl = document.getElementById("swal2-city-input");
                const suggestionsDivEl =
                  document.getElementById("swal2-suggestions");
                if (cityInputEl) cityInputEl.value = suggestion;
                if (suggestionsDivEl) suggestionsDivEl.style.display = "none";
                cityInputEl && cityInputEl.focus();
              };
              item.onkeydown = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  item.click();
                }
              };
            }
          });
        } else {
          suggestionsDiv.style.display = "none";
        }
      };

      cityInput.onkeydown = (e) => {
        const suggestions = suggestionsDiv.querySelectorAll(".suggestion-item");

        if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedSuggestionIndex = Math.min(
            selectedSuggestionIndex + 1,
            suggestions.length - 1
          );
          updateSuggestionSelection(suggestions, selectedSuggestionIndex);
          if (suggestions[selectedSuggestionIndex])
            suggestions[selectedSuggestionIndex].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
          updateSuggestionSelection(suggestions, selectedSuggestionIndex);
          if (
            selectedSuggestionIndex >= 0 &&
            suggestions[selectedSuggestionIndex]
          )
            suggestions[selectedSuggestionIndex].focus();
          else cityInput.focus();
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (
            selectedSuggestionIndex >= 0 &&
            suggestions[selectedSuggestionIndex]
          ) {
            const selectedText =
              suggestions[selectedSuggestionIndex].textContent;
            cityInput.value = selectedText;
            suggestionsDiv.style.display = "none";
            handleCityCheck(selectedText);
          } else {
            const city = e.target.value.trim();
            suggestionsDiv.style.display = "none";
            handleCityCheck(city);
          }
        } else if (e.key === "Escape") {
          suggestionsDiv.style.display = "none";
          selectedSuggestionIndex = -1;
        }
      };

      cityInput.onblur = () => {
        setTimeout(() => {
          suggestionsDiv.style.display = "none";
        }, 150);
      };

      function updateSuggestionSelection(suggestions, index) {
        suggestions.forEach((item, i) => {
          if (i === index) {
            item.classList.add("suggestion-item-selected");
            item.setAttribute("aria-selected", "true");
          } else {
            item.classList.remove("suggestion-item-selected");
            item.setAttribute("aria-selected", "false");
          }
        });
      }
    }
  }, 100);
}

function handleCityCheck(cityName) {
  const result = checkLocationByCity(cityName);

  if (result.success) {
    showResult("success", result.message);
  } else if (result.type === "validation") {
    showResult("error", result.message);
  } else {
    showResult(
      "warning",
      result.message,
      `<br><strong>${result.note}</strong><br><small>${result.details}</small><br><button id='swal2-retry-geo' class='swal2-styled'>Réessayer la géolocalisation</button>`
    );

    setTimeout(() => {
      const retryBtn = document.getElementById("swal2-retry-geo");
      if (retryBtn) {
        retryBtn.onclick = async () => {
          Swal.update({
            title: "Détection de votre position...",
            html: `<div class='swal-loader-container'><span class='swal2-loader'></span> Veuillez patienter...</div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: "swal2-location-popup",
            },
          });

          const result = await checkLocationByCoords();
          if (result.success) {
            showResult("success", result.message);
          } else if (result.requiresManualInput) {
            showManualInput(result.message);
          } else {
            showResult(
              "error",
              result.message,
              result.note ? `<br><small>${result.note}</small>` : ""
            );
          }
        };
      }
    }, 100);
  }
}

function LocationCheckerModal() {
  useEffect(() => {
    if (!shouldShowLocationModal()) return;

    // Remove SweetAlert2's scroll lock if present
    const observer = new MutationObserver(() => {
      document.body.style.overflow = "";
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Show consent modal in bottom-right
    Swal.fire({
      title: "Zone d'intervention",
      html: `<div class='swal-consent-content'>
        Nous intervenons dans un rayon de <b>20km autour de Lyon</b>.<br>
        Souhaitez-vous vérifier automatiquement si vous êtes dans notre secteur?<br>
        <span class='swal-privacy-note'>Votre emplacement reste privé sur votre appareil uniquement</span>
      </div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, vérifier",
      cancelButtonText: "Non, merci",
      customClass: {
        popup: "swal2-location-popup swal2-bottom-right",
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: true,
      didOpen: () => {
        // Position is now handled by CSS classes
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show loader
        Swal.fire({
          title: "Détection de votre position...",
          html: `<div class='swal-loader-container'>
            <span class='swal2-loader'></span> Veuillez patienter...
          </div>
          <div id='swal2-location-manual' class='swal-location-manual'></div>`,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            popup: "swal2-location-popup swal2-bottom-right",
          },
          didOpen: async () => {
            const result = await checkLocationByCoords();
            Swal.close();
            if (result.success) {
              showResult("success", result.message);
            } else if (result.requiresManualInput) {
              showManualInput(result.message);
            } else {
              showResult(
                "error",
                result.message,
                result.note ? `<br><small>${result.note}</small>` : ""
              );
            }
          },
        });
      } else if (result.dismiss === "cancel" || result.isDenied === true) {
        locationStorage.setLocationDenied();
      }
    });

    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);

  return null;
}

export default LocationCheckerModal;
