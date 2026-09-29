from flask import Flask, render_template, request, redirect, jsonify
import mysql.connector
import json

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="12345",
        database="hr_analytics"
    )

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM employees
    """)

    total_employees = cursor.fetchone()["total"]

    # Present Today
    cursor.execute("""
        SELECT COUNT(*) AS present_count
        FROM attendance
        WHERE attendance_date = CURDATE()
            AND status = 'Present'
    """)

    present_today = cursor.fetchone()["present_count"]

    # Active employees
    cursor.execute("""
        SELECT COUNT(*) AS active_count
        FROM employees
    """)

    active_employees = cursor.fetchone()["active_count"]

    # Employees on leave
    cursor.execute("""
        SELECT COUNT(*) AS leave_count
        FROM leave_management
    """)

    on_leave = cursor.fetchone()["leave_count"]

    # Average performance
    cursor.execute("""
        SELECT AVG(rating) AS average_rating
        FROM performance
    """)

    performance_result = cursor.fetchone()

    average_performance = round(
        performance_result["average_rating"] or 0, 1
    )

    # Attendance chart data
    cursor.execute("""
        SELECT status, COUNT(*) AS total
        FROM attendance
        GROUP BY status
    """)

    attendance_data = cursor.fetchall()

    # Performance chart data
    cursor.execute("""
        SELECT performance_level, COUNT(*) AS total
        FROM performance
        GROUP BY performance_level
        ORDER BY performance_level
    """)

    performance_data = cursor.fetchall()

    cursor.close()
    db.close()

    return render_template("dashboard.html",
                           total_employees=total_employees,
                           present_today=present_today,
                           active_employees=active_employees,
                           on_leave=on_leave,
                           average_performance=average_performance,
                           attendance_data=attendance_data,
                           performance_data=performance_data)
#======================================EMPLOYEE ==================================
@app.route("/employee")
def employee():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()

    print("EMPLOYEES:" ,employees)

    cursor.close()
    db.close()
    return render_template("employee.html", employees = employees)

#=============================DELETE EMPLOYEES====================================
@app.route("/delete_employee/<int:employee_id>")
def delete_employee(employee_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM employees WHERE employee_id = %s",
        (employee_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return redirect("/employee")

#=============================ADD EMPLOYEES======================================
@app.route("/add_employee", methods= ["POST"])
def add_employee():
    name = request.form["employee_name"]
    department = request.form["department"]
    email = request.form["email"]
    phone = request.form["phone"]
    joining_date = request.form["joining_date"]
    

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        INSERT INTO employees
        (employee_name, department, email, phone, joining_date)
        VALUES (%s, %s, %s, %s, %s)
        """

    cursor.execute(query, (
        name,
        department,
        email,
        phone,
        joining_date
    ))

    db.commit()
    cursor.close()
    db.close()

    return redirect ("/employee")

#===================================EDIT EMPLOYEES===============================

@app.route("/edit_employee/<int:employee_id>")
def edit_employee(employee_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM employees WHERE employee_id = %s",
        (employee_id,) 
    )

    employee = cursor.fetchone()

    cursor.close()
    db.close()

    return render_template("edit_employee.html", employee = employee)

#======================================UPDATE EMPLOYEE===========================

