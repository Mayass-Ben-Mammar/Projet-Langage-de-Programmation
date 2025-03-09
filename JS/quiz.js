let paysdata = [];
let choix = null;
let vie = 6;

function Commencer(){
	// Charger tous les pays et choisir un pays mystère
	fetch("https://restcountries.com/v3.1/all")
		.then(response => {
			if (!response.ok) {
                throw new Error("Pays introuvable");} // Cas erreur
            
		return response.json();
        })
		.then(data => {
			paysdata = data; // On stocke les infos des pays
			choix = paysdata[Math.floor(Math.random() * paysdata.length)]; // Pays au hasard à chaque partie, entre 0 et la longueur, floor retire la partie decimale
			console.log("Pays mystère :", choix.name.common); // Debug
		});
	document.getElementById("result").innerHTML = ""  // Réinitialise l'affichage a chaque partie
    document.getElementById("Entree").innerHTML = `
        <h2><label for="name">Entrer un pays :</label></h2>
        <input type="text" id="name" name="name" size="30"/>
        <button onclick="Devine()">Valider</button>
    `; // Html inserer pour faire apparaitre la zone de texte quand on commence une partie
}

function Devine() {
	let resultD = document.getElementById("result"); // Partie du DOM ou le texte de resultat va etre affiché
	cdt = true; // Condition de partie perdu ou gagné
    let choixuser = document.getElementById("name").value.trim().toLowerCase(); // Choix de l'utilisateur sans majuscule et sans espace (trim) en fin et début de chaine


    // Trouver le pays saisi par l'utilisateur dans l'api
    let paysDevine = paysdata.find(c => c.name.common.toLowerCase() === choixuser);

    if (!paysDevine) {
        resultD.innerHTML = "❌ Pays introuvable !";
        return;
    }

    // Comparaison avec le pays mystère
    let indicateurs = []; // Va contenir si les indices du pays mysteres sont validés

    // 🌍 Région
    if (paysDevine.region === choix.region) {
        indicateurs.push(`🌍 Région : ✅ Correct ! (${choix.region})`);
    } else {
		cdt = false;
        indicateurs.push(`🌍 Région : ❌ Faux (${paysDevine.region} au lieu de ${choix.region})`); 
    }

    // 🏛 Capitale
    let CapitaleDevine = paysDevine.capital ? paysDevine.capital[0] : "N/A"; // Si paysDevine.capital[0] pas disponible on met "N/A"
    let Choixcapital = choix.capital ? choix.capital[0] : "N/A"; // Si choix.capital[0] pas disponible on met "N/A"
    if (CapitaleDevine === Choixcapital) {
        indicateurs.push(`🏛 Capitale : ✅ Correct ! (${Choixcapital})`);
    } else {
		cdt = false;
		if (vie <= 2) { // Capitale données au dernier essai (décalage de 1 car la vie est retiré après l'affichage)
			indicateurs.push(`🏛 Capitale : ❌ Faux (${CapitaleDevine} au lieu de ${Choixcapital})`);}
		else {
			indicateurs.push("🏛 Capitale : ❌ Faux (Aide à 1 vie...)");
		}
    }

    // 💰 Monnaie
    let monnaiedevine = paysDevine.currencies ? Object.keys(paysDevine.currencies)[0] : "N/A";
    let Choixmonnaie = choix.currencies ? Object.keys(choix.currencies)[0] : "N/A";
    if (monnaiedevine === Choixmonnaie) {
        indicateurs.push(`💰 Monnaie : ✅ Correct ! (${Choixmonnaie})`);
    } else {
		cdt = false;
		if (vie <= 4) { // Monnaie donnée quand il reste 3 vies (décalage de 1 car la vie est retiré après l'affichage)
			indicateurs.push(`💰 Monnaie : ❌ Faux (${monnaiedevine} au lieu de ${Choixmonnaie})`);
    }
		else {
			indicateurs.push("💰 Monnaie : ❌ Faux (Aide à 3 vies ou moins...)");
	}
	}

    // 👥 Population (plus ou moins élevé)
    if (paysDevine.population === choix.population) {
        indicateurs.push(`👥 Population : ✅ Exact ! (${choix.population})`);
    } else if (paysDevine.population > choix.population) {
		cdt = false;
        indicateurs.push("👥 Population : ❌ Trop élevée !");
    } else {
		cdt = false;
        indicateurs.push("👥 Population : ❌ Trop basse !");
    }

    // Affichage du résultat selon cdt 
	if (cdt == true ) {resultD.innerHTML = "<br>" + resultD.innerHTML + "<strong>Tu as gagné!</strong> Le pays était: " + `<strong>${choixuser}</strong>` + "<br><br>" + indicateurs.join("<br>") + "<br><br>";
	document.getElementById("Entree").innerHTML = ""; vie = 6; return;} // On affiche le message et les indices validés (tous dans ce cas) et reinitialise les vies pour rejouer
	vie--; // Si on a pas gagné on retire 1 vie
    resultD.innerHTML = resultD.innerHTML + "<br>" + `<strong>${choixuser}</strong>` +  "<br><br>" + vie + " <strong>vies restantes</strong> " + "<br><br>" + indicateurs.join("<br>") + "<br>";
	if (vie == 0) {vie = 6; resultD.innerHTML = `Tu as perdu... Le pays était ${choix.name.common}` + "<br>" + ` Capitale: ${Choixcapital}` + "<br>" + `Monnaie: ${Choixmonnaie}` + "<br>" + `Population ${choix.population}`;
	document.getElementById("Entree").innerHTML = "";return;} // On appuie sur "commencer" pour rejouer donc on supprime les pays dévinés a la partie d'avant
	// On affiche la bonne réponse, les indices et reinitialise les vies pour rejouer
return;
}