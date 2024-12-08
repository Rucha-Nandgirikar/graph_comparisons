
// Alternate graph 1
  export function displayMyEquityGapsMajorGaps(chartPlaceholder) {
    // Create a parent canvas element
    const canvasElement = document.createElement("div");
    canvasElement.id = "MyEquityGaps";
    canvasElement.style.border = "1px solid black";
    canvasElement.style.padding = "10px";
    canvasElement.style.margin = "auto";
    canvasElement.style.height = "500px"; // Increase height to fit both charts
    canvasElement.style.width = "800px"; // Ensure width accommodates both charts
    canvasElement.style.display = "flex";
    canvasElement.style.flexDirection = "column"; // Arrange title and charts vertically
    canvasElement.style.alignItems = "center";
  
    // Append canvasElement to chartPlaceholder
    chartPlaceholder.appendChild(canvasElement);
  
    // Add title to the canvas element
    const titleElement = document.createElement("h3");
    titleElement.innerText = "Close the Gap";
    titleElement.style.textAlign = "center";
    titleElement.style.marginBottom = "20px"; // Add spacing between title and charts
    canvasElement.appendChild(titleElement);
  
    // Create a wrapper for the charts
    const chartWrapper = document.createElement("div");
    chartWrapper.style.display = "flex";
    chartWrapper.style.justifyContent = "center"; // Space out the two charts
    chartWrapper.style.width = "50%";
    chartWrapper.style.height = "50%"; // Ensure wrapper takes full height
    chartWrapper.style.flexGrow = "1"; // Allow charts to fill available space
    canvasElement.appendChild(chartWrapper);
  
    // Create individual canvas elements for the charts
    const canvasElementMajorAtEntry = document.createElement("canvas");
    canvasElementMajorAtEntry.id = "majorAtEntryChart";
    canvasElementMajorAtEntry.style.flex = "1"; // Make the chart responsive
    canvasElementMajorAtEntry.style.margin = "10px"; // Add spacing around the charts
    chartWrapper.appendChild(canvasElementMajorAtEntry);
  
    const canvasElementLastMajorHeld = document.createElement("canvas");
    canvasElementLastMajorHeld.id = "lastMajorHeldChart";
    canvasElementLastMajorHeld.style.flex = "1"; // Make the chart responsive
    canvasElementLastMajorHeld.style.margin = "10px"; // Add spacing around the charts
    chartWrapper.appendChild(canvasElementLastMajorHeld);
  
    // Fetch data and plot the charts
    const url1 = "https://studentresearch.dashboards.calstate.edu/api/equity-gaps/my-equity-gaps/major-gaps";
    const params1 = {
      'campus': "Pomona",
      'student_type': "freshmen",
      'outcome': "6th-Year Graduation",
      'gap_type': "firstgen",
    };
    const queryString1 = new URLSearchParams(params1).toString();
    const fullUrl1 = `${url1}?${queryString1}`;
  
    fetch(fullUrl1, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
  
        // Extract data for "Major At Entry"
        const majorAtEntryLabels = [data[0].major1, data[0].major2, data[0].major3, data[0].major4, data[0].major5];
        const majorAtEntryData = [data[0].n_major1_addtl, data[0].n_major2_addtl, data[0].n_major3_addtl, data[0].n_major4_addtl, data[0].n_major5_addtl];
        const majorAtEntryTotal = majorAtEntryData.reduce((sum, value) => sum + value, 0);
  
        // Extract data for "Last Major Held"
        const lastMajorHeldLabels = [data[1].major1, data[1].major2, data[1].major3, data[1].major4, data[1].major5];
        const lastMajorHeldData = [data[1].n_major1_addtl, data[1].n_major2_addtl, data[1].n_major3_addtl, data[1].n_major4_addtl, data[1].n_major5_addtl];
        const lastMajorHeldTotal = lastMajorHeldData.reduce((sum, value) => sum + value, 0);
  
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
            plugins: {
              title: {
                display: true,
                text: `By Major at Entry (Total: ${majorAtEntryTotal} Students)`
              }
            },
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
            plugins: {
              title: {
                display: true,
                text: `By Major Last Held (Total: ${lastMajorHeldTotal} Students)`
              }
            },
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
  // Alternate graph 2
  export function displayStudentProgressUnits(chartPlaceholder)
  {
    // let h4Element = document.createElement("h4");
    // h4Element.innerText = "Cannot embed alternative graph(faculty-dashboard/student-progress-units) iframe due to security issues"; // or use h4Element.textContent
    // chartPlaceholder.appendChild(h4Element);
  
    let iframeElement = document.createElement("iframe");
    iframeElement.src = `https://studentresearch2.dashboards.calstate.edu/faculty-dashboard/student-progress-units`;
    iframeElement.width = "150%";
    iframeElement.height = "100%";
    iframeElement.style.transform = "scale(0.50)";
    iframeElement.style.transformOrigin = "20% top"
    iframeElement.style.marginBottom = "-400px";
    iframeElement.style.border = "none";
    chartPlaceholder.appendChild(iframeElement);
  }
  // Alternate graph 3
  export function displayGoalTrajectories(chartPlaceholder) {
    const url = "https://studentresearch.dashboards.calstate.edu/api/graduation-initiative/goal-trajectories/ftf_6yr_pell/ZZ";
  
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
        // Extract the data for the chart
        const filteredData = data.result.filter(item => item.PELL_GAP !== null);
        const labels = filteredData.map(item => `${item.COHORT} - ${parseInt(item.COHORT) + 6}`);
        const nonPellData = filteredData.map(item => item.FTF_6YR_GRAD_NONPELL);
        const pellData = filteredData.map(item => item.FTF_6YR_GRAD_PELL);
        const pellGapDifference = filteredData.map(item => item.PELL_GAP ? item.PELL_GAP.toFixed(2) : "N/A");
  
        // Create the chart
        const ctx = document.getElementById('myAreaChart').getContext('2d');
        const myAreaChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Non-Pell Students',
                data: nonPellData,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
              },
              {
                label: 'Pell Students',
                data: pellData,
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 2,
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
                  text: 'Cohorts'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Percentage of Students'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: "Pell & Non-Pell Equity Gap Goal",
                font: {
                  size: 16, // Larger font size for the main title
                },
                padding: {
                  top: 10,
                  bottom: 5, // Add some spacing before the subtitle
                },
              },
              subtitle: {
                display: true,
                text: "Hover over the chart to get the details",
                font: {
                  size: 13, // Smaller font size for the subtitle
                },
                padding: {
                  top: 0,
                  bottom: 10,
                },
              },
              tooltip: {
                callbacks: {
                  footer: function (tooltipItems) {
                    const dataIndex = tooltipItems[0].dataIndex; // Get the index of the hovered data point
                    const pellGapDiff = pellGapDifference[dataIndex];
                    return `Pell Gap Difference: ${pellGapDiff}`;
                  }
                },
                footerFont: {
                  size: 12,
                  style: 'italic'
                }
              }
            },
            interaction: {
              mode: 'index',
              intersect: false // Ensures tooltip shows for both lines
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // Alternate graph 4
  export function displayWhatPathDoTheyFollow(chartPlaceholder)
  {
    
      const url = "https://studentresearch.dashboards.calstate.edu/api/faculty-dashboard/what-paths-do-they-follow/chart-data?campus=Bakersfield&college=School%20of%20Arts%20%26%20Humanities&major=Art&flowOption=1";
  
     
  
      // Append the query string to the URL
       const fullUrl = `${url}`
     
  
      const canvasElement = document.createElement("canvas");
  
      canvasElement.id = "myPieChart";
      canvasElement.style.border = "1px solid black";
      canvasElement.style.padding = "10px";
      canvasElement.style.margin = "auto";
      canvasElement.style.height = "400px";
      canvasElement.style.width = "600px";
      // canvasElement.appendChild(h4Element);
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
                       title: {
                        display: true,
                        text: [
                          'CSU Major Migration for all First-time Full-time Freshmen who Graduated in 2021, 2022, or 2023',
                          `School of Arts and Humanities: ${totalStudents} students`
                      ]
                      },
                       tooltip: {
                           callbacks: {
                            title: function(tooltipItems) {
                              // Access the dataIndex and retrieve nStudents
                              const index = tooltipItems[0].dataIndex;
                              const nStudents = data.seriesData[index].nStudents;
                              const major = data.seriesData[index].from;
                              
                              // Return the heading with nStudents
                              return `From College ${major}: ${nStudents} students`;
                          },
                               label: function(tooltipItem) {
                                   const value = tooltipItem.raw.toFixed(2);
                                   const lines = [
                                    `\tApproximately ${value}% of students graduating from the School of Arts and Humanities began as`,
                                    `students in the ${tooltipItem.label}`
                                ];
                                  return lines;
                               },
                           }
                       }
                   }
               }
           });
  
  
        }) .catch((error) => {
          console.error('Error:', error);
        });
  }
  // Alternate graph 5
  export function displayEnrollingAndGraduating(chartPlaceholder) {
  
  
  const tooltipData = [
    {
        tooltip_title: "204,020 freshmen applied",
        tooltip_point1: "Up 4.7% from the prior year",
        region: { x: 97, y: 97, width: 413, height: 151 } // Region 1
    },
    {
        tooltip_title: "91% of applicants admitted",
        tooltip_point1: "Down 0.8 percentage points from the prior year (6,794 more)",
        region: { x: 125, y: 255, width: 363, height: 120 } // Region 2
    },
    {
        tooltip_title: "36% of those admitted enrolled",
        tooltip_point1: "Up 0.3 percentage points from the prior year (2,947 more)",
        region: { x: 165, y: 390, width: 283, height: 98 } // Region 3
    }
  ];
  
  
    // Create and configure the canvas element
    const canvas = document.createElement("canvas");
    canvas.id = "myEnrollingAndGraduating";
    canvas.style.border = "1px solid black";
    // canvas.style.height = "400px";
    canvas.style.width = "600px";
    canvas.style.display = "flex"; 
    canvas.style.justifySelf = "center";
    chartPlaceholder.appendChild(canvas);
  
    // Create and configure the tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.display = "none";
    tooltip.style.backgroundColor = "#333"; // Darker background for compact style
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px 8px"; // Reduced padding for compactness
    tooltip.style.borderRadius = "4px"; // Slightly rounded corners
    tooltip.style.fontSize = "11px"; // Smaller font size for compactness
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "normal"; // Allow line wrapping
    tooltip.style.maxWidth = "200px"; // Limit the width of the tooltip
    chartPlaceholder.appendChild(tooltip);
  
    const ctx = canvas.getContext("2d");
  
    // Load and draw the PNG image on the canvas
    const img = new Image();
    img.src = "../img/enrolling-graduating.png"; // Replace with the actual image URL
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  
    // Event listener for mousemove to detect regions
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
  
        // Check if the pointer is in any defined region
        const hoveredRegion = tooltipData.find(regionData => {
            const { x: rx, y: ry, width, height } = regionData.region;
            return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
        });
  
        if (hoveredRegion) {
            // Show tooltip for the hovered region
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.style.display = "block";
  
            tooltip.innerHTML = `
                <div style="font-size: 15px; font-weight: bold; margin-bottom: 3px;">
                    ${hoveredRegion.tooltip_title}
                </div>
                <div style="font-size: 12px;">
                    ${hoveredRegion.tooltip_point1 || ""}
                </div>
            `;
        } else {
            tooltip.style.display = "none";
        }
    });
  
    // Hide tooltip on mouseout
    canvas.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
    });
  }
  
  
  