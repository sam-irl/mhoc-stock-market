const fs = require('fs');
const path = require('path');

export const loadData = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data.json'));
    return JSON.parse(data);
};

export const writeData = (data) => {
    const text = JSON.stringify(data);
    fs.writeFileSync(path.join(__dirname, '../data.json'), text);
};
