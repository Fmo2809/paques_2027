"use strict";
(() => {
    const $ = id => document.getElementById(id);
    const data = window.OEUVRES;
    const game = window.OeuvresGame;
    const total = window.OEUVRES_CONFIG.total;
    const params = new URLSearchParams(location.search);
    const cle = params.get("cle");
    const oeuvre = data.find(item => item.cle === cle);
    const estFin = cle === window.OEUVRES_CONFIG.cleFin;
    const numero = oeuvre ? oeuvre.numero : (estFin ? total + 1 : null);

    function terminer(titre, texte) {
        $("fin").hidden = false;
        $("fin-titre").textContent = titre;
        $("fin-texte").textContent = texte;
    }

    function afficherImage(id, type, n, alt) {
        const image = $(id);
        image.alt = alt;
        image.addEventListener("error", () => {
            image.hidden = true;
            const notice = document.createElement("p");
            notice.className = "image-error";
            notice.textContent = "Image indisponible";
            image.after(notice);
        }, { once: true });
        image.src = game.image(type, n);
    }

    if (params.has("n") || !cle || (!oeuvre && !estFin)) {
        location.replace("index.html");
        return;
    }

    const precedente = data.find(item => item.numero === numero - 1);
    if (precedente) {
        $("precedente").hidden = false;
        $("titre-precedent").textContent = precedente.titre;
        $("artiste-precedent").textContent = precedente.artiste;
        afficherImage("oeuvre-precedente", "oeuvre", precedente.numero, precedente.titre);
    }

    if (!oeuvre) {
        if (numero === total + 1 && data.some(item => item.numero === total)) {
            terminer("Bravo, le parcours est terminé !", "Donnez à Naïma le nom de la dernière œuvre que vous avez reconnue. Les cadeaux sont attribués par joueur, même si vous avez joué en équipe.");
        } else {
            terminer("La suite arrive bientôt", "Vous avez atteint la fin des énigmes actuellement disponibles. Le parcours complet comportera 20 œuvres.");
        }
        return;
    }

    document.title = `Énigme ${numero} · Pâques 2027`;
    $("jeu").hidden = false;
    $("progression").textContent = `ÉNIGME ${String(numero).padStart(2, "0")} / ${total}`;
    afficherImage("piece", "piece", numero, "Détail de l’œuvre à reconnaître");
    afficherImage("indice", "indice", numero, "Indice visuel de cette énigme");
    $("reponse-form").addEventListener("submit", event => {
        event.preventDefault();
        if (!game.estCorrecte($("reponse").value, oeuvre.titre, oeuvre.solutionsAlternatives || [])) {
            $("message").textContent = "Ce n’est pas le titre attendu. Essayez encore !";
            $("message").className = "error";
            $("reponse").setAttribute("aria-invalid", "true");
            $("reponse").focus();
            return;
        }
        $("message").textContent = "Bonne réponse !";
        $("message").className = "success";
        $("reponse").removeAttribute("aria-invalid");
        $("reponse").readOnly = true;
        $("reponse-form").querySelector("button").disabled = true;
        const prochaine = data.find(item => item.numero === numero + 1);
        const cleSuivante = prochaine ? prochaine.cle : window.OEUVRES_CONFIG.cleFin;
        $("suivant").href = `enigme.html?cle=${encodeURIComponent(cleSuivante)}`;
        $("suivant").hidden = false;
        $("suivant").focus();
    });
})();
