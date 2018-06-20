// import Company from '../company/model';

// export const handleCompaniesFromIGDB = async ({ developers, publishers }) => {
//   // This whole process is *rough*. How do we do it better?
//   let companiesInDb = await Company.find({
//     igdbId: { $in: developers.concat(publishers) }
//   });

//   companiesInDb = companiesInDb.reduce((accumulator, company) => {
//     accumulator[company.igdbId] = company;
//     return accumulator;
//   }, {});

//   // developers is array of ids
//   // check to see if you have developer ref in memory
//   // check to see if developer is in db
//   // if yes, pull ref, put in memory
//   // if no, insert into db and pull ref

//   for (let developer in developers) {
//     let developerId;
//     const retrievedCompany = companiesInDb[developers[developer]];
//     if (!retrievedCompany) {
//       const createdDeveloper = await Company.create({
//         igdbId: developers[developer]
//       });
//       developerId = createdDeveloper._id;
//     } else {
//       developerId = retrievedCompany._id;
//     }

//     localCacheGame.developer.push(developerId);
//   }
// };
