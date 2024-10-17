export function displayMyEquityGapsComparisonData(chartPlaceholder)
{
  const url = "https://studentresearch.dashboards.calstate.edu/api/equity-gaps/my-equity-gaps/comparison-data";
    const params = {
      'campus': "*CSU System",
      'college': "School of Arts & Humanities",
      'major': "*All Majors",
      'student_type': "freshmen",
      'student_type_name': "Freshmen",
      'cohort': 2019,
      'persistence': 1,
      'year1': 4,
      'year2': 6,
      'outcome': "6th-Year Graduation",
      'gap_type': "firstgen",
    };

    // Construct the query string from the parameters
    const queryString = new URLSearchParams(params).toString();

    // Append the query string to the URL
    const fullUrl = `${url}?${queryString}`;
  
    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        // Extracting the data to plot
        const labels = data.non.map(item => item[0]);  // Extract years
        const ingroupData = data.areadata.map(item => item.ingroup);  // Ingroup values
        const outgroupData = data.areadata.map(item => item.outgroup);  // Outgroup values

        // Create a canvas element for Chart.js
        const canvasElement = document.createElement("canvas");
        canvasElement.id = "myChart";
        canvasElement.style.border = "1px solid black";
        canvasElement.style.padding = "10px";
        canvasElement.style.margin = "auto";
        canvasElement.style.height = "400px";
        canvasElement.style.width = "600px";
        chartPlaceholder.appendChild(canvasElement);

        // Get the 2D drawing context of the canvas
        const ctx = canvasElement.getContext('2d');

        // Initialize the Chart.js chart
        const myChart = new Chart(ctx, {
          type: 'line', // Example chart type
          data: {
            labels: labels,
            datasets: [
              {
                label: 'First-Generation',
                data: ingroupData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
              },
              {
                label: 'Not First-Generation',
                data: outgroupData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

export function displayMyEquityGapsMajorGaps(chartPlaceholder)
{
  const url1 = "https://studentresearch.dashboards.calstate.edu/api/equity-gaps/my-equity-gaps/major-gaps";
    const params1 = {
      'campus': "*CSU System",
      'student_type': "freshmen",
      'outcome': "6th-Year Graduation",
      'gap_type': "firstgen",
    };
    // Construct the query string from the parameters
    const queryString1 = new URLSearchParams(params1).toString();

    // Append the query string to the URL
    const fullUrl1 = `${url1}?${queryString1}`;
   
    fetch(fullUrl1, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json'
       }
    })
       .then(response => response.json())
       .then(data => {

            const chartWrapper = document.createElement("div");
            chartWrapper.style.display = "flex";
            chartWrapper.style.height = "50%";
            chartWrapper.style.width = "35%";
            chartWrapper.style.marginLeft = "15%";                  

            const canvasElementMajorAtEntry = document.createElement("canvas");
            canvasElementMajorAtEntry.id = "majorAtEntryChart";
            canvasElementMajorAtEntry.width = "50px";  // Set width (optional)
            canvasElementMajorAtEntry.height = "100px"; // Set height (optional)
            chartWrapper.appendChild(canvasElementMajorAtEntry);

            const canvasElementLastMajorHeld = document.createElement("canvas");
            canvasElementLastMajorHeld.id = "lastMajorHeldChart";
            canvasElementLastMajorHeld.width = "50px";  // Set width (optional)
            canvasElementLastMajorHeld.height = "100px"; // Set height (optional)
            chartWrapper.appendChild(canvasElementLastMajorHeld);

            chartPlaceholder.appendChild(chartWrapper)

            // Extract data for "Major At Entry"
            const majorAtEntryLabels = [data[0].major1, data[0].major2, data[0].major3, data[0].major4, data[0].major5];
            const majorAtEntryData = [data[0].n_major1_addtl, data[0].n_major2_addtl, data[0].n_major3_addtl, data[0].n_major4_addtl, data[0].n_major5_addtl];

            // Extract data for "Last Major Held"
            const lastMajorHeldLabels = [data[1].major1, data[1].major2, data[1].major3, data[1].major4, data[1].major5];
            const lastMajorHeldData = [data[1].n_major1_addtl, data[1].n_major2_addtl, data[1].n_major3_addtl, data[1].n_major4_addtl, data[1].n_major5_addtl];

            // Plot "Major At Entry" Bar Chart
            const ctx1 = document.getElementById('majorAtEntryChart').getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: majorAtEntryLabels,
                    datasets: [{
                        label: 'Number of Students',
                        data: majorAtEntryData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Plot "Last Major Held" Bar Chart
            const ctx2 = document.getElementById('lastMajorHeldChart').getContext('2d');
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: lastMajorHeldLabels,
                    datasets: [{
                        label: 'Number of Students',
                        data: lastMajorHeldData,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
}

export function displayStudentProgressUnits(chartPlaceholder)
{
  // student-progress-units
  // const url = "https://studentresearch.dashboards.calstate.edu/api/faculty-dashboard/student-progress-units/what-paths-do-they-follow/chart-data";
    // const params = {
    //   'campus': "*CSU System",
    //   'college': "School of Arts & Humanities",
    //   'major': "*All Majors",
    //   'cohort': 2019,
    //   'student_type': "freshmen",
    //   'gap_type': "firstgen",
    // };

    const url = "https://studentresearch.dashboards.calstate.edu/api/faculty-dashboard/what-paths-do-they-follow/chart-data?campus=Bakersfield&college=School%20of%20Arts%20%26%20Humanities&major=Art&flowOption=1";

    // Construct the query string from the parameters
    //  const queryString = new URLSearchParams(params).toString();

    // Append the query string to the URL
     const fullUrl = `${url}`
    // queryString;

    const canvasElement = document.createElement("canvas");
    canvasElement.id = "myPieChart";
    canvasElement.style.border = "1px solid black";
    canvasElement.style.padding = "10px";
    canvasElement.style.margin = "auto";
    canvasElement.style.height = "400px";
    canvasElement.style.width = "600px";
    chartPlaceholder.appendChild(canvasElement);

    fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(response => response.json())
      .then(data => {
         // Extract the total number of students
         const totalStudents = data.nodes[0].totalStudents;

         // Extract labels and data
         const labels = data.seriesData.map(item => `${item.from} to ${item.to}`);
         const weights = data.seriesData.map(item => (item.weight / totalStudents) * 100); // Calculate percentage
 
         // Create the pie chart
         const ctx = document.getElementById('myPieChart').getContext('2d');
         const myPieChart = new Chart(ctx, {
             type: 'pie',
             data: {
                 labels: labels,
                 datasets: [{
                     data: weights,
                     backgroundColor: [
                         'rgba(255, 99, 132, 0.2)',
                         'rgba(54, 162, 235, 0.2)',
                         'rgba(255, 206, 86, 0.2)',
                         'rgba(75, 192, 192, 0.2)',
                         'rgba(153, 102, 255, 0.2)'
                     ],
                     borderColor: [
                         'rgba(255, 99, 132, 1)',
                         'rgba(54, 162, 235, 1)',
                         'rgba(255, 206, 86, 1)',
                         'rgba(75, 192, 192, 1)',
                         'rgba(153, 102, 255, 1)'
                     ],
                     borderWidth: 1
                 }]
             },
             options: {
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: {
                     legend: {
                         position: 'top',
                     },
                     tooltip: {
                         callbacks: {
                             label: function(tooltipItem) {
                                 const value = tooltipItem.raw.toFixed(2);
                                 return `${tooltipItem.label}: ${value}%`;
                             }
                         }
                     }
                 }
             }
         });


      }) .catch((error) => {
        console.error('Error:', error);
      });
}

export function displayGoalTrajectories(chartPlaceholder)
{
  const url = "https://studentresearch.dashboards.calstate.edu/api/graduation-initiative/goal-trajectories/ftf_6yr_pell/35";
  const fullUrl = `${url}`;

  const canvasElement = document.createElement("canvas");
  canvasElement.id = "myAreaChart";
  canvasElement.style.border = "1px solid black";
  canvasElement.style.padding = "10px";
  canvasElement.style.margin = "auto";
  canvasElement.style.height = "400px";
  canvasElement.style.width = "600px";
  chartPlaceholder.appendChild(canvasElement);

  fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      // console.log('displayGoalTracjectories:', data);

       // Extract the data for the chart
       const labels = data.result.map(item => item.COHORT);
       const nonPellData = data.result.map(item => item.FTF_6YR_GRAD_NONPELL);
       const pellData = data.result.map(item => item.FTF_6YR_GRAD_PELL);

       // Create the area chart
       const ctx = document.getElementById('myAreaChart').getContext('2d');
       const myAreaChart = new Chart(ctx, {
           type: 'line', // Use 'line' type with fill for area chart
           data: {
               labels: labels,
               datasets: [
                   {
                       label: 'Non-Pell Students',
                       data: nonPellData,
                       backgroundColor: 'rgba(75, 192, 192, 0.4)',
                       borderColor: 'rgba(75, 192, 192, 1)',
                       fill: true,
                       tension: 0.3
                   },
                   {
                       label: 'Pell Students',
                       data: pellData,
                       backgroundColor: 'rgba(153, 102, 255, 0.4)',
                       borderColor: 'rgba(153, 102, 255, 1)',
                       fill: true,
                       tension: 0.3
                   }
               ]
           },
           options: {
               responsive: true,
               maintainAspectRatio: false,
               scales: {
                   x: {
                       title: {
                           display: true,
                           text: 'Cohort Year'
                       }
                   },
                   y: {
                       beginAtZero: true,
                       title: {
                           display: true,
                           text: '6-Year Graduation Rate (%)'
                       }
                   }
               },
               plugins: {
                   tooltip: {
                       callbacks: {
                           label: function(tooltipItem) {
                               return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
                           }
                       }
                   }
               }
           }
       });


    }) .catch((error) => {
      console.error('Error:', error);
    });

}