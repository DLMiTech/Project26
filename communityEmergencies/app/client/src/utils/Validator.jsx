class Validator {
    static phone(phone) {
        // Only digits, length 10–15
        const regex = /^\d{10,15}$/;

        if (!regex.test(phone)) {
            return {
                status: false,
                message: "Phone number must contain only numbers and be 10 to 15 digits"
            };
        }

        return {
            status: true,
            message: "Valid phone number"
        };
    }

    static email(email) {
        // Valid email format
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {
            return {
                status: false,
                message: "Invalid email address"
            };
        }

        return {
            status: true,
            message: "Valid email"
        };
    }

    static password(password) {
        // Minimum 6 chars, uppercase, lowercase, number, special char
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{6,}$/;

        if (!regex.test(password)) {
            return {
                status: false,
                message:
                    "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
            };
        }

        return {
            status: true,
            message: "Valid password"
        };
    }

    static name(name) {
        // Only letters, spaces, ., -, _
        const regex = /^[A-Za-z\s._-]+$/;

        if (!regex.test(name)) {
            return {
                status: false,
                message:
                    "Name can only contain letters, spaces, ., -, and _"
            };
        }

        return {
            status: true,
            message: "Valid name"
        };
    }
}

export default Validator;