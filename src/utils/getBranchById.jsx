
const getBranchById = (branch) => {
    
    switch(branch) {
        case '01':
            return {id:"01", name: 'Farmanele',direction: 'Av. Eva peron 2399, Libertad'};
        case '02':
            return {id:"02", name: 'Anele',direction: 'Av. Eva peron 3050, Libertad'};
        case '03':
            return {id:"03", name: 'MGM',direction: 'Esteban Echeverría 702, San Antonio de Padua'};
            ;
        default:
            return 'Unknown Branch';
    }
  }
  
  export default getBranchById;
  