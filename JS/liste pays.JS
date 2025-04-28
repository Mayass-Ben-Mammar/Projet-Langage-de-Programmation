function obtenirTousLesPays() {
    const cache = localStorage.getItem("paysData");
    const expiration = localStorage.getItem("paysData_exp");

    const maintenant = new Date().getTime();

    if (cache && expiration && maintenant < parseInt(expiration)) {
        try {
            return Promise.resolve(JSON.parse(cache));
        } catch (e) {
            console.error("Erreur de lecture du cache :", e);
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
        })
        .catch(error => {
            console.error("Erreur de chargement des pays :", error);

            if (cache) {
                alert("⚠️ Impossible de mettre à jour les données. Utilisation du cache existant.");
                return JSON.parse(cache);
            } else {
                alert("❌ Aucune connexion et aucune donnée en cache. Impossible de charger la liste des pays !");
                throw error;
            }
        });
}

function nouveauTimestamp() {
    return new Date().getTime() + 1000 * 60 * 60 * 24; // 24 heures
}

function nouveauTimestamp() {
    return new Date().getTime() + 1000 * 60 * 60 * 24; // 24 heures
}

function afficherPays(paysListe) {
    const colonneFrancais = document.getElementById("francais");
    const colonneAnglais = document.getElementById("anglais");
    
    colonneFrancais.innerHTML = "";
    colonneAnglais.innerHTML = "";

    for (let pays of paysListe) {
        colonneFrancais.innerHTML += `<p>${pays.francais}</p>`;
        colonneAnglais.innerHTML += `<p>${pays.anglais}</p>`;
    }
}

function chargerPays() {
    obtenirTousLesPays()
        .then(data => {
            if (!data || data.length === 0) {
                return;
            }

            let paysListe = [];

            for (let val of data) {
                let nomAnglais = val.name?.common || "Non disponible";
                let nomFrancais = val.translations?.fra?.common || "Non disponible";
                paysListe.push({ anglais: nomAnglais, francais: nomFrancais });
            }

            paysListe.sort((a, b) => a.francais.localeCompare(b.francais));

            localStorage.setItem("paysListe", JSON.stringify(paysListe));
            afficherPays(paysListe);
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
}

function deletecache() {
    localStorage.removeItem("paysData");
    localStorage.removeItem("paysData_exp");
    localStorage.removeItem("paysListe");
}

document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clearCacheBtn");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            deletecache();

            Swal.fire({
                icon: 'success',
                title: 'Cache vidé',
                text: 'Le cache local a bien été supprimé.',
                confirmButtonText: 'OK'
            });

            setTimeout(() => location.reload(), 1500);
        });
    }

    if (!navigator.onLine) {
        Swal.fire({
            icon: 'error',
            title: 'Pas de connexion Internet',
            text: 'Vous êtes actuellement hors ligne. Vérifiez votre connexion.',
            confirmButtonText: 'Réessayer'
        });
    }

    if (!localStorage.getItem('paysData')) {
        Swal.fire({
            icon: 'warning',
            title: 'Aucune donnée disponible',
            text: 'Aucune donnée n’a été trouvée dans le cache.',
            confirmButtonText: 'OK'
        });
    }
});

// Lancer la fonction au chargement de la page
window.addEventListener("load", chargerPays);