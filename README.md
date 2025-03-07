### BookBus
# Bus Booking Platform

## 📌 Project Overview
This is a *Next.js*-based web application designed for a seamless bus booking experience. The platform allows passengers to book seats, manage their bookings, and provides administrative tools for bus operators to manage buses, drivers, and transactions efficiently.

The project follows a *modern UI design, featuring a **dark theme with accents of #F4A900* to maintain consistency with the Figma design.

## ✨ Features

### 🚍 User Features
- *Book Bus Tickets*: Users can search for and book available seats on buses.
- *Seat Selection*: Interactive seat layout that allows users to pick seats based on availability and category (VIP, Business, Standard, etc.).
- *Booking Submission*: Users enter personal details (Name, ID, Residence, Phone) to complete the booking.
- *User Dashboard*: View booking history and manage active reservations.

### 🔧 Admin Features
- *Manage Buses*: Add, edit, and remove buses from the system.
- *Manage Drivers*: Assign and manage drivers for various routes.
- *Handle Transactions*: Monitor booking transactions.
- *Manage Reviews*: View and respond to customer feedback.
- *Company Management*: Add and manage bus companies.

### 🏢 Driver Features
- *Driver Profile*: View personal information and assigned routes.
- *Route Management*: Drivers can see upcoming trips assigned to them.

## 🛠️ Tech Stack
- *Frontend*: Next.js, Tailwind CSS
- *Backend*: Python
- *Database*: PostgreSQL
- *Authentication*: JWT

## 🎨 Design & UI
- *Dark-themed UI with yellow (#F4A900) highlights*.
- *Designed in Figma* to ensure a smooth and visually appealing user experience.
- *Responsive Layout* for seamless use across different devices.

## 📂 Project Folder Structure

📦 bus-booking-app
 ┣ 📂 adminhomepage
 ┃ ┣ 📂 addbuses
 ┃ ┃ ┣ 📜 Addbuses.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📂 adddriver
 ┃ ┃ ┣ 📜 Adddriver.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📂 adminmanagebuses
 ┃ ┃ ┣ 📜 Adminmanagebuses.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📂 adminmanagedriver
 ┃ ┃ ┣ 📜 Adminmanagedriver.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📂 adminmanagereviews
 ┃ ┃ ┣ 📜 Adminmanagereviews.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📂 adminmanagetransactions
 ┃ ┃ ┣ 📜 Adminmanagetransactions.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📜 Adminhomepage.js
 ┃ ┣ 📜 page.js
 ┣ 📂 bookingbus
 ┃ ┣ 📜 bookingbus.js
 ┃ ┣ 📜 page.js
 ┣ 📂 bookings
 ┃ ┣ 📜 bookings.js
 ┃ ┣ 📜 page.js
 ┣ 📂 driverhomepage
 ┃ ┣ 📂 driverprofile
 ┃ ┃ ┣ 📜 Driverhomepage.js
 ┃ ┃ ┣ 📜 page.js
 ┣ 📂 selectseat
 ┃ ┣ 📜 selectseat.js
 ┃ ┣ 📜 page.js
 ┣ 📂 userhomepage
 ┃ ┣ 📂 addcompany
 ┃ ┃ ┣ 📜 Addcompany.js
 ┃ ┃ ┣ 📜 page.js
 ┃ ┣ 📜 userhomepage.js
 ┣ 📂 aboutus
 ┃ ┣ 📜 aboutus.js
 ┃ ┣ 📜 page.js
 ┣ 📜 _app.js
 ┣ 📜 layout.js
 ┣ 📜 page.js
 ┣ 📜 globals.css
 ┣ 📜 favicon.ico


## 🚀 Getting Started
### 1️⃣ Clone the Repository
bash
git clone https://github.com/Melrwa/BookBus.git
cd BookBus


### 2️⃣ Install Dependencies
bash
npm install
# or
yarn install


### 3️⃣ Run the Development Server
bash
npm run dev
# or
yarn dev

Then, open *http://localhost:5001* in your browser.

### 4️⃣ Build for Production
bash
npm run build
npm start


## 🔥 Future Improvements
- *Payment Integration* (e.g., Stripe, PayPal, Mobile Money)
- *Live Bus Tracking* using GPS APIs
- *Enhanced User Notifications* (SMS, Email Alerts)
- *AI-based Seat Recommendations*
- *Admin Analytics Dashboard*

## 📌 Conclusion
This project aims to modernize bus booking by providing an easy-to-use platform for passengers, drivers, and administrators. 🚍💨

---
### 👨‍💻 Need Help?
If you have any questions or need support, feel free to reach out! 🚀
