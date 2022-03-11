import { BASEURL } from "./baseurl";

export const getAll = BASEURL +'/inventorys/all';

export const getSpecific = BASEURL+"/inventorys/";

export const deleteSpecificItem = BASEURL +'/inventorys/delete';

export const updateSpecificItemInfo = BASEURL +'/inventorys/update-item-info';

export const updateBuyPrice = BASEURL +'/inventorys/update-price/buy';

export const updateSellPrice = BASEURL +'/inventorys/update-price/sell'