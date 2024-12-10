import { 
    captureBtn, 
    encounterBtn, 
    getDesc, 
    giveSprite, 
    initializeLists, 
    loadHeaderFooter, 
    search, 
    searchbarActivate
} from "./utils.mjs";

loadHeaderFooter(searchbarActivate)
initializeLists();
// getPkmnInfo();
giveSprite("lugia");
getDesc("lugia");
encounterBtn();
captureBtn();