@app.route("/update_employee/<int:employee_id>", methods = ["POST"])
def update_employee(employee_id):
    name = request.form["employee_name"]
    department = request.form["department"]
    email = request.form["email"]
    phone = request.form["phone"]
    joining_date = request.form["joining_date"]

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        UPDATE employees
        SET employee_name = %s,
            department = %s,
            email = %s,
            phone = %s,
            joining_date = %s
        WHERE employee_id = %s
    """

    cursor.execute(query, (
        name, department, email, phone, joining_date, employee_id
    ))

    db.commit()

    cursor.close()
    db.close()

    return redirect("/employee")

#====================================== ATTENDANCE =============================

@app.route("/attendance")
def attendance():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

     # Attendance records
    cursor.execute("""
        SELECT
            attendance.attendance_id,
            attendance.employee_id,
            employees.employee_name,
            attendance.attendance_date,
            attendance.check_in,
            attendance.check_out,
            attendance.status
        FROM attendance
        LEFT JOIN employees
            ON attendance.employee_id = employees.employee_id
        ORDER BY attendance.attendance_id DESC
    """)

    attendance_records = cursor.fetchall()

    # Employee list for dropdown
    cursor.execute("""
        SELECT employee_id, employee_name
        FROM employees
    """)

    employees = cursor.fetchall()

    cursor.close()
    db.close()

    return render_template(
        "attendance.html",
        attendance_records=attendance_records,
        employees=employees
    )

#================================= ADD ATTENDANCE ==================================

@app.route("/add_attendance", methods = ["POST"])
def add_attendance():

    employee_id = request.form["employee_id"]
    attendance_date = request.form["attendance_date"]
    check_in = request.form["check_in"]
    check_out = request.form["check_out"]
    status = request.form["status"]

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        INSERT INTO attendance
        (employee_id, attendance_date, check_in, check_out, status)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        employee_id,
        attendance_date,
        check_in,
        check_out,
        status
    ))

    db.commit()

    cursor.close()
    db.close()

    return redirect("/attendance")    

#============================= DELETE ATTENDANCE =============================

@app.route("/delete_attendance/<int:attendance_id>")
def delete_attendance(attendance_id):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM attendance WHERE attendance_id = %s",
        (attendance_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return redirect("/attendance")

#=================================== LEAVE MANAGEMENT ============================

@app.route("/leave")
def leave():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    #Leave Records
    cursor.execute("""
        SELECT
            leave_management.leave_id,
            leave_management.employee_id,
            employees.employee_name,
            leave_management.leave_type,
            leave_management.from_date,
            leave_management.to_date,
            leave_management.reason,
            leave_management.status
        FROM leave_management
        LEFT JOIN employees
            ON leave_management.employee_id = employees.employee_id
        ORDER BY leave_management.leave_id DESC
    """)

    leave_records = cursor.fetchall()
    #Employee list for dropdown
    cursor.execute("""
        SELECT employee_id, employee_name
        FROM employees
    """)

    employees = cursor.fetchall()

    cursor.close()
    db.close()

    return render_template("leave.html", leave_records=leave_records, employees=employees)

#================================ ADD LEAVE ===================================

@app.route("/add_leave", methods=["POST"])
def add_leave():

    employee_id = request.form["employee_id"]
    leave_type = request.form["leave_type"]
    from_date = request.form["from_date"]
    to_date = request.form["to_date"]
    reason = request.form["reason"]
    status = request.form["status"]

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        INSERT INTO leave_management
        (employee_id, leave_type, from_date, to_date, reason, status)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        employee_id,
        leave_type,
        from_date,
        to_date,
        reason,
        status
    ))

    db.commit()

    cursor.close()
    db.close()

    return redirect("/leave")

#============================= DELETE LEAVE =============================

@app.route("/delete_leave/<int:leave_id>")
def delete_leave(leave_id):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM leave_management WHERE leave_id = %s",
        (leave_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return redirect("/leave")

#================================== PERFORMANCE ==============================

@app.route("/performance")
def performance():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            performance.performance_id,
            performance.employee_id,
            employees.employee_name,
            employees.department,
            performance.rating,
            performance.performance_level,
            performance.review_date
        FROM performance
        LEFT JOIN employees
            ON performance.employee_id = employees.employee_id
        ORDER BY performance.performance_id DESC
    """)

    performance_records = cursor.fetchall()

    cursor.execute("""
        SELECT employee_id, employee_name
        FROM employees
    """)

    employees = cursor.fetchall()

    cursor.close()
    db.close()

    return render_template("performance.html",
                         performance_records=performance_records,
                         employees=employees)

