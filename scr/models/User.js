// src/models/User.js


class User {
    constructor(fullName, email, password, role, gradeLevel = "N/A") {
        this.fullName = fullName;
        this.email = email;
        this.password = password; // This will be the scrambled password
        this.role = role;         // "student" or "parent"
        this.gradeLevel = gradeLevel;
        this.createdAt = new Date().toISOString();
    }


    // A helper method to turn our class into a plain object for Firebase
    toFirestore() {
        return {
            fullName: this.fullName,
            email: this.email,
            password: this.password,
            role: this.role,
            gradeLevel: this.gradeLevel,
            createdAt: this.createdAt
        };
    }
}


module.exports = User;
