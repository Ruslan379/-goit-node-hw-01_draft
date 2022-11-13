const fs = require('fs').promises;

fs.readdir(__dirname)
    .then(files => {
        return Promise.all(
            files.map(async filename => {
                const stats = await fs.stat(filename);
                return {
                    Name: filename,
                    Size: stats.size,
                    Date: stats.mtime,
                };
            }),
        );
    })
    .then(result => console.table(result));