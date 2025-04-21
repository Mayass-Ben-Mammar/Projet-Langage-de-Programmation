fetch("https://restcountries.com/v3.1/all")
    .then(response => {
        if (!response.ok) {
            throw new Error("Pays introuvable");
        }
        return response.json();
    })
    .then(data => {
        let paysListe = [];

        for (let val of data) {
            let nomAnglais = val.name.common;
            let nomFrancais = val.translations?.fra?.common || "Non disponible";
            paysListe.push({ anglais: nomAnglais, francais: nomFrancais });
        }

        // Trier par nom français
        paysListe.sort((a, b) => a.francais.localeCompare(b.francais));

        // Sélection des deux colonnes
        let colonneFrancais = document.getElementById("francais");
        let colonneAnglais = document.getElementById("anglais");

        // Réinitialiser les colonnes avant d'ajouter du contenu
        colonneFrancais.innerHTML = "";
        colonneAnglais.innerHTML = "";

        // Remplir les colonnes
        let listeFrancais = "";
        let listeAnglais = "";

        for (let pays of paysListe) {
            listeFrancais += `<p>${pays.francais}</p>`; // Ajoute chaque pays en français
            listeAnglais += `<p>${pays.anglais}</p>`;   // Ajoute chaque pays en anglais
        }

        // Injecter le contenu dans chaque colonne
        colonneFrancais.innerHTML = listeFrancais;
        colonneAnglais.innerHTML = listeAnglais;
    })
    .catch(error => console.error("Erreur lors du chargement des pays :", error));


anime({
  targets: '#paysaffichage p',
  opacity: [0, 1],
  translateX: [-20, 0],
  delay: anime.stagger(50),
  duration: 600,
  easing: 'easeOutQuad'
});
