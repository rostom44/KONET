import { useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/location-modal.css";
import {
  CITY_DISPLAY_NAMES,
  QUICK_CITIES,
  KNOWN_AREAS,
} from "../data/cities.js";

// Input sanitization
function sanitizeInput(input) {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        let message = "Erreur de géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Géolocalisation refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position indisponible";
            break;
          case error.TIMEOUT:
            message = "Délai d'attente dépassé";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

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

function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]/g, "");
}

function isKnownArea(cityName) {
  const normalized = normalizeString(cityName);
  if (normalized.length < 2) return false;
  // Only accept exact matches
  return KNOWN_AREAS.some((area) => {
    const normalizedArea = normalizeString(area);
    return normalizedArea === normalized;
  });
}

function fuzzyMatch(input, target, threshold = 0.6) {
  const normalizedInput = normalizeString(input);
  const normalizedTarget = normalizeString(target);

  if (normalizedInput === normalizedTarget) return 1;
  if (normalizedTarget.includes(normalizedInput)) return 0.9;
  if (normalizedInput.includes(normalizedTarget)) return 0.8;

  // Simple character similarity
  const longer =
    normalizedInput.length > normalizedTarget.length
      ? normalizedInput
      : normalizedTarget;
  const shorter =
    normalizedInput.length > normalizedTarget.length
      ? normalizedTarget
      : normalizedInput;

  if (longer.length === 0) return 1;

  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }

  const similarity = matches / longer.length;
  return similarity >= threshold ? similarity : 0;
}

