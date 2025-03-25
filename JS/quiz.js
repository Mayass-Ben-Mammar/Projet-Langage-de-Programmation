let paysdata = [];
let choix = null;
let vie = 6;

function Commencer() {
    // Verification
    let storedData = localStorage.getItem("allCountriesData");

    if (storedData) {
		// Si les donnees sont dans le localStorage, on va les utiliser
        paysdata = JSON.parse(storedData);
        choisirPaysMystere(); // Fonction du quiz
    } else {
        fetch("https://restcountries.com/v3.1/all")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Pays introuvable");
                }
                return response.json();
            })
            .then(data => {
                paysdata = data; // On stocke les infos des pays
                localStorage.setItem("allCountriesData", JSON.stringify(data)); // Sauvegarder dans localStorage
                choisirPaysMystere(); // Choisir un pays mystère
            })
            .catch(error => console.error("Erreur lors du chargement des pays :", error));
    }

    // Réinitialiser l'affichage
    document.getElementById("result").innerHTML = "";
    document.getElementById("Entree").innerHTML = `
        <h2><label for="name">Entrer un pays :</label></h2>
        <input type="text" id="name" name="name" size="30"/>
        <button onclick="Devine()">Valider</button>
    `;
}

function choisirPaysMystere() {
    // Choisir un pays au hasard dans la liste
    choix = paysdata[Math.floor(Math.random() * paysdata.length)];
    console.log("Pays mystère :", choix.name.common); // Debug
}

function Devine() {
    let resultD = document.getElementById("result"); 
    let errorMessage = document.getElementById("Erreur"); // Zone d'affichage des erreurs
    let choixuser = document.getElementById("name").value.trim().toLowerCase();

    // Chercher le pays dans la liste
    let paysDevine = paysdata.find(c => c.name.common.toLowerCase() === choixuser);

    if (!paysDevine) {
        errorMessage.innerHTML = `<span class="error-text">❌ Pays introuvable !</span>`;
        return;
    }

    errorMessage.innerHTML = ""; // Efface le message d'erreur si le pays est valide

    let indicateurs = [];
    let cdt = true;

    // Comparer les informations entre le pays deviné et le pays mystère
    if (paysDevine.region === choix.region) {
        indicateurs.push(`🌍 Région : ✅ Correct ! (${choix.region})`);
    } else {
        cdt = false;
        indicateurs.push(`🌍 Région : ❌ Faux (${paysDevine.region} au lieu de ${choix.region})`);
    }

    let CapitaleDevine = paysDevine.capital ? paysDevine.capital[0] : "N/A";
    let Choixcapital = choix.capital ? choix.capital[0] : "N/A";
    if (CapitaleDevine === Choixcapital) {
        indicateurs.push(`🏛 Capitale : ✅ Correct ! (${Choixcapital})`);
    } else {
        cdt = false;
        if (vie <= 2) {
            indicateurs.push(`🏛 Capitale : ❌ Faux (${CapitaleDevine} au lieu de ${Choixcapital})`);
        } else {
            indicateurs.push("🏛 Capitale : ❌ Faux (Aide à 1 vie...)");
        }
    }

    let monnaiedevine = paysDevine.currencies ? Object.keys(paysDevine.currencies)[0] : "N/A";
    let Choixmonnaie = choix.currencies ? Object.keys(choix.currencies)[0] : "N/A";
    if (monnaiedevine === Choixmonnaie) {
        indicateurs.push(`💰 Monnaie : ✅ Correct ! (${Choixmonnaie})`);
    } else {
        cdt = false;
        if (vie <= 4) {
            indicateurs.push(`💰 Monnaie : ❌ Faux (${monnaiedevine} au lieu de ${Choixmonnaie})`);
        } else {
            indicateurs.push("💰 Monnaie : ❌ Faux (Aide à 3 vies ou moins...)");
        }
    }

    if (paysDevine.population === choix.population) {
        indicateurs.push(`👥 Population : ✅ Exact ! (${choix.population})`);
    } else if (paysDevine.population > choix.population) {
        cdt = false;
        indicateurs.push("👥 Population : ❌ Trop élevée !");
    } else {
        cdt = false;
        indicateurs.push("👥 Population : ❌ Trop basse !");
    }

    // Affichage des essais dans la boîte à droite
    if (cdt == true) {
        resultD.innerHTML = `<div class="quiz-try"><br> <strong>Tu as gagné!</strong> Le pays était: <strong>${choixuser}</strong> <br><br>${indicateurs.join("<br>")}<br><br></div>` + resultD.innerHTML;
        document.getElementById("Entree").innerHTML = ""; vie = 6; return;
    } else {
        vie--;
        resultD.innerHTML = `<div class="quiz-try"><strong>${choixuser}</strong><br><br>${vie} vies restantes <br><br>${indicateurs.join("<br>")}</div>` + resultD.innerHTML;
        if (vie == 0) {
            vie = 6;
            resultD.innerHTML = `<div class="quiz-try">Tu as perdu... Le pays était ${choix.name.common} <br> Capitale: ${Choixcapital} <br> Monnaie: ${Choixmonnaie} <br> Population ${choix.population} <br><br>${indicateurs.join("<br>")}<br><br></div>` + resultD.innerHTML;
            document.getElementById("Entree").innerHTML = ""; return;
        }
    }
}
