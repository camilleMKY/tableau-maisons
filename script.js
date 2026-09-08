fetch("data.json")
    .then(reponse => reponse.json())
    .then(donnees => {

        const SEUILS = {
            "5J": 500,      // pleine vers 2000 pts
            "2G3": 600,    // pleine vers 2400 pts
            "5B": 500,
        };
        const select = document.getElementById("choix-classe");
        const vueMaisons = document.getElementById("vue-maisons");
        const vueEleves = document.getElementById("vue-eleves");

        // Option d'invite, vide, sélectionnée par défaut
        const optionVide = document.createElement("option");
        optionVide.value = "";              // valeur vide = aucune classe
        optionVide.textContent = "— Choisis ta classe —";
        select.appendChild(optionVide);

        // 1. Remplir le menu déroulant avec les noms de classes (les clés du JSON)
        Object.keys(donnees).forEach(nomClasse => {
            const option = document.createElement("option");
            option.value = nomClasse;
            option.textContent = nomClasse;
            select.appendChild(option);
        });

        // 2. Une fonction qui (re)dessine tout pour une classe donnée
        function afficherClasse(nomClasse) {
            document.getElementById("titre-classe").textContent = nomClasse;
            const classe = donnees[nomClasse];
            const seuil = SEUILS[nomClasse] || 750;   // 750 par défaut si non défini

            // On VIDE les vues avant de les re-remplir (sinon ça s'empile)
            vueMaisons.innerHTML = "";
            vueEleves.innerHTML = "";

            // Le plus gros total parmi les maisons de cette classe
            const maxPoints = Math.max(...classe.maisons.map(m => m.total));


            // Remplir les maisons
            classe.maisons.forEach(maison => {

                let niveau = Math.floor(maison.total / seuil);
                if (niveau > 4) {
                    niveau = 4;
                }
                let palier = 5 - niveau;
                
                const carte = document.createElement("div");
                carte.className = "carte-maison";
                carte.style.backgroundColor = maison.couleur + "40";   // ← la couleur de la maison, translucide
    
                const embleme = document.createElement("img");
                embleme.src = "images/" + maison.nom + "_embleme.png";
                embleme.className = "embleme";
    
                //Le conteneur repère
                const fiole = document.createElement("div");
                fiole.className = "fiole"

                //Calque 1 (le fond)
                const fond = document.createElement("img");
                fond.src = "images/" + maison.nom + "_fond.png";
                fond.className = "calque-fiole";

                //Calque 2 (le liquide)
                const liquide = document.createElement("img");
                liquide.src = "images/" + maison.nom + "_liquide_" + palier + ".png";
                liquide.className = "calque-fiole";

                //Calque 3 (le verre)
                const verre = document.createElement("img");
                verre.src = "images/" + maison.nom + "_fiole.png";
                verre.className = "calque-fiole";

                //Ordre d'ajout
                fiole.appendChild(fond)
                fiole.appendChild(liquide);
                fiole.appendChild(verre);
    
                // La plaque de couleur sous la fiole
                const plaque = document.createElement("div");
                plaque.className = "plaque";
                plaque.style.backgroundColor = maison.couleur;
                plaque.textContent = maison.total + " points";
    
                carte.appendChild(embleme);
                carte.appendChild(fiole);
                carte.appendChild(plaque);
                vueMaisons.appendChild(carte);
            });

            // Remplir le classement des élèves
            classe.eleves.sort((a, b) => b.points - a.points);
            

        classe.eleves.sort((a, b) => b.points - a.points);
        let rang = 1;
        classe.eleves.slice(0, 10).forEach(eleve => {
            const ligne = document.createElement("div");
            ligne.className = "ligne-eleve";

            // Bloc 1 : le rang, seul dans sa pastille
            const blocRang = document.createElement("div");
            blocRang.className = "bloc-rang";
            blocRang.style.backgroundColor = eleve.couleur;
            blocRang.textContent = rang;

            // Bloc 2 : le reste (numéro + points)
            const blocInfos = document.createElement("div");
            blocInfos.className = "bloc-infos";
            blocInfos.style.backgroundColor = eleve.couleur;

            const numeroSpan = document.createElement("span");
            numeroSpan.className = "numero-eleve";
            numeroSpan.textContent = "Numéro : " + eleve.numéro;

            const pointsSpan = document.createElement("span");
            pointsSpan.className = "points-eleve";
            pointsSpan.textContent = eleve.points + " pts";

            blocInfos.appendChild(numeroSpan);
            blocInfos.appendChild(pointsSpan);

            ligne.appendChild(blocRang);
            ligne.appendChild(blocInfos);
            vueEleves.appendChild(ligne);
            rang = rang + 1;
        });
        }

        // 3. Quand on change la sélection, on réaffiche la nouvelle classe
        select.addEventListener("change", () => {
            if (select.value === "") {
                // Retour à l'invite : on cache tout
                vueMaisons.style.display = "none";
                vueEleves.style.display = "none";
                document.querySelector("nav").style.display = "none";
                document.getElementById("titre-classe").style.display = "none";
            } else {
                // Une vraie classe est choisie : on dessine et on affiche
                afficherClasse(select.value);
                document.querySelector("nav").style.display = "block";
                vueMaisons.style.display = "flex";
                vueEleves.style.display = "none";
                document.getElementById("titre-classe").style.display = "block";
            }
        });

        // 4. La navigation maisons / élèves (inchangée)
        document.getElementById("btn-maisons").addEventListener("click", () => {
            vueMaisons.style.display = "flex";
            vueEleves.style.display = "none";
        });
        document.getElementById("btn-eleves").addEventListener("click", () => {
            vueMaisons.style.display = "none";
            vueEleves.style.display = "block";
        });

        // 5. Au démarrage : afficher la première classe, vue maisons
        vueMaisons.style.display = "none";
        vueEleves.style.display = "none";
        document.querySelector("nav").style.display = "none";
        document.getElementById("titre-classe").style.display = "none";
    });