const viewAllDepartments = (db, promptUser) => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
};

module.exports = { viewAllDepartments };