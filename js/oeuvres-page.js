"use strict";
(() => {
    const $ = id => document.getElementById(id);
    const data = window.OEUVRES;
    const game = window.OeuvresGame;
    const total = window.OEUVRES_CONFIG.total;
    const param = new URLSearchParams(location.search).get("n") || "01";
    const numero = /^\d{1,2}$/.test(param) ? Number(param) : NaN;

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

    if (!Number.isInteger(numero) || numero < 1 || numero > total + 1) {
        terminer("Étape introuvable", "Revenez à l’accueil pour commencer le jeu.");
        return;
    }

    const precedente = data.find(item => item.numero === numero - 1);
    if (precedente) {
        $("precedente").hidden = false;
        $("titre-precedent").textContent = precedente.titre;
        afficherImage("oeuvre-precedente", "oeuvre", precedente.numero, precedente.titre);
    }

    const oeuvre = data.find(item => item.numero === numero);
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
    $("artiste").textContent = oeuvre.artiste;
    afficherImage("piece", "piece", numero, "Détail de l’œuvre à reconnaître");
    afficherImage("indice", "indice", numero, "Indice visuel de cette énigme");
    $("reponse-form").addEventListener("submit", event => {
        event.preventDefault();
        if (!game.estCorrecte($("reponse").value, oeuvre.titre)) {
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
        $("suivant").href = `enigme.html?n=${String(numero + 1).padStart(2, "0")}`;
        $("suivant").hidden = false;
        $("suivant").focus();
    });
})();
