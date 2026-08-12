import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for React frontend (default Vite dev server on port 5173/3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ==========================================
# IN-MEMORY DATABASE (Initial Seed Data)
# ==========================================

courses = [
    {
        "id": "c1",
        "code": "CS 101",
        "name": "Introduction to Computer Science",
        "color": "#4D7FA8",
    },
    {
        "id": "c2",
        "code": "MATH 201",
        "name": "Linear Algebra & Calculus",
        "color": "#6B8E23",
    },
    {
        "id": "c3",
        "code": "CYBER 301",
        "name": "Network Security Fundamentals",
        "color": "#8A2BE2",
    },
]

assignments = [
    {
        "id": "a1",
        "title": "Data Structures Implementation Project",
        "courseId": "c1",
        "dueDate": "2026-08-20",
        "status": "in_progress",  # 'pending' | 'in_progress' | 'completed'
        "priority": "high",       # 'low' | 'medium' | 'high'
        "description": "Implement standard linked lists and trees in Python.",
    },
    {
        "id": "a2",
        "title": "Problem Set 4: Eigenvalues",
        "courseId": "c2",
        "dueDate": "2026-08-15",
        "status": "pending",
        "priority": "medium",
        "description": "Solve exercises 1 through 10 in Chapter 4.",
    },
]

grades = [
    {
        "id": "g1",
        "courseId": "c1",
        "title": "Midterm Exam",
        "score": 92.5,
        "maxScore": 100,
        "weight": 30,
        "date": "2026-07-15",
    },
    {
        "id": "g2",
        "courseId": "c2",
        "title": "Quiz 1",
        "score": 18,
        "maxScore": 20,
        "weight": 10,
        "date": "2026-07-20",
    },
]

workouts = [
    {
        "id": "w1",
        "title": "Upper Body Hypertrophy",
        "date": "2026-08-11",
        "durationMinutes": 45,
        "notes": "Focused on bench press and pull-ups.",
        "exercises": [
            {"name": "Bench Press", "sets": 4, "reps": 8, "weightKg": 70},
            {"name": "Pull-ups", "sets": 3, "reps": 10, "weightKg": 0},
        ],
    }
]


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def generate_id(prefix="id"):
    return f"{prefix}_{int(datetime.utcnow().timestamp() * 1000)}"


# ==========================================
# API ROUTES
# ==========================================

# --- COURSES ---
@app.route("/api/courses", methods=["GET"])
def get_courses():
    return jsonify(courses), 200


@app.route("/api/courses", methods=["POST"])
def add_course():
    data = request.get_json() or {}
    new_course = {
        "id": generate_id("c"),
        "code": data.get("code", "NEW 101"),
        "name": data.get("name", "Untitled Course"),
        "color": data.get("color", "#4D7FA8"),
    }
    courses.append(new_course)
    return jsonify(new_course), 201


# --- ASSIGNMENTS ---
@app.route("/api/assignments", methods=["GET"])
def get_assignments():
    return jsonify(assignments), 200


@app.route("/api/assignments", methods=["POST"])
def create_assignment():
    data = request.get_json() or {}
    new_assignment = {
        "id": generate_id("a"),
        "title": data.get("title", "Untitled Assignment"),
        "courseId": data.get("courseId", ""),
        "dueDate": data.get("dueDate", datetime.utcnow().strftime("%Y-%m-%d")),
        "status": data.get("status", "pending"),
        "priority": data.get("priority", "medium"),
        "description": data.get("description", ""),
    }
    assignments.append(new_assignment)
    return jsonify(new_assignment), 201


@app.route("/api/assignments/<string:assignment_id>", methods=["PUT"])
def update_assignment(assignment_id):
    data = request.get_json() or {}
    for item in assignments:
        if item["id"] == assignment_id:
            item.update({
                "title": data.get("title", item["title"]),
                "courseId": data.get("courseId", item["courseId"]),
                "dueDate": data.get("dueDate", item["dueDate"]),
                "status": data.get("status", item["status"]),
                "priority": data.get("priority", item["priority"]),
                "description": data.get("description", item["description"]),
            })
            return jsonify(item), 200
    return jsonify({"error": "Assignment not found"}), 404


@app.route("/api/assignments/<string:assignment_id>", methods=["DELETE"])
def delete_assignment(assignment_id):
    global assignments
    assignments = [a for a in assignments if a["id"] != assignment_id]
    return jsonify({"success": True, "id": assignment_id}), 200


# --- GRADES ---
@app.route("/api/grades", methods=["GET"])
def get_grades():
    return jsonify(grades), 200


@app.route("/api/grades", methods=["POST"])
def create_grade():
    data = request.get_json() or {}
    new_grade = {
        "id": generate_id("g"),
        "courseId": data.get("courseId", ""),
        "title": data.get("title", "Assessment"),
        "score": float(data.get("score", 0)),
        "maxScore": float(data.get("maxScore", 100)),
        "weight": float(data.get("weight", 0)),
        "date": data.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
    }
    grades.append(new_grade)
    return jsonify(new_grade), 201


@app.route("/api/grades/<string:grade_id>", methods=["DELETE"])
def delete_grade(grade_id):
    global grades
    grades = [g for g in grades if g["id"] != grade_id]
    return jsonify({"success": True, "id": grade_id}), 200


# --- WORKOUTS ---
@app.route("/api/workouts", methods=["GET"])
def get_workouts():
    return jsonify(workouts), 200


@app.route("/api/workouts", methods=["POST"])
def create_workout():
    data = request.get_json() or {}
    new_workout = {
        "id": generate_id("w"),
        "title": data.get("title", "Workout Session"),
        "date": data.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
        "durationMinutes": int(data.get("durationMinutes", 0)),
        "notes": data.get("notes", ""),
        "exercises": data.get("exercises", []),
    }
    workouts.append(new_workout)
    return jsonify(new_workout), 201


@app.route("/api/workouts/<string:workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    global workouts
    workouts = [w for w in workouts if w["id"] != workout_id]
    return jsonify({"success": True, "id": workout_id}), 200


# --- HEALTH CHECK ---
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "time": datetime.utcnow().isoformat()}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6767, debug=True)