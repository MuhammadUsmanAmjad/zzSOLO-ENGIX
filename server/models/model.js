import { Schema, model } from 'mongoose';
import nodemailer from 'nodemailer';

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    petrolPumpName: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending" // Set the default value as "pending"
    }
});

const Userdb = model('userdb', schema);

export async function create(req, res) {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // new user
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        petrolPumpName: req.body.petrolPumpName,
        Date: new Date(),
        time: new Date().toLocaleTimeString(),
        status: req.body.status || "pending"
    });

    // save user in the database
    user
        .save()
        .then(data => {
            // Send email
            sendEmail(data);

            res.redirect('/add-user');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

// Send email using Nodemailer
function sendEmail(user) {
    const transporter = nodemailer.createTransport({
        // configure your email provider here
        // For example, using SMTP:
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@example.com',
            pass: 'your-password'
        }
    });

    const mailOptions = {
        from: 'your-email@example.com',
        to: user.email,
        subject: 'Welcome to the application',
        text: `Dear ${user.name},\n\nWelcome to the application. Your account has been created successfully.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export default Userdb;