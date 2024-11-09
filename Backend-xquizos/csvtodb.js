const {readFileSync} = require('fs');
const { parse } = require('csv-parse/sync');


const fileContent = readFileSync('Example.csv', 'utf8');


function csvtodb(fileContent){
  const file= parse(fileContent, { 
    columns: true,
    
    cast:(value, context)=>{
      if(context.column === 'estatura'){
        return Number(value);
      }
      if(context.column === 'fecha_nacimiento'){
        return new Date(value);
      }
      return value;

      }
    }
  );
  console.log(file);
}
