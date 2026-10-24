const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Read form data sent through POST requests
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS and other files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// GET route: Display the appointment form
app.post('/book-appointment', (req, res) => {
    const { name, mobile, email, age, doctor, date, symptoms } = req.body;

    const errors = [];

    // Validate patient name
    if (!name || name.trim().length < 2) {
        errors.push('Please enter a valid patient name.');
    }

    // Validate mobile number: exactly 10 digits
    if (!/^[0-9]{10}$/.test(mobile || '')) {
        errors.push('Mobile number must contain exactly 10 digits.');
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
        errors.push('Please enter a valid email address.');
    }

    // Validate age
    if (!/^\d+$/.test(age || '') || Number(age) < 1 || Number(age) > 120) {
        errors.push('Age must be a number between 1 and 100.');
    }

    // Validate doctor selection
    const doctors = [
        'General Physician',
        'Dentist',
        'Dermatologist',
        'Pediatrician'
    ];

    if (!doctors.includes(doctor)) {
        errors.push('Please select a valid doctor.');
    }

    // Validate appointment date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(`${date}T00:00:00`);

    if (!date || Number.isNaN(appointmentDate.getTime()) || appointmentDate < today) {
        errors.push('Please select today or a future appointment date.');
    }

    // Validate symptoms
    if (!symptoms || symptoms.trim().length < 3) {
        errors.push('Please enter a reason for your appointment (at least 3 characters).');
    }

    // Display validation errors
    if (errors.length > 0) {
    return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validation Error | MediBook</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f2f7fc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                .card {
                    background: white;
                    max-width: 450px;
                    width: 90%;
                    padding: 30px;
                    border-radius: 14px;
                    box-shadow: 0 8px 30px rgba(34, 76, 112, 0.1);
                }
                h1 {
                    color: #c0392b;
                    font-size: 24px;
                }
                li {
                    margin: 12px 0;
                    color: #4b5563;
                    line-height: 1.5;
                }
                a {
                    display: inline-block;
                    margin-top: 18px;
                    padding: 12px 18px;
                    background: #167d9a;
                    color: white;
                    text-decoration: none;
                    border-radius: 7px;
                }
                a:hover {
                    background: #10677f;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>❌ Please Correct the Errors</h1>
                <p>Please check the following details:</p>
                <ul>
                    ${errors.map(error => `<li>${escapeHtml(error)}</li>`).join('')}
                </ul>
                <a href="/">← Back to Appointment Form</a>
            </div>
        </body>
        </html>
    `);
}

    // Display success message
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Request | MediBook</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f2f7fc;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            }

            .card {
                background: white;
                max-width: 480px;
                width: 90%;
                padding: 35px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 8px 30px rgba(34, 76, 112, 0.1);
            }

            .icon {
                font-size: 55px;
            }

            h1 {
                color: #16845b;
                font-size: 26px;
            }

            p {
                color: #596b7d;
                line-height: 1.7;
            }

            .details {
                background: #f2f8fc;
                padding: 15px;
                border-radius: 9px;
                text-align: left;
                margin: 20px 0;
            }

            a {
                display: inline-block;
                margin-top: 15px;
                padding: 13px 20px;
                background: #167d9a;
                color: white;
                text-decoration: none;
                border-radius: 7px;
            }

            a:hover {
                background: #10677f;
            }

            .note {
                font-size: 12px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">✅</div>
            <h1>Request Submitted Successfully!</h1>
            <p>Thank you, ${escapeHtml(name.trim())}!</p>

            <div class="details">
                <p><strong>Doctor:</strong> ${escapeHtml(doctor)}</p>
                <p><strong>Appointment Date:</strong> ${escapeHtml(date)}</p>
                <p><strong>Patient Age:</strong> ${escapeHtml(age)}</p>
            </div>

            <p>Your appointment request has been received.</p>
            

            <a href="/">← Back to Home</a>
        </div>
    </body>
    </html>
`);
});

// Escape user input before displaying it in HTML
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`MediBook server running at http://localhost:${PORT}`);
});