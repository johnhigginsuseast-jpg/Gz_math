import {sequenceLabs,sequenceModel} from './elective2-sequence-labs.mjs';
import {derivativeLabs,derivativeModel} from './elective2-derivative-labs.mjs';
export const elective2Labs=[...sequenceLabs,...derivativeLabs];
export function elective2Model(id,v){return sequenceLabs.some(l=>l.id===id)?sequenceModel(id,v):derivativeModel(id,v);}
