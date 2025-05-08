from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
import password
import create_db
app = Flask(__name__, static_folder='static')
CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)
UPLOAD_FOLDER = 'uploads/'  # Ensure this folder exists

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:{password.PASSWORD}@localhost:3306/Job_Nest'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True

db = SQLAlchemy(app)

# ---------- MODELS ----------


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    fname = db.Column(db.String(255), nullable=False)
    lname = db.Column(db.String(255), nullable=False)


    resumes = db.relationship('Resume', backref='user', lazy=True)
    posted_jobs = db.relationship('Job', backref='user', lazy=True)


class UserInterestedJob(db.Model):
    __tablename__ = 'user_interested_jobs'
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), primary_key=True)


class Resume(db.Model):
    __tablename__ = 'resumes'
    id = db.Column(db.Integer, primary_key=True)  # Primary key (auto-increment)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    pdf_file = db.Column(db.String(255), nullable=False)  # Path to the uploaded PDF file

    user_info = db.relationship('User', backref='resume', lazy=True)  # Changed 'user' to 'user_info'
    submissions  = db.relationship('HandedTo', backref='resume', lazy=True)

class Company(db.Model):
    __tablename__ = 'companies'
    company_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    location = db.Column(db.String(255), nullable=False)

    jobs = db.relationship('Job', backref='company', lazy=True)
    submissions = db.relationship('HandedTo', backref='company', lazy=True)

class HandedTo(db.Model):
    __tablename__ = 'handed_to'
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), primary_key=True)
    submission_date = db.Column(db.Date, nullable=False)


class Job(db.Model):
    __tablename__ = 'jobs'
    job_id = db.Column(db.Integer, primary_key=True)
    salary = db.Column(db.Numeric(10, 2), nullable=True)
    requirements = db.Column(db.Text, nullable=True)
    skills = db.Column(db.Text, nullable=True)
    title = db.Column(db.Text, nullable=True)
    progress = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)

    economy = db.relationship('Economy', backref='job', uselist=False)
    management = db.relationship('Management', backref='job', uselist=False)
    engineering = db.relationship('Engineering', backref='job', uselist=False)
    medical = db.relationship('Medical', backref='job', uselist=False)

class Economy(db.Model):
    __tablename__ = 'economy'
    economy_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Management(db.Model):
    __tablename__ = 'management'
    management_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Engineering(db.Model):
    __tablename__ = 'engineering'
    engineering_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Medical(db.Model):
    __tablename__ = 'medical'
    medical_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


# ---------- ROUTES ----------

@app.route('/')
def home():
    return '<h1>HOME</h1>'

@app.route('/test_db')
def test_db():
    try:
        # Simple test query
        db.session.execute('SELECT 1')
        return {'message': 'Database connected successfully'}, 200
    except Exception as e:
        return {'message': 'Database connection failed', 'error': str(e)}, 500


@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    lname = data.get('lastName')
    fname = data.get('firstName')

    print(data, email, password)
    
    if None in (email, password, username, fname, lname):
        return {'message': 'Email, password, username, and first/last name are required'}, 400

    if User.query.filter_by(email=email).first():
        return {'message': 'Email already exists'}, 409

    hashed_password = password # todo implement hash
    user = User(email=email, password=hashed_password, username=username, fname=fname, lname=lname)
    db.session.add(user)
    db.session.commit()
    return {'message': 'User created', 'user_id': user.user_id}, 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    print(username, password)
    print(user.password)
    if not user or user.password != password:
        return {'message': 'Invalid email or password'}, 401

    return {'message': 'Login successful', 'user_id': user.user_id}, 200


