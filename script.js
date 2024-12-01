document.getElementById("btn").addEventListener("click", function() {
    // Récupérer les valeurs des inputs
    const moyenne = parseFloat(document.getElementById("m_input").value);
    const sigma = parseFloat(document.getElementById("s_input").value);
    const nb = parseFloat(document.getElementById("n_input").value);

    effacerTableau();

    const tableau = document.getElementById("myTable");
    tableau.style.display = "table"; // Rendre le tableau visible

    let newliste = [];
    let prevliste =[];
    let listValues = [];
    decimales = countDecimalPlaces(sigma);

    for (let k = 0; k < nb; k++) {
        prevliste.push(moyenne);
    }
    //console.log("liste moyenne : " + prevliste);
    for (let i = 0; i < 4000; i++) {
        //clear newlist et génération
        newliste = [];
        for (let j = 0; j < nb; j++) {
            newliste.push(roundToDecimalPlaces(newValue(moyenne,sigma), decimales));
        }
        
        let diffPrevSigma =  Math.abs(EcartType(prevliste) - sigma);
        let diffNewSigma = Math.abs(EcartType(newliste) - sigma);

        //console.log("diff new sigma: " + diffNewSigma);
        console.log("diff prev sigma: " + diffPrevSigma);

        if ( diffNewSigma < diffPrevSigma){
            
            prevliste = newliste;
            //console.log("la nouvelle liste est meilleure: " + prevliste);

        }//else{
            //console.log("l'ancienne liste est meilleure: " + prevliste);

        //}
    }
    // PROCESS DE RECALIBRAGE
    //do {
        

    //} while (roundToDecimalPlaces(EcartType(values)) != sigma && );  

    console.log(prevliste);
    prevliste.pop();
    prevliste.push(roundToDecimalPlaces(ajusterDerniereValeur(prevliste, moyenne, sigma), decimales)); 
    //console.log(prevliste);
    afficherListeEnTableau(prevliste);
});

function newValue(moy,et){
    return moy + (Math.random() * 2 - 1) * et 
}

function countDecimalPlaces(number) {
    // Convertir le nombre en chaîne de caractères pour pouvoir analyser les décimales
    const numberAsString = number.toString();
    
    // Vérifier s'il y a un point décimal
    if (numberAsString.includes(".")) {
      // Compter le nombre de chiffres après la virgule
      return numberAsString.split(".")[1].length;
    }
    
    // Si pas de virgule, il n'y a pas de chiffres après la virgule
    return 0;
  }

function roundToDecimalPlaces(number, decimalPlaces) {
  // Utiliser la méthode toFixed pour arrondir à 'decimalPlaces' chiffres après la virgule
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

function EcartType(lst) {
    // Étape 1 : Calculer la moyenne
    const moyenne = lst.reduce((acc, val) => acc + val, 0) / lst.length;

    // Étape 2 : Calculer la somme des carrés des différences
    const variance = lst.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / (lst.length - 1);

    // Étape 3 : Retourner l'écart type (racine carrée de la variance)
    return Math.sqrt(variance);
}

function ajusterDerniereValeur(liste, moyen, ecartType) {
    const n = liste.length + 1; // Nombre total d'éléments
    const sommeTotale = moyen * n; // Somme totale requise
    const sommePartielle = liste.reduce((acc, val) => acc + val, 0); // Somme des n-1 premières valeurs

    // Dernière valeur brute
    let derniereValeur = sommeTotale - sommePartielle;

    // Ajustement pour respecter l'écart type
    const variance = Math.pow(ecartType, 2);
    const variancePartielle = liste.reduce((acc, val) => acc + Math.pow(val - moyen, 2), 0);
    const termeRestant = variance * n - variancePartielle;

    derniereValeur = moyen + Math.sqrt(termeRestant); // Ajustement final

    return derniereValeur;
}

function afficherListeEnTableau(liste) {
    const tableBody = document.querySelector("#myTable tbody");

    // Parcourir la liste et créer une ligne pour chaque valeur
    liste.forEach((valeur) => {
        const row = document.createElement("tr"); // Crée une nouvelle ligne
        const cellValue = document.createElement("td"); // Colonne pour la valeur

        cellValue.textContent = valeur; // Ajouter la valeur dans la cellule

        row.appendChild(cellValue); // Ajouter la cellule à la ligne
        tableBody.appendChild(row); // Ajouter la ligne au tableau
    });
}

function effacerTableau() {
    const tableBody = document.querySelector("#myTable tbody");
    tableBody.innerHTML = ""; // Efface tout le contenu de <tbody>
    const tableau = document.getElementById("myTable");
    tableau.style.display = "none"; // Cacher le tableau après l'effacement
}