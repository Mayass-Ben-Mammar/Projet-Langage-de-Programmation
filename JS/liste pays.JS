// Verification
let cachedata = localStorage.getItem("allCountriesData");

if (cachedata) {
    // Si les donnees sont dans le localStorage, on va les utiliser
    afficherPaysListe(JSON.parse(cachedata));
} else {
    fetch("https://restcountries.com/v3.1/all")
        .then(response => {
            if (!response.ok) {
                throw new Error("Pays introuvable");
            }
            return response.json();
        })
        .then(data => {
            // Stocker la reponse dans le localStorage
            localStorage.setItem("allCountriesData", JSON.stringify(data));

            // Recuperer les donnees et trier
            let paysListe = [];

            for (let val of data) {
                let nomAnglais = val.name.common;
                let nomFrancais = val.translations?.fra?.common || "Non disponible";
                paysListe.push({ anglais: nomAnglais, francais: nomFrancais });
            }

            // Trier par nom français
            paysListe.sort((a, b) => a.francais.localeCompare(b.francais));

            // Afficher les pays
            afficherPaysListe(paysListe);
        })
        .catch(error => console.error("Erreur lors du chargement des pays :", error));
}

// Fonction pour afficher la liste des pays dans les colonnes
function afficherPaysListe(paysListe) {
    let colonneFrancais = document.getElementById("francais");
    let colonneAnglais = document.getElementById("anglais");

    // Reinitialiser les colonnes avant d'ajouter du contenu
    colonneFrancais.innerHTML = "";
    colonneAnglais.innerHTML = "";

    // Remplir les colonnes
    let listeFrancais = "";
    let listeAnglais = "";

    for (let pays of paysListe) {
        listeFrancais += `<p>${pays.francais}</p>`; 
        listeAnglais += `<p>${pays.anglais}</p>`;  
    }

    // Injecter le contenu dans chaque colonne
    colonneFrancais.innerHTML = listeFrancais;
    colonneAnglais.innerHTML = listeAnglais;
}
