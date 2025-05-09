'''
----------------------
Imports
----------------------
'''
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from datetime import date
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
import password
import create_db

'''
----------------------
Application Setup
----------------------
'''
app = Flask(__name__, static_folder='static')
CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)
UPLOAD_FOLDER = 'uploads/'  # Ensure this folder exists

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:{password.PASSWORD}@localhost:3306/Job_Nest'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True

db = SQLAlchemy(app)

'''
----------------------
Database tables
----------------------
'''
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
    location = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    jobs = db.relationship('Job', backref='company', lazy=True)
class HandedTo(db.Model):
    __tablename__ = 'handed_to'
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), primary_key=True)
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
    submissions = db.relationship('HandedTo', backref='company', lazy=True)
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


'''
----------------------
API Endpoints
----------------------
'''
#------- HOME PAGE -------#
@app.route('/')
def home():
    return '<h1>HOME</h1>'

#------- Test Database -------#
@app.route('/test_db')
def test_db():
    try:
        # Simple test query
        db.session.execute('SELECT 1')
        return {'message': 'Database connected successfully'}, 200
    except Exception as e:
        return {'message': 'Database connection failed', 'error': str(e)}, 500

#------- View Pdf -------#
@app.route("/pdfs/<string:filename>")
def serve_pdf(filename):
    # find local file name
    filename = filename.split("/")[-1]
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    
    # return path if it exists
    if os.path.exists(file_path):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
    else:
        return "File not found", 404

#------- Create User -------#
@app.route('/create_user', methods=['POST'])
def create_user():
    # Save request data
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    lname = data.get('lastName')
    fname = data.get('firstName')

    # Verify required information is present    
    if None in (email, password, username, fname, lname):
        return {'message': 'Email, password, username, and first/last name are required'}, 400

    # Ensure the email is unique
    if User.query.filter_by(email=email).first():
        return {'message': 'Email already exists'}, 409

    # Ensure the username is unique
    if User.query.filter_by(username=username).first():
        return {'message': 'Username already exists'}, 409
    
    # Save new user information
    hashed_password = password # todo implement hash
    user = User(email=email, password=hashed_password, username=username, fname=fname, lname=lname)
    db.session.add(user)
    db.session.commit()
    return {'message': 'User created', 'user_id': user.user_id}, 201

#------- Login -------#
@app.route('/login', methods=['POST'])
def login():
    # Save request data
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find user data in data base
    user = User.query.filter_by(username=username).first()
    
    # Validate user login information
    if not user or user.password != password:
        return {'message': 'Invalid email or password'}, 401

    return {'message': 'Login successful', 'user_id': user.user_id}, 200

#------- Add Resume -------#
@app.route('/add_resumes/<string:username>', methods=['POST'])
def add_resume(username: str):
    try:
        # Retrieve User Information
        user = User.query.filter_by(username=username).first()

        # Ensure user found
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Ensure file was sent
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 408
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 409

        # Ensure file is pdf
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

#------- Delete Resume -------#
@app.route('/resumes/<string:username>/<int:resume_id>', methods=['DELETE'])
def delete_resume(username: str, resume_id: int):
    try:
        # Retrieve user data
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Retrieve resume
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

