import { initializeLists, loadHeaderFooter, movePkmn, populateBox, searchbarActivate } from "./utils.mjs";

initializeLists();
loadHeaderFooter(searchbarActivate);
movePkmn(".pokebox")
populateBox();

