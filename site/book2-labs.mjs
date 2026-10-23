import { vectorLabs, vectorModel } from './book2-vector-labs.mjs';
import { complexLabs, complexModel } from './book2-complex-labs.mjs';
import { solidBookLabs, solidBookModel } from './book2-solid-labs.mjs';
import { dataLabs, dataModel } from './book2-data-labs.mjs';
export const book2Labs=[...vectorLabs,...complexLabs,...solidBookLabs,...dataLabs];
export function book2Model(id,values){
 if(id.startsWith('b2-v-'))return vectorModel(id,values);
 if(id.startsWith('b2-z-'))return complexModel(id,values);
 if(id.startsWith('b2-s-'))return solidBookModel(id,values);
 return dataModel(id,values);
}