#------- Update Resume Name -------#
@app.route('/resumes/update/<int:resume_id>', methods=['PUT'])
def update_resume_name(resume_id):
    try:
        # Retrieve new resume filename
        data = request.json
        new_file_name = data.get("fileName")

        # Ensure the file already exists
        if not new_file_name:
            return jsonify({'error': 'New file name is required'}), 400
        
        # Parse new file name to go in upload folder
        new_file_name = new_file_name.split("/")[-1]
        new_file_name = new_file_name.split("\\")[-1]
        new_file_name = os.path.join( app.config['UPLOAD_FOLDER'], new_file_name )
        if (new_file_name[-4:] != ".pdf"):
            new_file_name += ".pdf"

        # Retrieve the resume
        resume = Resume.query.get(resume_id)
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Rename the file
        if not os.path.exists(resume.pdf_file):
            return jsonify({'error': 'Resume not found'}), 404
        os.rename(resume.pdf_file, new_file_name)
        
        # Update the file name
        resume.pdf_file = new_file_name
        db.session.commit()

        return jsonify({'message': 'Resume name updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#------- Add Job -------#
@app.route('/jobs/<string:username>', methods=['POST'])
def add_job(username):
    # Retrieve job information
    data = request.get_json()
    
    # Retrieve user information and ensure user exists
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Create new job entry and add to database
    new_job = Job(
        salary=data.get('salary', 0),
        requirements=data.get('requirements', ""),
        skills=data.get('skills', ""),
        title=data.get('title', ""),
        progress=data.get('progress', ""),
        user_id=user.user_id,
        company_id=data.get('company_id')  # Optional, can be null
    )
    db.session.add(new_job)
    db.session.commit()
    
    return jsonify({"message": "Resume associated with job successfully"}), 200

#------- Edit Job Data -------#
@app.route('/jobs/<int:job_id>', methods=['PUT'])
def edit_job(job_id):
    # Retrieve updated job data
    data = request.get_json()
    
    # Retrieve edited job and ensure it exits
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Update information
    job.salary = data.get('salary', job.salary)
    job.requirements = data.get('requirements', job.requirements)
    job.skills = data.get('skills', job.skills)
    job.title = data.get('title', job.title)
    job.progress = data.get('progress', job.progress)
    job.company_id = data.get('company_id', job.company_id)

    db.session.commit()
    return jsonify({
        "id": job.job_id,
        "salary": str(job.salary),
        "requirements": job.requirements,
        "skills": job.skills,
        "title": job.title,
        "progress": job.progress,
        "company_id": job.company_id
    }), 200

#------- Delete Job -------#
@app.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    # Delete associated resumes in HandedTo
    associated_resumes = HandedTo.query.filter_by(job_id=job_id).all()
    for resume in associated_resumes:
        db.session.delete(resume)
    
    # Delete the job itself
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job and associated resumes deleted successfully"}), 200

#------- Associate a Users Resume with a Job -------#
@app.route('/jobs/<int:job_id>/associate_resume', methods=['POST'])
def associate_resume(job_id):
    data = request.get_json()
    resume_id = data.get("resume_id")

    
    # Check if the job and resume exist
    job = Job.query.get(job_id)

    if resume_id == "-1":
        #delete
        associated_resumes = HandedTo.query.filter_by(job_id=job_id).all()
        for resume in associated_resumes:
            db.session.delete(resume)
            db.session.commit()
            return jsonify({"message": "Resume disassociated with job successfully"}), 200
        
    resume = Resume.query.get(resume_id)

    if not job or not resume:
        return jsonify({"error": "Invalid Job or Resume ID"}), 404

    # Check if the pair already exists
    existing = HandedTo.query.filter_by(resume_id=resume_id, job_id=job_id).first()
    if existing:
        return jsonify({"message": "Resume is already associated with this job"}), 200

    # Create HandedTo entry
    handed_to = HandedTo(resume_id=resume_id, job_id=job_id, submission_date=date.today())
    db.session.add(handed_to)
    db.session.commit()

    return jsonify({"message": "Resume associated with job successfully"}), 200


#------- Add Company -------#
@app.route('/company/<string:username>', methods=['POST'])
def add_company(username):
    # Retrieve job information
    data = request.get_json()
    
    # Retrieve user information and ensure user exists
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404


    if not data.get('name'):
        return jsonify({"error", "company must have a name"}), 400
    
    print(data.get('name'))
    companies = Company.query.filter_by(name=data.get('name')).all()
    
    if companies:
        return jsonify({"error": "company already created"}), 408
    
    if data.get('rating') == '':
        data['rating'] = 0
    
    # Create new job entry and add to database
    new_company = Company(
        location = data.get('location'),
        name = data.get('name'),
        rating = int(data.get('rating')),
        user_id = user.user_id
    )
    db.session.add(new_company)
    db.session.commit()
    
    return jsonify({"message": "Resume associated with job successfully"}), 200


#------- Edit Company Data -------#
@app.route('/company/<int:company_id>', methods=['PUT'])
def edit_company(company_id):
    # Retrieve updated job data
    data = request.get_json()
    
    # Retrieve edited job and ensure it exits
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Job not found"}), 404

    # Update information
    company.location = data.get('location', company.location)
    company.rating = data.get('rating', company.rating)
    company.name = data.get('name', company.name)
    

    db.session.commit()
    return jsonify({"message": "Company edited successfully"}), 200


'''
----------------------
Query API Endpoints
----------------------
'''

#------- Get Username Data  -------#
@app.route('/get_user/<string:username>', methods=['GET'])
def get_all_users(username: str):
    try:
        # Retrieve user from db and ensure they exist
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Return user data
        user_data = {
            "fname" : user.fname,
            "lname" : user.lname,
            "email": user.email
        }
        
        return jsonify(user_data), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

#------- Get Resumes -------#
@app.route('/resumes/<string:username>', methods=['GET'])
def get_all_resumes(username: str):
    try:
        # Retrieve user and ensure they exist
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Retrieve all resumes for the user
        resumes = Resume.query.filter_by(user_id=user.user_id).all()
        
        # Remove "uploads" from each filename
        for resume in resumes:
            resume.pdf_file = resume.pdf_file.split("/")[-1]
        
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


#------- Get Companies -------#
@app.route('/companies', methods=['GET'])
def get_all_companies():
    companies = Company.query.all()
    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location
    } for c in companies])

