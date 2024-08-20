let globalOneRM = 0;
let globalUnit = 'lbs';
let globalBarWeight = 45;
let progressHistory = [];

document.getElementById('oneRMForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    globalUnit = document.getElementById('unit').value;
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps < 1) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }
    
    globalOneRM = calculateOneRM(weight, reps);
    updateResults();
});

function calculateOneRM(weight, reps) {
    let oneRM = weight * (100 / (101.3 - (2.67123 * reps)));
    if (oneRM < 0) {
        oneRM = weight * (1 + reps / 30);
    }
    return oneRM;
}

function updateResults() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Your estimated 1RM is: ${globalOneRM.toFixed(1)} ${globalUnit}`;
    resultDiv.style.backgroundColor = '#e9f5ff';
    
    displayPercentageResults();
    
    // Update convert button
    const convertUnitBtn = document.getElementById('convertUnitBtn');
    convertUnitBtn.textContent = `Convert to ${globalUnit === 'lbs' ? 'kg' : 'lbs'}`;
    convertUnitBtn.style.display = 'block';

    // Show save progress container
    document.getElementById('saveProgressContainer').style.display = 'flex';
}

function displayPercentageResults() {
    const percentages = [50, 60, 70, 75, 80, 85, 90, 95, 100];
    const percentageResultsDiv = document.getElementById('percentageResults');
    
    percentageResultsDiv.innerHTML = '<h3>Percentage-Based Weights</h3>';
    
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    const headerRow = table.insertRow();
    ['Percentage', 'Weight', 'Plate Loading (per side)'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f4f4f4';
        headerRow.appendChild(th);
    });
    
    percentages.forEach(function(percentage) {
        const weightForPercentage = globalOneRM * (percentage / 100);
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        
        cell1.textContent = percentage === 100 ? '1RM' : `${percentage}% of 1RM`;
        cell2.textContent = `${weightForPercentage.toFixed(1)} ${globalUnit}`;
        cell3.textContent = calculatePlateLoading(weightForPercentage);

        [cell1, cell2, cell3].forEach(cell => {
            cell.style.border = '1px solid #ddd';
            cell.style.padding = '8px';
        });
    });
    
    const noteRow = table.insertRow();
    const noteCell = noteRow.insertCell(0);
    noteCell.colSpan = 3;
    noteCell.innerHTML = `Note: Plate loading is calculated for a ${globalBarWeight} ${globalUnit} bar.`;
    noteCell.style.border = '1px solid #ddd';
    noteCell.style.padding = '8px';
    noteCell.style.fontStyle = 'italic';
    
    const barWeightRow = table.insertRow();
    const barWeightCell = barWeightRow.insertCell(0);
    barWeightCell.colSpan = 3;
    barWeightCell.style.border = '1px solid #ddd';
    barWeightCell.style.padding = '8px';
    
    barWeightCell.appendChild(document.createTextNode('Select bar weight for plate loading: '));
    
    const barWeights = globalUnit === 'lbs' ? [45, 35, 25] : [20, 15, 10];
    barWeights.forEach(weight => {
        const btn = document.createElement('button');
        btn.textContent = `${weight} ${globalUnit}`;
        btn.className = 'bar-weight-btn';
        if (weight === globalBarWeight) btn.classList.add('selected');
        btn.onclick = function() {
            globalBarWeight = weight;
            updateResults();
        };
        barWeightCell.appendChild(btn);
    });
    
    percentageResultsDiv.appendChild(table);
}

function calculatePlateLoading(weight) {
    const barWeight = globalBarWeight;
    let remainingWeight = Math.max(0, weight - barWeight);
    const plates = globalUnit === 'lbs' 
        ? [45, 35, 25, 10, 5, 2.5] 
        : [25, 20, 15, 10, 5, 2.5, 1.25];
    let loading = '';

    if (weight <= barWeight) {
        return 'Just the bar';
    }

    remainingWeight = Math.round(remainingWeight / 2.5) * 2.5;

    plates.forEach(plate => {
        const count = Math.floor(remainingWeight / (plate * 2));
        if (count > 0) {
            loading += `${count}x${plate}${globalUnit} `;
            remainingWeight -= count * plate * 2;
        }
    });

    return loading.trim() || 'Just the bar';
}

document.getElementById('convertUnitBtn').addEventListener('click', function() {
    globalOneRM = globalUnit === 'lbs' ? globalOneRM * 0.453592 : globalOneRM * 2.20462;
    globalUnit = globalUnit === 'lbs' ? 'kg' : 'lbs';
    
    if (globalUnit === 'lbs') {
        globalBarWeight = Math.round(globalBarWeight * 2.20462);
        if (globalBarWeight > 40) globalBarWeight = 45;
        else if (globalBarWeight > 30) globalBarWeight = 35;
        else globalBarWeight = 25;
    } else {
        globalBarWeight = Math.round(globalBarWeight * 0.453592);
        if (globalBarWeight > 17) globalBarWeight = 20;
        else if (globalBarWeight > 12) globalBarWeight = 15;
        else globalBarWeight = 10;
    }
    
    updateResults();
});

function saveProgress() {
    const date = new Date().toLocaleDateString();
    const liftType = document.getElementById('liftTypeSearch').value;
    progressHistory.push({ date, liftType, oneRM: globalOneRM, unit: globalUnit });
    localStorage.setItem('1RMProgressHistory', JSON.stringify(progressHistory));
    displayProgressHistory();
}

function displayProgressHistory() {
    const progressHistoryDiv = document.getElementById('progressHistory');
    const progressList = document.getElementById('progressList');
    progressList.innerHTML = '';

    progressHistory.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date} - ${entry.liftType}: ${entry.oneRM.toFixed(1)} ${entry.unit}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            progressHistory.splice(index, 1);
            localStorage.setItem('1RMProgressHistory', JSON.stringify(progressHistory));
            displayProgressHistory();
        };
        listItem.appendChild(deleteBtn);

        progressList.appendChild(listItem);
    });

    progressHistoryDiv.style.display = progressHistory.length > 0 ? 'block' : 'none';
}

function loadProgressHistory() {
    const savedHistory = localStorage.getItem('1RMProgressHistory');
    if (savedHistory) {
        progressHistory = JSON.parse(savedHistory);
        displayProgressHistory();
    }
}

function setupLiftTypeSearch() {
    const searchInput = document.getElementById('liftTypeSearch');
    const liftTypeSelect = document.getElementById('liftType');
    const liftOptions = liftTypeSelect.getElementsByTagName('option');

    searchInput.addEventListener('focus', () => {
        liftTypeSelect.style.display = 'block';
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            liftTypeSelect.style.display = 'none';
        }, 200);
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        for (let option of liftOptions) {
            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchTerm)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
    });

    liftTypeSelect.addEventListener('change', () => {
        searchInput.value = liftTypeSelect.options[liftTypeSelect.selectedIndex].text;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgressHistory();
    setupLiftTypeSearch();
});

document.getElementById('saveProgressBtn').addEventListener('click', saveProgress);
