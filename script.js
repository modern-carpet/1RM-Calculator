document.getElementById('oneRMForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }
    
    // Calculate 1RM using the Brzycki formula
    const oneRM = calculateOneRM(weight, reps);
    const resultDiv = document.getElementById('result');
    
    // Display the 1RM result and apply the background color
    resultDiv.textContent = `Your estimated 1RM is: ${oneRM.toFixed(2)} lbs`;
    resultDiv.style.backgroundColor = '#e7f0ff'; // Apply the background color
    
    // Show the button to display percentage-based weights
    const showPercentagesBtn = document.getElementById('showPercentagesBtn');
    showPercentagesBtn.style.display = 'block';
    
    // Handle button click to display the percentage-based weights table
    showPercentagesBtn.addEventListener('click', function() {
        displayPercentageResults(oneRM);
        showPercentagesBtn.style.display = 'none'; // Hide the button after clicking
    });
});

function calculateOneRM(weight, reps) {
    // Brzycki Formula
    return weight * (36 / (37 - reps));
}

function displayPercentageResults(oneRM) {
    const percentages = [50, 60, 70, 75, 80, 85, 90, 95];
    const percentageResultsDiv = document.getElementById('percentageResults');
    
    // Clear previous results
    percentageResultsDiv.innerHTML = '<h3>Percentage-Based Weights</h3>';
    
    // Create a table for the percentage-based results
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    percentages.forEach(function(percentage) {
        const weightForPercentage = (oneRM * (percentage / 100)).toFixed(2);
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        
        cell1.textContent = `${percentage}% of 1RM`;
        cell2.textContent = `${weightForPercentage} lbs`;

        // Add styles to the table cells
        cell1.style.border = '1px solid #ddd';
        cell1.style.padding = '8px';
        cell2.style.border = '1px solid #ddd';
        cell2.style.padding = '8px';
    });
    
    percentageResultsDiv.appendChild(table);
    percentageResultsDiv.style.display = 'block'; // Show the table
}
