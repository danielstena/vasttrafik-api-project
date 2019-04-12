// Run this command to update the list

await request(lista, { headers },(err, res, body) => {
    if (err) { return console.log(err); }
    
    fs.writeFile('allstops_updated_list.txt', body, (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log('List is saved!');
    });

}); 