const FileSystem = require("fs");
const Graph = require('./src/models/Graph');

const fileName = 'graphPresentationOrder.json';
const MAX_ORDERS = 50;

async function setUpOrder() {
    // get max number of graphs
    const numGraphs = await Graph.count();

    // create specified num of random combinations of graph ids for order.json
    const orders = [];
    const arr = Array.from(Array(numGraphs).keys());

    for (let i=0; i<MAX_ORDERS; i++) {
        let order = shuffledCopy(arr);

        while(orders.includes(order)) {
            order = shuffledCopy(arr);
        }
        
        orders.push(order)
    }
    
    const content = {"graphOrders": orders};
    
    FileSystem.writeFile(fileName, JSON.stringify(content), (error) => {
        if (error) throw error;
    });
}

function shuffledCopy(org_arr) {
    const array = [...org_arr];

    let currentIndex = array.length;
  
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

setUpOrder()