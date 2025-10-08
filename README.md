# Password Generator + Secure Vault

A modern web application that combines a password generator with a secure vault to store your credentials.

## Features

- **Password Generator**: Create strong, customizable passwords
- **Secure Vault**: Store and manage your credentials securely
- **Encryption**: All sensitive data is encrypted using AES encryption
- **User Authentication**: Secure login and signup system
- **Search Functionality**: Easily find stored credentials

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

## Setup and Installation

### Frontend Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Password-Generator/Madquick-Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will open in your default browser at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ../Madquick-Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```
   The backend server will run on http://localhost:8080

## Usage

1. **Register/Login**: Create an account or log in to access the vault
2. **Generate Passwords**: Use the password generator to create strong passwords
3. **Store Credentials**: Save your credentials in the secure vault
4. **Manage Entries**: View, edit, or delete stored credentials
5. **Search**: Use the search bar to find specific entries

## Project Structure

- **Frontend**: React application with components for UI
  - `components/`: UI components (VaultList, VaultModal, PasswordGenerator, etc.)
  - `pages/`: Main application pages (Login, Signup, Vault)
  - `utils/`: Utility functions and helpers

- **Backend**: Node.js server with API endpoints
  - Handles authentication, data storage, and retrieval

## Security Features

- AES encryption for all sensitive data
- Secure authentication system
- Password visibility toggle
- Automatic clipboard clearing

## Development

- Run tests: `npm test`
- Build for production: `npm run build`

## License

[MIT License](LICENSE)
