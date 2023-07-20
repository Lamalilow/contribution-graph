// Function for creating and updating the graph
async function createContributionGraph() {
  const dataUrl = 'calendar.json'; // Replace with the specific URL
  
  try {
      const response = await fetch(dataUrl);
      const contributionsData = await response.json();
  
      const graphContainer = document.getElementById('contributionGraph');
      graphContainer.innerHTML = ''; // Clear the container before creating the graph
  
      const colors = ['#EDEDED', '#ACD5F2', '#7FA8C9', '#527BA0', '#254E77'];
  
      // Function for getting the color based on the number of contributions
      function getFillColor(contributions) {
          if (contributions === 0) return colors[0];
          if (contributions >= 1 && contributions <= 9) return colors[1];
          if (contributions >= 10 && contributions <= 19) return colors[2];
          if (contributions >= 20 && contributions <= 29) return colors[3];
          return colors[4];
      }
  
      // Get the current date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Create the table for the graph
      const table = document.createElement('table');
  
      // Add the header with the weekdays and months
      const headerRow = document.createElement('tr');
      headerRow.innerHTML = '<th></th>';
  
      // Array to store already displayed months
      const displayedMonths = [];
  
      for (let col = 0; col < 51; col++) {
          const cellDate = new Date(today);
          cellDate.setDate(today.getDate() - (50 - col) * 7);
          const month = cellDate.toLocaleDateString('ru-RU', { month: 'short' });
  
          // Add the month to the header only if it's not already displayed
          if (!displayedMonths.includes(month)) {
              displayedMonths.push(month);
              headerRow.innerHTML += `<th>${month}</th>`;
          } else {
              headerRow.innerHTML += `<th></th>`;
          }
      }
      table.appendChild(headerRow);
  
      // Generate rows and columns for the graph
      for (let row = 0; row < 7; row++) {
          const tr = document.createElement('tr');
  
          // Display the day of the week to the left of the graph
          const cellDate = new Date(today);
          cellDate.setDate(today.getDate() - (50 * 7) + row);
          const dayOfWeek = cellDate.toLocaleDateString('ru-RU', { weekday: 'short' });
          const th = document.createElement('th');
          th.textContent = dayOfWeek;
          tr.appendChild(th);
  
          for (let col = 0; col < 51; col++) {
              const td = document.createElement('td');
  
              // Calculate the date for the current cell
              const cellDate = new Date(today);
              cellDate.setDate(today.getDate() - (50 - col) * 7 + row);
  
              // Format the date to compare with the data
              const formattedDate = cellDate.toISOString().slice(0, 10);
  
              // Find the number of contributions for the date
              const contributions = contributionsData[formattedDate] || 0;
  
              // Set the color and title for the cell
              const fillColor = getFillColor(contributions);
              td.style.backgroundColor = fillColor;
              td.classList.add('tooltip');
              const tooltipText = document.createElement('div');
              tooltipText.className = 'tooltiptext';
              tooltipText.textContent = `Date: ${formattedDate}\nContributions: ${contributions}`;
              td.appendChild(tooltipText);
              tr.appendChild(td);
          }
  
          table.appendChild(tr);
      }
  
      graphContainer.appendChild(table);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
  }
  
  createContributionGraph();