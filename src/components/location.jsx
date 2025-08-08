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
    html: `<div style="font-size:1.1em;">${message}${actions}</div>`,
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
      <div style='margin-bottom:1em;color:var(--secondary-color);'>⚠️ ${errorMessage}<br><small>Veuillez sélectionner votre ville manuellement ci-dessous.</small></div>
      <label for='swal2-city-input'>Saisissez votre ville :</label>
      <div style='position:relative;'>
        <input id='swal2-city-input' class='swal2-input' placeholder='ex: Villeurbanne, Lyon 3ème...' autocomplete='off'>
        <div id='swal2-suggestions' style='position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #ddd;border-top:none;max-height:200px;overflow-y:auto;z-index:1000;display:none;'></div>
      </div>
      <button id='swal2-city-check' class='swal2-confirm swal2-styled' style='margin-top:0.5em;'>Vérifier</button>
      <div style='margin:1em 0 0.5em 0;'>Ou sélectionnez directement :</div>
      <div id='swal2-quick-cities' style='display:flex;flex-wrap:wrap;gap:0.5em;'></div>
      <div style='margin-top:1em;font-size:0.95em;'>
        <b>Contact :</b> <a href='tel:${CONFIG.PHONE.replace(/ /g, "")} ' style='color:#007bff;text-decoration:underline;'>${CONFIG.PHONE}</a>
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
        btn.className = "swal2-styled";
        btn.style.background = "var(--accent-color)";
        btn.style.color = "var(--neutral-color)";
        btn.style.fontWeight = "500";
        btn.onclick = () => {
          const cityInput = document.getElementById("swal2-city-input");
          if (cityInput) cityInput.value = city;
          const suggestionsDiv = document.getElementById("swal2-suggestions");
          if (suggestionsDiv) suggestionsDiv.style.display = "none";
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
                `<div class='suggestion-item' data-index='${index}' style='padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border-color);background:var(--primary-color);color:var(--neutral-color);' onmouseover='this.style.background="var(--accent-color)";this.style.color="var(--neutral-color)"' onmouseout='this.style.background="var(--primary-color)";this.style.color="var(--neutral-color)"'>${suggestion}</div>`
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
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
          updateSuggestionSelection(suggestions, selectedSuggestionIndex);
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
            item.style.background = "var(--accent-color)";
            item.style.color = "var(--neutral-color)";
          } else {
            item.style.background = "var(--primary-color)";
            item.style.color = "var(--neutral-color)";
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
            html: `<div style='margin:1em 0;'><span class='swal2-loader'></span> Veuillez patienter...</div>`,
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
      html: `<div style='text-align:left;'>Nous intervenons dans un rayon de <b>20km autour de Lyon</b>.<br>Souhaitez-vous vérifier automatiquement si vous êtes dans notre secteur?<br><span style='color:var(--secondary-color);font-size:0.97em;display:block;margin-top:0.9em;'>Votre emplacement reste privé sur votre appareil uniquement</span></div>`,
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
        // Move modal to bottom right
        const popup = document.querySelector(".swal2-location-popup");
        if (popup) {
          popup.style.position = "fixed";
          popup.style.right = "2vw";
          popup.style.bottom = "2vh";
          popup.style.left = "auto";
          popup.style.top = "auto";
          popup.style.margin = "0";
          popup.style.zIndex = 9999;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show loader
        Swal.fire({
          title: "Détection de votre position...",
          html:
            `<div style='margin:1em 0;'><span class='swal2-loader'></span> Veuillez patienter...</div>` +
            `<div id='swal2-location-manual' style='display:none;'></div>`,
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
