function getCountry() {
let country = document.getElementById("name").value; // On prend le texte écrit

const feur = document.querySelector(".blanc");
if (feur) {
    feur.style.backgroundColor = "white";
} else {
    console.error("raaaaaaaaaaah");
}

fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`) // Appel de l'api fetch pour prendre les infos du DOM
        .then(response => { // On utilise .then avec les Promise
            if (!response.ok) {
                throw new Error("Pays introuvable"); // Cas erreur
            }
            return response.json();
        })
        
        .then(data => { // Le resultat d'un .then devient le parametre du .then d'apres
            
            let paysdata = data[0]; // On a qu'une valeur cas on précise le pays dans le fetch, les autres pays apparaissent donc pas
            let name = paysdata.name.common;
            let capital = paysdata.capital ? paysdata.capital[0] : "N/A"; // Condition ternaire au cas ou la capitale est pas disponible
            let population = paysdata.population.toLocaleString(); //.toLocaleString() met en forme le nombre donc met des espaces tout les 3 chiffres
            let languages = Object.values(paysdata.languages).join(", "); // Au cas ou il y a plusieurs langues
            let currency = Object.values(paysdata.currencies)[0].name; // Monnaie
            let flag = paysdata.flags.svg; // Lien d'une image pour le drapeau

            document.getElementById("result").innerHTML = // Affichage du texte en integrant du html
            `
                <h2>${name}</h2>
                <p><strong>🏙️ Capitale :</strong> ${capital}</p>
                <p><strong>👥 Population :</strong> ${population}</p>
                <p><strong>🗣️ Langues :</strong> ${languages}</p>
                <p><strong>💰 Monnaie :</strong> ${currency}</p>
                <img src="${flag}" alt="Drapeau de ${name}" width="150">
            `;
        })
        .catch(error => { // Affichage message d'erreur
            document.getElementById("result").innerHTML = `<p style='color:red;'>${error.message}</p> <p><strong>Aide et remarques:</strong> Vérifier que le nom a bien été écrit.<br> Exemple:
            France:✅, france: ✅;  Farnce:❌ Frances:❌ <br> <br>
            L'API Rest Countries ne liste que les pays reconnus internationalement.<br> <br>
            C'est à dire par exemple, l'Angleterre fait partie du Royaume-Uni (United Kingdom), qui regroupe : <br>
            ✅ England (Angleterre)<br>
            ✅ Scotland (Écosse)<br>
            ✅ Wales (Pays de Galles)<br>
            ✅ Northern Ireland (Irlande du Nord)<br><br>

            L'API ne sépare pas ces régions, mais les inclut sous le nom United Kingdom. Ainsi, écrire England ou Angleterre ne renvoie rien. </p>`; // Change le css si tu veux Mayass
            console.error("Erreur :", error); // texte en rouge si c'est raté
        });
}

const btn = document.querySelector(".INFO button");

btn.addEventListener("mouseenter", () => {
  anime({
    targets: btn,
    scale: 1.1,
    duration: 300,
    easing: 'easeInOutQuad'
  });
});

btn.addEventListener("mouseleave", () => {
  anime({
    targets: btn,
    scale: 1,
    duration: 300,
    easing: 'easeInOutQuad'
  });
});