#------- Get Jobs and Associated Resume -------#
@app.route('/jobs/<string:username>', methods=['GET'])
def get_jobs(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    jobs = (
        db.session.query(Job, Resume)
        .outerjoin(HandedTo, Job.job_id == HandedTo.job_id)
        .outerjoin(Resume, HandedTo.resume_id == Resume.id)
        .filter(Job.user_id == user.user_id)
        .all()
    )

    job_list = [
        {
            "id": job.job_id,
            "salary": str(job.salary),
            "requirements": job.requirements,
            "skills": job.skills,
            "title": job.title,
            "progress": job.progress,
            "company_id": job.company_id,
            "selectedResume": {
                "id": resume.id,
                "pdf_file": resume.pdf_file,
                "user_id": resume.user_id
            } if resume else None
        }
        for job, resume in jobs
    ]

    return jsonify(job_list), 200


@app.route('/users/<string:username>/companies', methods=['GET'])
def user_companies(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    companies = Company.query.filter_by(user_id=user.user_id).all()

    return jsonify([{
        "name" : c.name,
        "location": c.location,
        "rating": c.rating,
        "id": c.company_id
        } for c in companies]), 200

@app.route('/user/<int:user_id>/companies/filter', methods=['GET'])
def filter_user_companies(user_id):
    # Get filters from query params
    name = request.args.get('name', default='', type=str)
    location = request.args.get('location', default='', type=str)
    rating = request.args.get('rating', type=float)
    sort = request.args.get('sort', default='', type=str).lower()  # e.g., 'asc' or 'desc'

    #all job_ids the user is interested in
    user_job_ids = db.session.query(UserInterestedJob.job_id).filter_by(user_id=user_id).subquery()

    #companies linked to those jobs
    query = db.session.query(Company).join(Job, Company.company_id == Job.company_id).filter(Job.job_id.in_(user_job_ids))

    # Apply optional filters
    if name:
        query = query.filter(Company.name.ilike(f"%{name}%"))
    if location:
        query = query.filter(Company.location.ilike(f"%{location}%"))
    if rating is not None:
        query = query.filter(Company.rating >= rating)
    if sort == 'asc':
        query = query.order_by(Company.name.asc())
    elif sort == 'desc':
        query = query.order_by(Company.name.desc())

    # Get unique companies
    companies = query.distinct().all()

    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location,
        'rating': c.rating
    } for c in companies])


#------- Get Associated Resume -------#
@app.route('/jobs/<int:job_id>/associated_resumes', methods=['GET'])
def get_associated_resumes(job_id):
    associations = HandedTo.query.filter_by(job_id=job_id).all()
    resumes = [
        {
            "resume_id": assoc.resume_id,
            "submission_date": assoc.submission_date
        } for assoc in associations
    ]
    return jsonify(resumes), 200




'''
----------------------
Application Startup
----------------------
'''
if __name__ == '__main__':
    create_db.create_db()
    with app.app_context():
        #db.drop_all()   # Drops all existing tables
        db.create_all() # Recreates tables from models
    app.run(host='0.0.0.0', port=80, debug=True)