function getSuggestions(input) {
  if (input.length < 2) return [];

  const suggestions = CITY_DISPLAY_NAMES.map((city) => ({
    name: city,
    score: fuzzyMatch(input, city),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.name);

  return suggestions;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CONFIG = {
  LYON_CENTER: { lat: 45.7578, lng: 4.832 },
  SERVICE_RADIUS_KM: 20,
  PHONE: "04 XX XX XX XX",
  CONTACT_URL: "/contact",
};

function LocationCheckerModal() {
  useEffect(() => {
    if (
      localStorage.getItem("locationChecked") === "1" ||
      localStorage.getItem("locationDenied") === "1"
    )
      return;

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
      html: `<div style='text-align:left;'>Nous intervenons dans un rayon de <b>20km autour de Lyon</b>.<br>Souhaitez-vous vérifier automatiquement si vous êtes dans notre secteur?<br><span style='color:#d32f2f;font-size:0.97em;display:block;margin-top:0.9em;'>Votre emplacement reste privé sur votre appareil uniquement</span></div>`,
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
            try {
              const coords = await getCurrentLocation();
              Swal.close();
              const distance = calculateDistance(
                CONFIG.LYON_CENTER.lat,
                CONFIG.LYON_CENTER.lng,
                coords.latitude,
                coords.longitude
              );
              if (distance <= CONFIG.SERVICE_RADIUS_KM) {
                localStorage.setItem("locationChecked", "1");
                showResult(
                  "success",
                  `✅ Parfait ! Vous êtes à ${distance.toFixed(1)}km de Lyon - nous intervenons dans votre secteur !`
                );
              } else {
                showResult(
                  "error",
                  `❌ Désolé, vous êtes à ${distance.toFixed(1)}km de Lyon, ce qui dépasse notre zone de ${CONFIG.SERVICE_RADIUS_KM}km.`,
                  `<br><small>Contactez-nous quand même - nous pouvons faire des exceptions pour les gros chantiers !</small>`
                );
              }
            } catch (e) {
              // Show manual input if geolocation fails
              Swal.update({
                title: "Vérification manuelle",
                html: `
                  <div style='margin-bottom:1em;color:#856404;'>⚠️ ${e.message}<br><small>Veuillez sélectionner votre ville manuellement ci-dessous.</small></div>
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
              // Add quick city buttons
              setTimeout(() => {
                const quickCitiesDiv =
                  document.getElementById("swal2-quick-cities");
                if (quickCitiesDiv) {
                  QUICK_CITIES.forEach((city) => {
                    const btn = document.createElement("button");
                    btn.textContent = city;
                    btn.className = "swal2-styled";
                    btn.style.background = "#e9ecef";
                    btn.style.color = "#333";
                    btn.style.fontWeight = "500";
                    btn.onclick = () => {
                      const cityInput =
                        document.getElementById("swal2-city-input");
                      if (cityInput) cityInput.value = city;
                      const suggestionsDiv =
                        document.getElementById("swal2-suggestions");
                      if (suggestionsDiv) suggestionsDiv.style.display = "none";
                    };
                    quickCitiesDiv.appendChild(btn);
                  });
                }
                // Manual check button
                const checkBtn = document.getElementById("swal2-city-check");
                if (checkBtn) {
                  checkBtn.onclick = () => {
                    const city = document
                      .getElementById("swal2-city-input")
                      .value.trim();
                    handleCityCheck(city);
                  };
                }
                // Enter key (use onkeydown instead of deprecated onkeypress)
                const cityInput = document.getElementById("swal2-city-input");
                const suggestionsDiv =
                  document.getElementById("swal2-suggestions");

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
                            `<div class='suggestion-item' data-index='${index}' style='padding:8px 12px;cursor:pointer;border-bottom:1px solid #eee;' onmouseover='this.style.background="#f0f0f0"' onmouseout='this.style.background="white"'>${suggestion}</div>`
                        )
                        .join("");
                      suggestionsDiv.style.display = "block";

                      // Add click handlers to suggestions
                      suggestions.forEach((suggestion, index) => {
                        const item = suggestionsDiv.querySelector(
                          `[data-index='${index}']`
                        );
                        if (item) {
                          item.onclick = () => {
                            // Always get fresh input and suggestionsDiv
                            const cityInputEl =
                              document.getElementById("swal2-city-input");
                            const suggestionsDivEl =
                              document.getElementById("swal2-suggestions");
                            if (cityInputEl) cityInputEl.value = suggestion;
                            if (suggestionsDivEl)
                              suggestionsDivEl.style.display = "none";
                            // Do not call handleCityCheck here; let user confirm
                          };
                        }
                      });
                    } else {
                      suggestionsDiv.style.display = "none";
                    }
                  };

                  cityInput.onkeydown = (e) => {
                    const suggestions =
                      suggestionsDiv.querySelectorAll(".suggestion-item");

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      selectedSuggestionIndex = Math.min(
                        selectedSuggestionIndex + 1,
                        suggestions.length - 1
                      );
                      updateSuggestionSelection(
                        suggestions,
                        selectedSuggestionIndex
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      selectedSuggestionIndex = Math.max(
                        selectedSuggestionIndex - 1,
                        -1
                      );
                      updateSuggestionSelection(
                        suggestions,
                        selectedSuggestionIndex
                      );
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
                    // Delay hiding to allow clicking on suggestions
                    setTimeout(() => {
                      suggestionsDiv.style.display = "none";
                    }, 150);
                  };

                  function updateSuggestionSelection(suggestions, index) {
                    suggestions.forEach((item, i) => {
                      if (i === index) {
                        item.style.background = "#007bff";
                        item.style.color = "white";
                      } else {
                        item.style.background = "white";
                        item.style.color = "black";
                      }
                    });
                  }
                }
              }, 100);
            }
          },
        });
      } else if (result.dismiss === "cancel" || result.isDenied === true) {
        // User explicitly clicked 'Non, merci' (user said no, respect their choice)
        localStorage.setItem("locationDenied", "1");
      }
    });

    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);

  function handleCityCheck(cityName) {
    const sanitizedCity = sanitizeInput(cityName);
    if (!sanitizedCity) {
      showResult("error", "Veuillez saisir le nom de votre ville");
      return;
    }
    if (isKnownArea(sanitizedCity)) {
      localStorage.setItem("locationChecked", "1");
      showResult(
        "success",
        `✅ Excellent ! Nous intervenons à ${sanitizedCity}.`
      );
    } else {
      showResult(
        "warning",
        `⚠️ Nous n'avons pas pu vérifier automatiquement "${sanitizedCity}".`,
        `<br><strong>Appelez-nous au ${CONFIG.PHONE}</strong> pour confirmer votre secteur.<br><small>Nous intervenons dans un rayon de 20km autour de Lyon.</small>`
      );
    }
  }

  return null;
}

export default LocationCheckerModal;
