document.getElementById('oneRMForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }
    
    const oneRM = calculateOneRM(weight, reps);
    document.getElementById('result').textContent = `Your estimated 1RM is: ${oneRM.toFixed(2)} lbs`;
});

function calculateOneRM(weight, reps) {
    // Brzycki Formula
    return weight * (36 / (37 - reps));
}