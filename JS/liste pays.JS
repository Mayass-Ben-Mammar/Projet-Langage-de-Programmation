fetch("https://restcountries.com/v3.1/all")
    .then(response => {
        if (!response.ok) {
            throw new Error("Pays introuvable"); // Cas erreur
        }
        return response.json();
    })
    .then(data => {
        let paysListe = []; // Liste des pays sous forme de dictionnaires {anglais: ..., francais: ...}

        for (let val of data) {
            let nomAnglais = val.name.common;
            let nomFrancais = val.translations?.fra?.common || "Non disponible"; // Cas ou le pays est pas disponible
            paysListe.push({ anglais: nomAnglais, francais: nomFrancais }); // On ajoute le dictionnaire
        }

        // Trier les pays par leur nom en anglais
        paysListe.sort((a, b) => a.francais.localeCompare(b.francais)); // on compare selon le critere nom francais et renvoie -1 0 1 selon si c'est dans l'ordre ou non.
		// On utilise une fonction flechee pour que sort rearrange b ou a selon le resultat de la fonction

        let txt = "";
        for (let pays of paysListe) { // Affichage pays dans les deux langues pour chaque
            txt += `<br>Français: <strong>${pays.francais}</strong><br>Anglais: <strong>${pays.anglais}</strong><br>`;
        }

        document.getElementById("paysaffichage").innerHTML = txt;
    })
    .catch(error => console.error("Erreur lors du chargement des pays :", error));