@app.route('/edit_user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return {'message': 'User not found'}, 404

    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    user.looking_for_job = data.get('looking_for_job', user.looking_for_job)
    db.session.commit()
    return {'message': 'User updated'}, 200


@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return {'message': 'User not found'}, 404

    db.session.delete(user)
    db.session.commit()
    return {'message': 'User deleted'}, 200


@app.route('/add_resumes/<string:username>', methods=['POST'])
def add_resume(username: str):
    try:
        user = User.query.filter_by(username=username).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 408

        file = request.files['file']

        if file.filename == '':
            
            return jsonify({'error': 'No selected file'}), 409

        if file and file.filename.endswith('.pdf'):
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Create and save new resume
            new_resume = Resume(user_id=user.user_id, pdf_file=file_path)
            db.session.add(new_resume)
            db.session.commit()

            return jsonify({'message': 'Resume uploaded successfully'}), 201
        else:
            return jsonify({'error': 'Invalid file type. Only PDFs are allowed.'}), 400

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/resumes/<string:username>/<int:resume_id>', methods=['DELETE'])
def delete_resume(username: str, resume_id: int):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        resume = Resume.query.filter_by(id=resume_id, user_id=user.user_id).first()
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404

        # Delete the file from the server
        if os.path.exists(resume.pdf_file):
            os.remove(resume.pdf_file)

        # Delete the resume record from the database
        db.session.delete(resume)
        db.session.commit()

        return jsonify({'message': 'Resume deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/resumes/update/<int:resume_id>', methods=['PUT'])
def update_resume_name(resume_id):
    try:
        data = request.json
        new_file_name = data.get("fileName")

        if not new_file_name:
            return jsonify({'error': 'New file name is required'}), 400
        
        new_file_name = new_file_name.split("/")[-1]
        new_file_name = new_file_name.split("\\")[-1]
        new_file_name = os.path.join( app.config['UPLOAD_FOLDER'], new_file_name )
        if (new_file_name[-4:] != ".pdf"):
            new_file_name += ".pdf"

        print(resume_id)
        resume = Resume.query.get(resume_id)
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        print(resume.pdf_file)
        if not os.path.exists(resume.pdf_file):
            return jsonify({'error': 'Resume not found'}), 404
        os.rename(resume.pdf_file, new_file_name)
        
        
        # Update the file name
        resume.pdf_file = new_file_name
        db.session.commit()

        return jsonify({'message': 'Resume name updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/create_company', methods=['POST'])
def create_company():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')

    if Company.query.filter_by(name=name).first():
        return {'message': 'Company already exists'}, 409

    company = Company(name=name, location=location)
    db.session.add(company)
    db.session.commit()
    return {'message': 'Company created', 'company_id': company.company_id}, 201


@app.route('/create_job', methods=['POST'])
def create_job():
    data = request.get_json()
    job = Job(
        job_id=data['job_id'],
        availability=data['availability'],
        salary=data['salary'],
        company_id=data['company_id'],
        requirements=data['requirements'],
        user_id=data['user_id']
    )
    db.session.add(job)
    db.session.commit()
    return {'message': 'Job created'}, 201


@app.route('/add_econ_job', methods=['POST'])
def add_econ_job():
    data = request.get_json()
    eco = Economy(economy_id=data['economy_id'], job_id=data['job_id'])
    db.session.add(eco)
    db.session.commit()
    return {'message': 'Economy job added'}, 201


# ---------- QUERIES ----------

@app.route('/get_user/<string:username>', methods=['GET'])
def get_all_users(username: str):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_data = {
            "fname" : user.fname,
            "lname" : user.lname,
            "email": user.email
        }
        
        return jsonify(user_data), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/resumes/<string:username>', methods=['GET'])
def get_all_resumes(username: str):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        resumes = Resume.query.filter_by(user_id=user.user_id).all()

        # Convert the resume objects to a list of dictionaries for JSON response
        resume_list = [
            {
                'id': resume.id,
                'pdf_file': resume.pdf_file,
                'user_id': resume.user_id
            } for resume in resumes
        ]

        return jsonify(resume_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/jobs', methods=['GET'])
def get_all_jobs():
    jobs = Job.query.all()
    return jsonify([{
        'job_id': j.job_id,
        'availability': j.availability,
        'salary': float(j.salary),
        'company_id': j.company_id,
        'requirements': j.requirements,
        'user_id': j.user_id
    } for j in jobs])


@app.route('/companies', methods=['GET'])
def get_all_companies():
    companies = Company.query.all()
    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location
    } for c in companies])


@app.route('/users/<int:user_id>/interested_jobs', methods=['GET'])
def get_interested_jobs(user_id):
    job_ids = [t[0] for t in db.session.query(UserInterestedJob.job_id).filter_by(user_id=user_id).all()]
    jobs = Job.query.filter(Job.job_id.in_(job_ids)).all()
    return jsonify([{
        'job_id': j.job_id,
        'availability': j.availability,
        'salary': float(j.salary),
        'requirements': j.requirements,
        'company_id': j.company_id,
        'user_id': j.user_id
    } for j in jobs])


# ---------- APP ENTRY ----------

if __name__ == '__main__':
    create_db.create_db()
    with app.app_context():
        #db.drop_all()   # Drops all existing tables
        db.create_all() # Recreates tables from models
    app.run(host='0.0.0.0', port=80, debug=True)
