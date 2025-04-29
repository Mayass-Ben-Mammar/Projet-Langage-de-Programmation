function obtenirTousLesPays() {
    const cache = localStorage.getItem("paysData");
    const expiration = localStorage.getItem("paysData_exp");

    const maintenant = new Date().getTime();
    const expireDans = 1000 * 60 * 60 * 24; // 24 heures

    if (cache && expiration && maintenant < parseInt(expiration)) {
        try {
            return Promise.resolve(JSON.parse(cache));
        } catch (e) {
            localStorage.removeItem("paysData");
            localStorage.removeItem("paysData_exp");
        }
    }

    return fetch("https://restcountries.com/v3.1/all")
        .then(response => {
            if (!response.ok) throw new Error("Erreur lors du chargement des pays");
            return response.json();
        })
        .then(data => {
            localStorage.setItem("paysData", JSON.stringify(data));
            localStorage.setItem("paysData_exp", (nouveauTimestamp()).toString());
            return data;
        });
}

function nouveauTimestamp() {
    return new Date().getTime() + 1000 * 60 * 60 * 24; // 24 heures
}

function afficherPays(paysListe) {
    // Sélection des colonnes
    const colonneFrancais = document.getElementById("francais");
    const colonneAnglais = document.getElementById("anglais");
    
    // Remplir les colonnes
    for (let pays of paysListe) {
        colonneFrancais.innerHTML += `<p>${pays.francais}</p>`;
        colonneAnglais.innerHTML += `<p>${pays.anglais}</p>`;
    }
}

function chargerPays() {
    obtenirTousLesPays()
        .then(data => {
            let paysListe = [];

            for (let val of data) {
                let nomAnglais = val.name.common;
                let nomFrancais = val.translations?.fra?.common || "Non disponible";
                paysListe.push({ anglais: nomAnglais, francais: nomFrancais });
            }

            paysListe.sort((a, b) => a.francais.localeCompare(b.francais));

            localStorage.setItem("paysListe", JSON.stringify(paysListe)); // optionnel
            afficherPays(paysListe);
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
}

// Lancer la fonction au chargement de la page
window.addEventListener("load", chargerPays);