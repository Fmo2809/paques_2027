"use strict";
window.OeuvresGame = {
    normaliser(texte) {
        return texte.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/œ/g, "oe")
            .replace(/[’‘ʼ]/g, "'")
            .replace(/\s*'\s*/g, "'")
            .replace(/\s+/g, " ")
            .trim();
    },
    estCorrecte(saisie, titre, alternatives = []) {
        return [titre, ...alternatives].some(solution =>
            this.normaliser(saisie) === this.normaliser(solution)
        );
    },
    image(type, numero) {
        const config = window.OEUVRES_CONFIG;
        return `${config.dossierImages}/${type}_${String(numero).padStart(2, "0")}.${config.extension}`;
    }
};
