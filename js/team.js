import {searchbarActivate, loadHeaderFooter, populateTeam, getStats, changeTitle, initTeamname, movePkmn, initializeLists } from "./utils.mjs";

loadHeaderFooter(searchbarActivate);
initializeLists();
initTeamname(".team-name");
populateTeam();
getStats();
changeTitle(".team-name");
movePkmn(".team-box");