from datetime import datetime
from database.connection import db


def get_today_reminders(user_id: str):
    """
    Aaj ke active medicines, schedules aur exercises
    sirf current logged-in user ke liye return karta hai.
    """

    today = datetime.now().strftime("%A")

    reminders = []

    # =========================
    # MEDICINES
    # =========================

    medicines = db.medicines.find({
        "user_id": user_id,
        "active": True
    })

    for medicine in medicines:

        days = medicine.get("days", [])

        # Agar days empty hain ya aaj ka day selected hai
        if not days or today in days:

            reminders.append({
                "type": "medicine",
                "title": medicine.get(
                    "medicine_name",
                    "Medicine"
                ),
                "time": medicine.get(
                    "time",
                    ""
                ),
                "message": (
                    f"Ammaa, "
                    f"{medicine.get('medicine_name', 'medicine')} "
                    f"lene ka time hai 💊"
                )
            })


    # =========================
    # SCHEDULE
    # =========================

    schedules = db.schedules.find({
        "user_id": user_id,
        "active": True
    })

    for schedule in schedules:

        reminders.append({
            "type": "schedule",
            "title": schedule.get(
                "title",
                "Schedule"
            ),
            "time": schedule.get(
                "time",
                ""
            ),
            "message": (
                f"Ammaa, "
                f"{schedule.get('title', 'schedule')} "
                f"ka time hai 📅"
            )
        })


    # =========================
    # EXERCISE
    # =========================

    exercises = db.exercises.find({
        "user_id": user_id,
        "active": True
    })

    for exercise in exercises:

        reminders.append({
            "type": "exercise",
            "title": exercise.get(
                "name",
                "Exercise"
            ),
            "time": exercise.get(
                "time",
                ""
            ),
            "message": (
                f"Ammaa, "
                f"{exercise.get('name', 'exercise')} "
                f"karne ka time hai 🏃"
            )
        })


    # =========================
    # SORT BY TIME
    # =========================

    reminders.sort(
        key=lambda x: x.get("time", "")
    )

    return reminders