#================================== ADD PERFORMANCE =================================

@app.route("/add_performance", methods=["POST"])
def add_performance():

    employee_id = request.form["employee_id"]
    rating = request.form["rating"]
    performance_level = request.form["performance_level"]
    review_date = request.form["review_date"]

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        INSERT INTO performance
        (employee_id, rating, performance_level, review_date)
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (
        employee_id,
        rating,
        performance_level,
        review_date
    ))

    db.commit()

    cursor.close()
    db.close()

    return redirect("/performance")

#================================ DELETE PERFORMANCE ===============================

@app.route("/delete_performance/<int:performance_id>")
def delete_performance(performance_id):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM performance WHERE performance_id = %s",
        (performance_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return redirect("/performance")

@app.route("/analytics")
def analytics():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    #Total Employees
    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM employees
    """)

    total_employees = cursor.fetchone()["total"]

    #Attendance Rate
    cursor.execute("""
        SELECT COUNT(*) AS total_attendance,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_count
        FROM attendance""")

    attendance_result = cursor.fetchone()

    total_attendance = attendance_result["total_attendance"]
    present_count = attendance_result["present_count"] or 0

    if total_attendance > 0:
        attendance_rate = round(
            (present_count / total_attendance) * 100,1
        )
    else:
        attendance_rate = 0

    # Leave Rate
    cursor.execute("""
        SELECT COUNT(*) AS leave_count
        FROM leave_management
    """)

    leave_count = cursor.fetchone()["leave_count"]

    if total_employees > 0:
        leave_rate = round(
            (leave_count / total_employees) * 100, 1
        )
    else:
        leave_rate = 0

    # Average Performance
    cursor.execute("""
        SELECT AVG(rating) AS average_rating
        FROM performance
    """)

    performance_result = cursor.fetchone()

    performance_average = round(
        performance_result["average_rating"] or 0,1
    )

    # Employee count by department
    cursor.execute("""
        SELECT department, COUNT(*) AS total
        FROM employees
        GROUP BY department
        ORDER BY department
    """)

    department_data = cursor.fetchall()

    # Attendance analysis
    cursor.execute("""
        SELECT status, COUNT(*) AS total
        FROM attendance
        GROUP BY status
    """)

    attendance_data = cursor.fetchall()

    # Leave analysis
    cursor.execute("""
        SELECT leave_type, COUNT(*) AS total
        FROM leave_management
        GROUP BY leave_type
        ORDER BY leave_type
    """)

    leave_data = cursor.fetchall()

    # Performance analysis
    cursor.execute("""
        SELECT performance_level, COUNT(*) AS total
        FROM performance
        GROUP BY performance_level
        ORDER BY performance_level
    """)

    performance_data = cursor.fetchall()

    cursor.close()
    db.close()
    
    return render_template("analytics.html",
                            total_employees=total_employees,
                            attendance_rate=attendance_rate,
                            leave_rate=leave_rate,
                            performance_average=performance_average,
                            department_data=department_data,
                            attendance_data=attendance_data,
                            leave_data=leave_data,
                            performance_data=performance_data)

# AI CHAT BOT

@app.route("/chatbot_data")
def chatbot_data():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM employees")
    total_employees = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS present
        FROM attendance
        WHERE attendance_date = CURDATE()
        AND status = 'Present'
    """)

    present_today = cursor.fetchone()["present"]

    cursor.execute("""
        SELECT COUNT(*) AS leave_count
        FROM leave_management
    """)
    on_leave = cursor.fetchone()["leave_count"]

    cursor.execute("""
        SELECT AVG(rating) AS average_rating
        FROM performance
    """)
    result = cursor.fetchone()

    average_performance = round(
        result["average_rating"] or 0, 1
    )

    cursor.close()
    db.close()

    return jsonify({
        "employees": total_employees,
        "present": present_today,
        "leave": on_leave,
        "performance": average_performance  
    })


if __name__ == "__main__":
    app.run(debug=True)
