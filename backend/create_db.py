import pymysql

try:
    # Connect to MySQL Server (not to a database yet)
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="Arc-151912",  # replace with your MySQL root password
    )

    cursor = connection.cursor()

    # Create a new database
    cursor.execute("CREATE DATABASE IF NOT EXISTS Job_Nest")

    # Confirm it exists
    cursor.execute("SHOW DATABASES")
    for db in cursor.fetchall():
        print(db)

    connection.close()

except pymysql.MySQLError as e:
    print("Error while creating database:", e)
